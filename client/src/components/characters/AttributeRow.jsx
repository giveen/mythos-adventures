import React from "react";
import { modifier } from "./AttributeControls";

export function AttributeRow({ label, score, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <strong style={{ width: 120 }}>{label}</strong>

      <button
        onClick={() => onChange(score - 1)}
        disabled={score <= 8}
        style={{ marginRight: 8 }}
      >
        -
      </button>

      <span style={{ width: 30, textAlign: "center" }}>{score}</span>

      <button
        onClick={() => onChange(score + 1)}
        disabled={score >= 15}
        style={{ marginLeft: 8 }}
      >
        +
      </button>

      <span style={{ marginLeft: 20 }}>
        Modifier: {modifier(score) >= 0 ? "+" : ""}
        {modifier(score)}
      </span>
    </div>
  );
}

