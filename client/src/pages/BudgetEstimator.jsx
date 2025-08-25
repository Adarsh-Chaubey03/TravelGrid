import { useState } from "react";
import { jsPDF } from "jspdf";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Currency = ({ value }) => (
  <span className="font-semibold">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
);

export default function BudgetEstimator() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [budgetData, setBudgetData] = useState(null);

  const handleEstimate = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/budget/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: destination.trim(),
          days: parseInt(days),
          travelers: parseInt(travelers)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to estimate budget');
      }

      const data = await response.json();
      setBudgetData(data);
    } catch (err) {
      setError(err.message);
      setBudgetData(null);
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = () => {
    if (!budgetData) return;
    
    const doc = new jsPDF();
    let y = 16;
    doc.setFontSize(18);
    doc.text("Travel Budget Estimate", 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Destination: ${budgetData.destination}`, 14, y);
    y += 7;
    doc.text(`Days: ${budgetData.days} | Travelers: ${budgetData.travelers}`, 14, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Total Budget: $${budgetData.total.toFixed(0)}`, 14, y);
    y += 7;
    doc.text(`Per Person: $${budgetData.perPerson}`, 14, y);
    doc.save("budget-estimate.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-28">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Budget Estimator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 rounded-xl border border-pink-200/40 bg-white/60 dark:bg-slate-900/60 dark:border-slate-700 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4">Trip Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm opacity-80">Destination</label>
              <input
                type="text"
                className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-400 bg-transparent"
                placeholder="Enter destination (e.g., Paris, France)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm opacity-80">Days</label>
              <input
                type="number"
                min={1}
                className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-400 bg-transparent"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm opacity-80">Travelers</label>
              <input
                type="number"
                min={1}
                className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-400 bg-transparent"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleEstimate}
            disabled={loading}
            className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Calculating..." : "Estimate Budget"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl border border-pink-200/40 bg-white/60 dark:bg-slate-900/60 dark:border-slate-700 backdrop-blur h-fit">
          <h2 className="text-lg font-semibold mb-4">Budget Estimate</h2>
          
          {budgetData ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-medium">{budgetData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{budgetData.days} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span>{budgetData.travelers}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Budget:</span>
                  <Currency value={budgetData.total} />
                </div>
                <div className="flex justify-between text-base">
                  <span>Per Person:</span>
                  <Currency value={parseFloat(budgetData.perPerson)} />
                </div>
              </div>
              <button 
                onClick={exportPdf} 
                className="mt-6 w-full px-3 py-2 rounded-md bg-pink-600 text-white hover:opacity-90"
              >
                Export PDF
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Enter trip details and click "Estimate Budget" to see your estimate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



