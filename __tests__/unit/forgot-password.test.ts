/**
 * Unit tests for POST /api/auth/forgot-password
 */

// ── Mocks (must be before imports) ────────────────────────────────────────────

const mockSingle = jest.fn();
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: mockSingle,
  })),
};
jest.mock("@/lib/supabase", () => ({ supabase: mockSupabase }));

const mockCheckRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({ checkRateLimit: mockCheckRateLimit }));

const mockSendMail = jest.fn();
jest.mock("@/lib/mail", () => ({
  transporter: { sendMail: mockSendMail },
}));

// ── Imports ───────────────────────────────────────────────────────────────────

import { POST } from "@/app/api/auth/forgot-password/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeReq(body: object) {
  return { json: async () => body } as Request;
}

async function callPost(body: object) {
  const res = await POST(makeReq(body));
  return res.json();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckRateLimit.mockReturnValue(true); // allow by default
  mockSendMail.mockResolvedValue(undefined);
});

describe("POST /api/auth/forgot-password", () => {
  describe("input validation", () => {
    it("rejects missing email", async () => {
      const data = await callPost({});
      expect(data.ok).toBe(false);
      expect(data.error).toBeTruthy();
    });

    it("rejects malformed email", async () => {
      const data = await callPost({ email: "not-an-email" });
      expect(data.ok).toBe(false);
    });
  });

  describe("rate limiting", () => {
    it("returns 429 when rate limit exceeded", async () => {
      mockCheckRateLimit.mockReturnValue(false);
      const res = await POST(makeReq({ email: "a@b.com" }));
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toMatch(/wait/i);
    });
  });

  describe("email not registered", () => {
    it("returns generic OK (no enumeration leak)", async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });
      const data = await callPost({ email: "unknown@x.com" });
      expect(data.ok).toBe(true);
    });
  });

  describe("Google-only account", () => {
    it("returns error explaining Google Sign-In", async () => {
      mockSingle.mockResolvedValue({
        data: { user_id: "u1", first_name: "John", email: "j@g.com", is_verified: true, provider: "google" },
        error: null,
      });
      const res = await POST(makeReq({ email: "j@g.com" }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toMatch(/google/i);
    });
  });

  describe("unverified account", () => {
    it("returns error asking to verify email", async () => {
      mockSingle.mockResolvedValue({
        data: { user_id: "u1", first_name: "John", email: "j@x.com", is_verified: false, provider: "credentials" },
        error: null,
      });
      const res = await POST(makeReq({ email: "j@x.com" }));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error).toMatch(/verif/i);
    });
  });

  describe("success path", () => {
    beforeEach(() => {
      mockSingle.mockResolvedValue({
        data: { user_id: "u1", first_name: "Alice", email: "alice@x.com", is_verified: true, provider: "credentials" },
        error: null,
      });
    });

    it("returns generic OK message", async () => {
      const data = await callPost({ email: "alice@x.com" });
      expect(data.ok).toBe(true);
      expect(data.message).toBeTruthy();
    });

    it("calls sendMail once", async () => {
      await callPost({ email: "alice@x.com" });
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });

    it("sends email to the correct address", async () => {
      await callPost({ email: "alice@x.com" });
      const [mailArg] = mockSendMail.mock.calls[0];
      expect(mailArg.to).toBe("alice@x.com");
    });

    it("includes a 6-digit OTP in the email HTML", async () => {
      await callPost({ email: "alice@x.com" });
      const [mailArg] = mockSendMail.mock.calls[0];
      expect(mailArg.html).toMatch(/\d{6}/);
    });
  });
});
