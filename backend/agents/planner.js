const { genAI } = require("../gemini");

const generatePlan = async (prompt, currentUI = []) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `
You are a UI PLANNER. Output ONLY JSON.

CURRENT UI STATE: ${JSON.stringify(currentUI)}

TASK:
1. If current UI is empty → create new layout
2. If current UI exists → MODIFY it (preserve existing components unless told to remove)
3. Keep structure unless explicitly asked to change

ALLOWED COMPONENTS (use ONLY these):
- Card: { title: string }
- Button: { text: string, color: 'blue'|'red'|'green' }
- Input: { label: string, placeholder: string }
- Table: { headers: string[], rows: object[] }
- Navbar: { logo: string, links: string[] }
- Sidebar: { title: string, items: string[] }
- Modal: { title: string, isOpen: boolean }
- Chart: { type: 'bar'|'line'|'pie', data: [{label, value}], title: string }
- Badge: { text: string, variant: 'blue'|'green'|'red'|'yellow'|'gray' }
- Alert: { type: 'info'|'success'|'warning'|'error', message: string, title: string }

OUTPUT FORMAT:
{
  "plan": [
    { "component": "Card", "props": { "title": "Example" }, "children": [] }
  ]
}
`;

  const result = await model.generateContent([systemInstruction, `User Request: ${prompt}`]);
  const text = result.response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return parsed.plan || parsed;
  } catch (e) {
    console.error("❌ Planner parse error");
    return currentUI; // Fallback
  }
};

module.exports = { generatePlan };