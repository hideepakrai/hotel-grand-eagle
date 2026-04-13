"use client";
import React, { useEffect, useState } from "react";
import type { CMSPage, AboutSection, TextImageSection, QuoteSection } from "../../components/types";

// ── Highlight helper ──────────────────────────────────────────────────────────

function renderWithHighlights(text: string, terms: string): React.ReactNode {
    if (!terms.trim()) return text;

    // Build sorted list of terms by length desc (so longer matches take priority)
    const termList = terms
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);

    if (termList.length === 0) return text;

    // Build regex from terms
    const escaped = termList.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");

    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) => {
                const isMatch = termList.some(t => t.toLowerCase() === part.toLowerCase());
                return isMatch
                    ? <strong key={i} style={{ color: "var(--gold)" }}>{part}</strong>
                    : <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </>
    );
}

// Split description by newlines into paragraphs
function renderParagraphs(description: string, highlightTerms: string) {
    const paras = description.split(/\n+/).filter(p => p.trim());
    if (paras.length === 0) return null;
    return (
        <>
            {paras.map((para, i) => (
                <p key={i} className="fade-in-up visible" style={{ marginBottom: i < paras.length - 1 ? "20px" : 0 }}>
                    {renderWithHighlights(para, highlightTerms)}
                </p>
            ))}
        </>
    );
}

// ── Static fallback data ──────────────────────────────────────────────────────

const FALLBACK_TITLE = "A legacy of excellence";
const FALLBACK_SUBTITLE = "Our Heritage";
const FALLBACK_SECTIONS: AboutSection[] = [
    {
        id: "fb_1",
        type: "text-image",
        heading: "Budget-Friendly Stay in Jaipur",
        subheading: "",
        description: "Hotel Grand Eagle is a value-for-money hotel offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions, and 24/7 hot and cold water supply—everything you need for a comfortable yet affordable stay.\n\nLocated near JECC, major transport hubs, and local food joints, our hotel is perfect for budget-conscious travelers seeking convenience and accessibility. With a focus on cleanliness, functionality, and friendly service, Hotel Grand Eagle is the ideal pick for short or extended stays in Jaipur's Sitapura Industrial Area.",
        highlightTerms: "value-for-money hotel, air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions, 24/7 hot and cold water supply, comfortable yet affordable stay, JECC, transport hubs, local food joints, budget-conscious travelers, cleanliness, functionality, friendly service, short or extended stays",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
        imagePosition: "right",
        stats: [{ id: "s1", value: "24+", label: "Years of Luxury" }],
    },
    {
        id: "fb_2",
        type: "quote",
        eyebrow: "The Vision",
        text: "\"We created Grand Eagle as a love letter to Jaipur — a space where guests don't just visit, they belong.\"",
    },
];

// ── Section Renderers ─────────────────────────────────────────────────────────

