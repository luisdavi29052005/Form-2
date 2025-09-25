import React, { useState, useEffect } from 'react';
import LeadForm from './components/LeadForm';
import LoadingSpinner from './components/LoadingSpinner';
import { translations, Translation } from './i18n';
import { SpeedInsights } from "@vercel/speed-insights/react"

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState<Translation>(translations.en); // Default to English

  useEffect(() => {
    const setLanguage = () => {
      try {
        // Define o idioma diretamente como inglês
        setTexts(translations.en);
      } catch (error) {
        console.error("Could not set default language, defaulting to English.", error);
        setTexts(translations.en); // Fallback para inglês em caso de erro
      } finally {
        // Adiciona um pequeno atraso para garantir que o carregamento seja suave
        setTimeout(() => setLoading(false), 500);
      }
    };

    setLanguage();
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      {loading ? <LoadingSpinner /> : <LeadForm texts={texts} />}
    </main>
  );
};
<SpeedInsights />

export default App;