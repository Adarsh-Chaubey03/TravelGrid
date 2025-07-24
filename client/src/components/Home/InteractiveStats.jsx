import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Star, Plane } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-bold text-3xl md:text-4xl gradient-text">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const InteractiveStats = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 50000,
      suffix: '+',
      label: 'Happy Travelers',
      color: 'text-blue-500'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: 150,
      suffix: '+',
      label: 'Destinations',
      color: 'text-green-500'
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 98,
      suffix: '%',
      label: 'Satisfaction Rate',
      color: 'text-yellow-500'
    },
    {
      icon: <Plane className="w-8 h-8" />,
      value: 1000,
      suffix: '+',
      label: 'Trips Booked',
      color: 'text-purple-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-slideInDown">
            Our Amazing <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideInUp animate-delay-200">
            Join thousands of travelers who have trusted us to make their dreams come true
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-6 bg-white rounded-2xl shadow-lg hover-lift animate-scaleIn animate-delay-${(index + 1) * 100}`}
            >
              <div className={`${stat.color} mb-4 flex justify-center animate-float`}>
                {stat.icon}
              </div>
              <div className="mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveStats;
