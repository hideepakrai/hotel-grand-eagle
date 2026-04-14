import fs from 'fs';
import { MongoClient } from 'mongodb';

// Read .env
const envFile = fs.readFileSync('.env', 'utf-8');
const mongoUriMatch = envFile.match(/MONGODB_URI=(.*)/);
const mongoDbMatch = envFile.match(/MONGODB_DB=(.*)/);
const MONGODB_URI = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^"|"$/g, '') : null;
const MONGODB_DB = mongoDbMatch ? mongoDbMatch[1].trim().replace(/^"|"$/g, '') : "hotel_management";

const LEGAL_PAGES = [
    {
        id: "pg_privacy_policy",
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "<h1>Privacy Policy</h1><p>At Hotel Grand Eagle, we are committed to protecting your privacy. This policy explains how we collect and use your data.</p><h3>Data Collection</h3><p>We collect information you provide directly to us when you make a booking, such as your name, email address, and phone number.</p><h3>Use of Data</h3><p>Your data is used solely to facilitate your stay, process payments, and improve our services.</p>",
        isPublished: true,
        metaTitle: "Privacy Policy | Hotel Grand Eagle",
        metaDescription: "Read about our privacy practices and how we protect your personal information."
    },
    {
        id: "pg_terms_of_service",
        title: "Terms of Service",
        slug: "terms-of-service",
        content: "<h1>Terms of Service</h1><p>By using our services, you agree to the following terms and conditions.</p><h3>Bookings</h3><p>All bookings are subject to availability and confirmation. A valid ID is required at check-in.</p><h3>Cancellations</h3><p>Cancellation policies vary by room type. Please refer to your booking confirmation for details.</p>",
        isPublished: true,
        metaTitle: "Terms of Service | Hotel Grand Eagle",
        metaDescription: "Review the terms and conditions for staying at Hotel Grand Eagle."
    }
];

async function ensurePages() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI not found in .env");
        process.exit(1);
    }

    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db(MONGODB_DB);
        const collection = db.collection("pages");

        for (const pg of LEGAL_PAGES) {
            const existing = await collection.findOne({ slug: pg.slug });
            if (!existing) {
                const now = new Date().toISOString();
                await collection.insertOne({ ...pg, createdAt: now, updatedAt: now });
                console.log(`✅ Created page: ${pg.slug}`);
            } else {
                console.log(`ℹ️ Page already exists: ${pg.slug}`);
            }
        }
    } catch (err) {
        console.error("❌ Error seeding pages:", err);
    } finally {
        await client.close();
        console.log("🏁 Done!");
    }
}

ensurePages();
