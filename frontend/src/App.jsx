import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    setFile(e.target.files[0]);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API}/upload`, formData);
    console.log(res.data);
  };

  const handleAsk = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/ask`, { text: question });
      setResponse(res.data.answer);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleUpload} />

      {file && (
        <div>
          <input
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
