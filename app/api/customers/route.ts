import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { getTestMode, withTestMode, attachTestMode } from "@/app/utils/testMode";

export async function GET(req: Request) {
    const isTest = getTestMode(req);
    const db = await getDatabase();
    const query = withTestMode({}, isTest);
    const customers = await db.collection("customers").find(query).toArray();
    return NextResponse.json(customers);
}

export async function POST(req: Request) {
    const isTest = getTestMode(req);
    const body = await req.json();
    const db = await getDatabase();
    const customer = attachTestMode(body, isTest);
    const result = await db.collection("customers").insertOne(customer);
    return NextResponse.json(result);
}

export async function PUT(req: Request) {
    const isTest = getTestMode(req);
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    const updateData = attachTestMode(data, isTest);
    await db.collection("customers").updateOne({ id }, { $set: updateData });
    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await getDatabase();
    await db.collection("customers").deleteOne({ id });
    return NextResponse.json({ success: true });
}
