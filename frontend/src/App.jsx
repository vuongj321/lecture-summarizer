import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setUploaded(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post(`${API}/upload`, formData);
      setUploaded(true);
    } catch {
      setError("File upload failed");
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading("ask");
    setError("");

    try {
      const res = await axios.post(`${API}/ask`, { text: question });
      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "assistant", text: res.data.answer },
      ]);
      setQuestion("");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading("");
    }
  };

  const handleSummarize = async () => {
    setLoading("summarize");
    setError("");

    try {
      const res = await axios.post(`${API}/summarize`);
      setMessages((prev) => [
        ...prev,
        { role: "user", text: "Summarize the document" },
        { role: "assistant", text: res.data.summary },
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-bold">LectureAI</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — PDF Viewer */}
        <div className="w-1/2 border-r bg-white p-4 overflow-y-auto">
          <input type="file" accept=".pdf" onChange={handleUpload} />
          {uploaded && <p>File uploaded successfully!</p>}
        </div>

        {/* Right — Chat */}
        <div className="w-1/2 flex flex-col p-4">
          {messages.map((message, index) => (
            <div key={index}>
              <strong>{message.role === "user" ? "You" : "Assistant"}</strong>
              <p>{message.text}</p>
            </div>
          ))}

          {error && <p>{error}</p>}

          {uploaded && (
            <div>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Type your question"
              />
              <button onClick={handleAsk} disabled={loading}>
                {loading === "ask" ? "Thinking..." : "Ask"}
              </button>
              <button onClick={handleSummarize} disabled={loading}>
                {loading === "summarize" ? "Thinking..." : "Summarize"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
