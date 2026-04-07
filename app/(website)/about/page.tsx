"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function AboutPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
        
        // Handle scroll animations
        const fadeEls = document.querySelectorAll('.fade-in-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.transitionDelay = (i * 0.05) + 's';
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        fadeEls.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ paddingTop: 160, paddingBottom: 112, background: "var(--midnight)" }}>
            <div className="max-w">
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line" />
                        <span>Our Heritage</span>
                        <span className="line" />
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        A legacy of <em>excellence</em>
                    </h1>
                </div>

                {/* About Content Grid */}
                <div className="about-grid" style={{ marginBottom: 112 }}>
                    <div className="about-imgs">
                        <div className="about-gold-bar" />
                        <div className="about-main-img fade-in-up">
                            <img 
                                src="https://images.unsplash.com/photo-1542314831-c6a4d14d8376?q=80&w=800" 
                                alt="Grand Eagle Interior" 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div className="about-img-overlay" />
                        </div>
                        <div className="about-accent-img fade-in-up">
                            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800" alt="Detail" />
                        </div>
                        <div className="about-stat-card fade-in-up">
                            <div className="about-stat-num font-display">24+</div>
                            <div className="about-stat-label">Years of Luxury</div>
                        </div>
                    </div>
                    
                    <div className="about-text" style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#a0a0a0" }}>
                        <h2 className="section-title fade-in-up" style={{ fontSize: 36, marginBottom: 32, lineHeight: 1.2, color: "var(--ivory)" }}>
                            Budget-Friendly Stay in<br /><em>Jaipur</em>
                        </h2>
                        <p className="fade-in-up" style={{ marginBottom: "20px" }}>
                            Hotel Grand Eagle is a <strong style={{ color: "var(--gold)" }}>value-for-money hotel</strong> offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as <strong style={{ color: "var(--gold)" }}>air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions</strong>, and <strong style={{ color: "var(--gold)" }}>24/7 hot and cold water supply</strong>—everything you need for a <strong style={{ color: "var(--gold)" }}>comfortable yet affordable stay</strong>.
                        </p>
                        <p className="fade-in-up">
                            Located near <strong style={{ color: "var(--gold)" }}>JECC</strong>, major <strong style={{ color: "var(--gold)" }}>transport hubs</strong>, and <strong style={{ color: "var(--gold)" }}>local food joints</strong>, our hotel is perfect for <strong style={{ color: "var(--gold)" }}>budget-conscious travelers</strong> seeking convenience and accessibility. With a focus on <strong style={{ color: "var(--gold)" }}>cleanliness, functionality</strong>, and <strong style={{ color: "var(--gold)" }}>friendly service</strong>, Hotel Grand Eagle is the ideal pick for <strong style={{ color: "var(--gold)" }}>short or extended stays</strong> in Jaipur's Sitapura Industrial Area.
                        </p>
                    </div>
                </div>

                {/* Additional Vision Section */}
                <div style={{ background: "rgba(212, 168, 87, 0.05)", padding: "100px 40px", textAlign: "center", borderRadius: "1px", border: "1px solid rgba(212, 168, 87, 0.1)" }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span>The Vision</span>
                    </div>
                    <blockquote className="font-display fade-in-up" style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "var(--ivory)", fontStyle: "italic", maxWidth: 800, margin: "24px auto" }}>
                        "We created Grand Eagle as a love letter to Jaipur — a space where guests don't just visit, they belong."
                    </blockquote>
                </div>
            </div>
        </div>
    );
}


