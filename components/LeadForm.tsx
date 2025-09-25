import React, { useState, useEffect, useRef } from 'react';
import type { Lead } from '../types';
import { saveLead } from '../services/supabase';
import { Translation } from '../i18n';
import { SpeedInsights } from "@vercel/speed-insights/react"

interface LeadFormProps {
  texts: Translation;
}

const FacebookLeadForm: React.FC<LeadFormProps> = ({ texts }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string, api?: string }>({});
  const [animationDirection, setAnimationDirection] = useState<'right' | 'left'>('right');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const websiteUrl = "https://www.facebook.com/profile.php?id=100085172238508";

  useEffect(() => {
    if (step === 1) {
      nameInputRef.current?.focus();
    }
  }, [step]);

  const validateStep1 = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) {
      newErrors.name = texts.errorNameRequired;
    }
    if (!email.trim()) {
      newErrors.email = texts.errorEmailRequired;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = texts.errorEmailInvalid;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setAnimationDirection('right');
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setAnimationDirection('left');
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setName('');
    setEmail('');
    setErrors({});
    setLoading(false);
  };

  // ... (imports e início do componente)

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      // 1. Obter o IP do usuário primeiro
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (!ipResponse.ok) {
        throw new Error('Could not fetch IP address.');
      }
      const ipData = await ipResponse.json();
      const userIp = ipData.ip;

      // 2. Chamar saveLead com os dados do formulário + IP
      const leadData: Lead = { name, email, ip_address: userIp };
      await saveLead(leadData);

      setAnimationDirection('right');
      setStep(3); // Go to success step
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes('duplicate key value')) {
        setErrors({ api: texts.errorEmailDuplicate });
      } else {
        console.error('Submission error:', errorMessage); // For debugging
        setErrors({ api: `${texts.errorSubmit}. ${texts.errorTryAgain}` });
      }

      setStep(2); // Stay on step 2 to show the error
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
              {texts.contactInfoTitle}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </h2>
            <p className="text-sm text-gray-500 mb-6">{texts.contactInfoDescription}</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">{texts.fullNameLabel}</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="full-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={texts.answerPlaceholder}
                  aria-invalid={!!errors.name}
                  className={`w-full bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1" aria-live="polite">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{texts.emailLabel}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={texts.answerPlaceholder}
                  aria-invalid={!!errors.email}
                  className={`w-full bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1" aria-live="polite">{errors.email}</p>}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">{texts.privacyTitle}</h2>
            <p className="text-sm text-gray-600 mb-4">{texts.privacyDescription}</p>
            {errors.api && <p className="text-red-600 text-xs mt-4 text-center" aria-live="polite">{errors.api}</p>}
          </div>
        );
      case 3:
        return (
          <div className="text-center flex flex-col items-center">
            <img src="https://scontent-poa1-1.xx.fbcdn.net/v/t39.30808-6/540500790_743407431841658_3803878415531077354_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEuJNo4l6vtlyfpgNaatTiGfq7xQe4SHEZ-rvFB7hIcRvJzfz5zlm1BFksIDa7C3x_nt-hxCGR6m-lugQzG6e4k&_nc_ohc=lJ9f8IFrepkQ7kNvwFoQDhK&_nc_oc=Adnu1Fjs5PvOGdZU-j1pNxkssdEF9h-2mPhRyzw6pjprAwY3p1eNg1ZnAIuE2ckcBds&_nc_zt=23&_nc_ht=scontent-poa1-1.xx&_nc_gid=fA7dWtsan3M-qU6hlwYD7w&oh=00_AfaNCkIaN4OJPO7IjuJJmSJoJJuUTIrynQN67ZD4zYA0mA&oe=68DB6EA4" alt={texts.profileAlt} className="w-20 h-20 rounded-full mb-4 ring-4 ring-white shadow-lg" />
            <p className="font-semibold text-gray-700">Duda Ferrer</p>
            <h2 className="text-2xl font-bold text-gray-800 my-3">{texts.successTitle}</h2>
            <p className="text-gray-600 text-sm">{texts.successDescription}</p>
            <div className="w-full border-t my-6"></div>
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {texts.successConfirmation}
            </p>
          </div>
        );
      default: return null;
    }
  };

  const renderFooter = () => {
    switch (step) {
      case 1:
        return <button onClick={handleNextStep} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm">{texts.continueButton}</button>;
      case 2:
        return (
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:bg-blue-400 disabled:cursor-wait flex items-center justify-center">
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : texts.submitButton}
          </button>
        );
      case 3:
        return <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm text-center block">{texts.viewWebsiteButton}</a>;
      default: return null;
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden relative flex flex-col">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          {step > 1 && (
            <button onClick={handlePrevStep} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <span className="text-xs text-gray-600 font-medium">{step === 1 ? texts.headerStep1 : step === 2 ? texts.headerStep2 : texts.headerStep3}</span>
        </div>
        <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-grow min-h-[350px] flex flex-col justify-center">
        <div key={step} className={`p-6 md:p-8 ${animationDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
          {renderStepContent()}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t">
        {renderFooter()}
      </div>

      <div className="bg-gray-100 px-6 py-2 flex justify-end items-center text-xs text-gray-600 border-t">
        <div className="flex items-center space-x-2">
          <span>{texts.stepCounter(step, 3)}</span>
          <button onClick={handlePrevStep} disabled={step === 1} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNextStep} disabled={step >= 2} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
<SpeedInsights />

export default FacebookLeadForm;