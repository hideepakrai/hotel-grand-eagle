import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
  const db = await getDatabase();
  const pricing = await db.collection("pricing").find().toArray();

  return NextResponse.json(pricing);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getDatabase();

  // Backend validation
  if (body.seasonalPricing) {
    for (const sp of body.seasonalPricing) {
      if (sp.price < 0) return NextResponse.json({ error: "Seasonal price cannot be negative" }, { status: 400 });
    }
  }

  const result = await db.collection("pricing").insertOne(body);

  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const db = await getDatabase();

  // Backend validation
  if (body.seasonalPricing) {
    for (const sp of body.seasonalPricing) {
      if (sp.price < 0) return NextResponse.json({ error: "Seasonal price cannot be negative" }, { status: 400 });
    }
  }

  await db.collection("pricing").updateOne(
    { roomId: body.roomId },
    { $set: body },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}