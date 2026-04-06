import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("/documents");
        setDocuments(res.data.documents);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐒</span>
          <span className="text-lg font-bold text-gray-900">Monkey Mentor</span>
        </div>
        <button
          onClick={() => navigate("/app")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95"
        >
          Upload New
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">My Lectures</h2>
        <p className="text-sm text-gray-400 mb-6">Click a lecture to open it and continue your session.</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && documents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-gray-600 font-medium">No lectures yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Upload a PDF to get started</p>
            <button
              onClick={() => navigate("/app")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95"
            >
              Upload your first lecture
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/app?document_id=${doc.id}`)}
              className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{doc.filename}</p>
                <p className="text-xs text-gray-400 mt-0.5">Uploaded {formatDate(doc.uploaded_at)}</p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;