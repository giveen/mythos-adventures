import React from "react";

export function ResponseBox({ response, loading }) {
  return (
    <div className="response-box">{loading ? "..." : response}</div>
  );
}
