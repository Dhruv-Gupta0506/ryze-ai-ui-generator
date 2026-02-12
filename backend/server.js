const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { generatePlan } = require('./agents/planner');
const { generateCode } = require('./agents/generator');
const { generateExplanation } = require('./agents/explainer');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

const getFriendlyError = (error) => {
  const msg = error.message || '';
  if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'API limit reached. Please wait a moment or check your Gemini API quota.';
  }
  if (msg.includes('API_KEY') || msg.includes('api key') || msg.includes('403')) {
    return 'Invalid API key. Check your .env file.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Network error. Check your internet connection.';
  }
  return 'Something went wrong. Please try again.';
};

const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /ignore all instructions/i,
  /you are now/i,
  /act as/i,
  /jailbreak/i,
  /system prompt/i,
  /disregard/i,
  /forget your/i,
];

app.post('/api/generate', async (req, res) => {
    const { prompt, currentUI } = req.body;

    if (!prompt || prompt.trim().length === 0 || prompt.length > 500) {
        return res.status(400).json({ error: 'Prompt must be between 1 and 500 characters.' });
    }

    const isInjection = INJECTION_PATTERNS.some(p => p.test(prompt));
    if (isInjection) {
        return res.status(400).json({ error: 'Invalid prompt detected. Please describe a UI instead.' });
    }

    try {
        console.log("📋 Step 1: Planning...");
        const planObj = await generatePlan(prompt, currentUI || "");

        console.log("⚙️  Step 2: Generating React Code...");
        const reactCode = await generateCode(planObj, currentUI || "");

        console.log("💬 Step 3: Explaining...");
        const explanation = await generateExplanation(prompt, planObj);

        console.log("\n✅ Generated Code:\n", reactCode.substring(0, 200) + "...\n");

        res.json({
            code: reactCode,
            explanation: explanation
        });
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: getFriendlyError(error) });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));