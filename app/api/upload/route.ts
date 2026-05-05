import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Basic validation
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only image files (JPG, PNG, WEBP) are allowed" }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "hotel_aadhaar_uploads",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({ 
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id 
        });

    } catch (err) {
        console.error("[UPLOAD_ERROR]", err);
        return NextResponse.json({ error: "Failed to upload image to Cloudinary" }, { status: 500 });
    }
}
