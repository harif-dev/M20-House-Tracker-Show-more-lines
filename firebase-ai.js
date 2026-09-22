import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app-check.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-ai.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAx7wD2HcZ22e9D1RHT5_pvhF80KgZXwcc',
  authDomain: 'planning-with-ai-5f6fc.firebaseapp.com',
  projectId: 'planning-with-ai-5f6fc',
  storageBucket: 'planning-with-ai-5f6fc.firebasestorage.app',
  messagingSenderId: '107775600336',
  appId: '1:107775600336:web:241b0583b16f1caa3820d5'
};

const app = initializeApp(firebaseConfig);
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6Le0J8ktAAAAAOAM5NAvIPLUQzXemELaruS-6zd_'),
  isTokenAutoRefreshEnabled: true
});
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: 'gemini-3.8-flash' });

window.M20AI = {
  async generate(prompt) {
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};
window.dispatchEvent(new Event('m20-ai-ready'));
