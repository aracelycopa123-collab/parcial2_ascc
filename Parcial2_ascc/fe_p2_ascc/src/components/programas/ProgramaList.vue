<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'programas'
const programa = ref<Programa[]>([])
const emit = defineEmits(['edit'])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
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
      (programa.estado ?? '').toString().toLowerCase().includes(busqueda.value.toLowerCase()),
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
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
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
            placeholder="Buscar por nombre, descripción, nivel académico o estado"
          />
        </InputGroup>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="table-primary">
          <tr>
            <th class="text-center" style="width: 60px">Nro.</th>
            <th>Nivel Académico</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Versión</th>
            <th>Duración</th>
            <th>Costo</th>
            <th>Fecha de Inicio</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
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
            <td class="text-center">
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                text
                @click="emitirEdicion(programa)"
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                severity="danger"
                text
                @click="mostrarEliminarConfirm(programa)"
              />
            </td>
          </tr>
          <tr v-if="programasFiltrados.length === 0">
            <td colspan="10" class="text-center">No se encontraron resultados.</td>
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
