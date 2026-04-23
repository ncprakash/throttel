import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
  } catch (err) {
    console.error("requireAdmin error:", err);
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}
