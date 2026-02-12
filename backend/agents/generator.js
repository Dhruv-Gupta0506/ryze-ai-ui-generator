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
5. Button colors: 'blue', 'red', 'green' ONLY
6. ALWAYS pass onClick to Button when it needs interactivity
7. Use useState for any toggle/interactive behavior
8. NO inline styles (no style={{ }} anywhere)
9. NEVER use alert(), confirm(), prompt() — use useState to show/hide content instead
10. NO console.log statements
11. NEVER create helper functions like createTableRows or createChartData — pass data directly inline as arrays
12. When multiple Buttons should appear SIDE BY SIDE in a row, wrap them in a <div> together

${isModification
    ? `CURRENT CODE TO MODIFY:\n${currentUI}\n\nMake MINIMAL changes. Preserve existing structure. Only add/change what the user asked for.`
    : 'CREATE a new UI based on the plan.'}

PLAN:
${JSON.stringify(plan, null, 2)}

EXACT COMPONENT PROPS — USE THESE EXACTLY:

Button:   <Button text="Label" color="blue" onClick={() => setSomething(!something)} />
Card:     <Card title="Title">children</Card>
Input:    <Input label="Field Name" placeholder="hint" />
Table:    <Table headers={['Col1', 'Col2']} rows={[{ col1: 'val', col2: 'val' }]} />
Navbar:   <Navbar logo="App Name" links={['Home', 'About']} />
Sidebar:  <Sidebar title="Menu" items={['Item1', 'Item2']} />
Modal:    <Modal title="Title" isOpen={showModal}>children</Modal>
Chart:    <Chart type="bar" title="Sales" data={[{ label: 'Jan', value: 400 }, { label: 'Feb', value: 300 }]} />
Badge:    <Badge text="Active" variant="green" />
Alert:    <Alert type="success" title="Done" message="Operation successful" />

EXAMPLE (correct spacing, direct inline data, toggle, no helpers):
\`\`\`jsx
import React, { useState } from 'react';
import { Navbar, Card, Button, Table, Chart, Badge } from './components/library';

export default function GeneratedUI() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div>
      <Navbar logo="My App" links={['Home', 'Reports']} />

      <Card title="Overview">
        <Badge text="Users: 1.5K" variant="green" />
        <Badge text="Revenue: $5,200" variant="blue" />
      </Card>

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
          <Table
            headers={['Metric', 'Value', 'Change']}
            rows={[
              { metric: 'Revenue', value: '$500,000', change: '+5%' },
              { metric: 'Users', value: '1,200', change: '+10%' }
            ]}
          />
          <Chart
            type="bar"
            title="Monthly Sales"
            data={[
              { label: 'Jan', value: 120 },
              { label: 'Feb', value: 150 },
              { label: 'Mar', value: 130 }
            ]}
          />
          <Button text="Go Back" color="blue" onClick={() => setShowAnalytics(false)} />
        </Card>
      )}
    </div>
  );
}
\`\`\`

NOW GENERATE CODE. Valid JSX only. No markdown outside the code block.
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