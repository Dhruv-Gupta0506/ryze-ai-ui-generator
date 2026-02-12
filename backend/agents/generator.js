const { genAI } = require("../gemini");

const generateCode = async (plan, currentUI = "") => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const isModification = plan.isModification && currentUI && currentUI.trim().length > 0;

  const systemInstruction = `
You are an expert React developer. Generate CLEAN, WORKING React code.

STRICT RULES — FOLLOW EXACTLY:
1. Wrap ALL JSX in ONE parent <div>
2. Import from './components/library'
3. Function MUST be named "GeneratedUI"
4. No syntax errors
5. Button colors MUST be 'blue', 'red', or 'green' — pick based on what user described
6. ALWAYS pass onClick to Button when it needs interactivity
7. Use useState for any toggle/interactive behavior
8. NO inline styles — NO style={{ }} anywhere in the code
9. NEVER use alert(), confirm(), prompt() — use useState instead
10. NO console.log statements
11. NEVER create helper functions — pass all data directly as inline arrays
12. For "back to top" buttons, use: onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
13. CRITICAL COLOR RULE: If user says "red button" → color="red". If "blue button" → color="blue". If "green button" → color="green". You MUST respect the exact color the user specified.
14. SPACING RULE: To add space between two side-by-side buttons, put each Button in its own separate <Card> OR place them as separate children of the same parent so Card's gap-4 separates them. NEVER put two Buttons directly inside a plain <div> without space.

${isModification
    ? `CURRENT CODE TO MODIFY:\n${currentUI}\n\nMake MINIMAL changes. Preserve existing structure. Only add/change what the user asked for.`
    : 'CREATE a new UI based on the plan.'}

PLAN:
${JSON.stringify(plan, null, 2)}

EXACT COMPONENT PROPS:

Button:   <Button text="Label" color="red" onClick={() => handler()} />
Card:     <Card title="Title">children</Card>
Input:    <Input label="Name" placeholder="hint" value={val} onChange={(e) => setVal(e.target.value)} />
Table:    <Table headers={['Col1', 'Col2']} rows={[{ col1: 'a', col2: 'b' }]} />
Navbar:   <Navbar logo="App Name" links={['Home', 'About']} />
Sidebar:  <Sidebar title="Menu" items={['Item1', 'Item2']} />
Modal:    <Modal title="Title" isOpen={showModal}>children</Modal>
Chart:    <Chart type="bar" title="Sales" data={[{ label: 'Jan', value: 400 }]} />
Badge:    <Badge text="Active" variant="green" />
Alert:    <Alert type="info" title="Notice" message="Message text" />

SPACING EXAMPLE — correct way to space two buttons apart:
\`\`\`jsx
import React, { useState } from 'react';
import { Navbar, Card, Button, Chart, Table } from './components/library';

export default function GeneratedUI() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div>
      <Navbar logo="My App" links={['Home', 'Reports']} />

      <Card title="Actions">
        <Button text="Get Started" color="red" onClick={() => {}} />
        <Button
          text={showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          color="blue"
          onClick={() => setShowAnalytics(!showAnalytics)}
        />
      </Card>

      {showAnalytics && (
        <Card title="Analytics">
          <Chart
            type="bar"
            title="Monthly Sales"
            data={[
              { label: 'Jan', value: 120 },
              { label: 'Feb', value: 180 }
            ]}
          />
          <Table
            headers={['Metric', 'Value']}
            rows={[
              { metric: 'Revenue', value: '$500,000' },
              { metric: 'Users', value: '1,200' }
            ]}
          />
        </Card>
      )}
      
      <Card title="Navigation">
        <Button 
          text="Back to Top" 
          color="red" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        />
      </Card>
    </div>
  );
}
\`\`\`

NOW GENERATE CODE. Valid JSX only. No markdown text outside the code block.
`;

  try {
    const result = await model.generateContent([systemInstruction]);
    let text = result.response.text();

    const codeMatch = text.match(/```(?:jsx|javascript|js|tsx)?\s*([\s\S]*?)\s*```/);
    if (codeMatch) {
      text = codeMatch[1];
    }

    if (!text.includes('function GeneratedUI') && !text.includes('const GeneratedUI')) {
      throw new Error('Generated code does not contain GeneratedUI function');
    }

    return text.trim();
  } catch (error) {
    console.error("Generation failed:", error);
    return `import React from 'react';
import { Card, Button } from './components/library';

export default function GeneratedUI() {
  return (
    <Card title="Error">
      <p>Failed to generate UI. Please try again.</p>
      <Button text="Retry" color="blue" />
    </Card>
  );
}`;
  }
};

module.exports = { generateCode };