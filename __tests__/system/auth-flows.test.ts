/**
 * System / integration tests for the combined auth flows.
 *
 * These tests run all three API routes (forgot-password, reset-password, and
 * the NextAuth signIn callback) in sequence, simulating real user journeys
 * end-to-end with shared in-memory state — verifying the pieces fit together.
 *
 * External deps (Supabase, email, bcrypt) are mocked so tests are fast and
 * deterministic, but the full business logic path runs without shortcuts.
 */

// ── Shared in-memory state ────────────────────────────────────────────────────

interface FakeUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string | null;
  provider: "credentials" | "google";
  google_id: string | null;
  is_verified: boolean;
  role: string;
}

interface FakeOtp {
  id: number;
  email: string;
  otp: string;
  expires_at: string;
}

const db: { users: FakeUser[]; otps: FakeOtp[] } = { users: [], otps: [] };

// ── Supabase mock (stateful in-memory) ────────────────────────────────────────

jest.mock("@/lib/supabase", () => {
  const builder = (table: "users" | "email_otps") => {
    let filters: Record<string, unknown> = {};
    let gtFilters: Record<string, unknown> = {};

    const obj = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn((col: string, val: unknown) => { filters[col] = val; return obj; }),
      gt: jest.fn((col: string, val: unknown) => { gtFilters[col] = val; return obj; }),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),

      single: jest.fn(async () => {
        const rows = table === "users" ? db.users : db.otps;
        const match = rows.find((r) =>
          Object.entries(filters).every(([k, v]) => (r as Record<string, unknown>)[k] === v)
        );
        return { data: match ?? null, error: null };
      }),

      maybeSingle: jest.fn(async () => {
        if (table === "users") {
          const match = db.users.find((r) =>
            Object.entries(filters).every(([k, v]) => (r as Record<string, unknown>)[k] === v)
          );
          return { data: match ?? null, error: null };
        }
        // email_otps: also apply gt filter on expires_at
        const now = Object.values(gtFilters)[0] as string | undefined;
        const match = db.otps.find((r) => {
          const fieldMatch = Object.entries(filters).every(([k, v]) => (r as Record<string, unknown>)[k] === v);
          const notExpired = now ? r.expires_at > now : true;
          return fieldMatch && notExpired;
        });
        return { data: match ?? null, error: null };
      }),

      insert: jest.fn((payload: unknown) => {
        const row = Array.isArray(payload) ? payload[0] : payload;
        if (table === "users") {
          const user = { user_id: `uid-${Date.now()}`, role: "user", ...row } as FakeUser;
          db.users.push(user);
          return {
            select: jest.fn(() => ({ single: jest.fn().mockResolvedValue({ data: user, error: null }) })),
          };
        } else {
          const otp = { id: db.otps.length + 1, ...row } as FakeOtp;
          db.otps.push(otp);
          return { error: null };
        }
      }),

      update: jest.fn((payload: unknown) => ({
        eq: jest.fn((col: string, val: unknown) => {
          if (table === "users") {
            db.users.forEach((u) => {
              if ((u as Record<string, unknown>)[col] === val) Object.assign(u, payload);
            });
          }
          return { error: null };
        }),
      })),

      delete: jest.fn(() => ({
        eq: jest.fn((col: string, val: unknown) => {
          if (table === "email_otps") {
            db.otps = db.otps.filter((r) => (r as Record<string, unknown>)[col] !== val);
          }
          return { error: null };
        }),
      })),
    };

    return obj;
  };

  return { supabase: { from: (t: "users" | "email_otps") => builder(t) } };
});

// ── Other mocks ───────────────────────────────────────────────────────────────

jest.mock("@/lib/rate-limit", () => ({ checkRateLimit: jest.fn().mockReturnValue(true) }));

const capturedMails: { to: string; html: string }[] = [];
jest.mock("@/lib/mail", () => ({
  transporter: {
    sendMail: jest.fn(async (msg: { to: string; html: string }) => { capturedMails.push(msg); }),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(async (pw: string) => `hashed:${pw}`),
  compare: jest.fn(async (pw: string, hash: string) => hash === `hashed:${pw}`),
}));

jest.mock("next-auth/providers/google", () => ({ __esModule: true, default: jest.fn(() => ({ id: "google" })) }));
jest.mock("next-auth/providers/credentials", () => ({ __esModule: true, default: jest.fn(() => ({ id: "credentials" })) }));
jest.mock("next-auth", () => ({ __esModule: true, default: jest.fn((opts: unknown) => opts) }));

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import { POST as forgotPost } from "@/app/api/auth/forgot-password/route";
import { POST as resetPost } from "@/app/api/auth/reset-password/route";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type SignInCb = NonNullable<typeof authOptions.callbacks>["signIn"];
const googleSignIn = authOptions.callbacks!.signIn as SignInCb;

function req(body: object) {
  return { json: async () => body } as Request;
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  db.users = [];
  db.otps = [];
  capturedMails.length = 0;
});

// ── System tests ──────────────────────────────────────────────────────────────

