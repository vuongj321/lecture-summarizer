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
      <div className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold">LectureAI</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload New
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-lg font-medium mb-4">Your Lectures</h2>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && documents.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No lectures yet</p>
            <p className="text-sm mt-1">Upload a PDF to get started</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/?document_id=${doc.id}`)}
              className="bg-white border rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <p className="font-medium text-sm">{doc.filename}</p>
              <p className="text-xs text-gray-400 mt-1">
                Uploaded {formatDate(doc.uploaded_at)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;
