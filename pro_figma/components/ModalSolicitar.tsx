"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/AuthContext";

const CATEGORIAS = ["Alimentos", "Transporte", "Cuidado de Niños", "Educación", "Salud", "Hogar", "Otro"];
const INGRESOS = ["Menos de S/. 500", "S/. 500 - S/. 1,000", "S/. 1,000 - S/. 1,500"];
const SITUACIONES = ["Desempleado/a", "Empleo informal", "Empleo part-time", "Otro"];

interface FormData {
    ingresoFamiliar: string;
    situacionLaboral: string;
    personasHogar: number;
    declaracion: boolean;
    titulo: string;
    categoria: string;
    descripcion: string;
    ubicacion: string;
    voluntariosNecesarios: number;
    infoAdicional: string;
}

interface Props {
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
}

export default function ModalSolicitar({ onClose, onSubmit }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: { personasHogar: 1, voluntariosNecesarios: 1 },
    });

    const onFormSubmit = async (data: FormData) => {
        setLoading(true);
        await onSubmit(data);
        setLoading(false);
        onClose();
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
                width: "100%", maxWidth: 520,
                maxHeight: "90vh", overflowY: "auto",
                padding: 28,
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Solicitar Ayuda</h2>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                            Este sistema está diseñado para apoyar a personas en situación de vulnerabilidad económica.
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-muted)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                    {/* Verificación de elegibilidad */}
                    <div style={{
                        background: "#eff6ff", border: "1.5px solid #bfdbfe",
                        borderRadius: "var(--radius-sm)", padding: 16,
                        display: "flex", flexDirection: "column", gap: 14,
                    }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }}>
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e40af" }}>Verificación de Elegibilidad</p>
                                <p style={{ fontSize: 12, color: "#3b82f6", marginTop: 2 }}>
                                    Para garantizar que el apoyo llegue a quienes más lo necesitan, debes completar esta información.
                                </p>
                            </div>
                        </div>

                        <Field label="Ingreso familiar mensual (en Soles)" error={errors.ingresoFamiliar?.message}>
                            <select {...register("ingresoFamiliar", { required: "Requerido" })} style={selectStyle}>
                                <option value="">Selecciona el rango de ingresos</option>
                                {INGRESOS.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </Field>

                        <Field label="Situación laboral actual" error={errors.situacionLaboral?.message}>
                            <select {...register("situacionLaboral", { required: "Requerido" })} style={selectStyle}>
                                <option value="">Selecciona tu situación</option>
                                {SITUACIONES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </Field>

                        <Field label="Número de personas en tu hogar" error={errors.personasHogar?.message}>
                            <input type="number" min={1} max={20} {...register("personasHogar", { required: true, min: 1 })} style={inputStyle} />
                        </Field>

                        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                            <input type="checkbox" {...register("declaracion", { required: "Debes aceptar la declaración" })}
                                style={{ marginTop: 3, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Declaro bajo palabra de honor que la información económica proporcionada es verdadera y que me encuentro en situación de necesidad. Entiendo que este sistema está diseñado para apoyar a personas de bajos recursos económicos.
                            </span>
                        </label>
                        {errors.declaracion && <p style={{ fontSize: 12, color: "var(--accent-red)" }}>{errors.declaracion.message}</p>}
                    </div>

                    {/* Datos de la solicitud */}
                    <Field label="Título de tu solicitud" error={errors.titulo?.message}>
                        <input placeholder="¿Qué necesitas?" {...register("titulo", { required: "Requerido" })} style={inputStyle} />
                    </Field>

                    <Field label="Categoría" error={errors.categoria?.message}>
                        <select {...register("categoria", { required: "Requerido" })} style={selectStyle}>
                            <option value="">Selecciona una categoría</option>
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Field>

                    <Field label="Descripción" error={errors.descripcion?.message}>
                        <textarea
                            placeholder="Describe con más detalle lo que necesitas..."
                            rows={4}
                            {...register("descripcion", { required: "Requerido" })}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </Field>

                    <Field label="Ubicación">
                        <input placeholder="Barrio o zona en San Juan de Lurigancho" {...register("ubicacion")} style={inputStyle} />
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Solo válido para el distrito de San Juan de Lurigancho.</p>
                    </Field>

                    <Field label="Número de voluntarios necesarios">
                        <input type="number" min={1} max={20} {...register("voluntariosNecesarios")} style={inputStyle} />
                    </Field>

                    <Field label="Información adicional sobre tu situación (opcional)">
                        <textarea placeholder="Cuéntanos más sobre tu situación si lo deseas..." rows={3}
                            {...register("infoAdicional")} style={{ ...inputStyle, resize: "vertical" }} />
                    </Field>

                    {/* Botones */}
                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 4 }}>
                        <button type="button" onClick={onClose} style={{
                            padding: "10px 20px", border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-sm)", background: "none",
                            fontSize: 14, fontWeight: 500, cursor: "pointer",
                        }}>Cancelar</button>
                        <button type="submit" disabled={loading} style={{
                            padding: "10px 20px",
                            background: loading ? "#9ca3af" : "var(--text-primary)",
                            border: "none", borderRadius: "var(--radius-sm)",
                            fontSize: 14, fontWeight: 600, color: "white",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}>
                            {loading ? "Enviando..." : "Publicar Solicitud"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{label}</label>
            {children}
            {error && <p style={{ fontSize: 12, color: "var(--accent-red)" }}>{error}</p>}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 14, color: "var(--text-primary)", background: "#f9fafb",
    outline: "none", fontFamily: "inherit",
};

const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: "pointer", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
};