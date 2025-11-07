import type { NivelAcademico } from './nivelAcademico'

export interface ProgramaForm {
    id?: number
    idNivelAcademico: number
    nombre: string
    descripcion: string
    version: number
    duracionMeses: number
    costo: number
    fechaInicio: Date
    estado: string
    areaConocimiento: 'Derecho' | 'Ingeniería' | 'Economía' | 'Salud' | null
    nivelAcademico?: NivelAcademico | null
}
