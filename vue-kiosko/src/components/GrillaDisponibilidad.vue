<script setup>
import CeldaDisponibilidad from "./CeldaDisponibilidad.vue";
defineProps({ libros: { type: Array, required: true } });
const emit = defineEmits(["seleccionar"]);
</script>

<template>
  <div v-if="libros.length" class="book-grid">
    <CeldaDisponibilidad v-for="libro in libros" :key="libro.id" :libro="libro" @seleccionar="emit('seleccionar', $event)" />
  </div>
  <p v-else class="empty">No hay libros para mostrar con este filtro.</p>
</template>
