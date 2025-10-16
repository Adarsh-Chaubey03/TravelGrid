// src/pages/VisaChecker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
// NOTE: install these deps if not present:
// npm install framer-motion jspdf react-icons
import { jsPDF } from "jspdf";
import { FiHelpCircle, FiTrash2, FiSave, FiDownload, FiRepeat } from "react-icons/fi";

/**
 * Enhanced VisaChecker.jsx
 *
 * - Keeps original background / theme usage via useTheme()
 * - Adds:
 *   - autosuggest text inputs (with simple filtering)
 *   - auto-detect passport country (geo/ip fallback)
 *   - flags shown using ISO2 -> emoji (if ISO available)
 *   - loading spinner / skeletons
 *   - Framer Motion animations for results & modal
 *   - Compare modal (side-by-side)
 *   - Recommended countries (simple heuristic: visaHint absence -> recommend)
 *   - Download checklist using jsPDF
 *   - Recent searches and Save Search (localStorage)
 *   - Simple help/chat button (opens small panel)
 * - Preserves existing API calls & fallback behaviors in original component
 *
 * Keep style classes consistent with original Tailwind classes in the project.
 */

const COMMON_TRAVEL_ADVISORY_NOTE =
  "Check your government’s official travel advisory before traveling.";
const COMMON_HEALTH_NOTE =
  "Ensure you have travel insurance and required vaccinations before your trip.";

