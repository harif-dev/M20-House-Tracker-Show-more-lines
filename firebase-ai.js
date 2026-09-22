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
const primaryModel = getGenerativeModel(ai, { model: 'gemini-3.8-flash' });
const fallbackModel = getGenerativeModel(ai, { model: 'gemini-3.5-flash-lite' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const isTemporary = err => /503|overloaded|GEMINI_DEVELOPER_OVERLOADED|unavailable/i.test(String(err?.message || err));

async function callWithRetry(model, prompt, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      last = err;
      if (!isTemporary(err) || i === attempts - 1) throw err;
      window.dispatchEvent(new CustomEvent('m20-ai-retry', { detail: { attempt: i + 2, attempts } }));
      await sleep(900 * (2 ** i));
    }
  }
  throw last;
}

window.M20AI = {
  async generate(prompt) {
    try {
      return await callWithRetry(primaryModel, prompt, 3);
    } catch (err) {
      if (!isTemporary(err)) throw err;
      window.dispatchEvent(new Event('m20-ai-fallback'));
      return await callWithRetry(fallbackModel, prompt, 2);
    }
  }
};
window.dispatchEvent(new Event('m20-ai-ready'));
