import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/ask`, { text: question });
      setResponse(res.data.answer);
      setQuestion("");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleUpload} />
      {uploaded && <p>File uploaded successfully!</p>}

      {uploaded && (
        <div>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question"
          />
          <button onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      )}

      {error && <p>{error}</p>}
      {response && <p>{response}</p>}
    </div>
  );
}

export default App;
