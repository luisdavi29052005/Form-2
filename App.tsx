import React, { useState, useEffect } from 'react';
import LeadForm from './components/LeadForm';
import LoadingSpinner from './components/LoadingSpinner';
import { translations, Translation } from './i18n';
import { SpeedInsights } from "@vercel/speed-insights/react"

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState<Translation>(translations.pt); // Default to Portuguese

  useEffect(() => {
    const setLanguageFromBrowser = () => {
      try {
        const userLang = navigator.language.split('-')[0]; // 'pt-BR' -> 'pt'

        if (userLang === 'en') {
          setTexts(translations.en);
        } else {
          // Default to Portuguese for 'pt' and any other language
          setTexts(translations.pt);
        }
      } catch (error) {
        console.error("Could not detect browser language, defaulting to Portuguese.", error);
        setTexts(translations.pt); // Fallback to default language on error
      } finally {
        // Add a small delay to ensure loading feels smooth
        setTimeout(() => setLoading(false), 500);
      }
    };

    setLanguageFromBrowser();
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      {loading ? <LoadingSpinner /> : <LeadForm texts={texts} />}
    </main>
  );
};
<SpeedInsights />

export default App;