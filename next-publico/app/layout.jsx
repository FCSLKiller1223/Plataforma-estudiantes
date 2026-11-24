import "./styles.css";

export const metadata = {
  title: {
    default: "BiblioUTP | Biblioteca universitaria",
    template: "%s | BiblioUTP"
  },
  description: "Consulta el catálogo público y la disponibilidad de libros de BiblioUTP."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <a href="/">📚 BiblioUTP</a>
          <nav>
            <a href="/libros">Catálogo</a>
            <a href="/prestamo">Consultar préstamo</a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          BiblioUTP · Portal público de biblioteca
        </footer>
      </body>
    </html>
  );
}
