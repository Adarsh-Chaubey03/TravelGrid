import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { MdTravelExplore } from "react-icons/md";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const API_KEY =
  import.meta.env.VITE_OPENWEATHER_KEY ||
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  "";

async function geocodeCity(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Geocoding failed: ${res.status} ${res.statusText} ${txt}`);
  }
  const arr = await res.json();
  return arr?.[0] || null;
}

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `Weather fetch failed: ${res.status} ${res.statusText} ${txt}`
    );
  }
  return await res.json();
}

function buildPacking(weather) {
  const list = {
    Clothing: ["Socks", "T-shirts"],
    Footwear: ["Comfortable walking shoes"],
    Accessories: [],
    Toiletries: ["Toothbrush", "Toothpaste", "Deodorant"],
    Documents: ["ID/Passport", "Tickets/Bookings"],
    Gadgets: ["Phone", "Charger", "Power bank"],
    Health: ["Personal meds", "Band-aids", "Pain reliever"],
    Misc: ["Reusable water bottle", "Small daypack"],
  };

  const temp = weather?.main?.temp;
  const wMain = (weather?.weather?.[0]?.main || "").toLowerCase();
  const wDesc = weather?.weather?.[0]?.description || "";
  const humidity = weather?.main?.humidity ?? null;
  const wind = weather?.wind?.speed ?? null;

  if (typeof temp === "number") {
    if (temp <= 5) {
      list.Clothing.push(
        "Heavy jacket",
        "Thermal base layers",
        "Warm hat",
        "Gloves",
        "Scarf"
      );
      list.Footwear.push("Insulated boots", "Wool socks");
      list.Health.push("Lip balm", "Moisturizer");
    } else if (temp <= 15) {
      list.Clothing.push("Warm jacket", "Full-sleeve shirts");
      list.Footwear.push("Closed shoes");
      list.Health.push("Lip balm");
    } else if (temp <= 25) {
      list.Clothing.push("Light jacket", "Breathable shirts");
      list.Footwear.push("Sneakers");
    } else {
      list.Clothing.push(
        "Shorts",
        "Light cotton/linen",
        "Swimwear (if applicable)"
      );
      list.Footwear.push("Sandals/Flip-flops");
      list.Accessories.push("Sunglasses", "Sun hat/cap");
      list.Toiletries.push("High-SPF sunscreen", "After-sun lotion");
      if (humidity && humidity >= 70) list.Health.push("Insect repellent");
    }
  } else {
    list.Clothing.push("Layerable clothes");
  }

  if (wMain.includes("rain") || /rain|drizzle|thunder/i.test(wDesc)) {
    list.Accessories.push("Umbrella", "Compact raincoat");
    list.Footwear.push("Waterproof shoes");
    list.Misc.push("Zip-lock bags (electronics)");
  }
  if (wMain.includes("snow") || /snow/i.test(wDesc)) {
    list.Clothing.push("Snow jacket", "Snow pants");
    list.Footwear.push("Snow boots");
  }
  if (typeof wind === "number" && wind >= 9) {
    list.Accessories.push("Windbreaker");
  }

  Object.keys(list).forEach((k) => (list[k] = Array.from(new Set(list[k]))));
  return {
    temp,
    wMain: weather?.weather?.[0]?.main,
    wDesc,
    humidity,
    wind,
    list,
  };
}

function AddCustom({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add custom item"
        className="border px-2 py-1 rounded text-sm"
      />
      <button
        type="button"
        onClick={() => {
          const v = val.trim();
          if (v) onAdd(v);
          setVal("");
        }}
        className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
      >
        <FiPlus />
        Add
      </button>
    </div>
  );
}

export default function DestinationPacking() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState(null);
  const [packs, setPacks] = useState({});
  const [checked, setChecked] = useState({});
  const [custom, setCustom] = useState({});

  const storageKey = (placeName, country) =>
    `packing_${(placeName || "global").toLowerCase().replace(/\s+/g, "_")}_${(
      country || ""
    )
      .toLowerCase()
      .replace(/\s+/g, "_")}`;

  useEffect(() => {
    if (!meta) return;
    const raw = localStorage.getItem(storageKey(meta.name, meta.country));
    if (raw) {
      try {
        const { checked: ck = {}, custom: cu = {} } = JSON.parse(raw);
        setChecked(ck);
        setCustom(cu);
        return;
      } catch (e) {
        console.warn("Failed to parse saved packing data:", e);
      }
    }

    if (packs && Object.keys(packs).length) {
      const ck = {};
      Object.entries(packs).forEach(([cat, arr]) =>
        arr.forEach((it) => (ck[`${cat}|${it}`] = false))
      );
      setChecked(ck);
    } else {
      setChecked({});
    }
    setCustom({});
  }, [meta]);

  useEffect(() => {
    if (!meta) return;
    try {
      localStorage.setItem(
        storageKey(meta.name, meta.country),
        JSON.stringify({ checked, custom })
      );
    } catch (e) {
      console.warn("Failed to write packing data to localStorage:", e);
    }
  }, [checked, custom, meta]);

  async function handleGet() {
    try {
      setErr("");
      if (!API_KEY)
        throw new Error(
          "OpenWeather API key missing. Add VITE_OPENWEATHER_KEY to .env.local"
        );
      if (!city || !city.trim())
        throw new Error(
          "Please enter a city (you can add ',countryCode' for disambiguation, e.g. 'Paris,FR')"
        );

      setLoading(true);
      setPacks({});
      setChecked({});
      setCustom({});
      setMeta(null);

      const place = await geocodeCity(city.trim());
      if (!place)
        throw new Error(
          "City not found. Try adding a country code (e.g., 'Springfield,US') for better accuracy."
        );

      const weather = await fetchWeather(place.lat, place.lon);
      const built = buildPacking(weather);

      const ck = {};
      Object.entries(built.list).forEach(([cat, arr]) =>
        arr.forEach((it) => (ck[`${cat}|${it}`] = false))
      );

      setChecked(ck);
      setPacks(built.list);
      setMeta({
        name: place.name,
        country: place.country,
        temp: built.temp,
        desc: built.wDesc,
        humidity: built.humidity,
        wind: built.wind,
      });
    } catch (e) {
      console.error("DestinationPacking error:", e);
      setErr(e.message || "Something went wrong while fetching suggestions.");
    } finally {
      setLoading(false);
    }
  }

  function formatKey(cat, it) {
    return `${cat}|${it}`;
  }

  function toggle(cat, it) {
    const key = formatKey(cat, it);
    setChecked((p) => ({ ...p, [key]: !p[key] }));
  }

  function addCustom(cat, it) {
    const trimmed = it.trim();
    if (!trimmed) return;
    setCustom((p) => {
      const arr = p[cat] ? [...p[cat]] : [];
      if (!arr.includes(trimmed)) arr.push(trimmed);
      return { ...p, [cat]: arr };
    });
    setChecked((p) => ({ ...p, [formatKey(cat, trimmed)]: false }));
  }

  function removeCustom(cat, it) {
    setCustom((p) => {
      const arr = (p[cat] || []).filter((x) => x !== it);
      const next = { ...p, [cat]: arr };
      if (next[cat].length === 0) delete next[cat];
      return next;
    });
    setChecked((p) => {
      const cp = { ...p };
      delete cp[formatKey(cat, it)];
      return cp;
    });
  }

  function exportTxt() {
    if (!meta) return;
    let out = `Packing Checklist — ${meta.name}, ${meta.country}\n`;
    out += `Weather: ${meta.desc} • ${meta.temp}°C • Humidity ${
      meta.humidity ?? "?"
    }% • Wind ${meta.wind ?? "?"} m/s\n\n`;
    Object.keys(packs).forEach((cat) => {
      out += `== ${cat} ==\n`;
      packs[cat].forEach((it) => {
        const key = formatKey(cat, it);
        out += `${checked[key] ? "[x]" : "[ ]"} ${it}\n`;
      });
      (custom[cat] || []).forEach((it) => {
        const key = formatKey(cat, it);
        out += `${checked[key] ? "[x]" : "[ ]"} ${it} (custom)\n`;
      });
      out += "\n";
    });
    const blob = new Blob([out], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meta.name.replace(/\s+/g, "_")}-packing.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    if (!meta) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Packing — ${meta.name}, ${meta.country}`, 10, 10);
    doc.setFontSize(11);
    doc.text(
      `Weather: ${meta.desc} • ${meta.temp}°C • Humidity ${
        meta.humidity ?? "?"
      }% • Wind ${meta.wind ?? "?"} m/s`,
      10,
      18
    );

    let y = 28;
    Object.keys(packs).forEach((cat) => {
      doc.setFont(undefined, "bold");
      doc.text(cat, 10, y);
      y += 6;
      doc.setFont(undefined, "normal");
      packs[cat].forEach((it) => {
        const mark = checked[formatKey(cat, it)] ? "☑" : "☐";
        doc.text(`${mark} ${it}`, 12, y);
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });
      (custom[cat] || []).forEach((it) => {
        const mark = checked[formatKey(cat, it)] ? "☑" : "☐";
        doc.text(`${mark} ${it} (custom)`, 12, y);
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });
      y += 2;
      if (y > 285) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save(`${meta.name.replace(/\s+/g, "_")}-packing.pdf`);
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6">
  <div className="relative rounded-3xl shadow-2xl overflow-hidden"
       style={{
         background: "var(--card-bg)",
         border: "1px solid var(--card-border)",
         boxShadow: "0 10px 25px var(--shadow-primary)"
       }}>
    
    {/* Gradient Header Bar */}
    <div className="absolute top-0 left-0 w-full h-2" 
         style={{ background: "var(--gradient-primary)" }}></div>

    {/* Main Content */}
    <div className="p-6 space-y-6 text-[var(--text-primary)]">

      {/* Header */}
      <header className="flex items-center justify-center gap-3 mb-4">
  <MdTravelExplore className="text-3xl text-[var(--accent-primary)] drop-shadow" />
  <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--button-hover)] bg-clip-text text-transparent">
    Destination-Specific Packing
  </h1>
