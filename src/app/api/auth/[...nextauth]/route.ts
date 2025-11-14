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
          phone: user.phone ?? null,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial login, store all user info in token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone ?? null;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // Map token properties into session.user explicitly
      session.user = {
        id: token.id as string,
        role: token.role as string,
        phone: token.phone ?? null,
        name: token.name as string,
        email: token.email as string,
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