// helper: ISO2 to regional indicator symbols for emoji flags
const iso2ToFlagEmoji = (iso2) => {
  if (!iso2) return "";
  try {
    const codePoints = [...iso2.toUpperCase()].map((c) => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
  } catch {
    return "";
  }
};

const LOCAL_KEYS = {
  RECENT: "visa_checker_recent_searches_v1",
  SAVED: "visa_checker_saved_searches_v1",
};

// single high-quality hero image (world map aesthetic)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1920&q=60";

export default function VisaChecker() {
  const { isDarkMode } = useTheme();

  // core state
  const [countries, setCountries] = useState([]);
  const [passport, setPassport] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ from: "", to: "" });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // enrichment
  const [restInfo, setRestInfo] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [health, setHealth] = useState(null);
  const [visaHint, setVisaHint] = useState(null);

  // UI extras
  const [query, setQuery] = useState({ passport: "", destination: "" }); // for autosuggest text
  const [suggestionsPassport, setSuggestionsPassport] = useState([]);
  const [suggestionsDestination, setSuggestionsDestination] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePair, setComparePair] = useState({ a: "", b: "" });
  const [compareResult, setCompareResult] = useState(null);

  // recent/saved
  const [recent, setRecent] = useState([]);
  const [saved, setSaved] = useState([]);

  // help/chat widget
  const [helpOpen, setHelpOpen] = useState(false);

  // fixed hero image (no switching)

  // load countries list once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,currencies,languages,flags,region"
        );
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          const mapped = data
            .map((c) => ({
              name: c?.name?.common,
              code: c?.cca2, // ISO2
              currencies: c?.currencies || {},
              languages: c?.languages || {},
              flagSvg: c?.flags?.svg || null,
              region: c?.region || null,
            }))
            .filter(Boolean)
            .sort((a, b) => a.name.localeCompare(b.name));
          setCountries(mapped);
        }
      } catch (err) {
        console.error("Failed loading countries:", err);
        setCountries([
          { name: "India", code: "IN", currencies: {}, languages: {}, region: "Asia" },
          { name: "United States", code: "US", currencies: {}, languages: {}, region: "Americas" },
          { name: "United Kingdom", code: "GB", currencies: {}, languages: {}, region: "Europe" },
          { name: "Japan", code: "JP", currencies: {}, languages: {}, region: "Asia" },
        ]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // load recent/saved from localStorage
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(LOCAL_KEYS.RECENT) || "[]");
      const s = JSON.parse(localStorage.getItem(LOCAL_KEYS.SAVED) || "[]");
      setRecent(Array.isArray(r) ? r : []);
      setSaved(Array.isArray(s) ? s : []);
    } catch {
      setRecent([]);
      setSaved([]);
    }
  }, []);

  // country name -> ISO
  const countryNameToISO = (name) => {
    const c = countries.find((cc) => cc.name === name);
    return c?.code || null;
  };

  // get country object from name
  const countryByName = (name) => countries.find((c) => c.name === name);

  // destination options exclude passport
  const destinationOptions = useMemo(() => {
    if (!passport) return countries;
    return countries.filter((c) => c.name !== passport);
  }, [countries, passport]);

  // currency & language memo (from restInfo)
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

  // autosuggest handlers: simple filtering by startsWith / includes
  useEffect(() => {
    if (!query.passport) {
      setSuggestionsPassport([]);
      return;
    }
    const q = query.passport.toLowerCase();
    const list = countries
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((c) => ({ name: c.name, code: c.code }));
    setSuggestionsPassport(list);
  }, [query.passport, countries]);

  useEffect(() => {
    if (!query.destination) {
      setSuggestionsDestination([]);
      return;
    }
    const q = query.destination.toLowerCase();
    const list = countries
      .filter((c) => c.name.toLowerCase().includes(q) && c.name !== passport)
      .slice(0, 8)
      .map((c) => ({ name: c.name, code: c.code }));
    setSuggestionsDestination(list);
  }, [query.destination, countries, passport]);

  // auto-detect country via browser geolocation or IP fallback
  const autoDetectCountry = async () => {
    setDetecting(true);
    try {
      // Try browser geolocation (reverse geocoding not done locally) -> we attempt IP fallback first because geolocation needs reverse geocode server
      // Use IP geolocation fallback (simple and reliable)
      const r = await fetch("https://ipapi.co/json/");
      if (r.ok) {
        const j = await r.json();
        if (j && j.country_name) {
          setPassport(j.country_name);
          setQuery((q) => ({ ...q, passport: j.country_name }));
        } else if (j && j.country) {
          // try mapping ISO to name
          const found = countries.find((c) => c.code === j.country);
          if (found) {
            setPassport(found.name);
            setQuery((q) => ({ ...q, passport: found.name }));
          }
        }
      }
    } catch (err) {
      // ignore — do nothing
      console.warn("Auto-detect failed", err);
    } finally {
      setDetecting(false);
    }
  };

  // store recent helper
  const pushRecent = (rec) => {
    try {
      const next = [rec, ...(recent.filter((r) => !(r.passport === rec.passport && r.destination === rec.destination)))].slice(
        0,
        6
      );
      setRecent(next);
      localStorage.setItem(LOCAL_KEYS.RECENT, JSON.stringify(next));
    } catch {}
  };

  const saveSearch = (rec) => {
    try {
      const next = [rec, ...(saved.filter((r) => !(r.passport === rec.passport && r.destination === rec.destination)))].slice(0, 10);
      setSaved(next);
      localStorage.setItem(LOCAL_KEYS.SAVED, JSON.stringify(next));
    } catch {}
  };

  // generate PDF checklist
  const downloadChecklist = (payload) => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(18);
      doc.text(`Visa Checklist: ${payload.passport} → ${payload.destination}`, 40, 60);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 80);

      doc.setFontSize(14);
      doc.text("Recommended Documents:", 40, 110);
      doc.setFontSize(11);
      const items = payload.requiredDocuments || ["Passport (valid 6+ months)", "Return ticket", "Proof of funds"];
      let y = 130;
      items.forEach((it, idx) => {
        doc.text(`• ${it}`, 50, y);
        y += 18;
      });

      doc.setFontSize(12);
      doc.text("Note: Always verify with the embassy/official site before travel.", 40, y + 16);

      doc.save(`visa_checklist_${payload.passport}_${payload.destination}.pdf`);
    } catch (err) {
      console.error("Failed to create PDF", err);
      alert("Could not download checklist. Try again.");
    }
  };

  // onCheck: main orchestration that mostly reuses previous logic but adds requiredDocuments (simple heuristic)
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
      const shell = {
        passport: { name: passport, code: pIso },
        destination: { name: destination, code: dIso },
        dates,
        requiredDocuments: [], // we'll populate heuristically
      };
      setResult(shell);

      // Save into recent
      pushRecent({ passport, destination, timestamp: Date.now() });

      // 1) REST Countries enrichment for destination (currency/language)
      try {
        if (dIso) {
          const r = await fetch(`https://restcountries.com/v3.1/alpha/${dIso}?fields=currencies,languages,flags`);
          if (r.ok) {
            const d = await r.json();
            const info = Array.isArray(d) ? d[0] : d;
            setRestInfo({
              currencies: info?.currencies || {},
              languages: info?.languages || {},
              flagSvg: info?.flags?.svg || null,
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
      let travelBriefingGot = false;
      try {
        const tbRes = await fetch(`https://travelbriefing.org/${encodeURIComponent(destination)}?format=json`);
        if (tbRes.ok) {
          const tb = await tbRes.json();
          travelBriefingGot = true;

          const vaccines =
            Array.isArray(tb?.vaccinations) && tb.vaccinations.length ? tb.vaccinations.map((v) => v.name) : null;

          // Visa information keyed by passport ISO
          let visaForPassport = null;
          if (pIso && tb?.visas) {
            const keyUpper = pIso.toUpperCase();
            const keyLower = pIso.toLowerCase();
            visaForPassport = tb.visas[keyUpper] || tb.visas[keyLower] || null;
          }

          setHealth({
            vaccines,
            water: tb?.water || null,
            safety: tb?.advise || null,
          });

          // populate visa hint (friendly)
          if (visaForPassport) {
            const status = visaForPassport.category || visaForPassport.status || visaForPassport.type;
            const duration = visaForPassport.duration || visaForPassport.days || null;
            const hintParts = [];
            if (status) hintParts.push(status);
            if (duration) hintParts.push(`${duration}`);
            if (visaForPassport.note) hintParts.push(visaForPassport.note);
            setVisaHint(hintParts.join(" • ") || null);

            // heuristic required documents from travelbriefing visas (if any)
            const docs = [];
            if (visaForPassport?.requires) docs.push(...(visaForPassport.requires || []));
            if (visaForPassport?.note) docs.push(visaForPassport.note);
            // fallback common docs
            const fallbackDocs = ["Passport (valid 6+ months)", "Passport photos", "Proof of onward travel", "Proof of accommodation", "Financial proof (bank)"];
            shell.requiredDocuments = docs.length ? docs : fallbackDocs;
            setResult(shell);
          } else {
            // no visa info from travelbriefing -> fallback heuristic
            setVisaHint(null);
            shell.requiredDocuments = ["Passport (valid 6+ months)", "Return ticket", "Proof of funds", "Hotel reservation / address"];
            setResult(shell);
          }
        }
      } catch (err) {
        console.warn("travelbriefing failed", err);
      }

      // if travelbriefing didn't provide visa info, we try to mark the result as 'confirm with embassy'
      if (!travelBriefingGot) {
        shell.requiredDocuments = ["Passport (valid 6+ months)", "Return ticket", "Proof of funds", "Hotel reservation / address"];
        setVisaHint(null);
        setResult(shell);
      }
    } finally {
      setLoading(false);
    }
  };

  // Compare two countries (simple replicate of onCheck logic but minimal)
  const onCompare = async (e) => {
    e?.preventDefault();
    if (!comparePair.a || !comparePair.b) {
      alert("Select two countries to compare.");
      return;
    }
    setCompareResult(null);
    setLoading(true);
    try {
      const fetchInfo = async (name) => {
        const iso = countryNameToISO(name);
        const obj = { name, iso, rest: null, visaHint: null };
        try {
          if (iso) {
            const r = await fetch(`https://restcountries.com/v3.1/alpha/${iso}?fields=currencies,languages,flags`);
            if (r.ok) {
              const d = await r.json();
              const info = Array.isArray(d) ? d[0] : d;
              obj.rest = {
                currencies: info?.currencies || {},
                languages: info?.languages || {},
                flagSvg: info?.flags?.svg || null,
              };
            }
          }
        } catch {}
        // minimal travelbriefing call for visa hint
        try {
          const tbRes = await fetch(`https://travelbriefing.org/${encodeURIComponent(name)}?format=json`);
          if (tbRes.ok) {
            const tb = await tbRes.json();
            obj.tb = tb;
            // we don't attempt passport-specific visa here; user will check main flow
          }
        } catch {}
        return obj;
      };

      const a = await fetchInfo(comparePair.a);
      const b = await fetchInfo(comparePair.b);
      setCompareResult({ a, b });
    } finally {
      setLoading(false);
    }
  };

  // clear saved / recent helpers
  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(LOCAL_KEYS.RECENT);
  };
  const clearSaved = () => {
    setSaved([]);
    localStorage.removeItem(LOCAL_KEYS.SAVED);
  };

  // small presentational components used inside file (spinner)
  const Spinner = () => (
    <div role="status" aria-live="polite" className="inline-flex items-center gap-2">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="0" fill="none" />
      </svg>
      <span className="text-sm">Loading</span>
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 px-4 py-8`}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Heading / hero (kept as original) */}
        <div
          className={`relative h-[50vh] w-full flex flex-col justify-center items-center rounded-2xl border p-4 shadow-md border-pink-400 transition-colors duration-300 
          ${isDarkMode ? "bg-white/10 shadow-lg backdrop-blur-md hover:shadow-xl hover:bg-white/15 text-white" : "bg-white/90 border-gray-300 shadow-pink-500/20 text-gray-900"}`}
        >
          {/* soft decorative background image */}
          <img
            src={HERO_IMAGE}
            srcSet={`${HERO_IMAGE}&w=768 768w, ${HERO_IMAGE}&w=1280 1280w, ${HERO_IMAGE}&w=1920 1920w`}
            sizes="(max-width: 768px) 768px, (max-width: 1280px) 1280px, 1920px"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px] rounded-2xl pointer-events-none select-none"
          />
          {/* gradient overlay to keep text readable */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/20 via-black/10 to-black/0" />
          <h1 className="px-2 md:px-0 text-3xl md:text-6xl sm:text-4xl font-bold text-pink-500 text-center leading-snug">
            Visa & Travel Requirements
          </h1>
          <p className={`mt-6 text-sm md:text-lg text-center max-w-full whitespace-wrap ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Quickly check visa requirements and travel guidelines for any country with ease.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={onCheck}
          className={`border p-6 rounded-2xl shadow-lg backdrop-blur-sm ${isDarkMode ? "bg-white/10 border-white/10" : "bg-white/90 border-pink-400"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 gap-6">
            {/* Passport (autosuggest) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Passport Country</label>
              <div className="relative">
                <input
                  aria-label="Passport country"
                  placeholder={detecting ? "Detecting..." : "Type or pick passport country"}
                  value={query.passport || passport}
                  onChange={(e) => {
                    setQuery((q) => ({ ...q, passport: e.target.value }));
                    setPassport(""); // clear selected canonical until user chooses suggestion
                    setSuggestionsPassport([]);
                  }}
                  onFocus={() => {
                    if (query.passport && suggestionsPassport.length === 0) {
                      // compute suggestions immediately
                      const q = query.passport.toLowerCase();
                      setSuggestionsPassport(
                        countries.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8).map((c) => ({ name: c.name, code: c.code }))
                      );
                    }
                  }}
                  className={`w-full p-3 rounded-xl text-gray-900 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300`}
                />
                <button
                  type="button"
                  onClick={autoDetectCountry}
                  aria-label="Auto detect passport country"
                  title="Auto-detect my country"
                  className={`absolute right-2 top-2 px-2 py-1 rounded-md text-xs ${isDarkMode ? "bg-transparent text-white border-pink-400 hover:bg-white/10" : "bg-pink-100 text-gray-900 border"}`}
                >
                  {detecting ? <Spinner /> : "Auto-detect"}
                </button>

                {/* suggestions */}
                {suggestionsPassport.length > 0 && (
                  <ul
                    className={`absolute z-30 mt-2 w-full rounded-md shadow-lg max-h-56 overflow-auto border ${
                      isDarkMode ? "bg-zinc-900 border-pink-400" : "bg-white/95"
                    }`}
                  >
                    {suggestionsPassport.map((s) => (
                      <li
                        key={s.name}
                        onClick={() => {
                          setPassport(s.name);
                          setQuery((q) => ({ ...q, passport: s.name }));
                          setSuggestionsPassport([]);
                        }}
                        className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                          isDarkMode ? "hover:bg-white/20" : "hover:bg-pink-50"
                        }`}
                      >
                        <span className="text-xl">{iso2ToFlagEmoji(s.code)}</span>
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* small helper: show selected canonical passport */}
              {passport && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                  <span className="text-lg">{iso2ToFlagEmoji(countryNameToISO(passport))}</span>
                  <span>{passport}</span>
                </div>
              )}
            </div>

            {/* Destination (autosuggest) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Destination Country</label>
              <div className="relative">
                <input
                  aria-label="Destination country"
                  placeholder="Type or pick destination country"
                  value={query.destination || destination}
                  onChange={(e) => {
                    setQuery((q) => ({ ...q, destination: e.target.value }));
                    setDestination("");
                    setSuggestionsDestination([]);
                  }}
                  onFocus={() => {
                    if (query.destination && suggestionsDestination.length === 0) {
                      const q = query.destination.toLowerCase();
                      setSuggestionsDestination(
                        countries.filter((c) => c.name.toLowerCase().includes(q) && c.name !== passport).slice(0, 8).map((c) => ({ name: c.name, code: c.code }))
                      );
                    }
                  }}
                  className={`w-full p-3 rounded-xl text-gray-900 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300`}
                />
                {suggestionsDestination.length > 0 && (
                  <ul
                    className={`absolute z-30 mt-2 w-full rounded-md shadow-lg max-h-56 overflow-auto border ${
                      isDarkMode ? "bg-zinc-900 border-pink-400" : "bg-white/95"
                    }`}
                  >
                    {suggestionsDestination.map((s) => (
                      <li
                        key={s.name}
                        onClick={() => {
                          setDestination(s.name);
                          setQuery((q) => ({ ...q, destination: s.name }));
                          setSuggestionsDestination([]);
                        }}
                        className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                          isDarkMode ? "hover:bg-white/20" : "hover:bg-pink-50"
                        }`}
                      >
                        <span className="text-xl">{iso2ToFlagEmoji(s.code)}</span>
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {destination && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                  <span className="text-lg">{iso2ToFlagEmoji(countryNameToISO(destination))}</span>
                  <span>{destination}</span>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">From (Optional)</label>
                <input
                  type="date"
                  value={dates.from}
                  onChange={(e) => setDates((d) => ({ ...d, from: e.target.value }))}
                  className={`w-full py-1.5 px-2 rounded-md text-gray-900 border  ${isDarkMode ? "bg-zinc-800 border-white/20 [color-scheme:dark]" : "bg-slate-100 border-black/20 [color-scheme:light]"} focus:outline-none  focus:ring-2 focus:ring-pink-400 transition duration-300 cursor-pointer`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">To (Optional)</label>
                <input
                  type="date"
                  value={dates.to}
                  onChange={(e) => setDates((d) => ({ ...d, to: e.target.value }))}
                  className={`w-full py-1.5 px-2 rounded-md text-gray-900 border  ${isDarkMode ? "bg-zinc-800 border-white/20 [color-scheme:dark]" : "bg-slate-100 border-black/20 [color-scheme:light]"} focus:outline-none  focus:ring-2 focus:ring-pink-400 transition duration-300 cursor-pointer`}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col md:flex-row gap-4 md:gap-3 justify-center md:justify-start items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-5 py-3 rounded-md font-semibold bg-pink-500 hover:bg-pink-700 text-white disabled:opacity-60 transition-colors duration-300 focus:outline-none focus:ring-pink-500 focus:ring-offset-2 cursor-pointer"
            >
              {loading ? "Checking..." : "Check Requirements"}
            </button>

            <button
              type="button"
              onClick={() => {
                setPassport("");
                setDestination("");
                setDates({ from: "", to: "" });
                setQuery({ passport: "", destination: "" });
                setResult(null);
                setRestInfo(null);
                setAdvisory(null);
                setHealth(null);
                setVisaHint(null);
              }}
              className={`w-full md:w-auto px-5 py-3 rounded-md border border-pink-400 font-medium ${isDarkMode ? "bg-pink-500/10 hover:bg-pink-500/20 text-white" : "bg-pink-100 hover:bg-pink-200 text-gray-900"} transition-colors duration-300focus:outline-none focus:ring-pink-500 focus:ring-offset-2 cursor-pointer`}
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className={`w-full md:w-auto px-5 py-3 rounded-md font-medium border ${
                isDarkMode ? "bg-transparent border-pink-400 text-white hover:bg-white/10" : "border-gray-300 bg-white/60 hover:bg-pink-50 text-gray-900"
              }`}
            >
              Compare Countries
            </button>

            <button
              type="button"
              onClick={() => {
                if (!passport || !destination || !result) {
                  alert("Check requirements first to download checklist.");
                  return;
                }
                downloadChecklist({
                  passport,
                  destination,
                  requiredDocuments: result.requiredDocuments,
                });
              }}
              className={`w-full md:w-auto px-4 py-3 rounded-md font-medium border ${
                isDarkMode ? "bg-transparent border-pink-400 text-white hover:bg-white/10" : "border-pink-400 text-gray-900 bg-white/70"
              }`}
              title="Download a PDF checklist"
            >
              <FiDownload className="inline-block mr-2" /> Download Checklist
            </button>
          </div>
        </form>

        {/* Recent & Saved */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
          <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/6 border-white/10" : "bg-white/90 border-gray-300"} w-full`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Searches</h3>
              <div className="flex items-center gap-2">
                <button title="Clear recent" onClick={clearRecent} className={`text-xs px-2 py-1 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`}>
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {recent.length === 0 && <div className="text-xs text-gray-500">No recent searches</div>}
              {recent.map((r, idx) => (
                <button
                  key={`${r.passport}-${r.destination}-${idx}`}
                  onClick={() => {
                    setPassport(r.passport);
                    setDestination(r.destination);
                    setQuery({ passport: r.passport, destination: r.destination });
                    // optional: auto-check
                  }}
                  className={`px-3 py-1 rounded-full border text-xs ${isDarkMode ? "bg-transparent text-white border-pink-400" : "bg-white/80"}`}
                >
                  {r.passport} → {r.destination}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-white/6 border-white/10" : "bg-white/90 border-gray-300"} w-full`}>
              <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Saved Searches</h3>
              <div className="flex items-center gap-2">
                <button title="Clear saved" onClick={clearSaved} className={`text-xs px-2 py-1 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`}>
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {saved.length === 0 && <div className="text-xs text-gray-500">No saved searches</div>}
              {saved.map((r, idx) => (
                <div key={`${r.passport}-${r.destination}-${idx}`} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPassport(r.passport);
                      setDestination(r.destination);
                      setQuery({ passport: r.passport, destination: r.destination });
                    }}
                    className={`px-3 py-1 rounded-full border text-xs ${isDarkMode ? "bg-transparent text-white border-pink-400" : "bg-white/80"}`}
                  >
                    {r.passport} → {r.destination}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-6 rounded-2xl border transition-colors duration-300 shadow-md ${isDarkMode ? "bg-white/10  border-white/20" : "bg-white/90 border-pink-400"}`}
            >
              {/* skeleton */}
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-gray-300 rounded" />
                  <div className="h-20 bg-gray-300 rounded" />
                  <div className="h-20 bg-gray-300 rounded" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl border transition-colors duration-300 shadow-md ${isDarkMode ? "bg-white/10  border-white/20" : "bg-white/90 border-pink-400"}`}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      <span className="mr-2">{iso2ToFlagEmoji(result.passport.code)}</span>
                      {result.passport.name} → <span className="mx-2">{iso2ToFlagEmoji(result.destination.code)}</span>
                      {result.destination.name}
                    </h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      {dates.from && dates.to ? `Travel window: ${dates.from} → ${dates.to}` : "Travel window: not specified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${visaHint ? "bg-amber-600 text-white" : "bg-gray-300 text-gray-800"} z-4`}>
                      {visaHint || "Confirm with embassy"}
                    </span>
                    <button
                      onClick={() =>
                        saveSearch({
                          passport: result.passport.name,
                          destination: result.destination.name,
                          timestamp: Date.now(),
                        })
                      }
                      title="Save search"
                      className={`px-2 py-1 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`}
                    >
                      <FiSave />
                    </button>
                  </div>
                </div>

                {/* Details Cards */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-white/10 border-white/20" : "bg-white/70 border-gray-400"}`}>
                    <div className="text-sm mb-1 text-gray-700">Status</div>
                    <div className="font-semibold text-gray-900">{visaHint ? visaHint.split("•")[0] : "Check embassy/official source"}</div>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-white/10 border-white/20" : "bg-white/90 border-gray-400"}`}>
                    <div className="text-sm mb-1 text-gray-700">Currency</div>
                    <div className="font-medium text-gray-900">{currencyDisplay}</div>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-white/10 border-white/20" : "bg-white/90 border-gray-400"}`}>
                    <div className="text-sm mb-1 text-gray-700">Languages</div>
                    <div className="font-medium text-gray-900">{languageDisplay}</div>
                  </div>
                </div>

                {/* Advisory & Health */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border border-pink-400 ${isDarkMode ? "bg-white/10 " : "bg-white/90 "}`}>
                    <div className="font-semibold text-gray-900">Travel Advisory</div>
                    <div className="mt-2 text-sm text-gray-700">{advisory?.message || "Not available from advisory API."}</div>
                    <div className={`mt-2 text-xs font-medium italic ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}>{COMMON_TRAVEL_ADVISORY_NOTE}</div>
                  </div>
                  <div className={`p-4 rounded-2xl border border-pink-400 ${isDarkMode ? "bg-white/10" : "bg-white/90"}`}>
                    <div className="font-medium text-gray-900">Health & Vaccinations</div>
                    <div className={`mt-2 text-sm text-gray-700`}>
                      <div>
                        <strong>Recommended vaccines:</strong> {health?.vaccines?.length ? health.vaccines.join(", ") : "Not listed"}
                      </div>
                      <div className="mt-2 text-gray-700">
                        <strong>Water safety:</strong> {health?.water?.short || "Not listed"}
                      </div>
                    </div>
                    <div className={`mt-2 text-xs font-medium italic ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{COMMON_HEALTH_NOTE}</div>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="mt-5">
                  <div className="font-semibold text-gray-900">Required Documents</div>
                  <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
                    {(result.requiredDocuments && result.requiredDocuments.length ? result.requiredDocuments : ["Passport (valid 6+ months)", "Return ticket", "Proof of funds"]).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => downloadChecklist({ passport: result.passport.name, destination: result.destination.name, requiredDocuments: result.requiredDocuments })}
                      className={`px-3 py-2 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : "bg-white/80"}`}
                    >
                      <FiDownload className="inline-block mr-2" /> Download Checklist
                    </button>

                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(result.destination.name + " embassy " + result.passport.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      Official Embassy / Visa Portal
                    </a>
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-gray-700 italic">⚠️ Visa policies change frequently. Always verify with official government / embassy sources before travel.</p>
              </div>

              {/* Recommended Countries: simple heuristic */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-2xl border ${isDarkMode ? "bg-white/10 border-white/20" : "bg-white/90 border-pink-400"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Recommended (Visa-friendly) Destinations</h3>
                  <div className="text-sm text-gray-500">Based on passport selection</div>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {countries
                    .filter((c) => {
                      // simple heuristic: exclude origin, prefer same region or common visa-free with fewest restrictions (we don't have that data here)
                      if (!passport) return false;
                      if (c.name === passport) return false;
                      return c.region === countryByName(passport)?.region;
                    })
                    .slice(0, 8)
                    .map((c) => (
                      <div key={c.code} className="p-3 rounded-md border flex items-center gap-3">
                        <div className="text-2xl">{iso2ToFlagEmoji(c.code)}</div>
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-gray-600">Check requirements</div>
                        </div>
                        <div className="ml-auto">
                          <button
                            onClick={() => {
                              setDestination(c.name);
                              setQuery((q) => ({ ...q, destination: c.name }));
                              // auto trigger check optionally:
                              // onCheck();
                            }}
                            className={`px-2 py-1 rounded-md border text-xs ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  {(!passport || countries.filter((c) => c.region === countryByName(passport)?.region && c.name !== passport).length === 0) && (
                    <div className="col-span-full text-xs text-gray-500">No strong recommendations available. Try auto-detecting or selecting your passport country.</div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare Modal */}
        <AnimatePresence>
          {compareOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setCompareOpen(false)} />
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`relative max-w-3xl w-full p-6 rounded-2xl ${isDarkMode ? "bg-zinc-900 text-white" : "bg-white/95 text-gray-900"} shadow-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Compare Countries</h3>
                  <button onClick={() => setCompareOpen(false)} className={`px-2 py-1 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`}>Close</button>
                </div>

                <form onSubmit={onCompare} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-xs">Country A</label>
                    <select className={`w-full p-2 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`} value={comparePair.a} onChange={(e) => setComparePair((p) => ({ ...p, a: e.target.value }))}>
                      <option value="">Pick Country</option>
                      {countries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs">Country B</label>
                    <select className={`w-full p-2 rounded-md border ${isDarkMode ? "bg-transparent text-white border-pink-400" : ""}`} value={comparePair.b} onChange={(e) => setComparePair((p) => ({ ...p, b: e.target.value }))}>
                      <option value="">Pick Country</option>
                      {countries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <button type="submit" className="px-4 py-2 rounded-md bg-pink-500 text-white">Compare</button>
                  </div>
                </form>

                <div className="mt-4">
                  {loading && <div className="text-sm"><Spinner /> Fetching compare data...</div>}
                  {compareResult && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{iso2ToFlagEmoji(compareResult.a.iso)}</div>
                          <div>
                            <div className="font-semibold">{compareResult.a.name}</div>
                            <div className="text-xs text-gray-500">{Object.values(compareResult.a.rest?.languages || {}).slice(0, 3).join(", ")}</div>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <div><strong>Currency:</strong> {Object.keys(compareResult.a.rest?.currencies || {}).join(", ") || "—"}</div>
                        </div>
                      </div>

                      <div className="p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{iso2ToFlagEmoji(compareResult.b.iso)}</div>
                          <div>
                            <div className="font-semibold">{compareResult.b.name}</div>
                            <div className="text-xs text-gray-500">{Object.values(compareResult.b.rest?.languages || {}).slice(0, 3).join(", ")}</div>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <div><strong>Currency:</strong> {Object.keys(compareResult.b.rest?.currencies || {}).join(", ") || "—"}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help / Chat widget */}
        <div className="fixed right-6 bottom-6 z-50">
          <div className="relative">
            <button
              onClick={() => setHelpOpen((s) => !s)}
              aria-label="Help"
              title="Help & Chat"
              className="rounded-full p-4 shadow-lg bg-pink-500 text-white"
            >
              <FiHelpCircle className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {helpOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute right-0 bottom-16 w-80 rounded-xl ${isDarkMode ? "bg-zinc-900 text-white" : "bg-white/95 text-gray-900"} border shadow-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Visa Helper</div>
                    <button onClick={() => setHelpOpen(false)} className="text-xs px-2 py-1 border rounded">Close</button>
                  </div>
                  <div className="mt-3 text-sm">
                    <p>Need help checking visa requirements? Try these quick actions:</p>
                    <ul className="list-disc ml-5 mt-2 text-xs">
                      <li>Auto-detect passport using the Auto-detect button.</li>
                      <li>Type destination and pick from suggestions.</li>
                      <li>Click "Check Requirements" to fetch details and download a checklist.</li>
                    </ul>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => { autoDetectCountry(); }} className="px-3 py-1 rounded border text-xs">Auto-detect</button>
                      <button onClick={() => { setHelpOpen(false); window.open("https://www.travel-advisory.info/", "_blank"); }} className="px-3 py-1 rounded border text-xs">Advisory</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
