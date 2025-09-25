export const translations = {
  pt: {
    // Step 1
    contactInfoTitle: 'Informações de contato',
    contactInfoDescription: 'Confirme os detalhes que você gostaria de compartilhar conosco:',
    fullNameLabel: 'Nome completo',
    emailLabel: 'Email',
    answerPlaceholder: 'Digite sua resposta',
    // Step 2
    privacyTitle: 'Política de Privacidade',
    privacyDescription: 'Ao clicar em Enviar, você solicita que o Facebook envie suas informações para Duda Ferrer. Lembre-se de que o Facebook não controla como Duda Ferrer usará suas informações. O Facebook também usará suas informações sujeitas à nossa Política de Dados, inclusive para preencher formulários automaticamente para anúncios.',
    // Step 3
    profileAlt: 'Foto do perfil de Duda Ferrer',
    successTitle: 'Obrigado, tudo certo!',
    successDescription: 'Você pode visitar nosso site ou sair do formulário agora.',
    successConfirmation: 'Suas respostas foram enviadas com sucesso.',
    // Buttons
    continueButton: 'Continuar',
    submitButton: 'Enviar',
    viewWebsiteButton: 'Ver site',
    // Header & Footer
    headerStep1: 'Informações de preenchimento',
    headerStep2: 'Revisão de privacidade',
    headerStep3: 'Mensagem para leads',
    stepCounter: (current: number, total: number) => `${current} de ${total}`,
    // Errors
    errorNameRequired: 'O nome completo é obrigatório.',
    errorEmailRequired: 'O e-mail é obrigatório.',
    errorEmailInvalid: 'Por favor, insira um endereço de e-mail válido.',
    errorSubmit: 'Falha ao enviar',
    errorUnknown: 'Ocorreu um erro desconhecido.',
    errorEmailDuplicate: 'Este e-mail já foi cadastrado.',
    errorTryAgain: 'Por favor, tente novamente mais tarde.',
  },
  en: {
    // Step 1
    contactInfoTitle: 'Contact information',
    contactInfoDescription: 'Confirm the details you\'d like to share with us:',
    fullNameLabel: 'Full name',
    emailLabel: 'Email',
    answerPlaceholder: 'Enter your answer',
    // Step 2
    privacyTitle: 'Privacy Policy',
    privacyDescription: 'By clicking Submit, you request Facebook to send your info to Duda Ferrer. Keep in mind that Facebook does not control how Duda Ferrer will use your info. Facebook will also use your info subject to our Data Policy, including to auto-fill forms for ads.',
    // Step 3
    profileAlt: 'Duda Ferrer\'s profile picture',
    successTitle: 'Thanks, you\'re all set!',
    successDescription: 'You can visit our website or exit the form now.',
    successConfirmation: 'You successfully submitted your responses.',
    // Buttons
    continueButton: 'Continue',
    submitButton: 'Submit',
    viewWebsiteButton: 'View website',
    // Header & Footer
    headerStep1: 'Prefill information',
    headerStep2: 'Privacy review',
    headerStep3: 'Message for leads',
    stepCounter: (current: number, total: number) => `${current} of ${total}`,
    // Errors
    errorNameRequired: 'Full name is required.',
    errorEmailRequired: 'Email is required.',
    errorEmailInvalid: 'Please enter a valid email address.',
    errorSubmit: 'Submission failed',
    errorUnknown: 'An unknown error occurred.',
    errorEmailDuplicate: 'This email has already been registered.',
    errorTryAgain: 'Please try again later.',
  },
};

export type Translation = typeof translations.pt;