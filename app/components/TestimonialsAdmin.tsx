"use client";
import React, { useState } from "react";
import { Testimonial } from "./types";
import { Btn, Ic, uid, Badge } from "./ui";

interface Props {
    testimonials: Testimonial[];
    onAdd: (t: Testimonial) => Promise<void>;
    onUpdate: (t: Testimonial) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const BLANK: Omit<Testimonial, "id" | "createdAt"> = {
    name: "", role: "", location: "", text: "", rating: 5, img: "", isActive: true
};

function TestimonialModal({ testimonial: init, onSave, onClose }: {
    testimonial: Omit<Testimonial, "id" | "createdAt"> & { id?: string };
    onSave: (t: Testimonial) => void;
    onClose: () => void;
}) {
    const [f, setF] = useState({ ...init });
    const [uploading, setUploading] = useState(false);
    
    const s = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const val = k === "rating" ? Number(e.target.value) : e.target.value;
        setF(p => ({ ...p, [k]: val }));
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) setF(p => ({ ...p, img: data.url }));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
                <div className="modal-header">
                    <span className="modal-title">{f.id ? "Edit Testimonial" : "Add Testimonial"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div>
                            <label className="field-label">Guest Name *</label>
                            <input className="inp" value={f.name} onChange={s("name")} placeholder="e.g. Aditi Sharma" />
                        </div>
                        <div>
                            <label className="field-label">Rating</label>
                            <select className="sel" value={f.rating} onChange={s("rating")}>
                                <option value="5">5 Stars ★★★★★</option>
                                <option value="4">4 Stars ★★★★</option>
                                <option value="3">3 Stars ★★★</option>
                                <option value="2">2 Stars ★★</option>
                                <option value="1">1 Star ★</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div>
                            <label className="field-label">Role / Designation</label>
                            <input className="inp" value={f.role} onChange={s("role")} placeholder="e.g. Travel Editor" />
                        </div>
                        <div>
                            <label className="field-label">Location</label>
                            <input className="inp" value={f.location} onChange={s("location")} placeholder="e.g. Delhi, India" />
                        </div>
                    </div>
                    <div className="mb-12">
                        <label className="field-label">Testimonial Text *</label>
                        <textarea className="textarea" value={f.text} onChange={s("text")}
                            placeholder="Quote text..." style={{ minHeight: 100 }} />
                    </div>
                    <div className="mb-12">
                        <label className="field-label">Guest Photo</label>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f3f4f6", overflow: "hidden", border: "1px solid #e5e7eb", flexShrink: 0 }}>
                                {f.img ? <img src={f.img} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 24 }}>👤</div>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "#fff" }}>
                                        {uploading ? "⏳..." : "📁 Upload"}
                                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                                    </label>
                                    <input className="inp" value={f.img} onChange={s("img")} placeholder="https://..." style={{ flex: 1, fontSize: 12 }} />
                                </div>
                                <div style={{ fontSize: 11, color: "#9ca3af" }}>Preferred size: 80x80px or square.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn disabled={!f.name.trim() || !f.text.trim() || uploading} onClick={() => {
                        onSave({
                            id: (f as Testimonial).id || uid(),
                            name: f.name.trim(),
                            role: (f.role || "").trim(),
                            location: (f.location || "").trim(),
                            text: f.text.trim(),
                            rating: f.rating,
                            img: (f.img || "").trim(),
                            isActive: f.isActive,
                            createdAt: (init as Testimonial).createdAt || new Date().toISOString(),
                        });
                    }}>Save Testimonial</Btn>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsAdmin({ testimonials, onAdd, onUpdate, onDelete }: Props) {
    const [modal, setModal] = useState<(Omit<Testimonial, "id" | "createdAt"> & { id?: string }) | null>(null);
    const [delId, setDelId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async (t: Testimonial) => {
        setSaving(true);
        try {
            if (modal?.id) await onUpdate(t);
            else await onAdd(t);
            setModal(null);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {modal && <TestimonialModal testimonial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
            {delId && (
                <div className="modal-overlay" onClick={() => setDelId(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-header">
                            <span className="modal-title">Delete Testimonial?</span>
                            <button className="modal-close" onClick={() => setDelId(null)}><Ic.X /></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 14 }}>Are you sure you want to remove this testimonial from the system?</p>
                        </div>
                        <div className="modal-footer">
                            <Btn variant="secondary" onClick={() => setDelId(null)}>Cancel</Btn>
                            <Btn onClick={async () => { setSaving(true); await onDelete(delId); setSaving(false); setDelId(null); }} disabled={saving} style={{ background: "#dc2626", borderColor: "#dc2626" }}>Delete</Btn>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header">
                <div>
                    <div className="page-title">Guest Testimonials</div>
                    <div className="page-sub">{testimonials.length} reviews · shared across the hotel network</div>
                </div>
                <Btn onClick={() => setModal({ ...BLANK })}><Ic.Plus /> Add Testimonial</Btn>
            </div>

            {testimonials.length === 0 && (
                <div className="card" style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>No testimonials yet</div>
                    <div style={{ fontSize: 13 }}>Click "Add Testimonial" to share your first guest story.</div>
                </div>
            )}

            <div className="grid-3">
                {testimonials.map(t => (
                    <div key={t.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="card-body" style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f3f4f6", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                                    {t.img ? <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 20 }}>👤</div>}
                                </div>
                                <div style={{ color: "#fbbf24", fontSize: 14 }}>{"★".repeat(t.rating)}<span style={{ color: "#d1d5db" }}>{"★".repeat(5 - t.rating)}</span></div>
                            </div>
                            <blockquote style={{ fontSize: 13.5, color: "#4b5563", fontStyle: "italic", marginBottom: 16, borderLeft: "2px solid #e5e7eb", paddingLeft: 12, minHeight: 60 }}>
                                "{t.text}"
                            </blockquote>
                            <div style={{ marginBottom: 4, fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>{t.role}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{t.location}</div>
                        </div>
                        <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8 }}>
                            <Btn size="sm" variant="secondary" onClick={() => setModal({ ...t })}><Ic.Edit /> Edit</Btn>
                            <Btn size="sm" variant="ghost" style={{ color: "#dc2626", marginLeft: "auto" }} onClick={() => setDelId(t.id)}><Ic.Trash /></Btn>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
