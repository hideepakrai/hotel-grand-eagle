import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { getTestMode, withTestMode, attachTestMode } from "@/app/utils/testMode";

export async function GET(req: Request) {
    const isTest = getTestMode(req);
    const db = await getDatabase();
    const query = withTestMode({}, isTest);
    const plans = await db.collection("meal_plans").find(query).toArray();
    return NextResponse.json(plans);
}

export async function POST(req: Request) {
    const isTest = getTestMode(req);
    const body = await req.json();
    const db = await getDatabase();
    const plan = attachTestMode(body, isTest);
    const result = await db.collection("meal_plans").insertOne(plan);
    return NextResponse.json(result);
}

export async function PUT(req: Request) {
    const isTest = getTestMode(req);
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    const updateData = attachTestMode(data, isTest);
    await db.collection("meal_plans").updateOne(withTestMode({ id }, isTest), { $set: updateData });
    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const isTest = getTestMode(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await getDatabase();
    await db.collection("meal_plans").deleteOne(withTestMode({ id }, isTest));
    return NextResponse.json({ success: true });
}
