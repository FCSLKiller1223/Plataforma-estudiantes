<script setup>
defineProps({ libro: { type: Object, required: true } });
const emit = defineEmits(["seleccionar"]);
</script>

<template>
  <button class="book-cell" :class="libro.disponibles > 1 ? 'available' : libro.disponibles === 1 ? 'low' : 'unavailable'" @click="emit('seleccionar', libro)">
    <strong>{{ libro.titulo }}</strong>
    <span>{{ libro.disponibles }} / {{ libro.ejemplares }} disponibles</span>
    <small>{{ libro.disponibles > 1 ? 'Disponible' : libro.disponibles === 1 ? 'Último ejemplar' : 'Agotado' }}</small>
  </button>
</template>
