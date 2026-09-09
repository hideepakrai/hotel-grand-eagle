"use client";

import React, { useMemo, useState } from "react";
import NearbyMap from "../components/NearbyMap";
import type { NearbyPlace } from "../../components/types";

interface Attraction {
    id: string;
    name: string;
    timing: string;
    description: string;
    lat?: number;
    lng?: number;
}

interface Category {
    id: string;
    title: string;
    subtitle: string;
    items: Attraction[];
}

const CATEGORIES: Category[] = [
    {
        id: "travel",
        title: "Travel Hubs",
        subtitle: "Airport and railway access",
        items: [
            { id: "airport", name: "Jaipur International Airport", timing: "20 min", description: "Convenient access for business and leisure travellers.", lat: 26.8242, lng: 75.8122 },
            { id: "jagatpura", name: "Jagatpura Railway Station", timing: "8 min", description: "Useful local rail connectivity near Sitapura.", lat: 26.8325, lng: 75.8366 },
        ],
    },
    {
        id: "landmarks",
        title: "Landmarks",
        subtitle: "Daily essentials and local points",
        items: [
            { id: "dmart", name: "D'Mart", timing: "3 min", description: "Nearby shopping for daily essentials.", lat: 26.7799, lng: 75.8141 },
            { id: "sitapura", name: "Sitapura Industrial Area", timing: "3 min", description: "Prime business and industrial district of Jaipur.", lat: 26.7769, lng: 75.8123 },
            { id: "vivacity", name: "Viva City Mall", timing: "4 min", description: "Quick shopping and food options close to the hotel.", lat: 26.7798, lng: 75.8069 },
            { id: "capital", name: "Capital Mall", timing: "5 min", description: "Nearby mall for retail and casual dining.", lat: 26.7826, lng: 75.8101 },
            { id: "akshaya", name: "Akshaya Patra Temple", timing: "5 min", description: "A well-known local spiritual landmark.", lat: 26.7804, lng: 75.8346 },
        ],
    },
    {
        id: "education",
        title: "Schools & Colleges",
        subtitle: "Universities and institutions",
        items: [
            { id: "jecrc", name: "JECRC University", timing: "5 min", description: "Major university near Sitapura.", lat: 26.7815, lng: 75.8222 },
            { id: "poornima", name: "Poornima University", timing: "5 min", description: "Close access for visiting students and families.", lat: 26.7689, lng: 75.8516 },
            { id: "vit", name: "VIT University", timing: "5 min", description: "Nearby academic institution.", lat: 26.7821, lng: 75.8252 },
            { id: "gyan", name: "Gyan Vihar University", timing: "4 min", description: "Popular university campus close by.", lat: 26.8097, lng: 75.8493 },
            { id: "srn", name: "SRN International School", timing: "5 min", description: "School access for local visits.", lat: 26.7709, lng: 75.8217 },
            { id: "jpis", name: "Jaishree Periwal Global School", timing: "5 min", description: "Well-connected school near the hotel.", lat: 26.7784, lng: 75.8504 },
        ],
    },
    {
        id: "healthcare",
        title: "Hospitals",
        subtitle: "Healthcare nearby",
        items: [
            { id: "bombay", name: "Bombay Hospital", timing: "3 min", description: "Quick healthcare access close to the property.", lat: 26.7813, lng: 75.8094 },
            { id: "jeevan", name: "Jeevan Rekha Hospital", timing: "4 min", description: "Nearby hospital for urgent support.", lat: 26.8022, lng: 75.8173 },
            { id: "mg", name: "Mahatma Gandhi Hospital", timing: "5 min", description: "Major hospital and medical college nearby.", lat: 26.7759, lng: 75.8379 },
            { id: "narayana", name: "Narayana Multispeciality Hospital", timing: "8 min", description: "Multispeciality medical care within easy reach.", lat: 26.8395, lng: 75.7943 },
        ],
    },
];

function toNearbyPlace(item: Attraction): NearbyPlace {
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        distance: item.timing,
        image: "",
        lat: item.lat,
        lng: item.lng,
        createdAt: "static",
    };
}

