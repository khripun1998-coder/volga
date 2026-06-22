"use client";

// Глобальный фолбэк на случай падения в корневом layout — рендерит свой <html>/<body>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f5f4fc",
          color: "#16161c",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Что-то пошло не так
          </h1>
          <p style={{ color: "#6e6e7a", marginTop: 8 }}>
            Попробуйте обновить страницу.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "10px 22px",
              borderRadius: 999,
              border: "none",
              background: "#6366f1",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Обновить
          </button>
        </div>
      </body>
    </html>
  );
}
