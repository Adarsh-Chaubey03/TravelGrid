import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Add this import
import {
  MapPin,
  Star,
  Calendar,
  Sparkles,
  Images,
  Heart,
  Info,
} from "lucide-react";
import Navbar from "../components/Custom/Navbar";
import ARExperience from "../components/ARExperience";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const LocationDetail = () => {
  // Remove locationId prop, we'll get it from URL
  const { isDarkMode } = useTheme();
  const hotelsData = [
    {
      id: 0,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn9VEpeeu6H4AcaaaXE051Mnv1byf9UDDLZg&s",
      name: "JW Marriott Hotel Mumbai",
      rating: 8.6,
      distance: 2.3,
      lat: 19.1019,
      lng: 72.8262,
    },
    {
      id: 1,
      img: "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/leela-hyderabad-hotel.webp?VersionId=pv2n4jR67S0ZF75HqAbWQqM9zvf_fEV0",
      name: "The Oberoi New Delhi",
      rating: 8.8,
      distance: 5.1,
      lat: 28.5963,
      lng: 77.2397,
    },
    {
      id: 2,
      img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/385388071.jpg?k=de0b51f296a3d9431866b51b974921c9ebb50cacf08eb55c1eec1d468849ffe2&o=&hp=1",
      name: "Taj Palace Hotel Mumbai",
      rating: 8.4,
      distance: 3.4,
      lat: 18.9217,
      lng: 72.8332,
    },
    {
      id: 3,
      img: "https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg",
      name: "ITC Grand Chola Chennai",
      rating: 7.9,
      distance: 6.2,
      lat: 13.01085,
      lng: 80.22064,
    },
    {
      id: 4,
      img: "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/leela-palace-jaipur-5-star-hotel-d.jpg?VersionId=P7NPPYS1s4XETY6SWtZA3tnllR84Vpho",
      name: "Leela Palace Bengaluru",
      rating: 8.7,
      distance: 4.8,
      lat: 12.9596,
      lng: 77.6669,
    },
    {
      id: 5,
      img: "https://static.toiimg.com/photo/53223360.cms",
      name: "Radisson Blu Jaipur",
      rating: 7.2,
      distance: 7.9,
      lat: 26.86216,
      lng: 75.78812,
    },
    {
      id: 6,
      img: "https://digital.ihg.com/is/image/ihg/crowne-plaza-kochi-3941030496-4x3",
      name: "Hyatt Regency Pune",
      rating: 7.5,
      distance: 5.5,
      lat: 18.56,
      lng: 73.91,
    },
    {
      id: 7,
      img: "https://r1imghtlak.mmtcdn.com/129941a88b7311e7a7ab0a4cef95d023.jpg",
      name: "Trident Nariman Point",
      rating: 8.3,
      distance: 3.1,
      lat: 18.93,
      lng: 72.82,
    },
    {
      id: 8,
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/86/8a/0f/the-lalit-jaipur.jpg?w=1200&h=-1&s=1",
      name: "The Lalit New Delhi",
      rating: 7.6,
      distance: 8.2,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 9,
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/ee/2d/9d/jw-marriott-hotel-mumbai.jpg?w=900&h=500&s=1",
      name: "Novotel Hyderabad Convention Centre",
      rating: 6.9,
      distance: 9.0,
      lat: 17.472219,
      lng: 78.372603,
    },
  ];
  const restaurantsData = [
    {
      id: 10,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8nW-B2-_X9ENM27v5kjQc9Tazog7AT47Ngg&s",
      name: "Spice Haven",
      rating: 8.2,
      distance: 2.1,
      lat: 26.8524,
      lng: 75.761,
    },
    {
      id: 11,
      img: "https://interiordesign.net/wp-content/uploads/2024/04/InteriorDesign_March2024_Brave-New-World-11-1024x768.jpg",
      name: "The Royal Curry House",
      rating: 7.4,
      distance: 4.8,
      lat: 28.5963,
      lng: 77.2404,
    },
    {
      id: 12,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTed-OxFsYel1QzPBtGM1v6H-GRy-f-TIwjJw&s",
      name: "Urban Tadka Bistro",
      rating: 8.0,
      distance: 5.9,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 13,
      img: "https://t3.ftcdn.net/jpg/02/06/04/70/360_F_206047084_OxZGQ404N8rocQmItLIQRMRWlQwV3mSH.jpg",
      name: "The Bombay Plate",
      rating: 7.1,
      distance: 6.0,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 14,
      img: "https://assets.gqindia.com/photos/633eb9208370bdb93eda1e3c/16:9/w_1280,c_limit/One8-Commune_03.jpg",
      name: "Café Nirvana",
      rating: 8.6,
      distance: 1.9,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 15,
      img: "https://images.squarespace-cdn.com/content/v1/6672e6edcaff264369f010db/64ca4093-4a53-442f-b3e0-9cfbb29eed08/DearDaphni_GBonghi_Dec2024-49.jpg",
      name: "Masala Trails",
      rating: 7.3,
      distance: 3.6,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 16,
      img: "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2023-11/Koa.jpg",
      name: "The Spice Route",
      rating: 8.9,
      distance: 7.1,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 17,
      img: "https://imgmediagumlet.lbb.in/media/2025/03/67c59f4d2226626b47ecaf25_1741004621323.jpg",
      name: "Indigo Deli",
      rating: 7.8,
      distance: 8.4,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 18,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm1Ibe4h1KqqbzydsdzkLIbeakdoz2w-yN2w&s",
      name: "Coastal Catch",
      rating: 8.3,
      distance: 2.8,
      lat: 28.6122,
      lng: 77.2295,
    },
    {
      id: 19,
      img: "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/DINEOUT_ALL_RESTAURANTS/IMAGES/RESTAURANT_IMAGE_SERVICE/2025/6/10/3bb66b9b-c0ad-4d10-8189-c929692da23d_image4f2623a98cbcb47ee962d5f49b82a9189.JPG",
      name: "Saffron Street",
      rating: 6.7,
      distance: 5.2,
      lat: 28.6122,
      lng: 77.2295,
    },
  ];
  const mallsData = [
    {
      id: 20,
      img: "https://tripxl.com/blog/wp-content/uploads/2024/09/Shopping-Malls-In-Jodhpur-OG-Photo.jpg",
      name: "Grand Avenue Mall",
      rating: 8.0,
      distance: 3.7,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 21,
      img: "https://media.istockphoto.com/id/182408547/photo/elegant-shopping-mall.jpg?s=612x612&w=0&k=20&c=qpoZ75-JlU67tx710rgzp4Eb38kb5H-2M_bG9TTEZK0=",
      name: "Metro Square Mall",
      rating: 6.9,
      distance: 6.8,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 22,
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/07/bb/b8/luxurious-inside.jpg?w=900&h=500&s=1",
      name: "Crystal Galleria",
      rating: 7.3,
      distance: 2.5,
      lat: 24.575188,
      lng: 73.6834,
    },
    {
      id: 23,
      img: "https://images.unsplash.com/photo-1580793241553-e9f1cce181af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmclMjBtYWxsfGVufDB8fDB8fHww",
      name: "Skyline Mall",
      rating: 8.4,
      distance: 4.9,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 24,
      img: "https://img.staticmb.com/mbcontent/images/crop/uploads/2024/10/Exterior-of-Phoenix-Mall-of-the-Millennium-lighted-up-at-night_0_1200.jpg.webp",
      name: "Urban Central",
      rating: 7.7,
      distance: 8.3,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 25,
      img: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/08/04161939/Luxury-shopping-in-India-1-1600x900.jpg",
      name: "CityScape Mall",
      rating: 7.1,
      distance: 9.1,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 26,
      img: "https://cdn.shopify.com/s/files/1/0562/4011/1678/files/KC8.jpg?v=1709537774",
      name: "Royal Plaza Mall",
      rating: 7.9,
      distance: 7.5,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 27,
      img: "https://www.providentecopoliten.net.in/images/provident/top-5-malls-in-bangalore.webp",
      name: "Sunrise Arcade",
      rating: 8.2,
      distance: 5.0,
      lat: 26.263863,
      lng: 73.008957,
    },
    {
      id: 28,
      img: "https://assets-news.housing.com/news/wp-content/uploads/2022/12/25065016/malls-in-mysore-compressed.jpg",
      name: "Blue Horizon Mall",
      rating: 7.5,
      distance: 6.4,
      lat: 26.28373,
      lng: 73.038,
    },
    {
      id: 29,
      img: "https://www.treebo.com/blog/wp-content/uploads/2018/02/Shopping-Malls-in-Delhi.jpg",
      name: "Galaxy Galleria",
      rating: 8.1,
      distance: 3.9,
      lat: 26.263863,
      lng: 73.008957,
    },
  ];

  const { locationId } = useParams(); // Get locationId from URL parameters
  const [location, setLocation] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [expandDesc, setExpandDesc] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [pointOfInteractionList, setPointOfInteractionList] =
    useState(hotelsData);
  const [mapSrc, setMapSrc] = useState(
    "https://www.google.com/maps?q=19.075984,72.877656&hl=en&z=15&output=embed"
  );
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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
      shortDescription:
        "A volcanic island paradise famous for its dramatic clifftop villages, stunning sunsets, and distinctive blue-domed churches.",
      image:
        "https://images.unsplash.com/photo-1673137175648-889d7d236ba6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      coordinates: "36.3932,25.4615", // Santorini, Greece
      overview: {
        description:
          "Santorini is a crescent-shaped volcanic island in the southern Aegean Sea, about 200 kilometers southeast of mainland Greece. The island was shaped by one of the largest volcanic eruptions in recorded history, which occurred around 3,600 years ago. This dramatic geological event created the island's iconic caldera - a large volcanic crater filled with brilliant blue water that serves as the backdrop for the famous clifftop towns.",
        geography:
          "The island covers approximately 76 square kilometers and is characterized by dramatic cliffs that rise up to 400 meters above sea level. The western coast features the famous caldera cliffs with their black, red, and white volcanic rock layers, while the eastern coast has beautiful beaches with unique colored sands - red, black, and white - all created by the volcanic activity.",
        culture:
          "Santorini has been inhabited for over 4,000 years, with evidence of the ancient Minoan civilization found at the archaeological site of Akrotiri. The island's architecture is distinctly Cycladic, featuring cubic white-washed buildings with blue-domed churches, narrow cobblestone streets, and traditional cave houses called 'hyposkapha' carved directly into the volcanic rock.",
        highlights: [
          "The village of Oia offers the world's most photographed sunset views",
          "Fira, the capital, perches dramatically on the caldera rim 260 meters above sea level",
          "The Red Beach gets its striking color from red volcanic pebbles and sand",
          "Ancient Akrotiri preserves a 3,600-year-old Minoan settlement",
          "Local wineries produce unique wines from grapes grown in volcanic soil",
          "The island's distinctive architecture creates a postcard-perfect landscape",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/5/greece-2.jpg?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1531215304442-a45f5ddb0404?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 3,
          src: "https://images.unsplash.com/photo-1571406761717-16a4756722bc?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1664112115778-0ed2f2da97e2?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1599953068727-4e98147352f0?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "Japan's former imperial capital, home to over 2,000 temples and shrines, traditional wooden houses, and perfectly manicured gardens.",
      image:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      coordinates: "35.0116,135.7681", // Kyoto, Japan
      overview: {
        description:
          "Kyoto served as Japan's imperial capital for over 1,000 years (794-1868) and remains the heart of traditional Japanese culture. The city is home to 17 UNESCO World Heritage Sites, including some of Japan's most iconic temples and gardens. Despite being a modern city of 1.5 million people, Kyoto has carefully preserved its historical districts and traditional way of life.",
        geography:
          "Kyoto sits in a valley surrounded by mountains on three sides, with the Kamo and Katsura rivers flowing through the city. The city is organized in a grid pattern originally based on the ancient Chinese capital of Chang'an. The eastern mountains (Higashiyama) and western mountains (Nishiyama) provide a beautiful backdrop and are home to many of the city's most famous temples.",
        culture:
          "Kyoto is the birthplace of many Japanese cultural traditions including the tea ceremony, flower arrangement (ikebana), Noh theater, and geisha culture. The city's Gion district is famous for its traditional wooden machiya (townhouses) and ochaya (tea houses) where geishas still entertain guests. The city is also renowned for its traditional crafts including Kiyomizu pottery, Nishijin textiles, and lacquerware.",
        highlights: [
          "Kinkaku-ji (Golden Pavilion) is covered in gold leaf and reflects perfectly in its surrounding pond",
          "Fushimi Inari Shrine features thousands of bright orange torii gates winding up the mountainside",
          "The Arashiyama Bamboo Grove creates a magical green tunnel of towering bamboo stalks",
          "Gion district preserves traditional architecture and geisha culture",
          "Kiyomizu-dera temple offers panoramic views over the city from its wooden stage",
          "The Philosopher's Path winds along a canal lined with hundreds of cherry trees",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 3,
          src: "https://images.unsplash.com/photo-1649129683265-15a9aaf99f49?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1571406761717-16a4756722bc?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1583648008754-6dcfd0e1043f?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "Canada's first national park, featuring pristine mountain lakes, glacial peaks, and abundant wildlife in the heart of the Canadian Rockies.",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      coordinates: "51.4968,-115.9281", // Banff National Park
      overview: {
        description:
          "Established in 1885, Banff National Park is Canada's oldest national park and a UNESCO World Heritage Site. Located in the Canadian Rockies, the park covers 6,641 square kilometers of mountainous terrain with numerous glaciers, dense coniferous forest, alpine landscapes, and pristine wilderness. The park attracts over 4 million visitors annually who come to experience its stunning natural beauty and outdoor recreation opportunities.",
        geography:
          "Banff National Park is situated in the Rocky Mountains of Alberta, bordering British Columbia. The park features over 1,000 glaciers, including the Columbia Icefield, and is home to iconic peaks like Mount Assiniboine. The Continental Divide runs through the park, with major river systems including the Bow and Saskatchewan rivers. Lake Louise and Moraine Lake are among the most photographed lakes in the world.",
        culture:
          "The park is located on traditional territories of the Stoney Nakoda, Blackfoot, and Tsuut'ina peoples. The town of Banff serves as the park's cultural hub, offering mountain culture experiences, local art galleries, and the famous Banff Centre for Arts and Creativity. The area celebrates its mountaineering heritage and connection to the Canadian Pacific Railway's role in opening the region to tourism.",
        highlights: [
          "Lake Louise features turquoise waters surrounded by snow-capped peaks and the elegant Fairmont Chateau Lake Louise",
          "Moraine Lake in the Valley of the Ten Peaks offers one of Canada's most iconic mountain vistas",
          "Icefields Parkway is considered one of the world's most scenic drives through the heart of the Rockies",
          "Johnston Canyon features suspended walkways leading to spectacular frozen waterfalls in winter",
          "Abundant wildlife including grizzly bears, black bears, elk, bighorn sheep, and mountain goats",
          "World-class skiing at three major resorts: Lake Louise, Sunshine Village, and Mount Norquay",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1729872527247-f1b3c6086a72?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1491931466419-0ec3344c8f5e?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 3,
          src: "https://images.unsplash.com/photo-1659588868851-0f215cc59b47?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1722524270207-3d2c92b5f5e9?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1722524270207-3d2c92b5f5e9?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "A futuristic metropolis in the desert, known for luxury shopping, ultramodern architecture, and world-class entertainment.",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      coordinates: "25.2048,55.2708", // Dubai
      overview: {
        description:
          "Dubai has transformed from a modest fishing village to one of the world's most dynamic cities in just a few decades. This emirate in the UAE is renowned for its ambitious architecture, luxury lifestyle, and position as a global business hub. With over 16.7 million visitors annually, Dubai offers a unique blend of traditional Arabian culture and cutting-edge modernity, making it a top destination for luxury travelers and business professionals alike.",
        geography:
          "Located on the southeast coast of the Persian Gulf, Dubai sits on the Arabian Peninsula's eastern coast. The city is built along Dubai Creek, which divides it into two main sections: Deira and Bur Dubai. The emirate features a mix of coastal areas, desert landscapes, and man-made islands including the famous Palm Jumeirah. The city experiences a hot desert climate with mild winters making it ideal for tourism.",
        culture:
          "Dubai is a cosmopolitan city where over 85% of residents are expatriates from around the world. While Arabic is the official language, English is widely spoken. The city successfully balances its Islamic heritage with international influences, evident in its architecture, cuisine, and lifestyle. Traditional souks coexist with ultra-modern shopping malls, and ancient customs blend with contemporary luxury.",
        highlights: [
          "Burj Khalifa stands as the world's tallest building at 828 meters with observation decks offering panoramic city views",
          "Dubai Mall features over 1,200 shops, an aquarium, ice rink, and the famous Dubai Fountain show",
          "Palm Jumeirah is an artificial archipelago shaped like a palm tree, home to luxury resorts and residences",
          "Dubai Marina showcases impressive skyscrapers surrounding a man-made canal city",
          "Gold and Spice Souks in old Dubai offer traditional shopping experiences with authentic Arabian atmosphere",
          "Desert safari experiences include dune bashing, camel riding, and traditional Bedouin-style dinners",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1739952342769-6ec6163d6dee?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 3,
          src: "https://images.unsplash.com/photo-1737183616956-7da135f9a41d?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1734144197581-f2f672fa40d0?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1721974301263-5a328fe7a9a9?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "A bohemian beach town featuring spectacular Mayan ruins perched on cliffs overlooking the Caribbean Sea and mystical cenotes.",
      image:
        "https://images.unsplash.com/photo-1518638150340-f706e86654de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      coordinates: "20.2110,-87.4654", // Tulum
      overview: {
        description:
          "Tulum has evolved from a sleepy fishing village to one of Mexico's most sought-after destinations, attracting around 800,000 visitors annually. This coastal town on the Yucatan Peninsula offers a perfect blend of ancient Mayan history, pristine beaches, and eco-conscious luxury. The town is famous for its clifftop archaeological site, cenotes (natural swimming holes), and bohemian atmosphere that attracts yoga enthusiasts, digital nomads, and luxury travelers seeking an authentic Mexican Caribbean experience.",
        geography:
          "Located on the Caribbean coast of Mexico's Yucatan Peninsula, Tulum sits about 130 kilometers south of Cancun. The area features a unique landscape of white sand beaches, turquoise waters, dense jungle, and limestone cenotes. The Mesoamerican Reef System, the second-largest coral reef in the world, lies just offshore, making it excellent for snorkeling and diving.",
        culture:
          "Tulum embodies a unique blend of ancient Mayan heritage and modern bohemian culture. The area was once an important Mayan trading post, and this rich history is preserved in the archaeological sites. Today's Tulum culture emphasizes sustainability, wellness, and connection with nature. The town is known for its eco-friendly resorts, organic restaurants, yoga retreats, and artistic community that values environmental consciousness.",
        highlights: [
          "Tulum Archaeological Site features Mayan ruins dramatically positioned on 12-meter cliffs overlooking the Caribbean Sea",
          "Gran Cenote and Dos Ojos offer crystal-clear freshwater swimming and world-class cave diving experiences",
          "Tulum Beach stretches for miles with powdery white sand and bohemian beach clubs",
          "Sian Ka'an Biosphere Reserve protects diverse ecosystems including tropical forests, mangroves, and coral reefs",
          "Coba Archaeological Site features the tallest pyramid in the Yucatan Peninsula that visitors can still climb",
          "Vibrant wellness scene with numerous yoga studios, spa retreats, and organic restaurants focusing on healthy living",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1501532349-1c215c24f718?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1440558953273-969c107f78a4?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1503187680590-525b6e7a793f?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1457794355224-e92bb76cec4c?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "The world's northernmost capital, gateway to Iceland's natural wonders including Northern Lights, geothermal pools, and dramatic landscapes.",
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "64.1466,-21.9426", // Reykjavik
      overview: {
        description:
          "Reykjavik, home to about 130,000 people, serves as Iceland's cultural and economic center while maintaining a charming small-town feel. This northernmost capital in the world attracts 1.2 million visitors annually who use it as a base to explore Iceland's incredible natural phenomena. The city perfectly balances modern Scandinavian design with a rich Viking heritage, offering world-class museums, vibrant nightlife, and easy access to some of the planet's most spectacular natural wonders.",
        geography:
          "Reykjavik sits on the southwestern coast of Iceland on the shores of Faxaflói Bay. The city is built on a peninsula and is surrounded by mountains, including Mount Esja to the north. The area sits on the Mid-Atlantic Ridge, resulting in significant geothermal activity that powers much of the city. The location at 64°N latitude means extreme seasonal variation in daylight hours.",
        culture:
          "Icelandic culture in Reykjavik blends ancient Nordic traditions with modern progressive values. The city is renowned for its literary heritage (Iceland publishes more books per capita than any other country), vibrant music scene (home to Björk and Sigur Rós), and strong emphasis on environmental sustainability. The concept of 'þetta reddast' (it will all work out) reflects the resilient, optimistic Icelandic spirit.",
        highlights: [
          "Northern Lights (Aurora Borealis) are visible from the city during winter months from September to March",
          "Blue Lagoon geothermal spa offers milky blue waters rich in silica and minerals just 40 minutes from the city",
          "Hallgrímskirkja church dominates the skyline with its unique architecture inspired by Iceland's basalt columns",
          "Golden Circle tour includes Þingvellir National Park, Geysir hot springs, and Gullfoss waterfall",
          "Harpa Concert Hall showcases stunning modern architecture and hosts world-class performances",
          "Vibrant nightlife scene with numerous bars, clubs, and live music venues concentrated in the compact city center",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1565520637984-003fe752a844?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1723059199210-c9bec172bf44?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1518156959312-07a5380c1261?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1546178806-764c688238c0?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "A tropical paradise of 1,192 coral islands featuring overwater villas, crystal-clear lagoons, and world-class diving in the Indian Ocean.",
      image:
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "3.2028,73.2207", // Maldives
      overview: {
        description:
          "The Maldives consists of 1,192 coral islands grouped into 26 atolls, stretching across 871 kilometers in the Indian Ocean. Only about 200 islands are inhabited, with approximately 100 developed as tourist resorts. This island nation attracts 1.7 million visitors annually seeking the ultimate tropical luxury experience. Known for having the lowest natural point of any country (just 1.5 meters above sea level), the Maldives offers unparalleled beauty with crystal-clear waters, pristine beaches, and some of the world's best marine life.",
        geography:
          "Located southwest of Sri Lanka and India, the Maldives sits astride the equator in the Indian Ocean. The islands are built on a foundation of coral reefs and feature white sand beaches, turquoise lagoons, and house reefs perfect for snorkeling. The country is entirely composed of low-lying islands, with the highest point being only 2.4 meters above sea level, making it particularly vulnerable to climate change and sea level rise.",
        culture:
          "Maldivian culture reflects influences from various cultures including Indian, Sri Lankan, Arab, and African traditions due to its position on ancient maritime trade routes. Islam is the state religion, introduced in 1153 AD. Traditional music, dance, and crafts like lacquerwork and mat weaving are still practiced. The concept of 'resort islands' separate from local communities helps preserve traditional Maldivian culture while providing world-class tourism experiences.",
        highlights: [
          "Overwater villas pioneered in the Maldives offer direct lagoon access and unparalleled privacy and luxury",
          "Crystal-clear waters with visibility up to 50 meters provide exceptional snorkeling and diving opportunities",
          "Pristine coral reefs home to manta rays, whale sharks, sea turtles, and thousands of tropical fish species",
          "Private island resorts offering ultimate exclusivity with some featuring only 20-50 villas per island",
          "World-class spa treatments often featuring traditional Maldivian techniques in overwater spa pavilions",
          "Sunset dolphin cruises and romantic sandbank picnics create unforgettable romantic experiences",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1586495985096-787fb4a54ac0?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1543731068-7e0f5beff43a?q=70&w=1074&auto=format&fit=crop",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1574226780565-388f10f8121e?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "The legendary 'Lost City of the Incas' perched high in the Andes Mountains, offering spectacular ancient ruins and mountain hiking.",
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "-13.1631,-72.5450", // Machu Picchu
      overview: {
        description:
          "Machu Picchu, built around 1450 CE and abandoned during the Spanish conquest, remained hidden until American historian Hiram Bingham brought it to international attention in 1911. This UNESCO World Heritage Site sits at 2,430 meters above sea level and attracts approximately 1.5 million visitors annually. The citadel represents one of the most important archaeological sites in South America and showcases the remarkable architectural and engineering achievements of the Inca civilization.",
        geography:
          "Located in the Eastern Cordillera of southern Peru, Machu Picchu sits on a mountain ridge above the Sacred Valley, approximately 80 kilometers northwest of Cusco. The site is surrounded by the Amazon rainforest and features dramatic mountain peaks including Huayna Picchu and Machu Picchu mountain. The Urubamba River flows around the base of the mountain, creating a natural moat around the ancient citadel.",
        culture:
          "Machu Picchu reflects the advanced Inca civilization's understanding of astronomy, agriculture, and architecture. The site likely served as a royal estate and sacred center, with structures aligned to astronomical events. Modern Quechua-speaking descendants of the Incas still live in the region, maintaining traditional practices and serving as guides and porters. The site represents the deep spiritual connection between Andean peoples and their mountain environment, known as 'Apus' (mountain spirits).",
        highlights: [
          "Ancient Inca ruins featuring precision stone construction without mortar, withstanding centuries of earthquakes",
          "Classic Inca Trail trek offers a 4-day hiking experience through diverse ecosystems and archaeological sites",
          "Huayna Picchu provides a challenging climb with spectacular bird's-eye views of the entire citadel",
          "Temple of the Sun demonstrates sophisticated Inca astronomical knowledge and religious practices",
          "Agricultural terraces showcase Inca engineering prowess and sustainable farming techniques",
          "Sacred Valley exploration includes additional Inca sites, traditional markets, and authentic Andean culture",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1543385426-191664295b58?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1718649872891-e8a3d72d08fc?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1522451056252-3fa650a3b8bf?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1601226261548-82fa0b3e8e91?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1472982728022-601a8d99e9af?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "The 'Island of the Gods' featuring emerald rice terraces, ancient Hindu temples, volcanic landscapes, and vibrant cultural traditions.",
      image:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "-8.3405,115.0920", // Bali
      overview: {
        description:
          "Bali, known as the 'Island of the Gods,' is Indonesia's most famous destination, attracting 6.3 million visitors annually. This tropical paradise seamlessly blends ancient Hindu traditions with stunning natural beauty, creating a unique cultural landscape found nowhere else in the world. From the artistic hub of Ubud to the beach resorts of Seminyak and the dramatic volcanic landscapes of Mount Batur, Bali offers diverse experiences within a relatively small island of just 5,780 square kilometers.",
        geography:
          "Bali is located between Java and Lombok in the Indonesian archipelago, sitting just 8 degrees south of the equator. The island features a dramatic landscape of volcanic mountains, including the active Mount Batur and the sacred Mount Agung, alongside pristine beaches, dense tropical forests, and the famous subak irrigation system creating the iconic terraced rice fields. The Wallace Line runs through the Lombok Strait east of Bali, marking the boundary between Asian and Australian flora and fauna.",
        culture:
          "Bali is unique in Indonesia as the only province with a Hindu majority (about 87% of the population practices Balinese Hinduism). This creates a rich cultural tapestry of daily temple ceremonies, elaborate festivals like Nyepi (Day of Silence), traditional dance performances, and intricate art forms including wood carving, silver jewelry, and batik textiles. The Balinese philosophy of Tri Hita Karana emphasizes harmony between humans, nature, and the divine, reflected in every aspect of daily life.",
        highlights: [
          "Tegallalang Rice Terraces offer Instagram-worthy emerald landscapes showcasing traditional Balinese irrigation",
          "Ancient Hindu temples including Tanah Lot, Uluwatu, and Besakih showcase classical Balinese architecture",
          "Ubud serves as the cultural heart with art galleries, yoga retreats, monkey forest sanctuary, and traditional markets",
          "Mount Batur sunrise trekking provides spectacular volcanic crater views and natural hot springs",
          "Traditional Kecak fire dance and Legong performances demonstrate centuries-old Balinese artistic traditions",
          "Seminyak and Canggu beaches offer world-class surfing, beach clubs, and stunning sunset views",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1698466632744-f79b37b88ffd?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1704253411612-e4deb715dcd8?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1733281121131-6aa280eab10f?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1655289112220-59e25ac59d7e?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "Majestic mountain peaks, pristine alpine lakes, world-renowned skiing resorts, and charming villages in the heart of Europe.",
      image:
        "https://images.unsplash.com/photo-1551524164-6cf2ac925319?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "46.8876,9.6570", // Swiss Alps
      overview: {
        description:
          "The Swiss Alps cover approximately 65% of Switzerland's total area and attract 3.1 million visitors annually seeking both summer and winter mountain experiences. This iconic mountain range features some of Europe's highest peaks, including the Matterhorn and Jungfraujoch, alongside pristine alpine lakes, efficient mountain railways, and luxury ski resorts. The region perfectly combines natural beauty with Swiss precision, offering world-class infrastructure and hospitality in one of the planet's most spectacular mountain environments.",
        geography:
          "The Swiss Alps form the largest portion of the greater Alpine range, stretching across southern and eastern Switzerland. Key peaks include the Matterhorn (4,478m), Monte Rosa (4,634m), and the Jungfrau (4,158m). The region features numerous glaciers, pristine alpine lakes like Lake Geneva and Lake Lucerne, and dramatic valleys including the Lauterbrunnen Valley with its 72 waterfalls. The Continental Divide runs through the region, separating watersheds flowing to different seas.",
        culture:
          "Swiss Alpine culture reflects a unique blend of German, French, and Italian influences, varying by region. Traditional Alpine customs include yodeling, alphorn playing, and seasonal festivals celebrating mountain life. The region is famous for precision timekeeping, luxury watchmaking, high-quality chocolate, and distinctive architecture featuring wooden chalets with flower-filled balconies. Swiss efficiency and environmental consciousness are evident in the extensive network of mountain railways, cable cars, and sustainable tourism practices.",
        highlights: [
          "Matterhorn near Zermatt stands as one of the world's most photographed mountains with its distinctive pyramid shape",
          "Jungfraujoch 'Top of Europe' offers glacier experiences and panoramic views accessible by cogwheel railway",
          "World-class skiing at resorts like St. Moritz, Verbier, and Davos with reliable snow and pristine slopes",
          "Scenic train journeys including the Glacier Express and Bernina Express through spectacular mountain landscapes",
          "Alpine hiking trails with over 65,000 kilometers of marked paths ranging from gentle walks to challenging climbs",
          "Crystal-clear alpine lakes perfect for swimming, boating, and reflection of surrounding snow-capped peaks",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1508264165352-258a6d1d9392?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1508261303437-e520c1f41b72?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "The 'City of Light' featuring iconic landmarks like the Eiffel Tower, world-renowned art museums, and timeless romantic charm.",
      image:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "48.8566,2.3522", // Paris
      overview: {
        description:
          "Paris, the capital of France and the 'City of Light,' welcomes approximately 38 million visitors annually, making it one of the world's most visited cities. This iconic metropolis along the Seine River has been a center of art, fashion, gastronomy, and culture for centuries. From the Gothic magnificence of Notre-Dame to the iron lattice of the Eiffel Tower, Paris seamlessly blends historical grandeur with contemporary sophistication, offering an unmatched urban experience in the heart of Europe.",
        geography:
          "Paris sits in the north-central part of France in the Île-de-France region, built around the meandering Seine River. The city is organized into 20 arrondissements (districts) spiraling outward from the center. Key geographic features include the Île de la Cité (where Notre-Dame stands), Montmartre hill crowned by Sacré-Cœur, and the large parks like the Tuileries and Luxembourg Gardens. The greater Paris metropolitan area extends far beyond the city proper.",
        culture:
          "Parisian culture epitomizes French art de vivre (art of living) with its emphasis on fashion, cuisine, literature, and intellectual discourse. The city has been home to countless artists, writers, and philosophers who shaped Western culture. Café culture remains central to Parisian life, while the city's 130 museums, including the Louvre and Musée d'Orsay, house the world's greatest art collections. French savoir-vivre is evident in everything from haute couture to neighborhood patisseries.",
        highlights: [
          "Eiffel Tower stands as Paris's iron lady, offering spectacular city views from its three observation levels",
          "Louvre Museum houses the world's largest art collection including the Mona Lisa and Venus de Milo",
          "Notre-Dame Cathedral (currently under restoration) represents Gothic architecture at its finest",
          "Champs-Élysées stretches from Place de la Concorde to Arc de Triomphe, perfect for shopping and strolling",
          "Montmartre district features the bohemian charm of Sacré-Cœur Basilica and Place du Tertre artists' square",
          "Seine River cruises provide romantic perspectives of the city's monuments and historic bridges",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1551865673-9e9ee4f8cd4c?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1503187680590-525b6e7a793f?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1543349687-8f911b218ae6?w=500&auto=format&fit=crop&q=60",
        },
      ],
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
      shortDescription:
        "The 'Big Apple' featuring iconic skyscrapers, Broadway shows, world-class museums, and the vibrant energy of America's cultural capital.",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",

      coordinates: "40.7128,-74.0060", // New York City
      overview: {
        description:
          "New York City, the most populous city in the United States with over 8.3 million residents, attracts approximately 65 million visitors annually. Known as 'The Big Apple' and 'The City That Never Sleeps,' NYC is a global hub for finance, arts, fashion, and culture. The city's five boroughs - Manhattan, Brooklyn, Queens, The Bronx, and Staten Island - each offer distinct personalities while collectively creating one of the world's most dynamic urban experiences.",
        geography:
          "New York City is located at the mouth of the Hudson River in southeastern New York State. The city is built on a natural harbor formed by the convergence of the Hudson and East rivers with New York Bay. Manhattan, the city's heart, is a narrow island featuring the famous grid street system north of Houston Street. The surrounding boroughs are connected by an extensive network of bridges, tunnels, and ferry services.",
        culture:
          "NYC embodies the American melting pot with residents from every corner of the globe speaking over 200 languages. The city is synonymous with Broadway theater, world-class museums like MoMA and the Met, jazz clubs in Harlem, and cutting-edge art galleries in Chelsea. Wall Street represents global finance, while neighborhoods like Little Italy, Chinatown, and Koreatown celebrate diverse cultural traditions. The city's rapid pace and entrepreneurial spirit define the quintessential American urban experience.",
        highlights: [
          "Times Square pulses as the bright heart of NYC with Broadway theaters, massive digital billboards, and constant energy",
          "Central Park provides 843 acres of green oasis in Manhattan with lakes, meadows, and cultural attractions",
          "Statue of Liberty and Ellis Island symbolize freedom and immigration, accessible by ferry from Battery Park",
          "Empire State Building offers iconic Art Deco architecture and panoramic city views from its observation decks",
          "Brooklyn Bridge spans the East River as an engineering marvel and pedestrian promenade with stunning skyline views",
          "9/11 Memorial and Museum provide moving tributes to those lost with twin reflecting pools marking the original towers' footprints",
        ],
      },
      photos: [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1750810977550-b27de8ee6a82?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 2,
          src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&auto=format&fit=crop&q=60",
        },

        {
          id: 3,
          src: "https://images.unsplash.com/photo-1570613319757-68b3b899b183?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=500&auto=format&fit=crop&q=60",
        },
        {
          id: 5,
          src: "https://images.unsplash.com/photo-1507502167143-3f06acc85b8f?w=500&auto=format&fit=crop&q=60",
        },
      ],
    },
  };

  const changePoIData = (value) => {
    const dataMap = [hotelsData, restaurantsData, mallsData];
    setPointOfInteractionList(dataMap[value] || hotelsData);
  };

  const showInMap = (lat, lng) => {
    const newSrc = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
    setMapSrc(newSrc);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Convert locationId to number and find the location
      const numericLocationId = parseInt(locationId);
      const [lat, lon] = (
        locationData[numericLocationId] || locationData[1]
      ).coordinates
        .split(",")
        .map(parseFloat);
      showInMap(lat, lon);
      setLocation(locationData[numericLocationId] || locationData[1]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [locationId]); // Add locationId as dependency

  const tabs = [{ key: "overview", label: "Overview", icon: Info },{ key: "photos", label: "Photos", icon: Images }];

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-br from-black to-pink-900"
            : "bg-gradient-to-r from-pink-200/50 via-white/70 to-blue-200/50"
        } min-h-screen flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-400">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-br from-black to-pink-900"
            : "bg-gradient-to-r from-pink-200/50 via-white/70 to-blue-200/50"
        } min-h-screen text-white flex items-center justify-center`}
      >
        Location not found
      </div>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
        case "overview":
        // overview section
        return (
          <div className="space-y-8">
            {/* Description section */}
            <div class>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-500 mb-4">
                {" "}
                Description
              </h3>
              <p className="text-sm sm:text-md text-gray-700 leading-relaxed mb-6">
                {location.overview.description}
              </p>
              {/* State to control "Read more / Read Less" toggle for detail description */}
              {!expandDesc && (
                <button
                  className="flex mx-4 items-center mt-4 space-x-2 px-6 py-2 rounded-md whitespace-nowrap transition-all duration-300 bg-pink-300/20 text-gray-900 border border-pink-400 cursor-pointer"
                  onClick={() => setExpandDesc(true)}
                >
                  Read more
                </button>
              )}
              {expandDesc && (
                <>
                  <h4 className="text-xl font-semibold text-pink-500 mb-3">
                    Geography & Setting
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {location.overview.geography}
                  </p>

                  <h4 className="text-xl font-semibold text-pink-500 mb-3">
                    Culture & Heritage
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {location.overview.culture}
                  </p>
                  <button
                    className="flex mx-4 items-center mt-4 space-x-2 px-6 py-2 rounded-md whitespace-nowrap transition-all duration-300 bg-pink-500/10 border border-pink-400 text-gray-900 cursor-pointer"
                    onClick={() => setExpandDesc(false)}
                  >
                    Read less
                  </button>
                </>
              )}
            </div>
            {/* Highlight section */}
            <div>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-500 mb-4">
                Highlights
              </h4>
              <div className="bg-pink-300/20 border border-pink-400 rounded-xl p-4 inline-block mb-6">
                <span className="text-gray-900 flex gap-2 items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" /> Best time to
                  visit: {location.bestTime}
                </span>
              </div>
              {/* Highlight cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {location.overview.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className={`${isDarkMode?"bg-white/10":"bg-white/70"} rounded-xl p-4 text-gray-700 border border-gray-400/20 shadow-sm hover:shadow-lg transition-all duration-300`}
                  >
                    <span className="flex items-center gap-4 text-gray-900 text-sm sm:text-md">
                      <Sparkles className="w-4 h-5 sm:w-5 sm:h-5 text-pink-500 flex-shrink-0" />
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Point of Interactions Section */}
            <div className="mt-6 p-4 grid gap-10 md:grid-cols-2">
              {/* Left Column */}
              <div className="flex flex-col">
                {/* Dropdown */}
                <select
                  defaultValue=""
                  onChange={(e) => changePoIData(e.target.value)}
                  className="w-full md:w-fit mb-4 p-2 border border-gray-400/20 rounded-lg"
                >
                  <option disabled value="">
                    Point of Interaction
                  </option>
                  <option value={0}>Hotels</option>
                  <option value={1}>Restaurants</option>
                  <option value={2}>Malls</option>
                </select>

                {/* Scrollable List */}
                <div className="h-80 overflow-y-auto custom-scroll">
                  {pointOfInteractionList.map((place) => (
                    <div
                      key={place.id}
                      className={`mb-4 flex flex-col ${isDarkMode?"bg-white/10":"bg-white/80"} rounded-xl p-2 text-gray-700 border border-gray-400/30 shadow-sm hover:shadow-lg transition-all duration-300`}
                    >
                      <span className="flex items-center gap-4 text-gray-700 mb-2">
                        <img
                          src={place.img}
                          className="w-24 h-16 md:w-30 md:h-20 object-cover rounded"
                        />
                        <div className="flex flex-col">
                          <p>{place.name}</p>
                          <p>Distance from venue: {place.distance} Km</p>
                        </div>
                      </span>
                      <div className="flex justify-between items-center">
                        <span>Rating: {place.rating}/10</span>
                        <button
                          onClick={() => showInMap(place.lat, place.lng)}
                          className="rounded-lg cursor-pointer bg-pink-300/20 p-2 border border-pink-300 text-gray-900"
                        >
                          Show in Map
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="w-full mt-6 md:mt-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Map for {location.name || "Location"}
                </h3>

                {/* Iframe using the dynamic mapSrc state */}
                <iframe
                  className="rounded-xl w-full h-80 md:h-100"
                  src={mapSrc}
                  title={`Map of ${location.name || "Location"}`}
                  width="600"
                  height="450"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        );
      case "photos":
        return (
          <div className="space-y-8">
            <h2 className="text-xl text-gray-900 border-b-2 border-pink-400/30 px-2 py-3 rounded-sm font-medium">
              Photos
            </h2>
            <div className="grid grid-cols-1 items-center place-items-center sm:grid-cols-2 md:grid-cols-3 gap-6">
              {location.photos.map((image) => (
                <div
                  className="aspect-square overflow-hidden shadow-md rounded-xl group"
                  key={image.id}
                >
                  <img
                    src={image.src}
                    alt={`Photo ${image.id}`}
                    className="shadow-md w-full h-full object-cover rounded-xl group-hover:scale-105 transform transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const handleWishlistToggle = () => {
    if (!location) return;

    const locationData = {
      id: location.id,
      name: location.name,
      country: location.country,
      region: location.region,
      rating: location.rating,
      reviewCount: location.reviewCount,
      priceRange: location.priceRange,
      bestTime: location.bestTime,
      shortDescription: location.shortDescription,
      image: location.image,
      coordinates: location.coordinates,
    };

    if (isInWishlist(location.id)) {
      removeFromWishlist(location.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(locationData);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gradient-to-br from-black to-pink-900"
          : "bg-gradient-to-r from-pink-200/50 via-white/70 to-blue-200/50"
      } min-h-screen`}
    >
      <Navbar lightBackground />

      {/* Image */}
      <div className="relative h-96 overflow-hidden ">
        <img
          src={location.image}
          alt={location.name}
          loading="lazy"
          className="w-full h-full object-cover contrast-more:"
        />
        <div className={`absolute inset-0 bg-gradient-to-tr ${isDarkMode? "from-black/60 to-black/30":"from-black/10 to-transparent"} z-10`} />

        {/* Content */}
        <div className="absolute top-20 sm:top-25 bottom-0 left-0 right-0 p-8 z-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {location.name}
            </h1>
            {/* Map and review */}
            <div className="flex items-start  space-x-4">
              <div className="flex items-center space-x-1 text-gray-900">
                <Star className="h-4 w-5 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                <span className="font-medium">{location.rating}</span>
                <span className="text-gray-900 text-sm">
                  ({location.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              <div className="flex items-center gap-1 text-gray-900 mb-2">
                <MapPin className="h-4 w-5 sm:h-5 sm:w-5 text-pink-400" />
                <span>
                  {location.region}, {location.country}
                </span>
              </div>
            </div>
            {/* Add book now and Add to wishlist button */}
            <div className="flex flex-wrap items-center space-x-4 text-gray-700">
              <button
                className={`flex mx-4 items-center mt-4 space-x-2 px-4 sm:px-6 py-2 rounded-md text-sm sm:text-md md:text-lg whitespace-nowrap transition-all duration-300 font-medium cursor-pointer ${
                  isInWishlist(location.id)
                    ? "bg-red-500 text-white"
                    : "bg-pink-50 text-black"
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isInWishlist(location.id) ? "fill-current" : ""
                  }`}
                />
                <span>
                  {isInWishlist(location.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </span>
              </button>
              <button
                className="flex mx-4 items-center mt-4 space-x-2 px-4 sm:px-6 py-2 rounded-md text-sm sm:text-md md:text-lg whitespace-nowrap transition-all duration-300 font-medium bg-pink-500 text-white cursor-pointer"
                onClick={() => navigate(`/package/${locationId}`)}
              >
                Book now
              </button>
              <button
                className="flex mx-4 items-center mt-4 space-x-2 px-4 sm:px-6 py-2 rounded-md text-sm sm:text-md md:text-lg whitespace-nowrap transition-all duration-300 font-medium bg-purple-600 text-white cursor-pointer"
                onClick={() => setArMode(true)}
              >
                AR Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isDarkMode?"bg-white/15":"bg-white/70"} shadow-lg sticky top-0 z-10 backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 py-3 sm:py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setSelectedTab(
                    selectedTab === "overview" ? "photos" : "overview"
                  )
                }
                className={`flex items-center space-x-2 px-2 sm:px-4 lg:py-6 py-2 sm:py-3 rounded-md whitespace-nowrap transition-all duration-300 font-medium ${
                  selectedTab === tab.key
                    ? "bg-pink-400/30 text-gray-900"
                    : "text-gray-900 hover:text-gray-900 hover:bg-white/10"
                } cursor-pointer`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-sm sm:text-md md:text-lg">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderTabContent()}
      </div>
      {arMode && (
        <ARExperience location={location} onClose={() => setArMode(false)} />
      )}
    </div>
  );
};

export default LocationDetail;
