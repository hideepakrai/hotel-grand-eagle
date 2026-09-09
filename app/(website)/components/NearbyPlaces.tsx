"use client";
import React, { useEffect, useState } from "react";
import { NearbyPlace } from "../../components/types";
import { FaMapMarkerAlt, FaPlane, FaHospital, FaUniversity, FaBuilding, FaRoad } from "react-icons/fa";

const FALLBACK_PLACES: NearbyPlace[] = [
  { id: "airport", name: "Jaipur International Airport", description: "Airport access", distance: "20 min", image: "", createdAt: "static" },
  { id: "jecc", name: "JECC Jaipur", description: "Event and exhibition center", distance: "5 min", image: "", createdAt: "static" },
  { id: "mg", name: "Mahatma Gandhi Hospital", description: "Healthcare nearby", distance: "5 min", image: "", createdAt: "static" },
  { id: "jecrc", name: "JECRC University", description: "University access", distance: "5 min", image: "", createdAt: "static" },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  "JAIPUR INTERNATIONAL AIRPORT": <FaPlane />,
  "MAHATMA GANDHI HOSPITAL": <FaHospital />,
  "BOMBAY HOSPITAL": <FaHospital />,
  "JECC JAIPUR": <FaBuilding />,
  "AKSHAYA PATRA TEMPLE": <FaUniversity />,
  "CHATRALA CIRCLE": <FaRoad />,
  "INDIA GATE": <FaBuilding />,
};

export default function NearbyPlaces() {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/nearby")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        // Show only 3-4 places as requested
        setPlaces(Array.isArray(data) && data.length > 0 ? data.slice(0, 4) : FALLBACK_PLACES);
      })
      .catch((err) => {
        console.error("Error fetching nearby places:", err);
        setPlaces(FALLBACK_PLACES);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || places.length === 0) return null;

  return (
    <div className="nearby-section fade-in-up visible">
      <div className="nearby-grid">
        {places.map((place) => (
          <div key={place.id} className="nearby-card">
            <div className="nearby-icon">
              {ICON_MAP[place.name.toUpperCase()] || <FaMapMarkerAlt />}
            </div>
            <div className="nearby-info">
              <h4 className="nearby-name">{place.name}</h4>
              <p className="nearby-dist">{place.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
