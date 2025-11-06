import type { NivelAcademico } from './nivelAcademico'

export interface Programa {
  id: number
  idNivelAcademico: number
  nombre: string
  descripcion: string
  version: number
  duracionMeses: number
  costo: number
  fechaInicio: Date
  estado: string
  nivelAcademico: NivelAcademico
}
