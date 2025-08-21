import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { ChevronDown, Globe } from "lucide-react";

const LanguageSelector = () => {
    const {
        currentLanguage,
        changeLanguage,
        languages,
        getCurrentLanguageInfo,
    } = useLanguage();
    const { isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); 

    const currentLangInfo = getCurrentLanguageInfo();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLanguageChange = async (languageCode) => {
        const result = await changeLanguage(languageCode);
        if (result.success) {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 hover:bg-pink-500/20 ${
                    isDarkMode
                        ? "text-gray-200 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                }`}
                aria-label="Select language"
            >
                <Globe size={16} className="text-pink-500" />
                <span className="text-lg mr-1">{currentLangInfo.flag}</span>
                <span className="text-sm font-medium">
                    {currentLangInfo.name}
                </span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                    }`}
                >
                    <div className="py-1">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-pink-500 hover:text-white transition-colors duration-200 ${
                                    currentLanguage === language.code
                                        ? "bg-pink-500 text-white"
                                        : ""
                                }`}
                            >
                                <span className="text-lg">{language.flag}</span>
                                <span>{language.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;