</header>


      {/* Input + Button */}
      <div className="flex gap-2 mb-4">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., Goa or 'Paris,FR')"
          className="flex-1 px-4 py-2 rounded-xl outline-none"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--input-border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--input-focus)"}
          onBlur={(e) => e.target.style.borderColor = "var(--input-border)"}
        />
        <button
          type="button"
          onClick={handleGet}
          disabled={loading}
          className="px-5 py-2 rounded-xl font-medium text-white shadow transition-all"
          style={{
            background: "var(--button-primary)",
            color: "var(--text-primary)"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "var(--button-hover)"}
          onMouseOut={(e) => e.currentTarget.style.background = "var(--button-primary)"}
        >
          {loading ? "Fetching..." : "Get Suggestions"}
        </button>
      </div>

      {/* Error */}
      {err && <div style={{ color: "var(--error-color)", fontWeight: "500" }}>{err}</div>}

      {/* Meta Info */}
      {meta && (
        <div className="p-3 rounded-lg shadow-sm"
             style={{ background: "var(--card-bg)", color: "var(--text-secondary)" }}>
          <div>
            <strong style={{ color: "var(--accent-primary)" }}>Location:</strong>{" "}
            {meta.name}, {meta.country}
          </div>
          <div>
            <strong style={{ color: "var(--accent-primary)" }}>Weather:</strong>{" "}
            {meta.desc} • {meta.temp}°C • Humidity {meta.humidity ?? "?"}% •
            Wind {meta.wind ?? "?"} m/s
          </div>
        </div>
      )}

      {/* Packing List */}
      {Object.keys(packs).length > 0 ? (
        <>
          {/* Export Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportTxt}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                border: "1px solid var(--input-border)",
                color: "var(--accent-primary)",
                background: "var(--card-bg)"
              }}
            >
              Export .txt
            </button>
            <button
              onClick={exportPdf}
              className="px-4 py-2 rounded-lg text-sm font-medium shadow transition-all"
              style={{ background: "var(--gradient-primary)", color: "var(--text-primary)" }}
            >
              Export PDF
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-5 mt-4">
            {Object.keys(packs).map((cat) => (
              <div key={cat} className="rounded-xl p-4 shadow-md"
                   style={{
                     background: "var(--card-bg)",
                     border: "1px solid var(--card-border)"
                   }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ color: "var(--accent-primary)", fontWeight: "600" }}>{cat}</h3>
                  <AddCustom onAdd={(txt) => addCustom(cat, txt)} />
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {packs[cat].map((it) => {
                    const key = formatKey(cat, it);
                    const isChecked = !!checked[key];
                    return (
                      <li key={key} className="flex items-center gap-2 px-2 py-1 rounded transition"
                          style={{ backgroundColor: isChecked ? "var(--bg-tertiary)" : "transparent" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(cat, it)}
                          className="accent-[var(--accent-primary)]"
                        />
                        <span style={{
                          textDecoration: isChecked ? "line-through" : "none",
                          color: isChecked ? "var(--text-muted)" : "var(--text-primary)"
                        }}>
                          {it}
                        </span>
                      </li>
                    );
                  })}
                  {(custom[cat] || []).map((it) => {
                    const key = formatKey(cat, it);
                    const isChecked = !!checked[key];
                    return (
                      <li key={key} className="flex items-center gap-2 px-2 py-1 rounded transition">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(cat, it)}
                          className="accent-[var(--accent-secondary)]"
                        />
                        <span style={{
                          textDecoration: isChecked ? "line-through" : "none",
                          color: isChecked ? "var(--text-muted)" : "var(--text-primary)"
                        }}>
                          {it} <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>(custom)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCustom(cat, it)}
                          style={{ marginLeft: "auto", color: "var(--error-color)" }}
                          title="Remove"
                        >
                          <FiTrash2 />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "1.5rem" }}>
          Enter a city and click{" "}
          <span style={{ fontWeight: "600", color: "var(--accent-primary)" }}>
            “Get Suggestions”
          </span>.
        </div>
      )}
    </div>
  </div>
</div>

  );
}
