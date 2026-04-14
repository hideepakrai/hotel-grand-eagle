"use client";
import React from "react";

export default function Loading() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "var(--midnight)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px"
    }}>
      <div className="loader-logo">
        <img src="/logo.png" alt="Hotel Grand Eagle" style={{ height: "60px", width: "auto" }} />
      </div>
      <div className="loader-line-container">
        <div className="loader-line" />
      </div>
      <style jsx>{`
        .loader-logo {
          animation: pulse 2s ease-in-out infinite;
        }
        .loader-line-container {
          width: 200px;
          height: 1px;
          background: rgba(212, 168, 87, 0.1);
          position: relative;
          overflow: hidden;
        }
        .loader-line {
          position: absolute;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          animation: slide 1.5s infinite linear;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide {
          from { left: -100%; }
          to { left: 100%; }
        }
      `}</style>
    </div>
  );
}
