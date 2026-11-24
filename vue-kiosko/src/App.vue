<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import GrillaDisponibilidad from "./components/GrillaDisponibilidad.vue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const libros = ref([]);
const prestamos = ref([]);
const categoria = ref("");
const seleccionado = ref(null);
const cargando = ref(true);
const error = ref("");

let intervalo = null;

const categorias = computed(() =>
  [...new Set(libros.value.map((libro) => libro.categoria))].sort()
);

const filtrados = computed(() =>
  libros.value.filter(
    (libro) => !categoria.value || libro.categoria === categoria.value
  )
);

const solicitudesPendientes = computed(
  () => prestamos.value.filter((prestamo) => prestamo.estado === "pendiente").length
);

async function cargarDatos() {
  try {
    const [respuestaLibros, respuestaPrestamos] = await Promise.all([
      fetch(`${API_URL}/libros`),
      fetch(`${API_URL}/prestamos`)
    ]);

    if (!respuestaLibros.ok || !respuestaPrestamos.ok) {
      throw new Error("La API respondió con un error.");
    }

    libros.value = await respuestaLibros.json();
    prestamos.value = await respuestaPrestamos.json();
    error.value = "";
  } catch {
    error.value =
      "No se pudo conectar con BiblioUTP. Inicia api-mock en el puerto 3000.";
  } finally {
    cargando.value = false;
  }
}

function seleccionar(libro) {
  seleccionado.value = libro;
}

onMounted(() => {
  cargarDatos();
  intervalo = window.setInterval(cargarDatos, 30000);
});

onUnmounted(() => {
  if (intervalo) window.clearInterval(intervalo);
});
</script>

<template>
  <main class="kiosk-shell">
    <header class="topbar">
      <div>
        <span class="eyebrow">BIBLIOTECA UNIVERSITARIA</span>
        <h1>BiblioUTP</h1>
        <p>Kiosko de disponibilidad de libros</p>
      </div>
      <button @click="cargarDatos">Actualizar ahora</button>
    </header>

    <section class="summary">
      <article>
        <span>Libros registrados</span>
        <strong>{{ libros.length }}</strong>
      </article>
      <article>
        <span>Solicitudes pendientes</span>
        <strong>{{ solicitudesPendientes }}</strong>
      </article>
      <article>
        <span>Última actualización</span>
        <strong>Automática · 30 s</strong>
      </article>
    </section>

    <section class="filters">
      <label for="categoria">Filtrar por categoría</label>
      <select id="categoria" v-model="categoria">
        <option value="">Todas las categorías</option>
        <option v-for="item in categorias" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </section>

    <p v-if="cargando" class="notice">Cargando disponibilidad...</p>
    <p v-if="error" class="notice error">{{ error }}</p>

    <GrillaDisponibilidad
      v-if="!cargando && !error"
      :libros="filtrados"
      @seleccionar="seleccionar"
    />

    <section v-if="seleccionado" class="detail">
      <button class="close" @click="seleccionado = null">Cerrar</button>
      <h2>{{ seleccionado.titulo }}</h2>
      <p>{{ seleccionado.autor }} · {{ seleccionado.categoria }}</p>
      <strong>{{ seleccionado.disponibles }} ejemplar(es) disponibles</strong>
    </section>

    <footer>
      Estado de disponibilidad consultado desde la API de BiblioUTP.
    </footer>
  </main>
</template>
