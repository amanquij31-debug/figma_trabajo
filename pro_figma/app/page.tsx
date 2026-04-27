"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import SolicitudCard, { Solicitud } from "@/components/SolicitudCard";
import RankingKI, { Guerrero } from "@/components/RankingKI";
import ModalSolicitar from "@/components/ModalSolicitar";
import ModalOfrecer from "@/components/ModalOfrecer";

const CATEGORIAS = ["Todas", "Alimentos", "Transporte", "Cuidado de Niños", "Educación", "Salud", "Hogar", "Otro"];

// --- DATOS DE EJEMPLO (reemplazar con llamadas a tu API Spring Boot) ---
const SOLICITUDES_DEMO: Solicitud[] = [
  {
    id: "1", titulo: "Necesito transporte para cita médica",
    categoria: "Transporte", estado: "abierta",
    descripcion: "Tengo una cita médica importante el próximo viernes y no tengo forma de llegar al hospital. Busco alguien que pueda llevarme y traerme de vuelta.",
    ubicacion: "SJL - Centro", fecha: "25 mar 2026",
    autorNombre: "María González", autorIniciales: "MG",
    voluntariosActuales: 0, voluntariosNecesarios: 1,
  },
  {
    id: "2", titulo: "Apoyo con clases de matemáticas para mi hijo",
    categoria: "Educación", estado: "en-progreso",
    descripcion: "Mi hijo está en sexto grado y necesita refuerzo en matemáticas. Busco alguien con paciencia que pueda darle clases 2 veces por semana.",
    ubicacion: "SJL - Zárate", fecha: "24 mar 2026",
    autorNombre: "Carlos Ramírez", autorIniciales: "CR",
    voluntariosActuales: 1, voluntariosNecesarios: 1,
  },
  {
    id: "3", titulo: "Comida para familia numerosa",
    categoria: "Alimentos", estado: "abierta",
    descripcion: "Somos una familia de 6 personas y estamos pasando por dificultades económicas. Agradecería cualquier tipo de alimentos no perecederos o despensa básica.",
    ubicacion: "SJL - Canto Grande", fecha: "23 mar 2026",
    autorNombre: "Ana López", autorIniciales: "AL",
    voluntariosActuales: 1, voluntariosNecesarios: 2,
  },
  {
    id: "4", titulo: "Ayuda para reparar techo con goteras",
    categoria: "Hogar", estado: "abierta",
    descripcion: "Necesito ayuda para reparar el techo de mi casa que tiene goteras. Busco personas con experiencia en construcción o impermeabilización.",
    ubicacion: "SJL - Las Flores", fecha: "22 mar 2026",
    autorNombre: "Pedro Hernández", autorIniciales: "PH",
    voluntariosActuales: 2, voluntariosNecesarios: 3,
  },
  {
    id: "5", titulo: "Cuidado de niños por las tardes",
    categoria: "Cuidado de Niños", estado: "completada",
    descripcion: "Necesito que alguien pueda cuidar a mis dos hijos (5 y 7 años) de lunes a viernes de 2pm a 6pm mientras trabajo.",
    ubicacion: "SJL - Campoy", fecha: "20 mar 2026",
    autorNombre: "Laura Martínez", autorIniciales: "LM",
    voluntariosActuales: 1, voluntariosNecesarios: 1,
  },
];

const GUERREROS_DEMO: Guerrero[] = [
  { uid: "1", nombre: "Isabel Fernández", iniciales: "IF", puntosKI: 23, nivel: 20, titulo: "Ultra Instinto", color: "#dbeafe" },
  { uid: "2", nombre: "Miguel Torres", iniciales: "MT", puntosKI: 18, nivel: 16, titulo: "Super Saiyajin Blue", color: "#fce7f3" },
  { uid: "3", nombre: "Carmen Ruiz", iniciales: "CR", puntosKI: 15, nivel: 13, titulo: "Super Saiyajin God", color: "#d1fae5" },
  { uid: "4", nombre: "José Sánchez", iniciales: "JS", puntosKI: 12, nivel: 10, titulo: "Super Saiyajin 3", color: "#fef3c7" },
  { uid: "5", nombre: "Patricia Morales", iniciales: "PM", puntosKI: 10, nivel: 9, titulo: "Super Saiyajin 2", color: "#ede9fe" },
  { uid: "6", nombre: "Luis García", iniciales: "LG", puntosKI: 8, nivel: 7, titulo: "Super Saiyajin 2", color: "#fee2e2" },
  { uid: "7", nombre: "Ana López", iniciales: "AL", puntosKI: 6, nivel: 5, titulo: "Super Saiyajin", color: "#cffafe" },
  { uid: "8", nombre: "Fernando Castro", iniciales: "FC", puntosKI: 5, nivel: 4, titulo: "Super Saiyajin", color: "#f3f4f6" },
];

