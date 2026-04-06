import { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { getAuthHeaders } from "../api";
import ReactMarkdown from "react-markdown";

function MainApp() {
  const [searchParams] = useSearchParams();
  const [documentId, setDocumentId] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const idFromUrl = searchParams.get("document_id");
    if (idFromUrl) {
      const id = parseInt(idFromUrl);
      if (isNaN(id)) {
        navigate("/documents");
        return;
      }
      loadDocument(id);
    }
  }, [searchParams, navigate]);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setUploaded(false);
    setError("");
    setMessages([]);
    setDocumentId(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await api.post(`/upload`, formData);
      const newDocumentId = res.data.document_id;

      setFileURL(URL.createObjectURL(selectedFile));
      setDocumentId(newDocumentId);
      setUploaded(true);

      const historyRes = await api.get(`/documents/${newDocumentId}/messages`);
      setMessages(
        historyRes.data.messages.map((m) => ({
          role: m.role,
          text: m.content,
        })),
      );
    } catch {
      setError("File upload failed");
    }
  };

  const loadDocument = async (id) => {
    try {
      setDocumentId(id);

      const docRes = await api.get(`/documents/${id}`);
      setFileURL(docRes.data.url);
      setUploaded(true);

      const historyRes = await api.get(`/documents/${id}/messages`);
      const previousMessages = historyRes.data.messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));
      setMessages(previousMessages);
    } catch {
      setError("Failed to load document");
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading("ask");
    setError("");

    const currentQuestion = question;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: currentQuestion },
      { role: "assistant", text: "" },
    ]);
    setQuestion("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text: currentQuestion,
          document_id: documentId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => prev.slice(0, -1));
        setError(err.detail || "Something went wrong.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const chunk = JSON.parse(data);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: updated[updated.length - 1].text + chunk,
              };
              return updated;
            });
          } catch {
            console.error("Failed to parse SSE chunk:", data);
          }
        }
      }
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setError("Something went wrong.");
    } finally {
      setLoading("");
    }
  };

  const handleSummarize = async () => {
    setLoading("summarize");
    setError("");

    try {
      const res = await api.post(`/summarize`, { document_id: documentId });
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐒</span>
          <span className="text-lg font-bold text-gray-900">Monkey Mentor</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95">
            {uploaded ? "Change PDF" : "Upload PDF"}
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => navigate("/documents")}
            className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            My Lectures
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {!uploaded ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">🐒</div>
            <p className="text-lg font-semibold text-gray-700">Upload a PDF to get started</p>
            <p className="text-sm text-gray-400">Then ask questions or generate a summary</p>
            <label className="cursor-pointer mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95">
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <>
            {/* Left — PDF Viewer */}
            <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
              <iframe
                src={fileURL}
                className="flex-1 w-full h-full"
                title="Lecture PDF"
              />
            </div>

            {/* Right — Chat */}
            <div className="w-1/2 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                    <p className="text-sm">Ask a question or click Summarize to begin</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        message.role === "user"
                          ? "max-w-xs bg-indigo-600 text-white"
                          : "max-w-prose bg-gray-100 text-gray-800 prose prose-sm"
                      }`}
                    >
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {error && (
                <p className="text-red-600 text-sm px-5 py-2 bg-red-50 border-t border-red-100">
                  {error}
                </p>
              )}

              <div className="border-t border-gray-100 p-4 flex gap-2">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="Ask a question about your lecture..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  onClick={handleAsk}
                  disabled={!!loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95"
                >
                  {loading === "ask" ? "..." : "Ask"}
                </button>
                <button
                  onClick={handleSummarize}
                  disabled={!!loading}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95"
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

export default MainApp;