import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ChatPanel({ mode = "resources", incidentId = null }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    const res = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, mode, incident_id: incidentId, history }),
    });
    const data = await res.json();
    setHistory([...newHistory, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ marginTop: "1rem", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "0.75rem" }}>
      <div style={{ minHeight: 120, maxHeight: 240, overflowY: "auto", marginBottom: "0.75rem" }}>
        {history.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "user" ? "right" : "left",
            marginBottom: 6,
            fontSize: 13,
          }}>
            <span style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 8,
              background: m.role === "user" ? "var(--color-background-info)" : "var(--color-background-secondary)",
              color: m.role === "user" ? "var(--color-text-info)" : "var(--color-text-primary)",
              maxWidth: "80%",
            }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>...</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={mode === "emergency" ? "Type silently..." : "Ask about safety resources..."}
          style={{ flex: 1 }}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
