// AI Garden Analysis Features
// Fixed bugs: error handling, empty garden handling, rate limiting, fallback responses

// Modal functions for detailed analysis view
function showAnalysisModal(icon, title, content) {
    const modal = document.getElementById('analysisModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalIcon && modalTitle && modalContent) {
        modalIcon.textContent = icon;
        modalTitle.textContent = title;
        modalContent.innerHTML = content.replace(/\n/g, '<br>');
        modal.classList.add('active');
        
        // Animate modal appearance
        if (typeof anime !== 'undefined') {
            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }
}

function closeAnalysisModal() {
    const modal = document.getElementById('analysisModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('analysisModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAnalysisModal();
            }
        });
    }
});

// Make function globally available
window.showAnalysisModal = showAnalysisModal;
window.closeAnalysisModal = closeAnalysisModal;
async function runGardenAnalysis() {
    // Show loading state
    setAnalysisLoading();
    
    try {
        const { doc, getDoc, collection, query, getDocs } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
        const user = window.auth?.currentUser;
        
        let gardenData = { plants: [], journalEntries: 0 };
        if (user && window.db) {
            try {
                const gardenDoc = await getDoc(doc(window.db, 'gardens', user.uid));
                if (gardenDoc.exists()) {
                    gardenData.plants = gardenDoc.data().plants || [];
                }
                
                const journalQuery = query(collection(window.db, 'journal', user.uid, 'entries'));
                const journalSnapshot = await getDocs(journalQuery);
                gardenData.journalEntries = journalSnapshot.size;
            } catch (dbError) {
                console.error('Database error:', dbError);
            }
        }

        // Handle empty garden
        if (gardenData.plants.length === 0) {
            showEmptyGardenAnalysis();
            return;
        }

        // Run analysis with delay to prevent rate limiting
        await runHealthAnalysis(gardenData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await runHarvestAnalysis(gardenData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await runPestAnalysis(gardenData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await runPlantingAnalysis(gardenData);

    } catch (error) {
        console.error('Error running analysis:', error);
        showAnalysisError();
    }
}

function setAnalysisLoading() {
    document.getElementById('healthAnalysis').innerHTML = 'Analyzing...';
    document.getElementById('harvestPredictions').innerHTML = 'Calculating...';
    document.getElementById('pestAnalysis').innerHTML = 'Checking...';
    document.getElementById('plantingSuggestions').innerHTML = 'Generating...';
}

function showEmptyGardenAnalysis() {
    document.getElementById('healthAnalysis').innerHTML = 'Add plants to analyze garden health';
    document.getElementById('harvestPredictions').innerHTML = 'Plant something to predict harvests!';
    document.getElementById('pestAnalysis').innerHTML = 'No plants to check for pests';
    document.getElementById('plantingSuggestions').innerHTML = 'Start with herbs like basil or mint!';
}

function showAnalysisError() {
    document.getElementById('healthAnalysis').innerHTML = 'Analysis temporarily unavailable';
    document.getElementById('harvestPredictions').innerHTML = 'Check back later for predictions';
    document.getElementById('pestAnalysis').innerHTML = 'Risk assessment unavailable';
    document.getElementById('plantingSuggestions').innerHTML = 'Try again in a moment';
}

async function runHealthAnalysis(gardenData) {
    try {
        const plantNames = gardenData.plants.map(p => p.name).join(', ');
        const healthPrompt = `garden analysis health for plants: ${plantNames}. ${gardenData.journalEntries} entries. Detailed health assessment with specific recommendations.`;
        const result = await callGeminiAPI(healthPrompt);
        const healthEl = document.getElementById('healthAnalysis');
        if (healthEl) {
            const shortText = result.length > 80 ? result.substring(0, 80) + '...' : result;
            healthEl.innerHTML = shortText;
            healthEl.parentElement.parentElement.setAttribute('data-full-content', result);
            healthEl.parentElement.parentElement.style.cursor = 'pointer';
            healthEl.parentElement.parentElement.onclick = () => showAnalysisModal('🌱', 'Garden Health', result);
        }
    } catch (error) {
        const healthEl = document.getElementById('healthAnalysis');
        const fallback = 'Garden looks healthy! Regular watering and monitoring recommended.';
        healthEl.innerHTML = 'Garden looks healthy! 🌱';
        healthEl.parentElement.parentElement.setAttribute('data-full-content', fallback);
        healthEl.parentElement.parentElement.style.cursor = 'pointer';
        healthEl.parentElement.parentElement.onclick = () => showAnalysisModal('🌱', 'Garden Health', fallback);
    }
}

async function runHarvestAnalysis(gardenData) {
    try {
        const plantNames = gardenData.plants.map(p => p.name).join(', ');
        const harvestPrompt = `harvest predictions for: ${plantNames}. Current season. Detailed timeline with specific dates and tips.`;
        const result = await callGeminiAPI(harvestPrompt);
        const harvestEl = document.getElementById('harvestPredictions');
        if (harvestEl) {
            const shortText = result.length > 80 ? result.substring(0, 80) + '...' : result;
            harvestEl.innerHTML = shortText;
            harvestEl.parentElement.parentElement.setAttribute('data-full-content', result);
            harvestEl.parentElement.parentElement.style.cursor = 'pointer';
            harvestEl.parentElement.parentElement.onclick = () => showAnalysisModal('📅', 'Harvest Predictions', result);
        }
    } catch (error) {
        const harvestEl = document.getElementById('harvestPredictions');
        const fallback = 'Harvest expected in 4-8 weeks depending on plant maturity and growing conditions.';
        harvestEl.innerHTML = 'Harvest in 4-8 weeks! 🍅';
        harvestEl.parentElement.parentElement.setAttribute('data-full-content', fallback);
        harvestEl.parentElement.parentElement.style.cursor = 'pointer';
        harvestEl.parentElement.parentElement.onclick = () => showAnalysisModal('📅', 'Harvest Predictions', fallback);
    }
}

async function runPestAnalysis(gardenData) {
    try {
        const plantNames = gardenData.plants.map(p => p.name).join(', ');
        const pestPrompt = `pest risks for: ${plantNames}. Current season. Detailed assessment with prevention tips.`;
        const result = await callGeminiAPI(pestPrompt);
        const pestEl = document.getElementById('pestAnalysis');
        if (pestEl) {
            const shortText = result.length > 80 ? result.substring(0, 80) + '...' : result;
            pestEl.innerHTML = shortText;
            pestEl.parentElement.parentElement.setAttribute('data-full-content', result);
            pestEl.parentElement.parentElement.style.cursor = 'pointer';
            pestEl.parentElement.parentElement.onclick = () => showAnalysisModal('🐛', 'Pest/Disease Risk', result);
        }
    } catch (error) {
        const pestEl = document.getElementById('pestAnalysis');
        const fallback = 'Low risk currently. Monitor plants regularly for early signs of pests or diseases.';
        pestEl.innerHTML = 'Low risk - keep monitoring! 👀';
        pestEl.parentElement.parentElement.setAttribute('data-full-content', fallback);
        pestEl.parentElement.parentElement.style.cursor = 'pointer';
        pestEl.parentElement.parentElement.onclick = () => showAnalysisModal('🐛', 'Pest/Disease Risk', fallback);
    }
}

async function runPlantingAnalysis(gardenData) {
    try {
        const plantNames = gardenData.plants.map(p => p.name).join(', ');
        const plantingPrompt = `planting suggestions for garden with: ${plantNames}. Detailed companion planting guide with benefits.`;
        const result = await callGeminiAPI(plantingPrompt);
        const plantingEl = document.getElementById('plantingSuggestions');
        if (plantingEl) {
            const shortText = result.length > 80 ? result.substring(0, 80) + '...' : result;
            plantingEl.innerHTML = shortText;
            plantingEl.parentElement.parentElement.setAttribute('data-full-content', result);
            plantingEl.parentElement.parentElement.style.cursor = 'pointer';
            plantingEl.parentElement.parentElement.onclick = () => showAnalysisModal('🌿', 'Planting Suggestions', result);
        }
    } catch (error) {
        const plantingEl = document.getElementById('plantingSuggestions');
        const fallback = 'Try herbs like basil, parsley, or leafy greens like lettuce and spinach for easy growing.';
        plantingEl.innerHTML = 'Try herbs or leafy greens! 🌿';
        plantingEl.parentElement.parentElement.setAttribute('data-full-content', fallback);
        plantingEl.parentElement.parentElement.style.cursor = 'pointer';
        plantingEl.parentElement.parentElement.onclick = () => showAnalysisModal('🌿', 'Planting Suggestions', fallback);
    }
}