const { genAI } = require("../gemini");

const generateCode = async (plan) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `
You are a CODE GENERATOR. Convert plan into valid UI schema.

STRICT RULES:
✅ Components allowed: Card, Button, Input, Table, Navbar, Sidebar, Modal, Chart, Badge, Alert
✅ Output ONLY valid JSON array
✅ Every component needs: "component", "props", "children" (array)
❌ NO inline styles
❌ NO CSS generation
❌ NO custom components

OUTPUT EXAMPLE:
[
  {
    "component": "Card",
    "props": { "title": "Dashboard" },
    "children": [
      { "component": "Button", "props": { "text": "Click", "color": "blue" }, "children": [] }
    ]
  }
]
`;

  const result = await model.generateContent([
    systemInstruction, 
    `Plan: ${JSON.stringify(plan)}`
  ]);
  
  const text = result.response.text();

  try {
    // Extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (e) {
    console.error("❌ Generator parse error");
    return [];
  }
};

module.exports = { generateCode };