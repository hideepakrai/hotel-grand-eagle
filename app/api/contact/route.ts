import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { sendContactEnquiryNotification } from "@/app/utils/email";

interface ContactBody {
    name?: string;
    email?: string;
    phone?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    message?: string;
    source?: string;
}

function clean(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
    try {
        const body = await req.json() as ContactBody;
        const enquiry = {
            id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: clean(body.name),
            email: clean(body.email),
            phone: clean(body.phone),
            checkIn: clean(body.checkIn),
            checkOut: clean(body.checkOut),
            guests: clean(body.guests),
            message: clean(body.message),
            source: clean(body.source) || "Website contact form",
            status: "new",
            createdAt: new Date().toISOString(),
        };

        if (!enquiry.name) {
            return NextResponse.json({ error: "Name is required." }, { status: 400 });
        }

        if (!enquiry.email || !isEmail(enquiry.email)) {
            return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
        }

        if (!enquiry.message) {
            return NextResponse.json({ error: "Message is required." }, { status: 400 });
        }

        const db = await getDatabase();
        await db.collection("contact_enquiries").insertOne(enquiry);

        const emailSent = await sendContactEnquiryNotification(enquiry);

        return NextResponse.json({ success: true, emailSent, enquiryId: enquiry.id });
    } catch (err) {
        console.error("[POST /api/contact]", err);
        return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
    }
}
