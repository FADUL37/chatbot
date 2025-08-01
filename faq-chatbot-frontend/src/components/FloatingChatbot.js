import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState("");

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
    <>
      {/* Botão para abrir/fechar */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#6200EE",
          color: "#fff",
          padding: "14px 18px",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          fontWeight: "bold",
          userSelect: "none",
          zIndex: 1000,
          fontSize: 16,
        }}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Fechar Suporte" : "Abrir Suporte"}
      >
        {isOpen ? "✕" : "Suporte"}
      </div>

      {/* Chatbox */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 360,
            maxHeight: 500,
            backgroundColor: "#121212",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#E0E0E0",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid #333`,
              fontWeight: "700",
              fontSize: 18,
              userSelect: "none",
              backgroundColor: "#1F1B24",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            Suporte Atendimento Operadoras
          </div>

          {/* Resposta */}
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              fontSize: 14,
              lineHeight: "1.4em",
            }}
          >
            {loading ? "Consultando..." : resposta || "Digite sua dúvida abaixo."}
          </div>

          {/* Input e botão */}
          <div
            style={{
              display: "flex",
              borderTop: `1px solid #333`,
              padding: 10,
              backgroundColor: "#1E1E1E",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviar()}
              placeholder="Digite sua pergunta..."
              style={{
                flex: 1,
                borderRadius: 8,
                border: "none",
                padding: "10px 14px",
                fontSize: 14,
                color: "#E0E0E0",
                backgroundColor: "#1E1E1E",
                outline: "none",
              }}
              disabled={loading}
              autoFocus
            />
            <button
              onClick={enviar}
              disabled={loading || !input.trim()}
              style={{
                marginLeft: 8,
                backgroundColor: "#6200EE",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: "10px 16px",
                fontWeight: "600",
                fontSize: 14,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3700B3")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#6200EE")
              }
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
