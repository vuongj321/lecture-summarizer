import { useRef, useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API = import.meta.env.VITE_API_URL;
const API_KEY =
  "0dbd9af5eca4509966f0ee055a43a046a100e68d8ea525cffff0067e98c68f68";

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setUploaded(false);
    setError("");
    setMessages([]);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post(`${API}/upload`, formData, {
        headers: { "X-API-Key": API_KEY },
      });
      setFileURL(URL.createObjectURL(selectedFile));
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
      const res = await axios.post(
        `${API}/ask`,
        { text: question },
        {
          headers: { "X-API-Key": API_KEY },
        },
      );
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
      const res = await axios.post(
        `${API}/summarize`,
        {},
        {
          headers: { "X-API-Key": API_KEY },
        },
      );
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
      <div className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold">LectureAI</h1>

        <label
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white 
                     text-sm px-4 py-2 rounded-lg transition-colors"
        >
          {uploaded ? "Change PDF" : "Upload PDF"}
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {!uploaded ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
            <p className="text-lg">Upload a PDF to get started</p>
            <p className="text-sm">Then ask questions or generate a summary</p>
          </div>
        ) : (
          <>
            {/* Left — PDF Viewer */}
            <div className="w-1/2 border-r bg-white flex flex-col">
              <iframe
                src={fileURL}
                className="flex-1 w-full h-full"
                title="Lecture PDF"
              />
            </div>

            {/* Right — Chat */}
            <div className="w-1/2 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.role === "user"
                          ? "max-w-xs bg-blue-500 text-white"
                          : "max-w-prose bg-gray-100 text-gray-800 prose prose-sm"
                      }`}
                    >
                      <div ref={bottomRef} />
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm px-4 py-2 bg-red-50 border-t border-red-100">
                  {error}
                </p>
              )}

              <div className="border-t p-4 flex gap-2">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="Type your question"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAsk}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {loading === "ask" ? "..." : "Ask"}
                </button>
                <button
                  onClick={handleSummarize}
                  disabled={loading}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {loading === "summarize" ? "..." : "Summarize"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