function TextImageSectionRender({ sec }: { sec: TextImageSection }) {
    const isLeft = sec.imagePosition === "left";

    return (
        <div className="about-grid" style={{ marginBottom: 112 }}>
            {/* Image column — shown on left if imagePosition=left */}
            {isLeft && (
                <div className="about-imgs">
                    <div className="about-gold-bar" />
                    <div className="about-main-img fade-in-up visible">
                        {sec.image ? (
                            <img src={sec.image} alt={sec.heading || "About"} style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }} />
                        ) : (
                            <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />
                        )}
                        <div className="about-img-overlay" />
                    </div>
                    {sec.stats.length > 0 && sec.stats[0] && (
                        <div className="about-stat-card fade-in-up visible">
                            <div className="about-stat-num font-display">{sec.stats[0].value}</div>
                            <div className="about-stat-label">{sec.stats[0].label}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Text column */}
            <div className="about-text" style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#a0a0a0" }}>
                <h2 className="section-title fade-in-up visible" style={{ fontSize: 36, marginBottom: 32, lineHeight: 1.2, color: "var(--ivory)" }}>
                    {sec.heading.includes("\n")
                        ? sec.heading.split("\n").map((line, i) => (
                            <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                        ))
                        : <>{sec.heading.split(" ").slice(0, -1).join(" ")}{" "}<em>{sec.heading.split(" ").slice(-1)}</em></>
                    }
                </h2>
                {renderParagraphs(sec.description, sec.highlightTerms)}

                {/* Additional stats beyond the first (shown inline below text) */}
                {sec.stats.length > 1 && (
                    <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
                        {sec.stats.slice(1).map(stat => (
                            <div key={stat.id} className="about-stat-card fade-in-up visible" style={{ position: "static" }}>
                                <div className="about-stat-num font-display">{stat.value}</div>
                                <div className="about-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Image column — shown on right if imagePosition=right */}
            {!isLeft && (
                <div className="about-imgs">
                    <div className="about-gold-bar" />
                    <div className="about-main-img fade-in-up visible">
                        {sec.image ? (
                            <img src={sec.image} alt={sec.heading || "About"} style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }} />
                        ) : (
                            <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />
                        )}
                        <div className="about-img-overlay" />
                    </div>
                    {sec.stats.length > 0 && sec.stats[0] && (
                        <div className="about-stat-card fade-in-up visible">
                            <div className="about-stat-num font-display">{sec.stats[0].value}</div>
                            <div className="about-stat-label">{sec.stats[0].label}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function QuoteSectionRender({ sec }: { sec: QuoteSection }) {
    return (
        <div style={{ background: "rgba(212, 168, 87, 0.05)", padding: "100px 40px", textAlign: "center", borderRadius: "1px", border: "1px solid rgba(212, 168, 87, 0.1)", marginBottom: 80 }}>
            <div className="section-eyebrow fade-in-up visible" style={{ justifyContent: "center" }}>
                <span>{sec.eyebrow || "The Vision"}</span>
            </div>
            <blockquote className="font-display fade-in-up visible"
                style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "var(--ivory)", fontStyle: "italic", maxWidth: 800, margin: "24px auto" }}>
                {sec.text}
            </blockquote>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
    const [cmsData, setCmsData] = useState<CMSPage | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch("/api/pages?slug=about")
            .then(r => {
                if (!r.ok) return null;
                return r.json();
            })
            .then(d => {
                if (d && d.slug === "about") setCmsData(d);
            })
            .catch(() => {})
            .finally(() => setLoaded(true));
    }, []);

    // Use CMS data if available and published, otherwise fall back to static
    const isUsing = cmsData?.isPublished && cmsData?.sections && cmsData.sections.length > 0;
    const title = isUsing ? cmsData!.title : FALLBACK_TITLE;
    const subtitle = isUsing ? (cmsData!.subtitle || FALLBACK_SUBTITLE) : FALLBACK_SUBTITLE;
    const sections: AboutSection[] = isUsing ? cmsData!.sections! : FALLBACK_SECTIONS;

    // Render the page title with italic last word (e.g. "A legacy of _excellence_")
    const renderTitle = (t: string) => {
        const words = t.split(" ");
        if (words.length <= 1) return t;
        const lastWord = words[words.length - 1];
        const rest = words.slice(0, -1).join(" ");
        return <>{rest} <em>{lastWord}</em></>;
    };

    return (
        <div style={{ paddingTop: 160, paddingBottom: 112, background: "var(--midnight)" }}>
            <div className="max-w">
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up visible" style={{ justifyContent: "center" }}>
                        <span className="line" />
                        <span>{subtitle}</span>
                        <span className="line" />
                    </div>
                    <h1 className="section-title fade-in-up visible" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        {renderTitle(title)}
                    </h1>
                </div>

                {/* Dynamic Sections */}
                {sections.map(sec => {
                    if (sec.type === "text-image") {
                        return <TextImageSectionRender key={sec.id} sec={sec as TextImageSection} />;
                    }
                    if (sec.type === "quote") {
                        return <QuoteSectionRender key={sec.id} sec={sec as QuoteSection} />;
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
