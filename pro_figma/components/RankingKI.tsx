"use client";

export interface Guerrero {
    uid: string;
    nombre: string;
    iniciales: string;
    puntosKI: number;
    nivel: number;
    titulo: string;
    color: string;
}

const NIVEL_COLOR: Record<string, string> = {
    "Ultra Instinto": "#f59e0b",
    "Super Saiyajin Blue": "#3b82f6",
    "Super Saiyajin God": "#ef4444",
    "Super Saiyajin 3": "#8b5cf6",
    "Super Saiyajin 2": "#8b5cf6",
    "Super Saiyajin": "#8b5cf6",
};

const AVATAR_COLORS = ["#dbeafe", "#fce7f3", "#d1fae5", "#fef3c7", "#ede9fe", "#fee2e2", "#f3f4f6", "#cffafe"];
const AVATAR_TEXT = ["#1d4ed8", "#9d174d", "#065f46", "#92400e", "#5b21b6", "#991b1b", "#374151", "#0e7490"];

interface Props {
    guerreros: Guerrero[];
}

export default function RankingKI({ guerreros }: Props) {
    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: 20,
            position: "sticky", top: 76,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Ranking de Guerreros</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {guerreros.map((g, i) => {
                    const colorIdx = i % AVATAR_COLORS.length;
                    const nivelColor = NIVEL_COLOR[g.titulo] ?? "#6b7280";
                    const isTop3 = i < 3;

                    return (
                        <div key={g.uid} style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "10px 8px",
                            borderRadius: "var(--radius-sm)",
                            background: isTop3 ? "#fafafa" : "transparent",
                            border: isTop3 ? "1.5px solid var(--border)" : "1.5px solid transparent",
                            marginBottom: isTop3 ? 4 : 0,
                        }}>
                            {/* Rank */}
                            <div style={{ width: 24, textAlign: "center", fontSize: 14 }}>
                                {isTop3 ? medals[i] : <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>#{i + 1}</span>}
                            </div>

                            {/* Avatar */}
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: AVATAR_COLORS[colorIdx],
                                color: AVATAR_TEXT[colorIdx],
                                fontSize: 12, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                            }}>{g.iniciales}</div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {g.nombre}
                                </p>
                                <p style={{ fontSize: 11, color: nivelColor, fontWeight: 500 }}>
                                    Nv. {g.nivel} · {g.titulo}
                                </p>
                            </div>

                            {/* KI */}
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ fontSize: 16, fontWeight: 700 }}>{g.puntosKI}</p>
                                <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>KI</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}