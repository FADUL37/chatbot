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

      if (!res.ok) {
        throw new Error("Erro na requisição");
      }

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
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        borderRadius: 8,
        boxShadow: "0 0 15px rgba(0,0,0,0.5)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Suporte Atendimento Operadoras</h2>

      <input
        type="text"
        placeholder="Digite sua pergunta (ex: vivas prazo)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviar()}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #444",
          backgroundColor: "#222",
          color: "#fff",
          outline: "none",
        }}
        disabled={loading}
      />

      <button
        onClick={enviar}
        disabled={loading || !input.trim()}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          fontSize: 16,
          backgroundColor: "#1a73e8",
          border: "none",
          borderRadius: 4,
          color: "#fff",
          cursor: "pointer",
          opacity: loading || !input.trim() ? 0.6 : 1,
        }}
      >
        {loading ? "Consultando..." : "Enviar"}
      </button>

      <div
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#222",
          minHeight: 150,
          whiteSpace: "pre-wrap",
          borderRadius: 4,
          overflowY: "auto",
          maxHeight: 300,
          fontSize: 14,
          lineHeight: 1.4,
        }}
      >
        {resposta}
      </div>
    </div>
  );
}
