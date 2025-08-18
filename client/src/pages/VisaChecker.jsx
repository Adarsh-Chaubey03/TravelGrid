// src/pages/VisaChecker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from '../context/ThemeContext';

const COMMON_TRAVEL_ADVISORY_NOTE =
  "Check your government’s official travel advisory before traveling.";
const COMMON_HEALTH_NOTE =
  "Ensure you have travel insurance and required vaccinations before your trip.";

export default function VisaChecker() {
  const { isDarkMode } = useTheme();
  const [countries, setCountries] = useState([]);
  const [passport, setPassport] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ from: "", to: "" });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Enrichment states
  const [restInfo, setRestInfo] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [health, setHealth] = useState(null);
  const [visaHint, setVisaHint] = useState(null);

  // Load all countries once (name + cca2)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,currencies,languages"
        );
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          const mapped = data
            .map((c) => ({
              name: c?.name?.common,
              code: c?.cca2, // ISO2
              currencies: c?.currencies || {},
              languages: c?.languages || {},
            }))
            .filter(Boolean)
            .sort((a, b) => a.name.localeCompare(b.name));
          setCountries(mapped);
        }
      } catch (err) {
        console.error("Failed loading countries:", err);
        // fallback minimal
        setCountries([
          { name: "India", code: "IN", currencies: {}, languages: {} },
          { name: "United States", code: "US", currencies: {}, languages: {} },
          { name: "United Kingdom", code: "GB", currencies: {}, languages: {} },
          { name: "Japan", code: "JP", currencies: {}, languages: {} },
        ]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const countryNameToISO = (name) => {
    const c = countries.find((cc) => cc.name === name);
    return c?.code || null;
  };

  // Destination list excludes currently selected passport
  const destinationOptions = useMemo(() => {
    if (!passport) return countries;
    return countries.filter((c) => c.name !== passport);
  }, [countries, passport]);

  const currencyDisplay = useMemo(() => {
    if (!restInfo?.currencies) return "—";
    const entries = Object.entries(restInfo.currencies);
    if (!entries.length) return "—";
    return entries
      .map(([code, info]) => `${info?.name || code} (${code}${info?.symbol ? ` • ${info.symbol}` : ""})`)
      .join(", ");
  }, [restInfo]);

  const languageDisplay = useMemo(() => {
    if (!restInfo?.languages) return "—";
    return Object.values(restInfo.languages).join(", ");
  }, [restInfo]);

  const onCheck = async (e) => {
    e?.preventDefault();
    if (!passport || !destination) {
      alert("Please select both passport and destination countries.");
      return;
    }

    setLoading(true);
    setResult(null);
    setRestInfo(null);
    setAdvisory(null);
    setHealth(null);
    setVisaHint(null);

    try {
      const pIso = countryNameToISO(passport);
      const dIso = countryNameToISO(destination);

      // Build basic result shell
      setResult({
        passport: { name: passport, code: pIso },
        destination: { name: destination, code: dIso },
        dates,
      });

      // 1) REST Countries enrichment for destination (currency/language)
      try {
        if (dIso) {
          const r = await fetch(`https://restcountries.com/v3.1/alpha/${dIso}?fields=currencies,languages`);
          if (r.ok) {
            const d = await r.json();
            const info = Array.isArray(d) ? d[0] : d;
            setRestInfo({
              currencies: info?.currencies || {},
              languages: info?.languages || {},
            });
          }
        }
      } catch (err) {
        // ignore
      }

      // 2) Travel advisory
      try {
        if (dIso) {
          const r = await fetch(`https://www.travel-advisory.info/api?countrycode=${dIso}`);
          if (r.ok) {
            const d = await r.json();
            const item = d?.data?.[dIso];
            if (item?.advisory) {
              setAdvisory({
                score: item.advisory.score,
                message: item.advisory.message,
                updated: item.advisory.updated,
              });
            } else {
              setAdvisory(null);
            }
          }
        }
      } catch (err) {
        // ignore
      }

      // 3) Health + visa hints from travelbriefing
      try {
        // travelbriefing expects destination name (not ISO). We pass destination name.
        const tbRes = await fetch(
          `https://travelbriefing.org/${encodeURIComponent(destination)}?format=json`
        );
        if (tbRes.ok) {
          const tb = await tbRes.json();

          // Health vaccines
          const vaccines =
            Array.isArray(tb?.vaccinations) && tb.vaccinations.length
              ? tb.vaccinations.map((v) => v.name)
              : null;

          // Visa information: travelbriefing has .visas typically keyed by passport ISO
          let visaForPassport = null;
          if (pIso && tb?.visas) {
            // Some versions use lowercase iso keys; normalize:
            const keyUpper = pIso.toUpperCase();
            const keyLower = pIso.toLowerCase();
            visaForPassport = tb.visas[keyUpper] || tb.visas[keyLower] || null;
          }

          setHealth({
            vaccines,
            water: tb?.water || null,
            safety: tb?.advise || null,
          });

          if (visaForPassport) {
            // attempt to show friendly visa hint
            const status = visaForPassport.category || visaForPassport.status || visaForPassport.type;
            const duration = visaForPassport.duration || visaForPassport.days || null;
            const hintParts = [];
            if (status) hintParts.push(status);
            if (duration) hintParts.push(`${duration}`);
            if (visaForPassport.note) hintParts.push(visaForPassport.note);
            setVisaHint(hintParts.join(" • ") || null);
          } else {
            setVisaHint(null);
          }
        }
      } catch (err) {
        // ignore
      }

      // If travelbriefing didn't provide visa info, we show advisory fallback (will be handled in UI)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen  ${isDarkMode? 'bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900':'bg-gradient-to-br from-blue-50 to-pink-50'} px-4 py-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="mb-6">
          <h1 className={`text-3xl font-extrabold  ${isDarkMode?'text-zinc-100':'text-zinc-900'}`}>
            Visa & Travel Requirements Checker
          </h1>
          <p className="mt-9 text-7xl font-stretch-50% border-8 p-5 border-dotted font-bold text-blue-400 text-center ">
            Visa Checker
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={onCheck}
          className={` border p-5 rounded-2xl shadow-sm backdrop-blur ${isDarkMode?'bg-zinc-900/60 border-zinc-700 ':'bg-white '}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Passport */}
            <div>
              <label className={`block text-xs font-medium  ${isDarkMode?'text-zinc-300':'text-zinc-600'} mb-2`}>
                Passport country
              </label>
              <select
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                className={`w-full p-2 rounded-xl border ${isDarkMode?'text-zinc-100 bg-zinc-800/80 border-zinc-700 ':'text-zinc-900 bg-white border-zinc-300'}`}
                style={{ appearance: "auto" }}
                required
              >
                <option value="">Select passport</option>
                {countries.map((c) => (
                  <option
                    key={c.code}
                    value={c.name}
                    style={{ color: "#111", background: "#fff" }}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className={`block text-xs font-medium ${isDarkMode?'text-zinc-300':'text-zinc-600'} mb-2`}>
                Destination country
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={`w-full p-2 rounded-xl border ${isDarkMode?'text-zinc-100 bg-zinc-800/80 border-zinc-700 ':'text-zinc-900 bg-white border-zinc-300'}`}
                style={{ appearance: "auto" }}
                required
              >
                <option value="">Select destination</option>
                {destinationOptions.map((c) => (
                  <option
                    key={c.code}
                    value={c.name}
                    style={{ color: "#111", background: "#fff" }}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates (optional) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-medium ${isDarkMode?'text-zinc-300':'text-zinc-600'} mb-2`}>
                  From (optional)
                </label>
                <input
                  type="date"
                  value={dates.from}
                  onChange={(e) => setDates((d) => ({ ...d, from: e.target.value }))}
                  className={`w-full p-2 rounded-xl border ${isDarkMode?'text-zinc-100 bg-zinc-800/80 border-zinc-400 ':'text-zinc-600 bg-white border-zinc-300'}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium ${isDarkMode?'text-zinc-300':'text-zinc-600'} mb-2`}>
                  To (optional)
                </label>
                <input
                  type="date"
                  value={dates.to}
                  onChange={(e) => setDates((d) => ({ ...d, to: e.target.value }))}
                  className={`w-full p-2 rounded-xl border ${isDarkMode?'text-zinc-100 bg-zinc-800/80 border-zinc-400 ':'text-zinc-600 bg-white border-zinc-300'}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 font-semibold disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check Requirements"}
            </button>

            <button
              type="button"
              onClick={() => {
                setPassport("");
                setDestination("");
                setDates({ from: "", to: "" });
                setResult(null);
                setRestInfo(null);
                setAdvisory(null);
                setHealth(null);
                setVisaHint(null);
              }}
              className={`rounded-xl border px-4 py-2 ${isDarkMode?'text-zinc-100 border-zinc-500':'text-zinc-800 border-zinc-300'}`}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-5">
            <div className={` rounded-2xl p-5 border shadow-sm ${isDarkMode?'border-zinc-700 bg-zinc-900/60 ':'bg-white'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className={`text-lg font-semibold ${isDarkMode?'text-zinc-100':'text-zinc-900 '}`}>
                    {result.passport.name} → {result.destination.name}
                  </h2>
                  <p className={`text-sm mt-1 ${isDarkMode?'text-zinc-400':'text-zinc-600 '}`}>
                    {dates.from && dates.to
                      ? `Travel window: ${dates.from} → ${dates.to}`
                      : "Travel window: not specified"}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      visaHint ? "bg-amber-600 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    {visaHint ? visaHint : "Confirm with embassy"}
                  </span>
                </div>
              </div>

              {/* Details cards */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-3 rounded-xl border  ${isDarkMode?'bg-zinc-900/50 border-white/10':'border-zinc/10 bg-white/70 '}`}>
                  <div className={`text-xs  ${isDarkMode?'text-zinc-400':'text-zinc-500'} mb-1`}>Status</div>
                  <div className={`font-semibold ${isDarkMode?'text-zinc-100':'text-zinc-900'}`}>
                    {visaHint ? visaHint.split("•")[0] : "Check embassy/official source"}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode?'bg-zinc-900/50 border-white/10':'border-zinc/10 bg-white/70 '}`}>
                  <div className={`text-xs ${isDarkMode?'text-zinc-400':'text-zinc-500'} mb-1`}>Currency</div>
                  <div className={`font-medium ${isDarkMode?'text-zinc-100':'text-zinc-900'}`}>
                    {currencyDisplay}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode?'bg-zinc-900/50 border-white/10':'border-zinc/10 bg-white/70 '}`}>
                  <div className={`text-xs ${isDarkMode?'text-zinc-400':'text-zinc-500'} mb-1`}>Languages</div>
                  <div className={`font-medium ${isDarkMode?'text-zinc-100':'text-zinc-900'}`}>
                    {languageDisplay}
                  </div>
                </div>
              </div>

              {/* Advisory & health */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode?'bg-zinc-900/50 border-white/10':'bg-white/60 '}`}>
                  <div className={`font-semibold ${isDarkMode?'text-zinc-100':'text-zinc-900'}`}>Travel Advisory</div>
                  <div className={`mt-2 text-sm ${isDarkMode?'text-zinc-300 ':'text-zinc-700 '}`}>
                    {advisory?.message || "Not available from advisory API."}
                  </div>
                  <div className={`mt-2 text-xs italic  ${isDarkMode?'text-amber-400':'text-amber-600'}`}>
                    {COMMON_TRAVEL_ADVISORY_NOTE}
                  </div>
                </div>

                <div className={`p-4 rounded-lg  border  ${isDarkMode?'bg-zinc-900/50 border-white/10':'bg-white/60 '}`}>
                  <div className={`font-semibold ${isDarkMode?'text-zinc-100':'text-zinc-900'}`}>Health & Vaccinations</div>

                  <div className={`mt-2 text-sm ${isDarkMode?'text-zinc-300 ':'text-zinc-700 '}`}>
                    <div>
                      <strong>Recommended vaccines:</strong>{" "}
                      {health?.vaccines?.length ? health.vaccines.join(", ") : "Not listed"}
                    </div>
                    <div className="mt-2">
                      <strong>Water safety:</strong> {health?.water?.short || "Not listed"}
                    </div>
                  </div>

                  <div className={`mt-2 text-xs italic ${isDarkMode?'text-green-400':'text-green-600'}`}>
                    {COMMON_HEALTH_NOTE}
                  </div>
                </div>
              </div>

              <p className={`mt-4 text-xs  ${isDarkMode?'text-zinc-400':'text-zinc-600'}`}>
                ⚠️ Visa policies change frequently. Always verify with official government / embassy sources before travel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