describe("System: Forgot Password → Reset Password flow", () => {
  it("completes the full forgot → reset journey", async () => {
    // Seed a verified credentials user
    db.users.push({
      user_id: "u1",
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@x.com",
      password_hash: "hashed:oldpassword",
      provider: "credentials",
      google_id: null,
      is_verified: true,
      role: "user",
    });

    // Step 1: Request password reset
    const forgotRes = await forgotPost(req({ email: "alice@x.com" }));
    const forgotData = await forgotRes.json();
    expect(forgotData.ok).toBe(true);

    // Verify OTP was stored
    expect(db.otps).toHaveLength(1);
    const storedOtp = db.otps[0].otp;
    expect(storedOtp).toMatch(/^\d{6}$/);

    // Verify email was sent with the OTP
    expect(capturedMails).toHaveLength(1);
    expect(capturedMails[0].to).toBe("alice@x.com");
    expect(capturedMails[0].html).toContain(storedOtp);

    // Step 2: Reset password with the OTP
    const resetRes = await resetPost(
      req({ email: "alice@x.com", otp: storedOtp, newPassword: "newPass456", confirmPassword: "newPass456" })
    );
    const resetData = await resetRes.json();
    expect(resetData.ok).toBe(true);

    // Verify password was updated in DB
    const updatedUser = db.users.find((u) => u.email === "alice@x.com")!;
    expect(updatedUser.password_hash).toBe("hashed:newPass456");

    // Verify OTP was consumed (deleted)
    expect(db.otps).toHaveLength(0);
  });

  it("blocks reuse of OTP after successful reset", async () => {
    db.users.push({
      user_id: "u2",
      first_name: "Bob",
      last_name: "Jones",
      email: "bob@x.com",
      password_hash: "hashed:old",
      provider: "credentials",
      google_id: null,
      is_verified: true,
      role: "user",
    });

    await forgotPost(req({ email: "bob@x.com" }));
    const otp = db.otps[0].otp;

    // First reset succeeds
    const r1 = await resetPost(req({ email: "bob@x.com", otp, newPassword: "pass1111", confirmPassword: "pass1111" }));
    expect((await r1.json()).ok).toBe(true);

    // Second attempt with same OTP fails (OTP deleted)
    const r2 = await resetPost(req({ email: "bob@x.com", otp, newPassword: "pass2222", confirmPassword: "pass2222" }));
    expect(r2.status).toBe(400);
    expect((await r2.json()).ok).toBe(false);
  });

  it("rejects reset with wrong OTP", async () => {
    db.users.push({
      user_id: "u3",
      first_name: "Eve",
      last_name: "Doe",
      email: "eve@x.com",
      password_hash: "hashed:old",
      provider: "credentials",
      google_id: null,
      is_verified: true,
      role: "user",
    });

    await forgotPost(req({ email: "eve@x.com" }));

    const res = await resetPost(req({ email: "eve@x.com", otp: "000000", newPassword: "pass9999", confirmPassword: "pass9999" }));
    expect(res.status).toBe(400);
  });
});

describe("System: Google OAuth sign-in flow", () => {
  it("creates account on first Google sign-in", async () => {
    expect(db.users).toHaveLength(0);

    const user = { id: "", email: "new@gmail.com", name: "New User" } as Parameters<SignInCb>[0]["user"];
    const account = { provider: "google", providerAccountId: "g-new-1" } as Parameters<SignInCb>[0]["account"];

    const result = await googleSignIn!({ user, account, profile: undefined, email: undefined, credentials: undefined });

    expect(result).toBe(true);
    expect(db.users).toHaveLength(1);
    expect(db.users[0].email).toBe("new@gmail.com");
    expect(db.users[0].provider).toBe("google");
    expect(db.users[0].is_verified).toBe(true);
  });

  it("links Google ID to existing credentials account", async () => {
    db.users.push({
      user_id: "existing-u",
      first_name: "Cred",
      last_name: "User",
      email: "cred@x.com",
      password_hash: "hashed:pw",
      provider: "credentials",
      google_id: null,
      is_verified: true,
      role: "user",
    });

    const user = { id: "", email: "cred@x.com", name: "Cred User" } as Parameters<SignInCb>[0]["user"];
    const account = { provider: "google", providerAccountId: "g-link-1" } as Parameters<SignInCb>[0]["account"];

    const result = await googleSignIn!({ user, account, profile: undefined, email: undefined, credentials: undefined });

    expect(result).toBe(true);
    expect(user.id).toBe("existing-u");
    // google_id should be linked
    expect(db.users[0].google_id).toBe("g-link-1");
  });

  it("allows repeat Google sign-in for existing Google user", async () => {
    db.users.push({
      user_id: "google-u",
      first_name: "G",
      last_name: "User",
      email: "g@gmail.com",
      password_hash: null,
      provider: "google",
      google_id: "g-repeat-1",
      is_verified: true,
      role: "user",
    });

    const user = { id: "", email: "g@gmail.com", name: "G User" } as Parameters<SignInCb>[0]["user"];
    const account = { provider: "google", providerAccountId: "g-repeat-1" } as Parameters<SignInCb>[0]["account"];

    const result = await googleSignIn!({ user, account, profile: undefined, email: undefined, credentials: undefined });

    expect(result).toBe(true);
    expect(user.id).toBe("google-u");
    expect(db.users).toHaveLength(1); // no duplicate
  });

  it("google user cannot reset password via forgot-password (provider check)", async () => {
    db.users.push({
      user_id: "gu1",
      first_name: "G",
      last_name: "Only",
      email: "gonly@gmail.com",
      password_hash: null,
      provider: "google",
      google_id: "g-1",
      is_verified: true,
      role: "user",
    });

    const res = await forgotPost(req({ email: "gonly@gmail.com" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/google/i);
  });
});
