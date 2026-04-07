"use client";
import React from "react";

export default function About() {
  return (
    <section id="about" style={{ padding: "112px 0", background: "#0E0E0E", overflow: "hidden" }}>
      <div className="max-w about-grid" id="about-grid">
        <div className="about-imgs">
          <div className="about-gold-bar"></div>
          <div className="about-main-img fade-in-up visible">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"
              alt="Hotel Grand Eagle Lobby"
              loading="lazy"
              style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }}
            />
            <div className="about-img-overlay"></div>
          </div>
          <div className="about-accent-img fade-in-up visible">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800"
              alt="Pool"
              loading="lazy"
            />
          </div>
          <div className="about-stat-card fade-in-up visible">
            <div className="about-stat-num font-display">2001</div>
            <div className="about-stat-label">Est. in Jaipur</div>
          </div>
        </div>
        <div>
          <div className="section-eyebrow fade-in-up visible">
            <span className="line"></span>
            <span>About Us</span>
          </div>
          <h2 className="section-title fade-in-up visible" style={{ marginBottom: "28px" }}>
            Budget-Friendly Stay in<br />
            <em>Jaipur</em>
          </h2>
          <div className="about-text" style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#a0a0a0" }}>
            <p className="fade-in-up visible" style={{ marginBottom: "20px" }}>
              Hotel Grand Eagle is a <strong style={{ color: "var(--gold)" }}>value-for-money hotel</strong> offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as <strong style={{ color: "var(--gold)" }}>air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions</strong>, and <strong style={{ color: "var(--gold)" }}>24/7 hot and cold water supply</strong>—everything you need for a <strong style={{ color: "var(--gold)" }}>comfortable yet affordable stay</strong>.
            </p>
            <p className="fade-in-up visible">
              Located near <strong style={{ color: "var(--gold)" }}>JECC</strong>, major <strong style={{ color: "var(--gold)" }}>transport hubs</strong>, and <strong style={{ color: "var(--gold)" }}>local food joints</strong>, our hotel is perfect for <strong style={{ color: "var(--gold)" }}>budget-conscious travelers</strong> seeking convenience and accessibility. With a focus on <strong style={{ color: "var(--gold)" }}>cleanliness, functionality</strong>, and <strong style={{ color: "var(--gold)" }}>friendly service</strong>, Hotel Grand Eagle is the ideal pick for <strong style={{ color: "var(--gold)" }}>short or extended stays</strong> in Jaipur's Sitapura Industrial Area.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
