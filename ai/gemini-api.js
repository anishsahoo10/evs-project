// Gemini AI API Configuration and Core Functions
const GEMINI_API_KEY = 'AIzaSyCh-JwFuw38p1B7-fKb3OaJRLglkjNwio8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Rate limiting
let lastAPICall = 0;
const API_COOLDOWN = 2000; // 2 seconds between calls

async function callGeminiAPI(prompt) {
    try {
        // Rate limiting check
        const now = Date.now();
        if (now - lastAPICall < API_COOLDOWN) {
            console.log('Rate limited, using fallback');
            return getFallbackResponse(prompt);
        }
        lastAPICall = now;
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            console.error('API response not ok:', response.status, response.statusText);
            return getFallbackResponse(prompt);
        }

        const data = await response.json();
        
        if (data.error) {
            console.error('API error:', data.error);
            return getFallbackResponse(prompt);
        }
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected API response:', data);
            return getFallbackResponse(prompt);
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        return getFallbackResponse(prompt);
    }
}

function getFallbackResponse(prompt) {
    // Provide smart fallback responses based on prompt type
    if (prompt.includes('daily tips') || prompt.includes('gardening tips')) {
        return getRandomGardeningTip();
    } else if (prompt.includes('garden analysis') || prompt.includes('health')) {
        return getRandomGardenAnalysis();
    } else if (prompt.includes('chat') || prompt.includes('question')) {
        return getRandomChatResponse();
    } else {
        return 'I\'m currently offline, but here\'s some general gardening advice: Water your plants regularly, ensure good drainage, and give them plenty of sunlight! 🌱';
    }
}

function getRandomGardeningTip() {
    const tips = [
        '🌱 Water your plants early morning for best absorption!',
        '☀️ Most herbs need 6+ hours of sunlight daily.',
        '🌿 Check soil moisture by inserting your finger 1-2 inches deep.',
        '🍃 Rotate your plants weekly for even growth.',
        '💧 Use room temperature water to avoid shocking plant roots.',
        '🌸 Deadhead flowers to encourage more blooms.',
        '🌱 Group plants with similar water needs together.'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getRandomGardenAnalysis() {
    const analyses = [
        'Your garden looks healthy! Keep up the regular watering schedule.',
        'Consider adding more organic matter to improve soil quality.',
        'Plants are showing good growth - harvest time approaching!',
        'Monitor for pests during warm weather periods.',
        'Great job maintaining consistent care routines!'
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
}

function getRandomChatResponse() {
    const responses = [
        'I\'m here to help with your gardening questions! 🌱',
        'What would you like to know about plant care?',
        'I can help with watering, lighting, and plant health tips!',
        'Feel free to ask about any gardening challenges you\'re facing.',
        'I\'m your gardening companion - ask me anything! 🌿'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}