const { genAI } = require("../gemini");

const generateCode = async (plan, currentUI = "") => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const isModification = plan.isModification && currentUI && currentUI.trim().length > 0;

  const systemInstruction = `
You are an expert React developer. Generate CLEAN, WORKING React code.

STRICT RULES:
1. Wrap ALL JSX in ONE parent <div>
2. Import from './components/library'
3. Function MUST be named "GeneratedUI"
4. No syntax errors
5. Button colors: 'blue', 'red', 'green' ONLY
6. ALWAYS pass onClick to Button when it should do something interactive
7. Use useState for any toggle/interactive behavior

${isModification ? `CURRENT CODE TO MODIFY (make minimal changes, preserve structure):\n${currentUI}\n\nMODIFY the above code based on this plan. Do not rewrite from scratch.` : 'CREATE new UI based on the plan below.'}

PLAN:
${JSON.stringify(plan, null, 2)}

EXACT COMPONENT PROPS — USE THESE EXACTLY, NO VARIATIONS:

Button:   <Button text="Label" color="blue" onClick={() => doSomething()} />
Card:     <Card title="Title">children here</Card>
Input:    <Input label="Field Name" placeholder="hint" />
Table:    <Table headers={['Col1', 'Col2', 'Col3']} rows={[{ col1: 'a', col2: 'b', col3: 'c' }]} />
Navbar:   <Navbar logo="App Name" links={['Home', 'About']} />
Sidebar:  <Sidebar title="Menu" items={['Item1', 'Item2']} />
Modal:    <Modal title="Title" isOpen={showModal}>children</Modal>
Chart:    <Chart type="bar" title="Sales" data={[{ label: 'Jan', value: 400 }, { label: 'Feb', value: 300 }]} />
Badge:    <Badge text="Active" variant="green" />
Alert:    <Alert type="success" title="Done" message="Operation successful" />

EXAMPLE (shows toggle + table + chart):
\`\`\`jsx
import React, { useState } from 'react';
import { Navbar, Card, Button, Table, Chart } from './components/library';

export default function GeneratedUI() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Navbar logo="My App" links={['Home', 'Reports']} />
      <div style={{ padding: '20px' }}>
        <Button
          text={show ? 'Hide Data' : 'Show Data'}
          color="blue"
          onClick={() => setShow(!show)}
        />
        {show && (
          <Card title="Analytics">
            <Table
              headers={['Metric', 'Value', 'Change']}
              rows={[
                { metric: 'Visitors', value: '12,450', change: '+15%' },
                { metric: 'Revenue', value: '$85,000', change: '+12%' }
              ]}
            />
            <Chart
              type="bar"
              title="Monthly Visitors"
              data={[
                { label: 'Jan', value: 4000 },
                { label: 'Feb', value: 3000 },
                { label: 'Mar', value: 5000 }
              ]}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
\`\`\`

NOW GENERATE CODE. Valid JSX only, no markdown explanation outside the code block.
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