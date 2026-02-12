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

app.post('/api/generate', async (req, res) => {
    const { prompt, currentUI } = req.body;

    if (!prompt || prompt.trim().length === 0 || prompt.length > 500) {
        return res.status(400).json({ error: "Invalid prompt length" });
    }

    try {
        console.log("📋 Step 1: Planning...");
        const planObj = await generatePlan(prompt, currentUI || "");

        console.log("⚙️  Step 2: Generating React Code...");
        // Pass currentUI here too so generator can do real modifications
        const reactCode = await generateCode(planObj, currentUI || "");

        console.log("💬 Step 3: Explaining...");
        const explanation = await generateExplanation(prompt, planObj);

        console.log("\n✅ Generated Code:\n", reactCode.substring(0, 200) + "...\n");

        res.json({
            code: reactCode,
            explanation: explanation
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));