import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET(req: NextRequest) {
    try {
        const db = await getDatabase();
        const slug = req.nextUrl.searchParams.get("slug");
        const publishedOnly = req.nextUrl.searchParams.get("published") === "true";

        if (slug) {
            const query: Record<string, unknown> = { slug };
            if (publishedOnly) query.isPublished = true;
            const page = await db.collection("pages").findOne(query);
            if (!page) {
                return NextResponse.json({ error: "Page not found" }, { status: 404 });
            }
            return NextResponse.json(page);
        }

        const pages = await db.collection("pages").find().sort({ createdAt: -1 }).toArray();
        return NextResponse.json(pages);
    } catch (error) {
        console.error("GET /api/pages error:", error);
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = await getDatabase();

        if (!body.title || !body.slug) {
            return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
        }

        // Check if slug is unique
        const existing = await db.collection("pages").findOne({ slug: body.slug });
        if (existing) {
            return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });
        }

        const now = new Date().toISOString();
        const newPage = {
            id: body.id || `pg_${Date.now()}`,
            title: body.title,
            slug: body.slug,
            subtitle: body.subtitle || "",
            sections: body.sections || [],
            content: body.content || [],
            metaTitle: body.metaTitle || "",
            metaDescription: body.metaDescription || "",
            image: body.image || "",
            isPublished: body.isPublished ?? false,
            createdAt: body.createdAt || now,
            updatedAt: now,
        };

        const result = await db.collection("pages").insertOne(newPage);
        return NextResponse.json({ ...newPage, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("POST /api/pages error:", error);
        return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
    }
}

// PUT /api/pages — upsert by slug (used by About Page editor)
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const db = await getDatabase();

        if (!body.slug) {
            return NextResponse.json({ error: "Slug is required for upsert" }, { status: 400 });
        }

        const now = new Date().toISOString();
        const updateData = {
            id: body.id || `pg_${Date.now()}`,
            title: body.title || "",
            slug: body.slug,
            subtitle: body.subtitle || "",
            sections: body.sections || [],
            content: body.content || [],
            metaTitle: body.metaTitle || "",
            metaDescription: body.metaDescription || "",
            image: body.image || "",
            isPublished: body.isPublished ?? false,
            createdAt: body.createdAt || now,
            updatedAt: now,
        };

        await db.collection("pages").updateOne(
            { slug: body.slug },
            { $set: updateData },
            { upsert: true }
        );

        return NextResponse.json({ success: true, page: updateData });
    } catch (error) {
        console.error("PUT /api/pages error:", error);
        return NextResponse.json({ error: "Failed to upsert page" }, { status: 500 });
    }
}
