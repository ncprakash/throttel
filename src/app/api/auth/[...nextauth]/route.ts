import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  role: string;
}

function normalizePhone(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
}

const handler = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Look up user in Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user) throw new Error("User not found");

        // Ensure verified
        if (!user.is_verified) {
          throw new Error("Please verify your email before logging in");
        }

        // Validate password
        const isMatch = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isMatch) throw new Error("Invalid email or password");

        // Return safe user object
        return {
          id: user.user_id,
          email: user.email,
          phone: normalizePhone(user.phone),
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // token is a plain object at runtime; use runtime-safe assignment
      if (user) {
        // `user` came from authorize and conforms to AuthUser
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
        (token as any).phone = normalizePhone((user as any).phone);
        (token as any).name = (user as any).name;
        (token as any).email = (user as any).email;
      }
      return token;
    },

    async session({ session, token }) {
      // Normalize token.phone defensively: ensure string | null
      const phone = normalizePhone((token as any).phone);

      // Map token properties into session.user explicitly
      session.user = {
        id: (token as any).id as string,
        role: (token as any).role as string,
        phone,
        name: (token as any).name as string,
        email: (token as any).email as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
