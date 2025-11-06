<script setup lang="ts">
import ProgramaList from '@/components/programas/ProgramaList.vue'
import ProgramaSave from '@/components/programas/ProgramaSave.vue'
import type { Programa } from '@/models/programa'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
// Usamos un tipo genérico más específico para evitar `any` al tipar refs de componentes
const programaListRef = ref<InstanceType<typeof ProgramaList> | null>(null)
const programaEdit = ref<Programa | null>(null)

function handleCreate() {
  programaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(programa: Programa) {
  programaEdit.value = programa
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  programaListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Programas</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <ProgramaList ref="programaListRef" @edit="handleEdit" />
    <ProgramaSave
      :mostrar="mostrarDialog"
      :programa="programaEdit ?? undefined"
      :modoEdicion="!!programaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
