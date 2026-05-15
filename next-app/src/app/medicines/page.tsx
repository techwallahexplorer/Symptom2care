import MedicineSearch from "@/components/MedicineSearch";
import Link from "next/link";
import { Pill } from "lucide-react";

export default function MedicinesPage() {
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
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">
              ← Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl mb-4 shadow-sm border border-cyan-200">
              <Pill className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Medicine Search
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Search our comprehensive database of over-the-counter medicines, their indications, dosages, and contraindications.
            </p>
          </div>
          
          <MedicineSearch />
        </div>
      </main>
    </div>
  );
}
