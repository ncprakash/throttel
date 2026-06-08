import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      next: { revalidate: 86400 }, // cache for 24h — pincode data rarely changes
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
    }

    const data = await res.json();
    const result = data?.[0];

    if (!result || result.Status === "Error" || !result.PostOffice?.length) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
    }

    const po = result.PostOffice[0];
    return NextResponse.json({ city: po.District, state: po.State });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
