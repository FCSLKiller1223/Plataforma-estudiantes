const API_URL = process.env.BIBLIO_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function obtenerLibros() {
  const response = await fetch(`${API_URL}/libros`, { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo consultar el catálogo de BiblioUTP.");
  return response.json();
}

export async function obtenerLibro(id) {
  const response = await fetch(`${API_URL}/libros/${id}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo consultar el libro solicitado.");
  return response.json();
}

export async function obtenerPrestamos() {
  const response = await fetch(`${API_URL}/prestamos`, { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudieron consultar los préstamos.");
  return response.json();
}
