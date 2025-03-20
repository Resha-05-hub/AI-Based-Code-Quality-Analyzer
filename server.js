const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai"); // Use OpenAI API for AI-based analysis

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI API setup (Replace with your OpenAI API Key)
const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

// Route to analyze code
app.post("/analyze", async (req, res) => {
    const { feature, code, language } = req.body;
    
    if (!feature || !code || !language) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        let prompt = "";
        switch (feature) {
            case "plagiarism_check":
                prompt = `Check if the following ${language} code is plagiarized from common LeetCode solutions:\n${code}`;
                break;
            case "syntax_analysis":
                prompt = `Analyze and correct syntax errors in this ${language} code:\n${code}`;
                break;
            case "code_quality_score":
                prompt = `Rate this ${language} code from 0 to 100 based on quality:\n${code}`;
                break;
            case "optimization_suggestions":
                prompt = `Suggest optimizations for this ${language} code:\n${code}`;
                break;
            case "complexity_analysis":
                prompt = `Analyze time and space complexity for this ${language} code:\n${code}`;
                break;
            default:
                prompt = `Analyze the following ${language} code based on ${feature}:\n${code}`;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 500
        });

        res.json({ result: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI Processing Failed" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`AI Backend running on http://localhost:${PORT}`);
});
