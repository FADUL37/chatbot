import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  async function enviar() {
    if (!input.trim()) return;

    setLoading(true);
    setResposta("");

    try {
      const res = await fetch(`${API_URL}/consulta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: input }),
      });

      if (!res.ok) throw new Error("Erro na requisição");

      const data = await res.json();
      setResposta(data.resposta || "Nenhuma resposta encontrada.");
    } catch (err) {
      setResposta("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        backgroundColor: "#121212",
        color: "#e0e0e0",
        borderRadius: 8,
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.3)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Suporte Atendimento Operadoras
      </h2>

      <input
        type="text"
        placeholder="Digite sua pergunta (ex: vivas prazo)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviar()}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #555",
          backgroundColor: "#222",
          color: "#eee",
          outline: "none",
          boxSizing: "border-box",
        }}
        disabled={loading}
        autoFocus
      />

      <button
        onClick={enviar}
        disabled={loading || !input.trim()}
        style={{
          marginTop: 12,
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 6,
          border: "none",
          backgroundColor: "#4caf50",
          color: "white",
          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          width: "100%",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) =>
          !loading && input.trim() && (e.target.style.backgroundColor = "#45a049")
        }
        onMouseOut={(e) =>
          !loading && input.trim() && (e.target.style.backgroundColor = "#4caf50")
        }
      >
        {loading ? "Consultando..." : "Enviar"}
      </button>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#222",
          borderRadius: 6,
          minHeight: 150,
          whiteSpace: "pre-wrap",
          fontSize: 15,
          lineHeight: 1.5,
          overflowY: "auto",
          maxHeight: 400,
          boxShadow: "inset 0 0 10px #000",
        }}
      >
        {resposta}
      </div>
    </div>
  );
}
