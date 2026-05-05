import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { getTestMode, withTestMode, attachTestMode } from "@/app/utils/testMode";

// GET all room types
export async function GET(req: Request) {
  try {
    const isTest = getTestMode(req);
    const db = await getDatabase();
    const query = withTestMode({}, isTest);
    const rooms = await db.collection("room_types").find(query).toArray();
    // Strip MongoDB internal _id from results
    const clean = rooms.map(({ _id, ...rest }) => rest);
    return NextResponse.json(clean);
  } catch (err) {
    console.error("API error fetching room types:", err);
    return NextResponse.json({ error: "Failed to fetch room types", details: String(err) }, { status: 500 });
  }
}

// POST — create a new room type
export async function POST(req: Request) {
  try {
    const isTest = getTestMode(req);
    const body = await req.json();
    const db = await getDatabase();
    
    // Backend validation
    if (body.maxOccupancy !== undefined && (body.maxOccupancy < 1 || body.maxOccupancy > 20)) {
      return NextResponse.json({ error: "Max occupancy must be between 1 and 20" }, { status: 400 });
    }
    if (body.roomSize !== undefined && (body.roomSize < 5 || body.roomSize > 2000)) {
      return NextResponse.json({ error: "Room size must be between 5 and 2000 m²" }, { status: 400 });
    }
    if (body.basePrice !== undefined && body.basePrice < 0) {
      return NextResponse.json({ error: "Base price cannot be negative" }, { status: 400 });
    }
    if (body.extraBedPrice !== undefined && body.extraBedPrice < 0) {
      return NextResponse.json({ error: "Extra bed price cannot be negative" }, { status: 400 });
    }

    const doc = attachTestMode(body, isTest);
    await db.collection("room_types").insertOne(doc);
    return NextResponse.json({ success: true, id: body.id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

// PUT — update existing room type by its string id field
export async function PUT(req: Request) {
  try {
    const isTest = getTestMode(req);
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await getDatabase();
    
    // Backend validation
    if (data.maxOccupancy !== undefined && (data.maxOccupancy < 1 || data.maxOccupancy > 20)) {
      return NextResponse.json({ error: "Max occupancy must be between 1 and 20" }, { status: 400 });
    }
    if (data.roomSize !== undefined && (data.roomSize < 5 || data.roomSize > 2000)) {
      return NextResponse.json({ error: "Room size must be between 5 and 2000 m²" }, { status: 400 });
    }
    if (data.basePrice !== undefined && data.basePrice < 0) {
      return NextResponse.json({ error: "Base price cannot be negative" }, { status: 400 });
    }
    if (data.extraBedPrice !== undefined && data.extraBedPrice < 0) {
      return NextResponse.json({ error: "Extra bed price cannot be negative" }, { status: 400 });
    }

    const updateData = attachTestMode(data, isTest);
    const result = await db.collection("room_types").updateOne(
      withTestMode({ id }, isTest),
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Room not found in current mode" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

// DELETE — remove room by string id query param
export async function DELETE(req: Request) {
  try {
    const isTest = getTestMode(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await getDatabase();
    const result = await db.collection("room_types").deleteOne(withTestMode({ id }, isTest));
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found in current mode" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}