import AssessmentForm from "@/components/AssessmentForm";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-600 p-2 rounded-lg text-white">
              <span className="text-xl">🏥</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              Symptom2Care
            </span>
          </div>
          <nav className="flex gap-4 items-center">
            <a href="/" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">
              ← Back to Home
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Complete Health Assessment
            </h1>
            <p className="text-lg text-slate-600">
              Fill out all sections below for a comprehensive health analysis
            </p>
          </div>
          
          <AssessmentForm />
        </div>
      </main>
    </div>
  );
}
