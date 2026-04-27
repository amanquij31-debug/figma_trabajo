"use client";
import { useAuth } from "@/lib/AuthContext";

export interface Solicitud {
    id: string;
    titulo: string;
    categoria: string;
    descripcion: string;
    ubicacion: string;
    estado: "abierta" | "en-progreso" | "completada";
    autorNombre: string;
    autorIniciales: string;
    fecha: string;
    voluntariosActuales: number;
    voluntariosNecesarios: number;
}

const CATEGORIA_COLORS: Record<string, string> = {
    Transporte: "#dbeafe",
    Alimentos: "#fef3c7",
    Educación: "#ede9fe",
    Salud: "#fee2e2",
    Hogar: "#d1fae5",
    "Cuidado de Niños": "#fce7f3",
    Otro: "#f3f4f6",
};

const CATEGORIA_TEXT: Record<string, string> = {
    Transporte: "#1d4ed8",
    Alimentos: "#92400e",
    Educación: "#5b21b6",
    Salud: "#991b1b",
    Hogar: "#065f46",
    "Cuidado de Niños": "#9d174d",
    Otro: "#374151",
};

const ESTADO_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    abierta: { label: "Abierta", color: "#f59e0b", dot: "#f59e0b" },
    "en-progreso": { label: "En Progreso", color: "#3b82f6", dot: "#3b82f6" },
    completada: { label: "Completada", color: "#10b981", dot: "#10b981" },
};

interface Props {
    solicitud: Solicitud;
    onOfrecer: (s: Solicitud) => void;
}

export default function SolicitudCard({ solicitud, onOfrecer }: Props) {
    const { isGuest } = useAuth();
    const estado = ESTADO_CONFIG[solicitud.estado];
    const catBg = CATEGORIA_COLORS[solicitud.categoria] ?? "#f3f4f6";
    const catText = CATEGORIA_TEXT[solicitud.categoria] ?? "#374151";

    return (
        <div className="animate-fadeUp" style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: 20,
            display: "flex", flexDirection: "column", gap: 12,
            transition: "box-shadow 0.2s",
        }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
        >
            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                    padding: "3px 10px", borderRadius: "var(--radius-full)",
                    fontSize: 12, fontWeight: 500,
                    background: catBg, color: catText,
                }}>{solicitud.categoria}</span>
                <span style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "3px 10px", borderRadius: "var(--radius-full)",
                    fontSize: 12, fontWeight: 500,
                    border: "1.5px solid var(--border)", color: "var(--text-secondary)",
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: estado.dot, display: "inline-block" }} />
                    {estado.label}
                </span>
            </div>

            {/* Título */}
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
                {solicitud.titulo}
            </h3>

            {/* Autor */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#e5e7eb", fontSize: 11, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-secondary)",
                }}>{solicitud.autorIniciales}</div>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{solicitud.autorNombre}</span>
            </div>

            {/* Descripción */}
            <p style={{
                fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6,
                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
                {solicitud.descripcion}
            </p>

            {/* Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <MetaRow icon="pin">{solicitud.ubicacion}</MetaRow>
                <MetaRow icon="calendar">{solicitud.fecha}</MetaRow>
                <MetaRow icon="users">{solicitud.voluntariosActuales} de {solicitud.voluntariosNecesarios} voluntarios</MetaRow>
            </div>

            {/* Botón */}
            {solicitud.estado !== "completada" && (
                <button
                    onClick={() => !isGuest && onOfrecer(solicitud)}
                    disabled={isGuest}
                    style={{
                        width: "100%", padding: "12px",
                        background: isGuest ? "#e5e7eb" : "var(--text-primary)",
                        color: isGuest ? "var(--text-muted)" : "white",
                        border: "none", borderRadius: "var(--radius-sm)",
                        fontSize: 15, fontWeight: 600,
                        cursor: isGuest ? "not-allowed" : "pointer",
                        transition: "opacity 0.15s", marginTop: 4,
                    }}
                    onMouseEnter={e => { if (!isGuest) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                    {isGuest ? "Inicia sesión para ayudar" : "Ofrecer Ayuda"}
                </button>
            )}
        </div>
    );
}

function MetaRow({ icon, children }: { icon: string; children: React.ReactNode }) {
    const icons: Record<string, React.ReactNode> = {
        pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>,
        calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
        users: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    };
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            {icons[icon]}
            {children}
        </div>
    );
}