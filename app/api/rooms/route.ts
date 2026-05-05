import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { getTestMode, withTestMode, attachTestMode } from "@/app/utils/testMode";

/**
 * Individual Room Inventory API — collection: "rooms"
 */

export async function GET(req: Request) {
    try {
        const isTest = getTestMode(req);
        const { searchParams } = new URL(req.url);
        const roomTypeId = searchParams.get("roomTypeId");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");

        const db = await getDatabase();

        // Base filter by roomTypeId if provided + test mode
        const filter: Record<string, unknown> = withTestMode(
            roomTypeId ? { roomTypeId } : {},
            isTest
        );
        
        const rooms = await db.collection("rooms").find(filter).sort({ floor: 1, roomNumber: 1 }).toArray();
        let clean = rooms.map(({ _id, ...rest }) => rest);

        // Date-range availability filtering: exclude rooms with overlapping active bookings
        if (checkIn && checkOut && roomTypeId) {
            const overlapping = await db.collection("bookings").find(withTestMode({
                roomTypeId,
                roomNumber: { $ne: null, $exists: true },
                status: { $nin: ["cancelled", "checked-out", "no-show"] },
                checkIn: { $lt: checkOut },
                checkOut: { $gt: checkIn },
            }, isTest)).toArray();

            const occupiedRooms = new Set(overlapping.map((b) => String(b.roomNumber)));

            clean = clean.filter((r) => {
                const hasDateConflict = occupiedRooms.has(String(r.roomNumber));
                const isUnavailableStatus = r.status === "maintenance" || r.status === "out-of-order";
                return !hasDateConflict && !isUnavailableStatus;
            });
        }

        return NextResponse.json(clean);
    } catch {
        return NextResponse.json({ error: "Failed to fetch room inventory" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const isTest = getTestMode(req);
        const body = await req.json();
        if (!body.roomNumber || !body.roomTypeId) {
            return NextResponse.json({ error: "roomNumber and roomTypeId are required" }, { status: 400 });
        }
        const db = await getDatabase();
        
        // Check if exists in the same mode
        const exists = await db.collection("rooms").findOne(withTestMode({ roomNumber: body.roomNumber }, isTest));
        if (exists) return NextResponse.json({ error: `Room ${body.roomNumber} already exists in ${isTest ? 'test' : 'production'} mode` }, { status: 409 });

        const doc = attachTestMode({
            id: body.id || `room_${body.roomNumber}`,
            roomNumber: body.roomNumber,
            roomTypeId: body.roomTypeId,
            roomTypeName: body.roomTypeName ?? "",
            floor: body.floor ?? Math.floor(parseInt(body.roomNumber) / 100),
            status: body.status ?? "available",
            isActive: body.isActive ?? true,
            features: body.features ?? [],
            notes: body.notes ?? "",
            lastCleaned: body.lastCleaned ?? new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
        }, isTest);

        if (doc.floor < 1 || doc.floor > 99) {
            return NextResponse.json({ error: "Floor must be between 1 and 99" }, { status: 400 });
        }

        await db.collection("rooms").insertOne(doc);
        return NextResponse.json({ success: true, id: doc.id });
    } catch {
        return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const isTest = getTestMode(req);
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const db = await getDatabase();
        
        if (data.floor !== undefined && (data.floor < 1 || data.floor > 99)) {
            return NextResponse.json({ error: "Floor must be between 1 and 99" }, { status: 400 });
        }

        const updateData = attachTestMode(data, isTest);
        const result = await db.collection("rooms").updateOne({ id }, { $set: updateData });
        if (result.matchedCount === 0) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const isTest = getTestMode(req);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const floor = searchParams.get("floor");

        const db = await getDatabase();

        if (id) {
            // Delete should also check mode to be safe, though ID is usually unique
            const result = await db.collection("rooms").deleteOne(withTestMode({ id }, isTest));
            if (result.deletedCount === 0) return NextResponse.json({ error: "Room not found in current mode" }, { status: 404 });
            return NextResponse.json({ success: true });
        }

        if (floor) {
            const floorNum = parseInt(floor);
            const result = await db.collection("rooms").deleteMany(withTestMode({ floor: floorNum }, isTest));
            return NextResponse.json({ success: true, deletedCount: result.deletedCount });
        }

        return NextResponse.json({ error: "id or floor required" }, { status: 400 });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
