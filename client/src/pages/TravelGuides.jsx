// client/src/pages/TravelGuides.jsx
import { Card, CardContent } from "../components/ui/card";

const guides = [
  {
    city: "Jaipur",
    state: "Rajasthan",
    description: "The Pink City, famous for forts and palaces.",
    topThings: [
      "Visit Amer Fort",
      "Explore City Palace",
      "See Hawa Mahal",
      "Shop at Johari Bazaar",
      "Try Rajasthani cuisine"
    ]
  },
  {
    city: "Goa",
    state: "Goa",
    description: "Beach paradise with vibrant nightlife.",
    topThings: [
      "Relax at Baga Beach",
      "Party at Tito’s",
      "Water sports at Calangute",
      "Visit Aguada Fort",
      "Enjoy Goan seafood"
    ]
  },
  {
    city: "Manali",
    state: "Himachal Pradesh",
    description: "A hill station surrounded by snow-capped mountains.",
    topThings: [
      "Visit Solang Valley",
      "Explore Rohtang Pass",
      "Shop at Mall Road",
      "Try river rafting",
      "Relax in hot springs"
    ]
  },
  {
    city: "Munnar",
    state: "Kerala",
    description: "Scenic hill town with tea plantations and waterfalls.",
    topThings: [
      "Tour tea gardens",
      "Visit Eravikulam National Park",
      "See Attukal Waterfalls",
      "Take a spice plantation tour",
      "Enjoy Kerala cuisine"
    ]
  }
];

export default function TravelGuides() {
  return (
    <main className="content-below-navbar px-6 py-10 bg-[var(--bg-secondary)] min-h-screen">
      {/* Page Heading */}
      <h1 className="text-4xl font-bold gradient-text text-center mb-10">
        Travel Guides
      </h1>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide, idx) => (
          <Card
            key={idx}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-md hover-lift theme-transition"
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                {guide.city}, {guide.state}
              </h2>
              <p className="text-[var(--text-secondary)] mb-4">
                {guide.description}
              </p>
              <h3 className="text-lg font-medium text-[var(--accent-primary)] mb-2">
                Top 5 Things to Do:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-[var(--text-primary)]">
                {guide.topThings.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
