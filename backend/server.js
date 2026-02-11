const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { generatePlan } = require('./agents/planner');
const { generateCode } = require('./agents/generator');
const { generateExplanation } = require('./agents/explainer');
const { validateUI } = require('./agents/validator');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const { prompt, currentUI } = req.body;

    // 🛡️ Safety: Prompt validation
    if (!prompt || prompt.length > 500) {
        return res.status(400).json({ error: "Invalid prompt length" });
    }

    // 🛡️ Safety: Prompt injection detection
    const suspiciousPatterns = /(<script|javascript:|onerror=|eval\()/i;
    if (suspiciousPatterns.test(prompt)) {
        return res.status(400).json({ error: "Invalid characters in prompt" });
    }

    try {
        console.log("📋 Step 1: Planning...");
        const planObj = await generatePlan(prompt, currentUI || []);

        console.log("⚙️  Step 2: Generating UI...");
        const generatedUI = await generateCode(planObj);

        console.log("🛡️  Step 3: Validating...");
        const validation = validateUI(generatedUI);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        console.log("💬 Step 4: Explaining...");
        const explanation = await generateExplanation(prompt, generatedUI);

        res.json({
            ui: generatedUI,
            explanation: explanation
        });
    } catch (error) {
        console.error("❌ Pipeline Error:", error);
        res.status(500).json({ error: "AI agent failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));