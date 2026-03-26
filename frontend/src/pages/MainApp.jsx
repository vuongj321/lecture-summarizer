import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ReactMarkdown from "react-markdown";

function MainApp() {
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
      setFileURL(URL.createObjectURL(selectedFile));
      setDocumentId(res.data.document_id);
      setUploaded(true);
    } catch {
      setError("File upload failed");
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading("ask");
    setError("");

    const currentQuestion = question;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: "" },
    ]);
    setQuestion("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-API-Key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          text: currentQuestion,
          document_id: documentId,
        }),
      });

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

          const chunk = JSON.parse(data);

          // append chunk to the last message in place
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: updated[updated.length - 1].text + chunk,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading("");
    }
    // try {
    //   const res = await api.post(`/ask`, {
    //     text: question,
    //     document_id: documentId,
    //   });
    //   setMessages((prev) => [
    //     ...prev,
    //     { role: "user", text: question },
    //     { role: "assistant", text: res.data.answer },
    //   ]);
    //   setQuestion("");
    // } catch (err) {
    //   setError(err.response?.data?.detail || "Something went wrong.");
    // } finally {
    //   setLoading("");
    // }
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
      <div className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold">LectureAI</h1>

        <div className="flex items-center gap-3">
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
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Log out
          </button>
        </div>
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
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
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

export default MainApp;
