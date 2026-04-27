"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/AuthContext";
import { Solicitud } from "./SolicitudCard";

interface FormData {
    nombre: string;
    contacto: string;
    mensaje: string;
}

interface Props {
    solicitud: Solicitud;
    onClose: () => void;
    onSubmit: (solicitudId: string, data: FormData) => Promise<void>;
}

export default function ModalOfrecer({ solicitud, onClose, onSubmit }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            nombre: user?.displayName ?? "",
            contacto: user?.email ?? "",
        },
    });

    const onFormSubmit = async (data: FormData) => {
        setLoading(true);
        await onSubmit(solicitud.id, data);
        setLoading(false);
        setSuccess(true);
    };

    return (
        <div className="animate-fadeIn" style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="animate-slideIn" style={{
                background: "var(--surface)",
                borderRadius: 16,
                width: "100%", maxWidth: 480,
                padding: 28,
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Ofrecer Ayuda</h2>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                            Solicitud: {solicitud.titulo}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-muted)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {success ? (
                    <div style={{
                        textAlign: "center", padding: "32px 0",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: "50%",
                            background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontSize: 17, fontWeight: 700 }}>¡Oferta enviada!</p>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
                                {solicitud.autorNombre} recibirá tu información de contacto pronto.
                            </p>
                        </div>
                        <button onClick={onClose} style={{
                            padding: "10px 24px",
                            background: "var(--text-primary)", border: "none",
                            borderRadius: "var(--radius-sm)", color: "white",
                            fontSize: 14, fontWeight: 600, cursor: "pointer",
                        }}>Cerrar</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Tu Nombre</label>
                            <input
                                placeholder="Nombre completo"
                                {...register("nombre", { required: "Requerido" })}
                                style={inputStyle}
                            />
                            {errors.nombre && <p style={{ fontSize: 12, color: "var(--accent-red)" }}>{errors.nombre.message}</p>}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Contacto</label>
                            <input
                                placeholder="correo@ejemplo.com"
                                {...register("contacto", { required: "Requerido" })}
                                style={inputStyle}
                            />
                            {errors.contacto && <p style={{ fontSize: 12, color: "var(--accent-red)" }}>{errors.contacto.message}</p>}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Mensaje <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
                            <textarea
                                placeholder="¿Cómo puedes ayudar?"
                                rows={4}
                                {...register("mensaje")}
                                style={{ ...inputStyle, resize: "vertical" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 4 }}>
                            <button type="button" onClick={onClose} style={{
                                padding: "10px 20px", border: "1.5px solid var(--border)",
                                borderRadius: "var(--radius-sm)", background: "none",
                                fontSize: 14, fontWeight: 500, cursor: "pointer",
                            }}>Cancelar</button>
                            <button type="submit" disabled={loading} style={{
                                padding: "10px 24px",
                                background: loading ? "#9ca3af" : "var(--text-primary)",
                                border: "none", borderRadius: "var(--radius-sm)",
                                fontSize: 14, fontWeight: 600, color: "white",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}>
                                {loading ? "Enviando..." : "Enviar Oferta"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 14, color: "var(--text-primary)", background: "#f9fafb",
    outline: "none", fontFamily: "inherit",
};