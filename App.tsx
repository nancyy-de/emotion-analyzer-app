import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ emotion: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch emotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Emotion Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="How are you feeling today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {loading && <p>Analyzing...</p>}
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <p><strong>Emotion:</strong> {result.emotion}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
