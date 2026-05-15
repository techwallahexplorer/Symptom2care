import Link from "next/link";
import { Activity, Brain, ShieldAlert, FileText, ChevronRight, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-600 p-2 rounded-lg text-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              Symptom2Care
            </span>
          </div>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-cyan-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-cyan-600 transition-colors">How It Works</Link>
            <Link href="#safety" className="hover:text-cyan-600 transition-colors">Safety</Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <Link href="/medicines" className="hover:text-cyan-600 transition-colors">Medicines</Link>
            <Link href="/assessment" className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg">
              Start Assessment
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 -z-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-semibold tracking-wide border border-cyan-200">
                AI-Powered Healthcare Assistant
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Smart Health <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Recommendations</span> <br/>
                at Your Fingertips
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Get instant, AI-powered health guidance tailored to your symptoms. 
                Our intelligent system analyzes your condition and provides personalized 
                recommendations including yoga asanas, OTC medicines, and lifestyle advice.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/assessment" className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-cyan-600/30">
                  Begin Assessment <ChevronRight className="w-5 h-5" />
                </Link>
                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold transition-all shadow-sm">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 absolute inset-0 transform rotate-3 scale-105 opacity-50 z-0"></div>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 relative z-10">
                <div className="flex gap-4 items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-slate-700">
                    I have a headache and a mild fever that started yesterday.
                  </div>
                </div>
                
                <div className="flex gap-4 items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 text-cyan-600">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="bg-cyan-50 border border-cyan-100 rounded-2xl rounded-tr-none p-4 text-slate-700">
                    Get a preliminary health analysis based on your symptoms and lifestyle factors. It&apos;s quick, private, and powered by AI.
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Rest and stay hydrated</li>
                      <li className="flex items-center gap-2 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Paracetamol for fever</li>
                      <li className="flex items-center gap-2 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Balasana (Child&apos;s Pose) for headache</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-y border-amber-200 py-3">
          <div className="container mx-auto px-4 flex items-center gap-3 text-sm text-amber-800 justify-center">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p><strong>Medical Disclaimer:</strong> This tool provides general wellness suggestions only. Always consult a healthcare professional for diagnosis.</p>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive Health Guidance</h2>
              <p className="text-lg text-slate-600">Powered by advanced AI and evidence-based medical knowledge</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Brain className="w-6 h-6"/>, title: "NLP Symptom Processing", desc: "Advanced AI understands your symptoms in plain language." },
                { icon: <Activity className="w-6 h-6"/>, title: "Personalized Yoga", desc: "Customized yoga poses tailored to your specific condition." },
                { icon: <FileText className="w-6 h-6"/>, title: "OTC Medicine Guidance", desc: "Evidence-based recommendations for over-the-counter medicines." }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-cyan-600 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-slate-900 opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Personalized Guidance?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Start your health assessment now and receive instant, AI-powered recommendations tailored just for you.</p>
            <Link href="/assessment" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-8 py-4 rounded-full font-bold transition-colors shadow-lg shadow-cyan-500/20">
              Begin Assessment <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">© 2026 Symptom2Care. All rights reserved.</p>
          <p>For educational purposes only. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
