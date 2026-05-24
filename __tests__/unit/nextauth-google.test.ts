/**
 * Unit tests for the NextAuth signIn callback (Google OAuth path)
 * Tests cover: new user creation, credentials account linking, existing Google user.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockMaybeSingle = jest.fn();
const mockInsertSingle = jest.fn();
const mockUpdate = jest.fn();

const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: mockMaybeSingle,
    insert: jest.fn(() => ({
      select: jest.fn(() => ({ single: mockInsertSingle })),
    })),
    update: jest.fn(() => ({ eq: mockUpdate })),
  })),
};
jest.mock("@/lib/supabase", () => ({ supabase: mockSupabase }));

// Mock all other NextAuth provider deps so the module loads cleanly
jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn(() => ({ id: "google", name: "Google" })),
}));
jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: jest.fn(() => ({ id: "credentials", name: "Credentials" })),
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn() }));
jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn((opts: unknown) => opts), // return authOptions directly for inspection
}));

// ── Import the signIn callback from authOptions ───────────────────────────────

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type SignInCallback = NonNullable<typeof authOptions.callbacks>["signIn"];

const signIn = authOptions.callbacks!.signIn as SignInCallback;

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeGoogleAccount(providerAccountId = "google-uid-1") {
  return { provider: "google", providerAccountId } as Parameters<SignInCallback>[0]["account"];
}

function makeUser(overrides = {}) {
  return { id: "u1", email: "test@g.com", name: "Test User", ...overrides } as Parameters<SignInCallback>[0]["user"];
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdate.mockResolvedValue({ error: null });
});

describe("NextAuth signIn callback — Google provider", () => {
  describe("new user (not in DB)", () => {
    it("creates a new user and returns true", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });
      mockInsertSingle.mockResolvedValue({ data: { user_id: "new-uid", role: "user" }, error: null });

      const user = makeUser();
      const result = await signIn!({ user, account: makeGoogleAccount(), profile: undefined, email: undefined, credentials: undefined });

      expect(result).toBe(true);
      expect(user.id).toBe("new-uid");
    });

    it("returns false when DB insert fails", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });
      mockInsertSingle.mockResolvedValue({ data: null, error: { message: "insert failed" } });

      const result = await signIn!({ user: makeUser(), account: makeGoogleAccount(), profile: undefined, email: undefined, credentials: undefined });

      expect(result).toBe(false);
    });
  });

  describe("existing credentials account", () => {
    it("links Google ID to the credentials account and returns true", async () => {
      const existingUser = { user_id: "existing-uid", provider: "credentials", google_id: null, role: "user" };
      mockMaybeSingle.mockResolvedValue({ data: existingUser, error: null });

      const user = makeUser();
      const result = await signIn!({ user, account: makeGoogleAccount("g-123"), profile: undefined, email: undefined, credentials: undefined });

      expect(result).toBe(true);
      // update should have been called to link the google_id
      expect(mockUpdate).toHaveBeenCalled();
      expect(user.id).toBe("existing-uid");
    });
  });

  describe("existing Google account (repeat sign-in)", () => {
    it("returns true without inserting again", async () => {
      const existingUser = { user_id: "google-uid", provider: "google", google_id: "g-123", role: "user" };
      mockMaybeSingle.mockResolvedValue({ data: existingUser, error: null });

      const user = makeUser();
      const result = await signIn!({ user, account: makeGoogleAccount("g-123"), profile: undefined, email: undefined, credentials: undefined });

      expect(result).toBe(true);
      expect(mockInsertSingle).not.toHaveBeenCalled();
      expect(user.id).toBe("google-uid");
    });
  });

  describe("non-Google provider", () => {
    it("skips the callback and returns true for credentials signIn", async () => {
      const credAccount = { provider: "credentials", providerAccountId: "cred-1" } as Parameters<SignInCallback>[0]["account"];
      const result = await signIn!({ user: makeUser(), account: credAccount, profile: undefined, email: undefined, credentials: undefined });

      expect(result).toBe(true);
      expect(mockMaybeSingle).not.toHaveBeenCalled();
    });
  });
});