export default function NearbyPage() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
    const [selectedPlaceId, setSelectedPlaceId] = useState(CATEGORIES[0].items[0].id);

    const active = CATEGORIES.find(cat => cat.id === activeCategory) || CATEGORIES[0];
    const mapPlaces = useMemo(() => CATEGORIES.flatMap(cat => cat.items.map(toNearbyPlace)), []);

    return (
        <div className="nearby-page">
            <div className="nearby-bg-text">Nearby</div>

            <div className="max-w nearby-shell">
                <div className="nearby-header">
                    <div className="section-eyebrow fade-in-up visible" style={{ justifyContent: "center" }}>
                        <span className="line" />
                        <span>Local Discoveries</span>
                        <span className="line" />
                    </div>
                    <h1 className="section-title fade-in-up visible nearby-title">
                        Nearby <em>Attractions</em>
                    </h1>
                    <p className="fade-in-up visible nearby-intro">
                        Stay close to everything that matters. Hotel Grand Eagle keeps you near travel hubs, colleges, hospitals, shopping points, and Sitapura&apos;s business district.
                    </p>
                </div>

                <div className="nearby-layout">
                    <div className="nearby-content">
                        <div className="nearby-tabs" aria-label="Nearby categories">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`nearby-tab${activeCategory === cat.id ? " active" : ""}`}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setSelectedPlaceId(cat.items[0]?.id || selectedPlaceId);
                                    }}
                                >
                                    <span>{cat.title}</span>
                                    <small>{cat.subtitle}</small>
                                </button>
                            ))}
                        </div>

                        <div className="nearby-card-grid">
                            {active.items.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`nearby-place-card${selectedPlaceId === item.id ? " selected" : ""}`}
                                    onClick={() => setSelectedPlaceId(item.id)}
                                >
                                    <span className="nearby-place-meta">{item.timing}</span>
                                    <strong>{item.name}</strong>
                                    <span>{item.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="nearby-map-wrap fade-in-up visible">
                        <NearbyMap places={mapPlaces} selectedPlaceId={selectedPlaceId} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .nearby-page {
                    background: var(--midnight);
                    min-height: 100vh;
                    padding: 160px 0 112px;
                    position: relative;
                    overflow: hidden;
                }

                .nearby-bg-text {
                    position: absolute;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(212, 168, 87, 0.035);
                    font-size: clamp(72px, 16vw, 190px);
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    line-height: 1;
                    pointer-events: none;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .nearby-shell {
                    position: relative;
                    z-index: 1;
                }

                .nearby-header {
                    text-align: center;
                    margin-bottom: 72px;
                }

                .nearby-title {
                    font-size: clamp(40px, 8vw, 84px);
                }

                .nearby-intro {
                    color: var(--ivory-dim);
                    font-size: 15px;
                    line-height: 1.8;
                    max-width: 760px;
                    margin: 24px auto 0;
                }

                .nearby-layout {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
                    gap: 48px;
                    align-items: start;
                }

                .nearby-content {
                    min-width: 0;
                }

                .nearby-tabs {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 14px;
                    margin-bottom: 24px;
                }

                .nearby-tab,
                .nearby-place-card {
                    border: 1px solid rgba(212, 168, 87, 0.14);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--ivory-dim);
                    cursor: pointer;
                    font-family: inherit;
                    text-align: left;
                    transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
                }

                .nearby-tab {
                    min-height: 86px;
                    padding: 18px;
                }

                .nearby-tab span {
                    color: var(--ivory);
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                .nearby-tab small {
                    color: var(--ivory-dim);
                    font-size: 12px;
                    line-height: 1.5;
                }

                .nearby-tab:hover,
                .nearby-place-card:hover {
                    border-color: rgba(212, 168, 87, 0.38);
                    transform: translateY(-2px);
                }

                .nearby-tab.active {
                    background: var(--gold);
                    border-color: var(--gold);
                }

                .nearby-tab.active span,
                .nearby-tab.active small {
                    color: var(--midnight);
                }

                .nearby-card-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }

                .nearby-place-card {
                    min-height: 158px;
                    padding: 24px;
                }

                .nearby-place-card strong {
                    color: var(--ivory);
                    display: block;
                    font-size: 18px;
                    line-height: 1.35;
                    margin: 12px 0 10px;
                }

                .nearby-place-card span:last-child {
                    display: block;
                    font-size: 13px;
                    line-height: 1.65;
                }

                .nearby-place-meta {
                    color: var(--gold);
                    display: inline-flex;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                .nearby-place-card.selected {
                    background: rgba(212, 168, 87, 0.08);
                    border-color: rgba(212, 168, 87, 0.5);
                }

                .nearby-map-wrap {
                    border: 1px solid rgba(212, 168, 87, 0.2);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                    height: 650px;
                    overflow: hidden;
                    position: sticky;
                    top: 120px;
                }

                @media (max-width: 1024px) {
                    .nearby-page {
                        padding-top: 132px;
                    }

                    .nearby-layout {
                        grid-template-columns: 1fr;
                    }

                    .nearby-map-wrap {
                        height: 480px;
                        position: relative;
                        top: 0;
                    }
                }

                @media (max-width: 768px) {
                    .nearby-page {
                        padding: 116px 0 80px;
                    }

                    .nearby-header {
                        margin-bottom: 42px;
                    }

                    .nearby-tabs,
                    .nearby-card-grid {
                        grid-template-columns: 1fr;
                    }

                    .nearby-place-card {
                        min-height: 0;
                    }

                    .nearby-map-wrap {
                        height: 420px;
                    }
                }
            `}</style>
        </div>
    );
}
