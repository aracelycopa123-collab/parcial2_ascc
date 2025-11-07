<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref, watch } from 'vue'
import Select from 'primevue/select'

const ENDPOINT = 'programas'
const programa = ref<Programa[]>([])
const emit = defineEmits(['edit'])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const areaSeleccionada = ref<string>('')
const areasConocimiento = ref([
  { label: 'Todos', value: '' },
  { label: 'Derecho', value: 'Derecho' },
  { label: 'Ingeniería', value: 'Ingeniería' },
  { label: 'Economía', value: 'Economía' },
  { label: 'Salud', value: 'Salud' }
])

async function obtenerLista(areaConocimiento?: string) {
  try {
    const response = await http.get(`${ENDPOINT}?_expand=nivelAcademico`)
    programa.value = response.data
    console.log('Programas con niveles académicos:', programa.value)
    // Verificar si los niveles académicos están llegando correctamente
    programa.value.forEach(p => {
      console.log(`Programa ${p.id} - Nivel Académico:`, p.nivelAcademico)
    })
  } catch (error) {
    console.error('Error al recuperar programas:', error)
    alert('Error al cargar la lista de programas')
  }
}

const programasFiltrados = computed(() => {
  return programa.value.filter(
    (programa) =>
      (programa.nombre ?? '').toString().toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (programa.descripcion ?? '')
        .toString()
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()) ||
      (programa.nivelAcademico?.nombre ?? '')
        .toString()
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()) ||
      (programa.estado ?? '').toString().toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (programa.areaConocimiento ?? '')
        .toString()
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(programa: Programa) {
  console.log('Emitiendo programa para editar:', programa)
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${programaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

watch(areaSeleccionada, (newValue) => {
  obtenerLista(newValue)
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<style scoped>
.table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.table thead {
  background-color: #0d6efd;
  color: white;
}

.table th {
  padding: 15px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 14px;
}

.table td {
  padding: 12px 15px;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9em;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.table th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

.table td {
  padding: 12px 8px;
  vertical-align: middle;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table td.actions {
  width: 100px;
  white-space: nowrap;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>

<template>
  <div>
      <div class="search-container mb-3">
        <div class="col-7 pl-0">
          <InputGroup>
            <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
            <InputText
              v-model="busqueda"
              type="text"
              class="form-control"
              placeholder="Buscar por nombre, descripción, nivel académico, área de conocimiento o estado"
            />
          </InputGroup>
        </div>
      </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th class="text-center" style="width: 60px">Nro.</th>
            <th style="width: 150px">Nivel Académico</th>
            <th style="width: 200px">Nombre</th>
            <th style="width: 250px">Descripción</th>
            <th style="width: 150px">Área de Conocimiento</th>
            <th style="width: 80px">Versión</th>
            <th style="width: 100px">Duración</th>
            <th style="width: 120px">Costo</th>
            <th style="width: 150px">Fecha de Inicio</th>
            <th style="width: 120px">Estado</th>
            <th class="text-center" style="width: 100px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(programa, index) in programasFiltrados" :key="programa.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>
              <span v-if="programa.nivelAcademico" class="badge bg-info text-white">
                {{ programa.nivelAcademico.nombre }}
              </span>
              <span v-else class="badge bg-secondary">No asignado</span>
            </td>
            <td>{{ programa.nombre }}</td>
            <td>{{ programa.descripcion }}</td>
            <td>
              <span v-if="programa.areaConocimiento" class="badge bg-success text-white">
                {{ programa.areaConocimiento }}
              </span>
              <span v-else class="badge bg-secondary">No asignado</span>
            </td>
            <td>{{ programa.version }}</td>
            <td>{{ programa.duracionMeses }} meses</td>
            <td>
              {{
                Number(programa.costo).toLocaleString('es-BO', {
                  style: 'currency',
                  currency: 'BOB',
                })
              }}
            </td>
            <td>
              {{
                new Date(programa.fechaInicio).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              }}
            </td>
            <td>{{ programa.estado }}</td>
            <td class="text-center actions">
              <div class="btn-group">
                <Button
                  icon="pi pi-pencil"
                  aria-label="Editar"
                  class="p-button-sm"
                  @click="emitirEdicion(programa)"
                />
                <Button
                  icon="pi pi-trash"
                  aria-label="Eliminar"
                  severity="danger"
                  class="p-button-sm"
                  @click="mostrarEliminarConfirm(programa)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="programasFiltrados.length === 0">
            <td colspan="11" class="text-center">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button
            label="No"
            icon="pi pi-times"
            text
            @click="mostrarConfirmDialog = false"
          />
          <Button
            label="Sí"
            icon="pi pi-check"
            severity="danger"
            text
            @click="eliminar"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
