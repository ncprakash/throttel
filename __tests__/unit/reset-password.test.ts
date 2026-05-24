/**
 * Unit tests for POST /api/auth/reset-password
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockMaybeSingle = jest.fn();
const mockSingleUser = jest.fn();
const mockUpdate = jest.fn().mockReturnThis();
const mockDelete = jest.fn().mockReturnThis();
const mockEqFn = jest.fn().mockReturnThis();

const mockSupabase = {
  from: jest.fn((table: string) => {
    if (table === "users") {
      return {
        select: jest.fn().mockReturnThis(),
        update: jest.fn(() => ({ eq: jest.fn(() => ({ error: null })) })),
        eq: mockEqFn,
        single: mockSingleUser,
      };
    }
    // email_otps
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      maybeSingle: mockMaybeSingle,
      delete: jest.fn(() => ({ eq: jest.fn().mockReturnThis() })),
    };
  }),
};
jest.mock("@/lib/supabase", () => ({ supabase: mockSupabase }));

const mockCheckRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({ checkRateLimit: mockCheckRateLimit }));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn().mockResolvedValue(true),
}));

// ── Imports ───────────────────────────────────────────────────────────────────

import { POST } from "@/app/api/auth/reset-password/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_BODY = {
  email: "user@x.com",
  otp: "123456",
  newPassword: "newpass123",
  confirmPassword: "newpass123",
};

function makeReq(body: object) {
  return { json: async () => body } as Request;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckRateLimit.mockReturnValue(true);
  mockSingleUser.mockResolvedValue({
    data: { user_id: "u1", password_hash: "hash", provider: "credentials", is_verified: true },
    error: null,
  });
  mockMaybeSingle.mockResolvedValue({ data: { id: 1, email: "user@x.com", otp: "123456" }, error: null });
});

describe("POST /api/auth/reset-password", () => {
  describe("input validation", () => {
    it("rejects missing fields", async () => {
      const res = await POST(makeReq({}));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.ok).toBe(false);
    });

    it("rejects OTP shorter than 6 digits", async () => {
      const res = await POST(makeReq({ ...VALID_BODY, otp: "12345" }));
      expect(res.status).toBe(400);
    });

    it("rejects password under 8 characters", async () => {
      const res = await POST(makeReq({ ...VALID_BODY, newPassword: "short", confirmPassword: "short" }));
      expect(res.status).toBe(400);
    });

    it("rejects mismatched passwords", async () => {
      const res = await POST(makeReq({ ...VALID_BODY, confirmPassword: "different_password" }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/match/i);
    });
  });

  describe("rate limiting", () => {
    it("returns 429 when rate limit exceeded", async () => {
      mockCheckRateLimit.mockReturnValue(false);
      const res = await POST(makeReq(VALID_BODY));
      expect(res.status).toBe(429);
    });
  });

  describe("user validation", () => {
    it("returns 400 when user does not exist", async () => {
      mockSingleUser.mockResolvedValue({ data: null, error: null });
      const res = await POST(makeReq(VALID_BODY));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/invalid or expired/i);
    });

    it("returns 400 for Google-provider accounts", async () => {
      mockSingleUser.mockResolvedValue({
        data: { user_id: "u1", password_hash: null, provider: "google", is_verified: true },
        error: null,
      });
      const res = await POST(makeReq(VALID_BODY));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/google/i);
    });
  });

  describe("OTP validation", () => {
    it("returns 400 when OTP is invalid or expired", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });
      const res = await POST(makeReq(VALID_BODY));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/invalid or expired/i);
    });
  });

  describe("success path", () => {
    it("returns ok:true with success message", async () => {
      const res = await POST(makeReq(VALID_BODY));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.message).toMatch(/reset/i);
    });

    it("hashes the new password with bcrypt", async () => {
      const bcrypt = await import("bcryptjs");
      await POST(makeReq(VALID_BODY));
      expect(bcrypt.hash).toHaveBeenCalledWith(VALID_BODY.newPassword, 10);
    });
  });
});
