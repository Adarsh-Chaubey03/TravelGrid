// src/data/visaData.js

// Basic mapping to help normalize common names -> ISO Alpha-2
export const NAME_TO_ISO2 = {
  India: "IN",
  "United States": "US",
  USA: "US",
  "United Kingdom": "GB",
  UK: "GB",
  Germany: "DE",
  France: "FR",
  Spain: "ES",
  Italy: "IT",
  Canada: "CA",
  Australia: "AU",
  Japan: "JP",
  Thailand: "TH",
  Singapore: "SG",
  Nepal: "NP",
  "United Arab Emirates": "AE",
  UAE: "AE",
  Brazil: "BR",
  "South Africa": "ZA",
  Turkey: "TR",
  Qatar: "QA",
  Indonesia: "ID",
  Malaysia: "MY",
  "Sri Lanka": "LK",
  "New Zealand": "NZ",
  Mexico: "MX",
  "Saudi Arabia": "SA",
};

// Legend for status
// - visa_free: No visa needed for short stays (see maxStayDays)
// - visa_on_arrival: Visa issued at border
// - evisa: Apply online before travel
// - visa_required: Must get visa from embassy/consulate
// - eta: Electronic Travel Authorization
export const VISA_STATUS = {
  visa_free: "Visa-free",
  visa_on_arrival: "Visa on arrival",
  evisa: "eVisa required",
  eta: "eTA required",
  visa_required: "Visa required",
  unknown: "Unknown (verify with official sources)",
};

// Minimal demo dataset. Expand as you like.
// Structure: RULES[passportISO2][destinationISO2] = { status, maxStayDays?, notes? }
export const RULES = {
  IN: {
    NP: { status: "visa_free", maxStayDays: 0, notes: ["Indians do not need a visa for Nepal."] },
    TH: { status: "evisa", maxStayDays: 30, notes: ["Apply online (Thailand eVisa)."] },
    SG: { status: "visa_required", notes: ["Apply prior to travel via authorized channel."] },
    AE: { status: "evisa", maxStayDays: 30, notes: ["Pre-arranged visa / eVisa often required."] },
    MY: { status: "evisa", maxStayDays: 30, notes: ["eVisa or eNTRI (as applicable)."] },
    LK: { status: "evisa", maxStayDays: 30, notes: ["ETA required prior to travel."] },
    ID: { status: "visa_on_arrival", maxStayDays: 30, notes: ["VOA available at major airports."] },
    TR: { status: "evisa", maxStayDays: 30, notes: ["eVisa prior to arrival."] },
    GB: { status: "visa_required", notes: ["Standard Visitor Visa required."] },
    US: { status: "visa_required", notes: ["B1/B2 visa required."] },
    DE: { status: "visa_required", notes: ["Schengen visa required."] },
    FR: { status: "visa_required", notes: ["Schengen visa required."] },
    IT: { status: "visa_required", notes: ["Schengen visa required."] },
  },

  US: {
    GB: { status: "visa_free", maxStayDays: 180, notes: ["Visa-free entry for tourism (short stays)."] },
    DE: { status: "visa_free", maxStayDays: 90, notes: ["90/180 rule (Schengen)."] },
    FR: { status: "visa_free", maxStayDays: 90, notes: ["90/180 rule (Schengen)."] },
    IT: { status: "visa_free", maxStayDays: 90 },
    JP: { status: "visa_free", maxStayDays: 90 },
    TH: { status: "visa_free", maxStayDays: 30 },
    SG: { status: "visa_free", maxStayDays: 90 },
    AE: { status: "visa_on_arrival", maxStayDays: 30 },
    BR: { status: "visa_required", notes: ["Check current policy; varies over time."] },
    IN: { status: "visa_required" },
  },

  GB: {
    US: { status: "visa_free", maxStayDays: 90, notes: ["ESTA may be required (Visa Waiver Program)."] },
    DE: { status: "visa_free", maxStayDays: 90 },
    FR: { status: "visa_free", maxStayDays: 90 },
    TH: { status: "visa_free", maxStayDays: 30 },
    SG: { status: "visa_free", maxStayDays: 90 },
    AE: { status: "visa_on_arrival", maxStayDays: 30 },
    IN: { status: "visa_required" },
  },

  DE: {
    FR: { status: "visa_free", maxStayDays: 90 },
    IT: { status: "visa_free", maxStayDays: 90 },
    ES: { status: "visa_free", maxStayDays: 90 },
    US: { status: "visa_free", maxStayDays: 90 },
    GB: { status: "visa_free", maxStayDays: 180 },
    TH: { status: "visa_free", maxStayDays: 30 },
    IN: { status: "visa_required" },
  },

  JP: {
    US: { status: "visa_free", maxStayDays: 90 },
    GB: { status: "visa_free", maxStayDays: 90 },
    TH: { status: "visa_free", maxStayDays: 30 },
    IN: { status: "visa_required" },
  },

  CA: {
    US: { status: "visa_free", maxStayDays: 180 },
    GB: { status: "visa_free", maxStayDays: 180 },
    DE: { status: "visa_free", maxStayDays: 90 },
    FR: { status: "visa_free", maxStayDays: 90 },
    IN: { status: "visa_required" },
  },

  AU: {
    GB: { status: "visa_free", maxStayDays: 180 },
    US: { status: "visa_free", maxStayDays: 90 },
    JP: { status: "visa_free", maxStayDays: 90 },
    IN: { status: "visa_required" },
  },
};

// Generic documents advice by status (used if the rule doesn’t include custom notes)
export const GENERIC_DOCS = {
  visa_free: [
    "Passport valid for at least 6 months",
    "Return/onward ticket",
    "Proof of accommodation / funds",
    "Travel insurance (recommended)",
  ],
  visa_on_arrival: [
    "Passport valid for at least 6 months",
    "Onward/return ticket",
    "Visa fee (cash/credit per country)",
    "Hotel booking / proof of funds",
  ],
  evisa: [
    "Approved eVisa document",
    "Passport valid for at least 6 months",
    "Onward/return ticket",
    "Hotel booking / proof of funds",
  ],
  eta: [
    "Approved eTA",
    "Passport valid for at least 6 months",
    "Onward/return ticket",
  ],
  visa_required: [
    "Embassy/consulate-issued visa",
    "Passport valid for at least 6 months",
    "Completed application & photos",
    "Financial proof and itinerary",
  ],
};
