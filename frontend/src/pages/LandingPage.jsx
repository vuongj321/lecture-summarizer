import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐒</span>
          <span className="text-xl font-bold text-gray-900">Monkey Mentor</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-150"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95"
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #c7d2fe 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.5,
          }}
        />

        {/* Gradient blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-violet-300 rounded-full opacity-25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl pointer-events-none" />

        {/* Floating decorative emojis */}
        <span className="absolute top-16 left-16 text-3xl opacity-40 -rotate-12 select-none pointer-events-none">📄</span>
        <span className="absolute top-24 right-20 text-2xl opacity-35 rotate-10 select-none pointer-events-none">✏️</span>
        <span className="absolute bottom-20 left-24 text-2xl opacity-35 rotate-6 select-none pointer-events-none">💡</span>
        <span className="absolute bottom-16 right-16 text-3xl opacity-40 -rotate-6 select-none pointer-events-none">🎓</span>
        <span className="absolute top-1/2 right-12 text-xl opacity-25 rotate-12 select-none pointer-events-none">⭐</span>
        <span className="absolute top-1/3 left-10 text-xl opacity-25 -rotate-12 select-none pointer-events-none">📚</span>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            AI-Powered Study Tool
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Study smarter,{" "}
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              not harder
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
            Upload your lecture PDFs and chat with an AI that truly understands
            your notes. Get instant answers, summaries, and insights — all in one
            place.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-150 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Get started free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Log in
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Everything you need to ace your lectures
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Two powerful tools, one seamless experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 cursor-default">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Upload any lecture PDF
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Drop in any PDF — lecture slides, textbook chapters, research
                  papers. Monkey Mentor reads and understands every page so you
                  don't have to start from scratch.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-violet-100 cursor-default">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chat with your notes
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Ask questions in plain English and get answers grounded in
                  your actual notes. Clarify concepts, quiz yourself, or request
                  a full summary in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-8 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>🐒</span>
          <span className="font-medium text-gray-600">Monkey Mentor</span>
        </div>
        <span>© {new Date().getFullYear()} Monkey Mentor</span>
      </footer>
    </div>
  );
}

export default LandingPage;