export default function HomePage() {
  const { user, isGuest, loading } = useAuth();
  const router = useRouter();

  const [solicitudes] = useState<Solicitud[]>(SOLICITUDES_DEMO);
  const [guerreros] = useState<Guerrero[]>(GUERREROS_DEMO);
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [modalSolicitar, setModalSolicitar] = useState(false);
  const [modalOfrecer, setModalOfrecer] = useState<Solicitud | null>(null);

  useEffect(() => {
    if (!loading && !user && !isGuest) router.push("/login");
  }, [user, isGuest, loading, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Cargando...</div>
    </div>
  );

  const stats = {
    total: solicitudes.length,
    abiertas: solicitudes.filter(s => s.estado === "abierta").length,
    enProgreso: solicitudes.filter(s => s.estado === "en-progreso").length,
    completadas: solicitudes.filter(s => s.estado === "completada").length,
  };

  const filtradas = solicitudes.filter(s => {
    const matchEstado =
      filtroEstado === "Todas" ? true :
      filtroEstado === "Abiertas" ? s.estado === "abierta" :
      filtroEstado === "Progreso" ? s.estado === "en-progreso" :
      s.estado === "completada";
    const matchCat = filtroCategoria === "Todas" || s.categoria === filtroCategoria;
    return matchEstado && matchCat;
  });

  const handleSubmitSolicitud = async (data: any) => {
    // TODO: enviar a tu API Spring Boot
    console.log("Nueva solicitud:", data);
  };

  const handleSubmitOferta = async (solicitudId: string, data: any) => {
    // TODO: enviar a tu API Spring Boot
    console.log("Oferta para:", solicitudId, data);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar onNuevaSolicitud={() => setModalSolicitar(true)} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>
        {/* Banner informativo */}
        <div style={{
          background: "#eff6ff", border: "1.5px solid #bfdbfe",
          borderRadius: "var(--radius)", padding: "16px 20px",
          display: "flex", gap: 14, marginBottom: 24,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#3b82f6", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>
              Sistema de Apoyo para Familias de Bajos Recursos
            </p>
            <p style={{ fontSize: 13, color: "#1d4ed8", lineHeight: 1.6 }}>
              Esta plataforma está diseñada exclusivamente para apoyar a personas en situación de vulnerabilidad económica{" "}
              <strong>del distrito de San Juan de Lurigancho. Todas las solicitudes son revisadas por un administrador antes de ser publicadas</strong>{" "}
              para garantizar que el apoyo llegue a quienes realmente lo necesitan. Si deseas solicitar ayuda, debes cumplir con los
              requisitos de elegibilidad (ingresos familiares mensuales menores a S/. 1,500).
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          {/* Columna principal */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <StatCard icon="doc" label="TOTAL" value={stats.total} />
              <StatCard icon="check-blue" label="ABIERTAS" value={stats.abiertas} />
              <StatCard icon="clock" label="EN PROGRE..." value={stats.enProgreso} />
              <StatCard icon="check-green" label="COMPLETA..." value={stats.completadas} />
            </div>

            {/* Filtros */}
            <div style={{
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)", padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 6h18M7 12h10M11 18h2"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Filtros</span>
              </div>

              {/* Tabs estado */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                background: "#f3f4f6", borderRadius: "var(--radius-sm)",
                padding: 4, gap: 2, marginBottom: 12,
              }}>
                {["Todas", "Abiertas", "Progreso", "Completadas"].map(t => (
                  <button key={t} onClick={() => setFiltroEstado(t)} style={{
                    padding: "8px 4px", border: "none", borderRadius: "var(--radius-sm)",
                    fontSize: 13, fontWeight: filtroEstado === t ? 600 : 400,
                    background: filtroEstado === t ? "white" : "transparent",
                    color: filtroEstado === t ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    boxShadow: filtroEstado === t ? "var(--shadow-sm)" : "none",
                    transition: "all 0.15s",
                  }}>{t}</button>
                ))}
              </div>

              {/* Tags categoría */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIAS.map(c => (
                  <button key={c} onClick={() => setFiltroCategoria(c)} style={{
                    padding: "5px 14px",
                    border: "1.5px solid " + (filtroCategoria === c ? "var(--text-primary)" : "var(--border)"),
                    borderRadius: "var(--radius-full)",
                    background: filtroCategoria === c ? "var(--text-primary)" : "transparent",
                    color: filtroCategoria === c ? "white" : "var(--text-secondary)",
                    fontSize: 13, fontWeight: filtroCategoria === c ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Grid de solicitudes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {filtradas.length === 0 ? (
                <div style={{
                  gridColumn: "1/-1", textAlign: "center", padding: "48px 0",
                  color: "var(--text-muted)", fontSize: 14,
                }}>
                  No hay solicitudes con estos filtros.
                </div>
              ) : filtradas.map(s => (
                <SolicitudCard key={s.id} solicitud={s} onOfrecer={setModalOfrecer} />
              ))}
            </div>
          </div>

          {/* Sidebar ranking */}
          <RankingKI guerreros={guerreros} />
        </div>
      </main>

      {/* Modales */}
      {modalSolicitar && (
        <ModalSolicitar
          onClose={() => setModalSolicitar(false)}
          onSubmit={handleSubmitSolicitud}
        />
      )}
      {modalOfrecer && (
        <ModalOfrecer
          solicitud={modalOfrecer}
          onClose={() => setModalOfrecer(null)}
          onSubmit={handleSubmitOferta}
        />
      )}
    </div>
  );
}

// ---- Stat card ----
function StatCard({ icon, label, value }: { icon: string; value: number; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    "doc": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
    "check-blue": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
    "clock": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    "check-green": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
  };

  return (
    <div style={{
      background: "var(--surface)", border: "1.5px solid var(--border)",
      borderRadius: "var(--radius)", padding: "16px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: "#f9fafb",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icons[icon]}</div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 3, letterSpacing: "0.05em" }}>{label}</p>
      </div>
    </div>
  );
}