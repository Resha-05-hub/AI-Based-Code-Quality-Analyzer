const GEMINI_API_KEY = "AIzaSyDsqxoSPDmHoQhVqm84MEQJ6np1KEx2-rM";
const AI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received Request:", request);

    if (!request.code) {
        sendResponse({ result: "Error: No code detected!" });
        return true;
    }

    let prompt = getFeaturePrompt(request.feature, request.code, request.language || "JavaScript");

    fetch(AI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]  // ✅ Correct request format
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Full AI Response:", JSON.stringify(data, null, 2)); // ✅ Debugging log

        let resultText = data?.candidates?.[0]?.content.parts[0].text || "AI Analysis Failed!";
        sendResponse({ result: resultText });
    })
    .catch(error => {
        console.error("AI API Error:", error);
        sendResponse({ result: `AI Analysis Failed! Error: ${error.message}` });
    });

    return true; // ✅ Keeps async response channel open
});

function getFeaturePrompt(feature, code, language) {
    switch (feature) {
        case "Plagiarism Check":
            return `Check if the following ${language} code is plagiarized and compare it with common implementations:\n\n${code}`;
        case "Syntax Analysis":
            return `Analyze the syntax of this ${language} code and correct any errors:\n\n${code}`;
        case "Code Quality Score":
            return `Rate the quality of this ${language} code on a scale of 0-100, considering readability, structure, and best practices:\n\n${code}`;
        case "AI Hints":
            return `Provide hints to solve the problem in this ${language} code without revealing the full solution:\n\n${code}`;
        case "Smart Test Case Analysis":
            return `Generate AI-based real-world test cases for this ${language} code:\n\n${code}`;
        case "Optimization Suggestions":
            return `Suggest optimized implementations for this ${language} code to improve efficiency:\n\n${code}`;
        case "Adaptive Hints":
            return `Provide hints for improving the approach in this ${language} code based on difficulty level:\n\n${code}`;
        case "Performance Insights":
            return `Analyze the performance bottlenecks in this ${language} code:\n\n${code}`;
        case "Complexity Analysis":
            return `Determine the time and space complexity of this ${language} code:\n\n${code}`;
        case "Code Comments":
            return `Generate meaningful comments for the following ${language} code to enhance readability:\n\n${code}`;
        case "Naming Suggestions":
            return `Suggest better variable and function names for the following ${language} code:\n\n${code}`;
        case "Similarity Detector":
            return `Check the similarity of this ${language} code with other common LeetCode solutions:\n\n${code}`;
        default:
            return `Analyze the following ${language} code:\n\n${code}`;
    }
}
