"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Search, X, Pill, AlertTriangle, CheckCircle2, Info } from "lucide-react";

type Medicine = {
  name: string;
  type: string;
  conditions: string;
  dosage: string;
  contraindications: string;
  side_effects: string;
};

export default function MedicineSearch() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/data/medicines.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setMedicines(results.data as Medicine[]);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Failed to load medicines:", error);
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filteredMedicines = query.length >= 2 
    ? medicines.filter(med => {
        const q = query.toLowerCase();
        return (med.name?.toLowerCase().includes(q) || 
                med.conditions?.toLowerCase().includes(q) || 
                med.type?.toLowerCase().includes(q));
      })
    : [];

  const handleCloseModal = () => setSelectedMedicine(null);

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto mb-12 relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
          <Search className="w-6 h-6" />
        </div>
        <input 
          type="text" 
          className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none text-lg transition-all shadow-sm bg-white"
          placeholder="Search by medicine name or condition (e.g., headache)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mb-12">
          {query.length < 2 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Start searching</h3>
              <p className="text-slate-500">Type at least 2 characters to see medicine results</p>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((med, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedMedicine(med)}
                  className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/5 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{med.name}</h3>
                    <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {med.type || 'OTC'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 line-clamp-2">
                    <strong className="text-slate-900">Treats:</strong> {med.conditions || 'Various conditions'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedMedicine.name}</h2>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 mt-1">
                  <Pill className="w-4 h-4" /> {selectedMedicine.type || 'Over-the-Counter Medicine'}
                </span>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Indications
                </h3>
                <p className="text-slate-600 pl-7">{selectedMedicine.conditions || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-500" /> Dosage Guidelines
                </h3>
                <p className="text-slate-600 pl-7">{selectedMedicine.dosage || 'Consult product label'}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Pros
                  </h3>
                  <ul className="space-y-2 text-sm text-emerald-700">
                    <li className="flex gap-2"><span className="shrink-0">•</span> Effective for {selectedMedicine.conditions || 'various conditions'}</li>
                    <li className="flex gap-2"><span className="shrink-0">•</span> Available over-the-counter</li>
                    <li className="flex gap-2"><span className="shrink-0">•</span> Well-studied and widely used</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                  <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Cons / Side Effects
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-700">
                    {selectedMedicine.side_effects ? 
                      selectedMedicine.side_effects.split(',').map((s, i) => (
                        <li key={i} className="flex gap-2"><span className="shrink-0">•</span> {s.trim()}</li>
                      )) : 
                      <li className="flex gap-2"><span className="shrink-0">•</span> Consult product information</li>
                    }
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" /> Contraindications
                </h3>
                <p className="text-slate-600 pl-7">{selectedMedicine.contraindications || 'Consult healthcare provider'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
