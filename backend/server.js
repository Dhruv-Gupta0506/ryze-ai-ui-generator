const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This stops the "Cannot GET /" error
app.get('/', (req, res) => {
    res.send("Server is running! Frontend can now talk to /api/generate");
});

app.post('/api/generate', (req, res) => {
    const { prompt } = req.body;
    
    // This is the 3-step agent response the assignment needs
    res.json({
        plan: `Planning UI for: ${prompt}`,
        explanation: "I used a Card to group the elements and a Button for the action.",
        ui: [
            {
                component: "Card",
                props: { title: "Generated Result" },
                children: [
                    { component: "Input", props: { label: "User Input", placeholder: "Enter text..." } },
                    { component: "Button", props: { text: "Submit", color: "blue" } }
                ]
            }
        ]
    });
});

app.listen(5000, () => console.log("Backend running on port 5000"));