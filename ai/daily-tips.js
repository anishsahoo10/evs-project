// AI Daily Tips Generator
async function generateDailyTips() {
    const tipsContainer = document.getElementById('aiDailyTips');
    if (!tipsContainer) return;
    
    tipsContainer.innerHTML = '<div class="loading-tip">🌱 Generating personalized tips...</div>';

    try {
        const user = window.auth?.currentUser;
        let plants = [];
        
        // Get user's garden data
        if (user && window.db) {
            try {
                const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
                const gardenDoc = await getDoc(doc(window.db, 'gardens', user.uid));
                if (gardenDoc.exists()) {
                    plants = gardenDoc.data().plants || [];
                }
            } catch (dbError) {
                console.log('Database not available, using fallback tips');
            }
        }

        // Get weather data
        const weatherTemp = document.getElementById('weatherTemp')?.textContent || '20°C';
        const weatherDesc = document.getElementById('weatherDesc')?.textContent || 'mild';
        const season = getCurrentSeason();
        
        let tips;
        if (plants.length > 0) {
            // Generate AI tips for specific plants
            tips = await generatePersonalizedTips(plants, weatherTemp, weatherDesc, season);
        } else {
            // Show beginner tips
            tips = getBeginnerTips(season, weatherDesc);
        }
        
        displayTips(tips, tipsContainer);
        
    } catch (error) {
        console.error('Error generating tips:', error);
        showFallbackTips(tipsContainer);
    }
}

async function generatePersonalizedTips(plants, temp, weather, season) {
    const plantNames = plants.map(p => p.name).join(', ');
    const tempNum = parseInt(temp);
    
    const prompt = `Give 3 specific daily gardening tips for plants: ${plantNames}. Weather: ${temp} ${weather}. Season: ${season}. Make each tip:
- One sentence only
- Actionable today
- Plant-specific
- Include emoji
- No generic advice

Format: • [emoji] [specific tip]`;

    try {
        const response = await callGeminiAPI(prompt);
        return parseAITips(response) || getSmartFallbackTips(plants, tempNum, weather, season);
    } catch (error) {
        return getSmartFallbackTips(plants, tempNum, weather, season);
    }
}

function parseAITips(response) {
    if (!response || response.length < 20) return null;
    
    // Clean and format the response
    const lines = response.split('\n').filter(line => line.trim());
    const tips = [];
    
    for (const line of lines) {
        const cleaned = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleaned.length > 10 && cleaned.length < 150) {
            tips.push(cleaned);
        }
        if (tips.length >= 3) break;
    }
    
    return tips.length >= 2 ? tips : null;
}

function getSmartFallbackTips(plants, temp, weather, season) {
    const tips = [];
    const plantNames = plants.map(p => p.name.toLowerCase());
    
    // Always add temperature-based tip
    if (temp > 25) {
        if (plantNames.some(p => ['tomato', 'pepper', 'basil'].includes(p))) {
            tips.push('🌡️ Water your heat-loving plants early morning to avoid evaporation');
        } else {
            tips.push('☀️ Provide shade for delicate plants during peak sun hours');
        }
    } else if (temp < 10) {
        tips.push('🧊 Protect tender plants from frost with covers or move indoors');
    } else {
        tips.push('💧 Check soil moisture by inserting finger 2 inches deep');
    }
    
    // Always add plant-specific tips
    if (plantNames.includes('basil')) {
        tips.push('🌿 Pinch basil flowers to keep leaves tender and flavorful');
    } else if (plantNames.includes('tomato')) {
        tips.push('🍅 Check tomato plants for suckers and remove them for better fruit');
    } else if (plantNames.some(p => ['lettuce', 'spinach', 'kale'].includes(p))) {
        tips.push('🥬 Harvest outer leaves of leafy greens to encourage new growth');
    } else {
        tips.push('🌱 Rotate your plants weekly for even growth and sunlight');
    }
    
    // Always add weather-based tip
    if (weather.includes('rain')) {
        tips.push('🌧️ Skip watering today - let nature do the work!');
    } else if (weather.includes('sunny')) {
        tips.push('☀️ Perfect weather for outdoor plant maintenance tasks');
    } else {
        tips.push('🌤️ Good day to check plants for pests and diseases');
    }
    
    // Always add seasonal tip
    if (season === 'spring') {
        tips.push('🌱 Perfect time to start seeds indoors for summer planting');
    } else if (season === 'summer') {
        tips.push('🌞 Mulch around plants to retain moisture and suppress weeds');
    } else if (season === 'autumn') {
        tips.push('🍂 Plant cool-season crops like lettuce and radishes now');
    } else {
        tips.push('🏠 Move tender herbs indoors for winter growing');
    }
    
    return tips.slice(0, 4);
}

function getBeginnerTips(season, weather) {
    const tips = [
        '🌱 Start with easy herbs like basil, mint, or parsley',
        '💧 Water when top inch of soil feels dry to touch',
        '☀️ Most vegetables need 6+ hours of direct sunlight daily',
        '🌿 Choose containers with drainage holes for healthy roots'
    ];
    
    if (season === 'spring') {
        tips[0] = '🌿 Spring is perfect for starting your first herb garden';
    } else if (season === 'winter') {
        tips[0] = '🏠 Try growing herbs on a sunny windowsill indoors';
    }
    
    return tips;
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

function displayTips(tips, container) {
    const tipsHtml = tips.map(tip => `<div class="daily-tip">${tip}</div>`).join('');
    
    container.innerHTML = `
        <div class="ai-tip-content">
            <div class="tips-list">${tipsHtml}</div>
            <div class="ai-timestamp">Updated ${new Date().toLocaleTimeString()}</div>
        </div>
    `;
}

function showFallbackTips(container) {
    const fallbackTips = [
        '🌱 Check your plants daily for signs of pests or disease',
        '💧 Water deeply but less frequently for stronger roots',
        '☀️ Rotate plants weekly for even growth and sunlight exposure',
        '🌿 Remove dead or yellowing leaves to promote new growth'
    ];
    
    displayTips(fallbackTips, container);
}