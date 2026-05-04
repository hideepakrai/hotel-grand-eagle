import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    const db = await getDatabase();
    const rules = await db.collection("pricing_rules").find().toArray();
    return NextResponse.json(rules);
}

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDatabase();
    // Backend validation
    if (body.discount !== undefined && (body.discount < 0 || body.discount > 100)) {
        return NextResponse.json({ error: "Discount must be between 0 and 100%" }, { status: 400 });
    }

    const result = await db.collection("pricing_rules").insertOne(body);
    return NextResponse.json(result);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    // Backend validation
    if (data.discount !== undefined && (data.discount < 0 || data.discount > 100)) {
        return NextResponse.json({ error: "Discount must be between 0 and 100%" }, { status: 400 });
    }

    await db.collection("pricing_rules").updateOne({ id }, { $set: data }, { upsert: true });
    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await getDatabase();
    await db.collection("pricing_rules").deleteOne({ id });
    return NextResponse.json({ success: true });
}
