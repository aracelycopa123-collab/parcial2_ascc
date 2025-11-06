# Parcial 2 – Gestión de Programas de Postgrado (USFX)
**Autor:** Aracely Soledad Copa Condori  
**Iniciales del proyecto:** ascc  
**Estructura:** Backend + Frontend

---

### ✅ Tabla: niveles_academicos
| Campo               | Tipo              | Restricciones                         |
|--------------------|-------------------|----------------------------------------|
| id                 | serial PK         | auto numérico                          |
| nombre             | varchar(20)       | NOT NULL (Diplomado, Especialidad, Maestría, Doctorado) |
| descripcion        | varchar(500)      | opcional                               |
| fecha_creacion     | timestamp         | NOT NULL                               |
| fecha_modificacion | timestamp         | NULL                                   |
| fecha_eliminacion  | timestamp         | NULL                                   |

---

### ✅ Tabla: programas
| Campo               | Tipo              | Restricciones                         |
|--------------------|-------------------|----------------------------------------|
| id                 | serial PK         | auto numérico                          |
| id_nivel_academico | int               | NOT NULL, FK → niveles_academicos.id   |
| nombre             | varchar(100)      | NOT NULL                               |
| descripcion        | varchar(2000)     | NOT NULL                               |
| version            | int               | NOT NULL                               |
| duracion_meses     | int               | NOT NULL                               |
| costo              | decimal           | NOT NULL                               |
| fecha_inicio       | date              | NOT NULL                               |
| estado             | varchar(20)       | enum ('En Planificación', 'En curso', 'Finalizado') |
| fecha_creacion     | timestamp         | NOT NULL                               |
| fecha_modificacion | timestamp         | NULL                                   |
| fecha_eliminacion  | timestamp         | NULL                                   |

---
