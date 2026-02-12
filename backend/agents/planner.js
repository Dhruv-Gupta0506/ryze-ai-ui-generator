const { genAI } = require("../gemini");

const generatePlan = async (prompt, currentUI = "") => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const hasExistingUI = currentUI && currentUI.trim().length > 0;

  const systemInstruction = `
You are a UI PLANNER.

${hasExistingUI ? `CURRENT UI CODE:\n${currentUI}\n\nTASK: MODIFY the existing UI based on the user request. Preserve existing components and only add/change what is needed.` : `TASK: CREATE a new UI from scratch.`}

USER REQUEST: "${prompt}"

ALLOWED COMPONENTS (use only these):
Card, Button, Input, Table, Navbar, Sidebar, Modal, Chart, Badge, Alert

OUTPUT: JSON plan only. No explanation outside the JSON.

FORMAT:
{
  "components": ["Navbar", "Card", "Button"],
  "layout": "single-column",
  "reasoning": "Brief reason for component choices",
  "isModification": ${hasExistingUI}
}
`;

  const result = await model.generateContent([systemInstruction]);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (e) {
    return {
      components: [],
      layout: "single-column",
      reasoning: "",
      isModification: hasExistingUI
    };
  }
};

module.exports = { generatePlan };