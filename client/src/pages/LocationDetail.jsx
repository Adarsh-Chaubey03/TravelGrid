import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Add this import
import {   MapPin, Star, Calendar, Info, Sparkles } from 'lucide-react';
import Navbar from '../components/Custom/Navbar';

const LocationDetail = () => { // Remove locationId prop, we'll get it from URL
  const { locationId } = useParams(); // Get locationId from URL parameters
  const [location, setLocation] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  const [expandDesc,setExpandDesc]=useState(false)

  // Comprehensive location data with natural descriptions
  const locationData = {
    1: {
      id: 1,
      name: "Santorini, Greece",
      country: "Greece",
      region: "Cyclades Islands",
      rating: 4.8,
      reviewCount: 12847,
      priceRange: "$$",
      bestTime: "April - October",
      shortDescription: "A volcanic island paradise famous for its dramatic clifftop villages, stunning sunsets, and distinctive blue-domed churches.",
      image: "https://images.unsplash.com/photo-1673137175648-889d7d236ba6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      overview: {
        description: "Santorini is a crescent-shaped volcanic island in the southern Aegean Sea, about 200 kilometers southeast of mainland Greece. The island was shaped by one of the largest volcanic eruptions in recorded history, which occurred around 3,600 years ago. This dramatic geological event created the island's iconic caldera - a large volcanic crater filled with brilliant blue water that serves as the backdrop for the famous clifftop towns.",
        geography: "The island covers approximately 76 square kilometers and is characterized by dramatic cliffs that rise up to 400 meters above sea level. The western coast features the famous caldera cliffs with their black, red, and white volcanic rock layers, while the eastern coast has beautiful beaches with unique colored sands - red, black, and white - all created by the volcanic activity.",
        culture: "Santorini has been inhabited for over 4,000 years, with evidence of the ancient Minoan civilization found at the archaeological site of Akrotiri. The island's architecture is distinctly Cycladic, featuring cubic white-washed buildings with blue-domed churches, narrow cobblestone streets, and traditional cave houses called 'hyposkapha' carved directly into the volcanic rock.",
        highlights: [
          "The village of Oia offers the world's most photographed sunset views",
          "Fira, the capital, perches dramatically on the caldera rim 260 meters above sea level",
          "The Red Beach gets its striking color from red volcanic pebbles and sand",
          "Ancient Akrotiri preserves a 3,600-year-old Minoan settlement",
          "Local wineries produce unique wines from grapes grown in volcanic soil",
          "The island's distinctive architecture creates a postcard-perfect landscape"
        ]
      },
    },
    2: {
      id: 2,
      name: "Kyoto, Japan",
      country: "Japan",
      region: "Kansai",
      rating: 4.9,
      reviewCount: 18732,
      priceRange: "$",
      bestTime: "March - May, September - November",
      shortDescription: "Japan's former imperial capital, home to over 2,000 temples and shrines, traditional wooden houses, and perfectly manicured gardens.",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      overview: {
        description: "Kyoto served as Japan's imperial capital for over 1,000 years (794-1868) and remains the heart of traditional Japanese culture. The city is home to 17 UNESCO World Heritage Sites, including some of Japan's most iconic temples and gardens. Despite being a modern city of 1.5 million people, Kyoto has carefully preserved its historical districts and traditional way of life.",
        geography: "Kyoto sits in a valley surrounded by mountains on three sides, with the Kamo and Katsura rivers flowing through the city. The city is organized in a grid pattern originally based on the ancient Chinese capital of Chang'an. The eastern mountains (Higashiyama) and western mountains (Nishiyama) provide a beautiful backdrop and are home to many of the city's most famous temples.",
        culture: "Kyoto is the birthplace of many Japanese cultural traditions including the tea ceremony, flower arrangement (ikebana), Noh theater, and geisha culture. The city's Gion district is famous for its traditional wooden machiya (townhouses) and ochaya (tea houses) where geishas still entertain guests. The city is also renowned for its traditional crafts including Kiyomizu pottery, Nishijin textiles, and lacquerware.",
        highlights: [
          "Kinkaku-ji (Golden Pavilion) is covered in gold leaf and reflects perfectly in its surrounding pond",
          "Fushimi Inari Shrine features thousands of bright orange torii gates winding up the mountainside",
          "The Arashiyama Bamboo Grove creates a magical green tunnel of towering bamboo stalks",
          "Gion district preserves traditional architecture and geisha culture",
          "Kiyomizu-dera temple offers panoramic views over the city from its wooden stage",
          "The Philosopher's Path winds along a canal lined with hundreds of cherry trees"
        ]
      }
    },
    3: {
        id: 3,
        name: "Banff National Park",
        country: "Canada",
        region: "Alberta",
        rating: 4.7,
        reviewCount: 4200000,
        priceRange: "$",
        bestTime: "June - September",
        shortDescription: "Canada's first national park, featuring pristine mountain lakes, glacial peaks, and abundant wildlife in the heart of the Canadian Rockies.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        overview: {
        description: "Established in 1885, Banff National Park is Canada's oldest national park and a UNESCO World Heritage Site. Located in the Canadian Rockies, the park covers 6,641 square kilometers of mountainous terrain with numerous glaciers, dense coniferous forest, alpine landscapes, and pristine wilderness. The park attracts over 4 million visitors annually who come to experience its stunning natural beauty and outdoor recreation opportunities.",
        geography: "Banff National Park is situated in the Rocky Mountains of Alberta, bordering British Columbia. The park features over 1,000 glaciers, including the Columbia Icefield, and is home to iconic peaks like Mount Assiniboine. The Continental Divide runs through the park, with major river systems including the Bow and Saskatchewan rivers. Lake Louise and Moraine Lake are among the most photographed lakes in the world.",
        culture: "The park is located on traditional territories of the Stoney Nakoda, Blackfoot, and Tsuut'ina peoples. The town of Banff serves as the park's cultural hub, offering mountain culture experiences, local art galleries, and the famous Banff Centre for Arts and Creativity. The area celebrates its mountaineering heritage and connection to the Canadian Pacific Railway's role in opening the region to tourism.",
        highlights: [
            "Lake Louise features turquoise waters surrounded by snow-capped peaks and the elegant Fairmont Chateau Lake Louise",
            "Moraine Lake in the Valley of the Ten Peaks offers one of Canada's most iconic mountain vistas",
            "Icefields Parkway is considered one of the world's most scenic drives through the heart of the Rockies",
            "Johnston Canyon features suspended walkways leading to spectacular frozen waterfalls in winter",
            "Abundant wildlife including grizzly bears, black bears, elk, bighorn sheep, and mountain goats",
            "World-class skiing at three major resorts: Lake Louise, Sunshine Village, and Mount Norquay"
        ]
        }
    },
    4: {
        id: 4,
        name: "Dubai",
        country: "United Arab Emirates",
        region: "Middle East",
        rating: 4.6,
        reviewCount: 3200,
        priceRange: "$$",
        bestTime: "November - March",
        shortDescription: "A futuristic metropolis in the desert, known for luxury shopping, ultramodern architecture, and world-class entertainment.",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        overview: {
        description: "Dubai has transformed from a modest fishing village to one of the world's most dynamic cities in just a few decades. This emirate in the UAE is renowned for its ambitious architecture, luxury lifestyle, and position as a global business hub. With over 16.7 million visitors annually, Dubai offers a unique blend of traditional Arabian culture and cutting-edge modernity, making it a top destination for luxury travelers and business professionals alike.",
        geography: "Located on the southeast coast of the Persian Gulf, Dubai sits on the Arabian Peninsula's eastern coast. The city is built along Dubai Creek, which divides it into two main sections: Deira and Bur Dubai. The emirate features a mix of coastal areas, desert landscapes, and man-made islands including the famous Palm Jumeirah. The city experiences a hot desert climate with mild winters making it ideal for tourism.",
        culture: "Dubai is a cosmopolitan city where over 85% of residents are expatriates from around the world. While Arabic is the official language, English is widely spoken. The city successfully balances its Islamic heritage with international influences, evident in its architecture, cuisine, and lifestyle. Traditional souks coexist with ultra-modern shopping malls, and ancient customs blend with contemporary luxury.",
        highlights: [
            "Burj Khalifa stands as the world's tallest building at 828 meters with observation decks offering panoramic city views",
            "Dubai Mall features over 1,200 shops, an aquarium, ice rink, and the famous Dubai Fountain show",
            "Palm Jumeirah is an artificial archipelago shaped like a palm tree, home to luxury resorts and residences",
            "Dubai Marina showcases impressive skyscrapers surrounding a man-made canal city",
            "Gold and Spice Souks in old Dubai offer traditional shopping experiences with authentic Arabian atmosphere",
            "Desert safari experiences include dune bashing, camel riding, and traditional Bedouin-style dinners"
        ]
        }
    },
    5: {
        id: 5,
        name: "Tulum",
        country: "Mexico",
        region: "Quintana Roo",
        rating: 4.5,
        reviewCount: 670,
        priceRange: "$$",
        bestTime: "December - April",
        shortDescription: "A bohemian beach town featuring spectacular Mayan ruins perched on cliffs overlooking the Caribbean Sea and mystical cenotes.",
        image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        overview: {
        description: "Tulum has evolved from a sleepy fishing village to one of Mexico's most sought-after destinations, attracting around 800,000 visitors annually. This coastal town on the Yucatan Peninsula offers a perfect blend of ancient Mayan history, pristine beaches, and eco-conscious luxury. The town is famous for its clifftop archaeological site, cenotes (natural swimming holes), and bohemian atmosphere that attracts yoga enthusiasts, digital nomads, and luxury travelers seeking an authentic Mexican Caribbean experience.",
        geography: "Located on the Caribbean coast of Mexico's Yucatan Peninsula, Tulum sits about 130 kilometers south of Cancun. The area features a unique landscape of white sand beaches, turquoise waters, dense jungle, and limestone cenotes. The Mesoamerican Reef System, the second-largest coral reef in the world, lies just offshore, making it excellent for snorkeling and diving.",
        culture: "Tulum embodies a unique blend of ancient Mayan heritage and modern bohemian culture. The area was once an important Mayan trading post, and this rich history is preserved in the archaeological sites. Today's Tulum culture emphasizes sustainability, wellness, and connection with nature. The town is known for its eco-friendly resorts, organic restaurants, yoga retreats, and artistic community that values environmental consciousness.",
        highlights: [
            "Tulum Archaeological Site features Mayan ruins dramatically positioned on 12-meter cliffs overlooking the Caribbean Sea",
            "Gran Cenote and Dos Ojos offer crystal-clear freshwater swimming and world-class cave diving experiences",
            "Tulum Beach stretches for miles with powdery white sand and bohemian beach clubs",
            "Sian Ka'an Biosphere Reserve protects diverse ecosystems including tropical forests, mangroves, and coral reefs",
            "Coba Archaeological Site features the tallest pyramid in the Yucatan Peninsula that visitors can still climb",
            "Vibrant wellness scene with numerous yoga studios, spa retreats, and organic restaurants focusing on healthy living"
        ]
        }
    },
    6: {
        id: 6,
        name: "Reykjavik",
        country: "Iceland",
        region: "Capital Region",
        rating: 4.8,
        reviewCount: 540,
        priceRange: "$$",
        bestTime: "June - August, September - March",
        shortDescription: "The world's northernmost capital, gateway to Iceland's natural wonders including Northern Lights, geothermal pools, and dramatic landscapes.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "Reykjavik, home to about 130,000 people, serves as Iceland's cultural and economic center while maintaining a charming small-town feel. This northernmost capital in the world attracts 1.2 million visitors annually who use it as a base to explore Iceland's incredible natural phenomena. The city perfectly balances modern Scandinavian design with a rich Viking heritage, offering world-class museums, vibrant nightlife, and easy access to some of the planet's most spectacular natural wonders.",
        geography: "Reykjavik sits on the southwestern coast of Iceland on the shores of Faxaflói Bay. The city is built on a peninsula and is surrounded by mountains, including Mount Esja to the north. The area sits on the Mid-Atlantic Ridge, resulting in significant geothermal activity that powers much of the city. The location at 64°N latitude means extreme seasonal variation in daylight hours.",
        culture: "Icelandic culture in Reykjavik blends ancient Nordic traditions with modern progressive values. The city is renowned for its literary heritage (Iceland publishes more books per capita than any other country), vibrant music scene (home to Björk and Sigur Rós), and strong emphasis on environmental sustainability. The concept of 'þetta reddast' (it will all work out) reflects the resilient, optimistic Icelandic spirit.",
        highlights: [
            "Northern Lights (Aurora Borealis) are visible from the city during winter months from September to March",
            "Blue Lagoon geothermal spa offers milky blue waters rich in silica and minerals just 40 minutes from the city",
            "Hallgrímskirkja church dominates the skyline with its unique architecture inspired by Iceland's basalt columns",
            "Golden Circle tour includes Þingvellir National Park, Geysir hot springs, and Gullfoss waterfall",
            "Harpa Concert Hall showcases stunning modern architecture and hosts world-class performances",
            "Vibrant nightlife scene with numerous bars, clubs, and live music venues concentrated in the compact city center"
        ]
        }
    },
    7: {
        id: 7,
        name: "Maldives",
        country: "Maldives",
        region: "Indian Ocean",
        rating: 4.9,
        reviewCount: 980,
        priceRange: "$$",
        bestTime: "November - April",
        shortDescription: "A tropical paradise of 1,192 coral islands featuring overwater villas, crystal-clear lagoons, and world-class diving in the Indian Ocean.",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "The Maldives consists of 1,192 coral islands grouped into 26 atolls, stretching across 871 kilometers in the Indian Ocean. Only about 200 islands are inhabited, with approximately 100 developed as tourist resorts. This island nation attracts 1.7 million visitors annually seeking the ultimate tropical luxury experience. Known for having the lowest natural point of any country (just 1.5 meters above sea level), the Maldives offers unparalleled beauty with crystal-clear waters, pristine beaches, and some of the world's best marine life.",
        geography: "Located southwest of Sri Lanka and India, the Maldives sits astride the equator in the Indian Ocean. The islands are built on a foundation of coral reefs and feature white sand beaches, turquoise lagoons, and house reefs perfect for snorkeling. The country is entirely composed of low-lying islands, with the highest point being only 2.4 meters above sea level, making it particularly vulnerable to climate change and sea level rise.",
        culture: "Maldivian culture reflects influences from various cultures including Indian, Sri Lankan, Arab, and African traditions due to its position on ancient maritime trade routes. Islam is the state religion, introduced in 1153 AD. Traditional music, dance, and crafts like lacquerwork and mat weaving are still practiced. The concept of 'resort islands' separate from local communities helps preserve traditional Maldivian culture while providing world-class tourism experiences.",
        highlights: [
            "Overwater villas pioneered in the Maldives offer direct lagoon access and unparalleled privacy and luxury",
            "Crystal-clear waters with visibility up to 50 meters provide exceptional snorkeling and diving opportunities",
            "Pristine coral reefs home to manta rays, whale sharks, sea turtles, and thousands of tropical fish species",
            "Private island resorts offering ultimate exclusivity with some featuring only 20-50 villas per island",
            "World-class spa treatments often featuring traditional Maldivian techniques in overwater spa pavilions",
            "Sunset dolphin cruises and romantic sandbank picnics create unforgettable romantic experiences"
        ]
        }
    },
    8: {
        id: 8,
        name: "Machu Picchu",
        country: "Peru",
        region: "Cusco",
        rating: 4.8,
        reviewCount: 1150,
        priceRange: "$",
        bestTime: "May - September",
        shortDescription: "The legendary 'Lost City of the Incas' perched high in the Andes Mountains, offering spectacular ancient ruins and mountain hiking.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "Machu Picchu, built around 1450 CE and abandoned during the Spanish conquest, remained hidden until American historian Hiram Bingham brought it to international attention in 1911. This UNESCO World Heritage Site sits at 2,430 meters above sea level and attracts approximately 1.5 million visitors annually. The citadel represents one of the most important archaeological sites in South America and showcases the remarkable architectural and engineering achievements of the Inca civilization.",
        geography: "Located in the Eastern Cordillera of southern Peru, Machu Picchu sits on a mountain ridge above the Sacred Valley, approximately 80 kilometers northwest of Cusco. The site is surrounded by the Amazon rainforest and features dramatic mountain peaks including Huayna Picchu and Machu Picchu mountain. The Urubamba River flows around the base of the mountain, creating a natural moat around the ancient citadel.",
        culture: "Machu Picchu reflects the advanced Inca civilization's understanding of astronomy, agriculture, and architecture. The site likely served as a royal estate and sacred center, with structures aligned to astronomical events. Modern Quechua-speaking descendants of the Incas still live in the region, maintaining traditional practices and serving as guides and porters. The site represents the deep spiritual connection between Andean peoples and their mountain environment, known as 'Apus' (mountain spirits).",
        highlights: [
            "Ancient Inca ruins featuring precision stone construction without mortar, withstanding centuries of earthquakes",
            "Classic Inca Trail trek offers a 4-day hiking experience through diverse ecosystems and archaeological sites",
            "Huayna Picchu provides a challenging climb with spectacular bird's-eye views of the entire citadel",
            "Temple of the Sun demonstrates sophisticated Inca astronomical knowledge and religious practices",
            "Agricultural terraces showcase Inca engineering prowess and sustainable farming techniques",
            "Sacred Valley exploration includes additional Inca sites, traditional markets, and authentic Andean culture"
        ]
        }
    },
    9: {
        id: 9,
        name: "Bali",
        country: "Indonesia",
        region: "Southeast Asia",
        rating: 4.6,
        reviewCount: 2800,
        priceRange: "$",
        bestTime: "April - October",
        shortDescription: "The 'Island of the Gods' featuring emerald rice terraces, ancient Hindu temples, volcanic landscapes, and vibrant cultural traditions.",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "Bali, known as the 'Island of the Gods,' is Indonesia's most famous destination, attracting 6.3 million visitors annually. This tropical paradise seamlessly blends ancient Hindu traditions with stunning natural beauty, creating a unique cultural landscape found nowhere else in the world. From the artistic hub of Ubud to the beach resorts of Seminyak and the dramatic volcanic landscapes of Mount Batur, Bali offers diverse experiences within a relatively small island of just 5,780 square kilometers.",
        geography: "Bali is located between Java and Lombok in the Indonesian archipelago, sitting just 8 degrees south of the equator. The island features a dramatic landscape of volcanic mountains, including the active Mount Batur and the sacred Mount Agung, alongside pristine beaches, dense tropical forests, and the famous subak irrigation system creating the iconic terraced rice fields. The Wallace Line runs through the Lombok Strait east of Bali, marking the boundary between Asian and Australian flora and fauna.",
        culture: "Bali is unique in Indonesia as the only province with a Hindu majority (about 87% of the population practices Balinese Hinduism). This creates a rich cultural tapestry of daily temple ceremonies, elaborate festivals like Nyepi (Day of Silence), traditional dance performances, and intricate art forms including wood carving, silver jewelry, and batik textiles. The Balinese philosophy of Tri Hita Karana emphasizes harmony between humans, nature, and the divine, reflected in every aspect of daily life.",
        highlights: [
            "Tegallalang Rice Terraces offer Instagram-worthy emerald landscapes showcasing traditional Balinese irrigation",
            "Ancient Hindu temples including Tanah Lot, Uluwatu, and Besakih showcase classical Balinese architecture",
            "Ubud serves as the cultural heart with art galleries, yoga retreats, monkey forest sanctuary, and traditional markets",
            "Mount Batur sunrise trekking provides spectacular volcanic crater views and natural hot springs",
            "Traditional Kecak fire dance and Legong performances demonstrate centuries-old Balinese artistic traditions",
            "Seminyak and Canggu beaches offer world-class surfing, beach clubs, and stunning sunset views"
        ]
        }
    },
    10: {
        id: 10,
        name: "Swiss Alps",
        country: "Switzerland",
        region: "Central Europe",
        rating: 4.9,
        reviewCount: 750,
        priceRange: "$$",
        bestTime: "June - September, December - March",
        shortDescription: "Majestic mountain peaks, pristine alpine lakes, world-renowned skiing resorts, and charming villages in the heart of Europe.",
        image: "https://images.unsplash.com/photo-1551524164-6cf2ac925319?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "The Swiss Alps cover approximately 65% of Switzerland's total area and attract 3.1 million visitors annually seeking both summer and winter mountain experiences. This iconic mountain range features some of Europe's highest peaks, including the Matterhorn and Jungfraujoch, alongside pristine alpine lakes, efficient mountain railways, and luxury ski resorts. The region perfectly combines natural beauty with Swiss precision, offering world-class infrastructure and hospitality in one of the planet's most spectacular mountain environments.",
        geography: "The Swiss Alps form the largest portion of the greater Alpine range, stretching across southern and eastern Switzerland. Key peaks include the Matterhorn (4,478m), Monte Rosa (4,634m), and the Jungfrau (4,158m). The region features numerous glaciers, pristine alpine lakes like Lake Geneva and Lake Lucerne, and dramatic valleys including the Lauterbrunnen Valley with its 72 waterfalls. The Continental Divide runs through the region, separating watersheds flowing to different seas.",
        culture: "Swiss Alpine culture reflects a unique blend of German, French, and Italian influences, varying by region. Traditional Alpine customs include yodeling, alphorn playing, and seasonal festivals celebrating mountain life. The region is famous for precision timekeeping, luxury watchmaking, high-quality chocolate, and distinctive architecture featuring wooden chalets with flower-filled balconies. Swiss efficiency and environmental consciousness are evident in the extensive network of mountain railways, cable cars, and sustainable tourism practices.",
        highlights: [
            "Matterhorn near Zermatt stands as one of the world's most photographed mountains with its distinctive pyramid shape",
            "Jungfraujoch 'Top of Europe' offers glacier experiences and panoramic views accessible by cogwheel railway",
            "World-class skiing at resorts like St. Moritz, Verbier, and Davos with reliable snow and pristine slopes",
            "Scenic train journeys including the Glacier Express and Bernina Express through spectacular mountain landscapes",
            "Alpine hiking trails with over 65,000 kilometers of marked paths ranging from gentle walks to challenging climbs",
            "Crystal-clear alpine lakes perfect for swimming, boating, and reflection of surrounding snow-capped peaks"
        ]
        }
    },
    11: {
        id: 11,
        name: "Paris",
        country: "France",
        region: "Île-de-France",
        rating: 4.7,
        reviewCount: 4200,
        priceRange: "$",
        bestTime: "April - June, September - October",
        shortDescription: "The 'City of Light' featuring iconic landmarks like the Eiffel Tower, world-renowned art museums, and timeless romantic charm.",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "Paris, the capital of France and the 'City of Light,' welcomes approximately 38 million visitors annually, making it one of the world's most visited cities. This iconic metropolis along the Seine River has been a center of art, fashion, gastronomy, and culture for centuries. From the Gothic magnificence of Notre-Dame to the iron lattice of the Eiffel Tower, Paris seamlessly blends historical grandeur with contemporary sophistication, offering an unmatched urban experience in the heart of Europe.",
        geography: "Paris sits in the north-central part of France in the Île-de-France region, built around the meandering Seine River. The city is organized into 20 arrondissements (districts) spiraling outward from the center. Key geographic features include the Île de la Cité (where Notre-Dame stands), Montmartre hill crowned by Sacré-Cœur, and the large parks like the Tuileries and Luxembourg Gardens. The greater Paris metropolitan area extends far beyond the city proper.",
        culture: "Parisian culture epitomizes French art de vivre (art of living) with its emphasis on fashion, cuisine, literature, and intellectual discourse. The city has been home to countless artists, writers, and philosophers who shaped Western culture. Café culture remains central to Parisian life, while the city's 130 museums, including the Louvre and Musée d'Orsay, house the world's greatest art collections. French savoir-vivre is evident in everything from haute couture to neighborhood patisseries.",
        highlights: [
            "Eiffel Tower stands as Paris's iron lady, offering spectacular city views from its three observation levels",
            "Louvre Museum houses the world's largest art collection including the Mona Lisa and Venus de Milo",
            "Notre-Dame Cathedral (currently under restoration) represents Gothic architecture at its finest",
            "Champs-Élysées stretches from Place de la Concorde to Arc de Triomphe, perfect for shopping and strolling",
            "Montmartre district features the bohemian charm of Sacré-Cœur Basilica and Place du Tertre artists' square",
            "Seine River cruises provide romantic perspectives of the city's monuments and historic bridges"
        ]
        }
    },
    12: {
        id: 12,
        name: "New York City",
        country: "United States",
        region: "New York",
        rating: 4.5,
        reviewCount: 5800,
        priceRange: "$",
        bestTime: "April - June, September - November",
        shortDescription: "The 'Big Apple' featuring iconic skyscrapers, Broadway shows, world-class museums, and the vibrant energy of America's cultural capital.",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

        overview: {
        description: "New York City, the most populous city in the United States with over 8.3 million residents, attracts approximately 65 million visitors annually. Known as 'The Big Apple' and 'The City That Never Sleeps,' NYC is a global hub for finance, arts, fashion, and culture. The city's five boroughs - Manhattan, Brooklyn, Queens, The Bronx, and Staten Island - each offer distinct personalities while collectively creating one of the world's most dynamic urban experiences.",
        geography: "New York City is located at the mouth of the Hudson River in southeastern New York State. The city is built on a natural harbor formed by the convergence of the Hudson and East rivers with New York Bay. Manhattan, the city's heart, is a narrow island featuring the famous grid street system north of Houston Street. The surrounding boroughs are connected by an extensive network of bridges, tunnels, and ferry services.",
        culture: "NYC embodies the American melting pot with residents from every corner of the globe speaking over 200 languages. The city is synonymous with Broadway theater, world-class museums like MoMA and the Met, jazz clubs in Harlem, and cutting-edge art galleries in Chelsea. Wall Street represents global finance, while neighborhoods like Little Italy, Chinatown, and Koreatown celebrate diverse cultural traditions. The city's rapid pace and entrepreneurial spirit define the quintessential American urban experience.",
        highlights: [
            "Times Square pulses as the bright heart of NYC with Broadway theaters, massive digital billboards, and constant energy",
            "Central Park provides 843 acres of green oasis in Manhattan with lakes, meadows, and cultural attractions",
            "Statue of Liberty and Ellis Island symbolize freedom and immigration, accessible by ferry from Battery Park",
            "Empire State Building offers iconic Art Deco architecture and panoramic city views from its observation decks",
            "Brooklyn Bridge spans the East River as an engineering marvel and pedestrian promenade with stunning skyline views",
            "9/11 Memorial and Museum provide moving tributes to those lost with twin reflecting pools marking the original towers' footprints"
        ]
        }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // Convert locationId to number and find the location
      const numericLocationId = parseInt(locationId);
      setLocation(locationData[numericLocationId] || locationData[1]);
      setLoading(false);
    }, 800);
  }, [locationId]); // Add locationId as dependency

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Info },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-300">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return <div className="min-h-screen bg-gray-50 text-white flex items-center justify-center">Location not found</div>;
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      // overview section
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Description section */}
            <div class>
              <h3 className="text-3xl font-bold text-pink-400 mb-4"> Description</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{location.overview.description}</p>
              {/* State to control "Read more / Read Less" toggle for detail description */}
               {!expandDesc && (
                 <button className="flex mx-4 items-center mt-4 space-x-2 px-6 py-2 rounded-md whitespace-nowrap transition-all duration-300  bg-pink-500/10 text-gray-900 border border-pink-400 cursor-pointer" onClick={()=> setExpandDesc(true)}>Read more</button>
              )}
                {expandDesc && (
                <>
              <h4 className="text-xl font-semibold text-pink-400 mb-3">Geography & Setting</h4>
              <p className="text-gray-700 leading-relaxed mb-6">{location.overview.geography}</p>
              
              <h4 className="text-xl font-semibold text-pink-400 mb-3">Culture & Heritage</h4>
              <p className="text-gray-700 leading-relaxed mb-6">{location.overview.culture}</p>
                 <button className="flex mx-4 items-center mt-4 space-x-2 px-6 py-2 rounded-md whitespace-nowrap transition-all duration-300 bg-pink-500/10 border border-pink-400 text-gray-900 cursor-pointer" onClick={()=> setExpandDesc(false)}>Read less</button>
              </>
              )}
            </div>
                {/* Highlight section */}
            <div>
              <h4 className="text-3xl font-bold text-pink-400 mb-4">Highlights</h4>
               <div className="bg-pink-500/10 border border-pink-400 rounded-xl p-4 inline-block mb-6">
                <span className='text-gray-900 flex gap-2 items-center'><Calendar className='w-5 h-5 text-pink-500'/> Best time to visit:   {location.bestTime}</span>
              </div>
               {/* Highlight cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {location.overview.highlights.map((highlight, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl p-4 text-gray-700 border border-gray-400 shadow-sm hover:shadow-lg transition-all duration-300">
                    <span className="flex items-start gap-4 text-gray-700">
                      <Sparkles className='w-5 h-5 text-pink-400 flex-shrink-0'/>
                      {highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar lightBackground />

      {/* Image */}
      <div className="relative h-96 overflow-hidden ">
          <img
            src={location.image}
            alt={location.name}
            loading="lazy" 
            className="w-full h-full object-cover contrast-more:"
          />       
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-black/30 z-10" />

        {/* Content */}
        <div className="absolute top-20 bottom-0 left-0 right-0 p-8 z-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {location.name}
            </h1>
            <p className="md:text-sm sm:text-xs text-md text-wrap text-gray-200 mb-4 max-w-3xl">
              {location.shortDescription}
            </p>
            {/* Map and review */}
            <div className="flex items-start  space-x-4">
                <div className="flex items-center space-x-1 text-gray-200">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-medium">{location.rating}</span>
                <span className="text-gray-200">({location.reviewCount.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-center gap-1 text-white mb-2">
              <MapPin className="h-5 w-5 text-pink-400" />
              <span>{location.region}, {location.country}</span>
              </div>
            </div>
            {/* Add book now and Add to wishlist button */}
            <div className="flex items-center space-x-6 text-gray-700">
            <button className="flex mx-4 items-center mt-4 space-x-2 px-6 py-2 rounded-md whitespace-nowrap transition-all duration-300 font-medium bg-pink-50 text-black cursor-pointer" onClick={()=>navigate('/wishlist')}>Add to wishlist</button>
          <button className="flex mx-4 items-center mt-4 space-x-2 px-6 py-2 rounded-md whitespace-nowrap transition-all duration-300 font-medium bg-pink-500 text-white cursor-pointer" onClick={()=> navigate(`/package/${locationId}`)}>Book now</button>
            </div>
           
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-100 shadow-lg sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md whitespace-nowrap transition-all duration-300 font-medium ${
                  selectedTab === tab.key
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-white/10'
                } cursor-pointer`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LocationDetail;