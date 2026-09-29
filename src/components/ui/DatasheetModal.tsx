"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DatasheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export function DatasheetModal({ isOpen, onClose }: DatasheetModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    company: "",
    country: "India",
    state: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.contact.trim())) {
      newErrors.contact = "Invalid contact number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (formData.country === "India" && !formData.state) {
      newErrors.state = "State selection is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, apiError: "" })); // Clear any previous API error

    try {
      const payload = {
        ...formData,
        state: formData.country === "India" ? formData.state : " - ",
      };

      const response = await fetch("/api/datasheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Auto-trigger PDF download
        const link = document.createElement("a");
        link.href = "/AI%20CEPTOR%20BROCHURE.pdf";
        link.target = "_blank";
        link.download = "AI_CEPTOR_BROCHURE.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Close modal
        onClose();
      } else {
        setErrors((prev) => ({ ...prev, apiError: result.message || "Something went wrong" }));
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors((prev) => ({ ...prev, apiError: "Network error. Please try again later." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scoped CSS — matches exact website theme */}
          <style>{`
            .ds-field-wrap {
              position: relative;
              border: 1px solid rgba(255, 255, 255, 0.35);
              border-radius: 9999px;
              transition: all 0.25s ease;
              display: flex;
              align-items: center;
              padding: 0.55rem 1.1rem;
              background: rgba(255, 255, 255, 0.03);
            }
            .ds-field-wrap.focused {
              border-color: #FFFFFF;
              background: rgba(255, 255, 255, 0.08);
              box-shadow: 0 0 16px rgba(255, 255, 255, 0.2);
            }
            .ds-field-wrap.error { border-color: #EF4444; }

            .ds-input, .ds-select {
              width: 100%;
              background: transparent;
              border: none;
              padding: 0;
              color: #FFFFFF;
              font-family: var(--font-inter), sans-serif;
              font-size: 0.8rem;
              outline: none;
              caret-color: #FFFFFF;
              box-sizing: border-box;
            }
            .ds-select { cursor: pointer; color-scheme: dark; }
            .ds-input::placeholder { color: rgba(255, 255, 255, 0.45); font-size: 0.78rem; }
            .ds-input:focus, .ds-input:focus-visible,
            .ds-select:focus, .ds-select:focus-visible {
              outline: none !important;
              box-shadow: none !important;
            }
            .ds-select option { background: #05070B; color: #FFFFFF; }
          `}</style>

          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000,
              background: "rgba(3, 5, 8, 0.85)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              padding: "1rem",
            }}
          >
            {/* Modal Card */}
            <motion.div
              key="modal-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={{
                pointerEvents: "auto",
                width: "min(96vw, 540px)",
                background: "#05070B",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 30px 100px rgba(0,0,0,0.95), 0 0 25px rgba(255,255,255,0.12)",
                position: "relative",
              }}
            >
              {/* Dot grid decorative background — matches site footer */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                opacity: 0.9,
                pointerEvents: "none",
              }} />

              {/* Shimmer top border line */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 80%, transparent 100%)",
              }} />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "1.3rem",
                  right: "1.3rem",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Form View */}
              <div style={{ padding: "1.6rem 2.2rem 1.8rem", position: "relative", zIndex: 1 }}>
                  <div style={{ marginBottom: "1.1rem" }}>
                    {/* Tactical section badge — matches footer theme */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                      <div style={{ width: "22px", height: "1px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                      <span style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.46rem",
                        letterSpacing: "0.22em",
                        color: "#FFFFFF",
                        textTransform: "uppercase",
                        fontWeight: 700
                      }}>
                        Secure Transmission
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: "1.3rem",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      margin: "0 0 0.3rem 0",
                      letterSpacing: "-0.03em",
                    }}>Download Data Sheet</h3>
                    <p style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.6)",
                      margin: 0,
                      fontWeight: 300,
                    }}>
                      Please fill in your details to download the data sheet.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {/* First & Last Name */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                          First Name <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div className={`ds-field-wrap${focusedField === "firstName" ? " focused" : ""}${errors.firstName ? " error" : ""}`}>
                          <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          <input
                            type="text"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onFocus={() => setFocusedField("firstName")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="ds-input"
                          />
                        </div>
                        {errors.firstName && <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem", color: "#EF4444", textTransform: "uppercase", marginTop: "0.1rem" }}>{errors.firstName}</span>}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                          Last Name <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div className={`ds-field-wrap${focusedField === "lastName" ? " focused" : ""}${errors.lastName ? " error" : ""}`}>
                          <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          <input
                            type="text"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onFocus={() => setFocusedField("lastName")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="ds-input"
                          />
                        </div>
                        {errors.lastName && <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem", color: "#EF4444", textTransform: "uppercase", marginTop: "0.1rem" }}>{errors.lastName}</span>}
                      </div>
                    </div>

                    {/* Contact & Email */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                          Contact <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div className={`ds-field-wrap${focusedField === "contact" ? " focused" : ""}${errors.contact ? " error" : ""}`}>
                          <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          <input
                            type="text"
                            placeholder="Enter your contact number"
                            value={formData.contact}
                            onFocus={() => setFocusedField("contact")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleInputChange("contact", e.target.value)}
                            className="ds-input"
                          />
                        </div>
                        {errors.contact && <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem", color: "#EF4444", textTransform: "uppercase", marginTop: "0.1rem" }}>{errors.contact}</span>}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                          Email <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div className={`ds-field-wrap${focusedField === "email" ? " focused" : ""}${errors.email ? " error" : ""}`}>
                          <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="ds-input"
                          />
                        </div>
                        {errors.email && <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem", color: "#EF4444", textTransform: "uppercase", marginTop: "0.1rem" }}>{errors.email}</span>}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                        Company Name <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <div className={`ds-field-wrap${focusedField === "company" ? " focused" : ""}${errors.company ? " error" : ""}`}>
                        <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                        <input
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onFocus={() => setFocusedField("company")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="ds-input"
                        />
                      </div>
                      {errors.company && <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem", color: "#EF4444", textTransform: "uppercase", marginTop: "0.1rem" }}>{errors.company}</span>}
                    </div>

                    {/* Country */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                        Country <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <div className={`ds-field-wrap${focusedField === "country" ? " focused" : ""}`}>
                        <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        <select
                          value={formData.country}
                          onFocus={() => setFocusedField("country")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          className="ds-select"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                    </div>

                    {/* State (Conditional for India) */}
                    {formData.country === "India" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                          State <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div className={`ds-field-wrap${focusedField === "state" ? " focused" : ""}${errors.state ? " error" : ""}`}>
                          <svg style={{ marginRight: "0.55rem", flexShrink: 0 }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          <select
                            value={formData.state}
                            onFocus={() => setFocusedField("state")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className="ds-select"
                            style={{ color: formData.state ? "#FFFFFF" : "rgba(255,255,255,0.45)" }}
                          >
                            <option value="" disabled>Select your state</option>
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        {errors.state && <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.52rem", color: "#EF4444", textTransform: "uppercase", marginTop: "0.1rem" }}>{errors.state}</span>}
                      </div>
                    )}

                    {errors.apiError && (
                      <div style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "center", marginTop: "0.4rem" }}>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.55rem", color: "#EF4444", textTransform: "uppercase" }}>{errors.apiError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        marginTop: "0.6rem",
                        width: "100%",
                        padding: "0.75rem 1.4rem",
                        borderRadius: "9999px",
                        background: "#FFFFFF",
                        color: "#000000",
                        border: "none",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.6rem",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 20px rgba(255,255,255,0.18)"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.background = "#E2E8F0";
                          e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,255,255,0.3)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.background = "#FFFFFF";
                          e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.18)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {isSubmitting ? (
                        "Verifying Identity..."
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download Data Sheet
                        </>
                      )}
                    </button>
                  </form>
                </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
