import NextAuth, { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  role: string;
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email/phone and password are required");
        }

        const identifier = credentials.email.trim();
        const isEmail = identifier.includes("@");

        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq(isEmail ? "email" : "phone", identifier)
          .single();

        if (!user) throw new Error("User not found");
        if (!user.is_verified) {
          throw new Error("Please verify your email before logging in");
        }

        // Block Google-only accounts from credentials login
        if (user.provider === "google" || !user.password_hash) {
          throw new Error("This account uses Google Sign-In. Please use the Google button.");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isMatch) throw new Error("Invalid email or password");

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
    async signIn({ user, account }) {
      // Only runs for OAuth providers (Google)
      if (account?.provider === "google") {
        const email = user.email!;
        const googleId = account.providerAccountId;
        const nameParts = (user.name || "").split(" ");
        const firstName = nameParts[0] || "User";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Look up existing user by email
        const { data: existing } = await supabase
          .from("users")
          .select("user_id, provider, google_id, role")
          .eq("email", email)
          .maybeSingle();

        if (!existing) {
          // New user — create account (auto-verified via Google)
          const { data: created, error } = await supabase
            .from("users")
            .insert({
              email,
              first_name: firstName,
              last_name: lastName,
              provider: "google",
              google_id: googleId,
              is_verified: true,
              role: "user",
            })
            .select("user_id, role")
            .single();

          if (error || !created) {
            console.error("[NextAuth] Google sign-in: Supabase insert failed", error);
            return false;
          }

          user.id = created.user_id;
          (user as AuthUser).role = created.role;
        } else {
          // Existing credentials user — link Google to their account
          if (existing.provider === "credentials") {
            await supabase
              .from("users")
              .update({ google_id: googleId })
              .eq("user_id", existing.user_id);
          }

          user.id = existing.user_id;
          (user as AuthUser).role = existing.role;
        }
      }
      return true;
    },

    async jwt({ token, user, account }: { token: JWT; user?: User; account?: { provider?: string } | null }) {
      if (user) {
        token.id = (user as AuthUser).id;
        token.role = (user as AuthUser).role;
        token.phone = (user as AuthUser).phone ?? null;
        token.name = (user as AuthUser).name;
        token.email = (user as AuthUser).email;
        token.provider = account?.provider ?? "credentials";
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = (token.phone as string | null) ?? null;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
