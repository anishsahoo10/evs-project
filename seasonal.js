// Seasonal Tips JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Seasonal tips data
    const seasonalTips = {
        autumn: [
            {
                icon: '🍂',
                title: 'Prepare for Winter',
                description: 'Start preparing your plants for the colder months. Reduce watering frequency and move sensitive plants indoors.',
                actions: ['Reduce Watering', 'Move Plants']
            },
            {
                icon: '🌰',
                title: 'Harvest Time',
                description: 'Autumn is perfect for harvesting herbs and vegetables. Collect seeds for next year\'s planting.',
                actions: ['Harvest Herbs', 'Collect Seeds']
            },
            {
                icon: '🍁',
                title: 'Leaf Care',
                description: 'Clean fallen leaves from plant containers to prevent fungal diseases and pest problems.',
                actions: ['Clean Leaves', 'Check Health']
            }
        ],
        winter: [
            {
                icon: '❄️',
                title: 'Indoor Gardening',
                description: 'Focus on indoor plants during winter. Provide adequate light and maintain proper humidity levels.',
                actions: ['Add Grow Lights', 'Increase Humidity']
            },
            {
                icon: '🌿',
                title: 'Minimal Watering',
                description: 'Most plants need less water in winter. Check soil moisture before watering to avoid root rot.',
                actions: ['Check Soil', 'Water Less']
            },
            {
                icon: '🏠',
                title: 'Protect from Cold',
                description: 'Shield outdoor plants from frost and cold winds. Use covers or move containers to sheltered areas.',
                actions: ['Use Covers', 'Find Shelter']
            }
        ],
        spring: [
            {
                icon: '🌸',
                title: 'Spring Awakening',
                description: 'Time to wake up your garden! Start new seedlings and gradually increase watering as plants become active.',
                actions: ['Start Seeds', 'Increase Water']
            },
            {
                icon: '🌱',
                title: 'Repotting Season',
                description: 'Spring is ideal for repotting plants that have outgrown their containers. Fresh soil provides new nutrients.',
                actions: ['Repot Plants', 'Fresh Soil']
            },
            {
                icon: '✂️',
                title: 'Pruning Time',
                description: 'Prune dead or damaged growth to encourage healthy new shoots. Shape your plants for better growth.',
                actions: ['Prune Dead Parts', 'Shape Plants']
            }
        ],
        summer: [
            {
                icon: '☀️',
                title: 'Beat the Heat',
                description: 'Protect plants from intense summer sun. Provide shade during the hottest parts of the day.',
                actions: ['Add Shade', 'Morning Water']
            },
            {
                icon: '💧',
                title: 'Hydration Focus',
                description: 'Summer means more frequent watering. Water early morning or evening to reduce evaporation.',
                actions: ['Water Daily', 'Mulch Soil']
            },
            {
                icon: '🍅',
                title: 'Harvest Season',
                description: 'Enjoy the fruits of your labor! Regular harvesting encourages continued production.',
                actions: ['Harvest Daily', 'Preserve Excess']
            }
        ]
    };
    
    // Plant suggestions by season
    const plantSuggestions = {
        autumn: [
            { icon: '🥬', name: 'Lettuce', reason: 'Cool weather crop' },
            { icon: '🧄', name: 'Garlic', reason: 'Plant for spring harvest' },
            { icon: '🌿', name: 'Herbs', reason: 'Bring indoors for winter' },
            { icon: '🥕', name: 'Carrots', reason: 'Cold-tolerant root vegetable' }
        ],
        winter: [
            { icon: '🌿', name: 'Rosemary', reason: 'Hardy indoor herb' },
            { icon: '🍃', name: 'Pothos', reason: 'Low-light houseplant' },
            { icon: '🌵', name: 'Succulents', reason: 'Minimal water needs' },
            { icon: '🌱', name: 'Microgreens', reason: 'Quick indoor growing' }
        ],
        spring: [
            { icon: '🍅', name: 'Tomatoes', reason: 'Start from seedlings' },
            { icon: '🌶️', name: 'Peppers', reason: 'Warm season crop' },
            { icon: '🌻', name: 'Sunflowers', reason: 'Easy from seed' },
            { icon: '🥒', name: 'Cucumbers', reason: 'Fast-growing vine' }
        ],
        summer: [
            { icon: '🌿', name: 'Basil', reason: 'Loves heat and sun' },
            { icon: '🍆', name: 'Eggplant', reason: 'Heat-loving vegetable' },
            { icon: '🌶️', name: 'Hot Peppers', reason: 'Thrives in heat' },
            { icon: '🌻', name: 'Marigolds', reason: 'Heat-tolerant flowers' }
        ]
    };
    
    let currentSeason = 'autumn';
    let currentTipIndex = 0;
    
    const tipsCarousel = document.getElementById('tipsCarousel');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const suggestionsGrid = document.getElementById('suggestionsGrid');
    
    // Initialize
    init();
    
    function init() {
        setupEventListeners();
        renderTips();
        renderSuggestions();
        animateEntrance();
    }
    
    function setupEventListeners() {
        // Season selector buttons
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const season = this.dataset.season;
                selectSeason(season);
            });
        });
        
        // Carousel controls
        if (prevBtn) prevBtn.addEventListener('click', () => navigateTips(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigateTips(1));
        
        // Touch/swipe support for carousel
        if (tipsCarousel) {
            let startX = 0;
            tipsCarousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            tipsCarousel.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        navigateTips(1);
                    } else {
                        navigateTips(-1);
                    }
                }
            });
        }
    }
    
    function selectSeason(season) {
        currentSeason = season;
        currentTipIndex = 0;
        
        // Update active button
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-season="${season}"]`).classList.add('active');
        
        // Animate season change
        anime({
            targets: '.season-btn.active',
            scale: [1, 1.1, 1.05],
            duration: 400,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Re-render content
        renderTips();
        renderSuggestions();
    }
    
    function renderTips() {
        const tips = seasonalTips[currentSeason];
        tipsCarousel.innerHTML = '';
        carouselDots.innerHTML = '';
        
        tips.forEach((tip, index) => {
            // Create tip card
            const tipCard = document.createElement('div');
            tipCard.className = `tip-card ${currentSeason} flip-in`;
            tipCard.innerHTML = `
                <div class="tip-header">
                    <span class="tip-icon">${tip.icon}</span>
                    <h3 class="tip-title">${tip.title}</h3>
                    <div class="tip-season">${currentSeason}</div>
                </div>
                <div class="tip-content">
                    <p class="tip-description">${tip.description}</p>
                    <div class="tip-actions">
                        ${tip.actions.map(action => `
                            <button class="tip-action">${action}</button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            tipsCarousel.appendChild(tipCard);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `dot ${index === currentTipIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => goToTip(index));
            carouselDots.appendChild(dot);
        });
        
        updateCarouselPosition();
    }
    
    function navigateTips(direction) {
        const tips = seasonalTips[currentSeason];
        const newIndex = currentTipIndex + direction;
        
        if (newIndex >= 0 && newIndex < tips.length) {
            goToTip(newIndex);
        }
    }
    
    function goToTip(index) {
        currentTipIndex = index;
        updateCarouselPosition();
        updateDots();
    }
    
    function updateCarouselPosition() {
        if (!tipsCarousel) return;
        
        const cardWidth = 350 + 32;
        const scrollPosition = currentTipIndex * cardWidth;
        tipsCarousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        if (prevBtn) prevBtn.disabled = currentTipIndex === 0;
        if (nextBtn) nextBtn.disabled = currentTipIndex === seasonalTips[currentSeason].length - 1;
    }
    
    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTipIndex);
        });
    }
    
    function renderSuggestions() {
        if (!suggestionsGrid) return;
        
        const suggestions = plantSuggestions[currentSeason];
        suggestionsGrid.innerHTML = '';
        
        suggestions.forEach((plant) => {
            const suggestionCard = document.createElement('div');
            suggestionCard.className = 'suggestion-card';
            suggestionCard.innerHTML = `
                <span class="suggestion-icon">${plant.icon}</span>
                <div class="suggestion-name">${plant.name}</div>
                <div class="suggestion-reason">${plant.reason}</div>
            `;
            
            suggestionsGrid.appendChild(suggestionCard);
        });
    }
    
    function animateEntrance() {
        const elements = document.querySelectorAll('.seasonal-header, .season-btn');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
});

    
    function renderSuggestions() {
        const suggestions = plantSuggestions[currentSeason];
        suggestionsGrid.innerHTML = '';
        
        suggestions.forEach((plant, index) => {
            const suggestionCard = document.createElement('div');
            suggestionCard.className = 'suggestion-card';
            suggestionCard.innerHTML = `
                <span class="suggestion-icon">${plant.icon}</span>
                <div class="suggestion-name typewriter">${plant.name}</div>
                <div class="suggestion-reason">${plant.reason}</div>
            `;
            
            suggestionsGrid.appendChild(suggestionCard);
        });
        
        // Staggered entrance animation
        anime({
            targets: '.suggestion-card',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .8)',
            delay: anime.stagger(100, {start: 300})
        });
        
        // Typewriter effect for plant names
        setTimeout(() => {
            document.querySelectorAll('.suggestion-name').forEach((name, index) => {
                setTimeout(() => {
                    name.classList.add('typewriter');
                }, index * 200);
            });
        }, 500);
    }
    
    function navigateTips(direction) {
        const tips = seasonalTips[currentSeason];
        const newIndex = currentTipIndex + direction;
        
        if (newIndex >= 0 && newIndex < tips.length) {
            goToTip(newIndex);
        }
    }
    
    function goToTip(index) {
        currentTipIndex = index;
        updateCarouselPosition();
        updateDots();
    }
    
    function updateCarouselPosition() {
        const cardWidth = 350 + 32; // card width + gap\n        const scrollPosition = currentTipIndex * cardWidth;
        tipsCarousel.scrollTo({\n            left: scrollPosition,\n            behavior: 'smooth'\n        });
        
        // Update button states
        prevBtn.disabled = currentTipIndex === 0;
        nextBtn.disabled = currentTipIndex === seasonalTips[currentSeason].length - 1;
    }
    
    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTipIndex);
        });
    }
    
    function animateEntrance() {
        // Header animation
        anime({
            targets: '.seasonal-header h1',
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
        
        // Season buttons staggered
        anime({
            targets: '.season-btn',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: anime.stagger(100, {start: 200})
        });
        
        // Carousel container
        anime({
            targets: '.tips-carousel-container',
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuad',
            delay: 400
        });
        
        // Plant suggestions
        anime({
            targets: '.plant-suggestions h2',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: 600
        });
    }
    
    // Auto-advance carousel (optional)
    setInterval(() => {
        const tips = seasonalTips[currentSeason];
        if (currentTipIndex < tips.length - 1) {
            navigateTips(1);
        } else {
            goToTip(0); // Loop back to first
        }
    }, 8000); // Change every 8 seconds
});