const { genAI } = require("../gemini");

const generateExplanation = async (userIntent, plan) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `
You are a UI Design Critic. 
Explain WHY the specific components were chosen to satisfy the user request.
- Keep it brief (2 sentences).
- Do NOT show code.
- Reference layout choices (e.g. "I added a Table for better data visibility").
`;

  const result = await model.generateContent([
    systemInstruction, 
    `Intent: ${userIntent}`, 
    `Plan: ${JSON.stringify(plan)}`
  ]);

  return result.response.text();
};

module.exports = { generateExplanation };