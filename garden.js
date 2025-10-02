// Garden JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Available plants for adding
    const availablePlants = [
        {
            id: 1,
            name: "Monstera Deliciosa",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        },
        {
            id: 2,
            name: "Basil",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop"
        },
        {
            id: 3,
            name: "Snake Plant",
            image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop"
        },
        {
            id: 4,
            name: "Cherry Tomatoes",
            image: "https://images.unsplash.com/photo-1592841200221-21e1c4e6e8e5?w=400&h=300&fit=crop"
        },
        {
            id: 5,
            name: "Pothos",
            image: "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400&h=300&fit=crop"
        },
        {
            id: 6,
            name: "Lavender",
            image: "https://images.unsplash.com/photo-1611909023032-2d4b3a2e7d3d?w=400&h=300&fit=crop"
        },
        {
            id: 7,
            name: "Fiddle Leaf Fig",
            image: "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400&h=300&fit=crop"
        },
        {
            id: 8,
            name: "Rosemary",
            image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=300&fit=crop"
        },
        {
            id: 9,
            name: "Peace Lily",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop"
        },
        {
            id: 10,
            name: "Lettuce",
            image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop"
        },
        {
            id: 11,
            name: "Spider Plant",
            image: "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400&h=300&fit=crop"
        },
        {
            id: 12,
            name: "Mint",
            image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&h=300&fit=crop"
        },
        {
            id: 13,
            name: "Rubber Plant",
            image: "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400&h=300&fit=crop"
        },
        {
            id: 14,
            name: "Cilantro",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop"
        },
        {
            id: 15,
            name: "Aloe Vera",
            image: "https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=400&h=300&fit=crop"
        },
        {
            id: 16,
            name: "Peppers",
            image: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop"
        }
    ];
    
    let myGarden = [];
    let currentUser = null;
    let selectedPlantId = null;
    let sortable = null;
    
    const gardenGrid = document.getElementById('gardenGrid');
    const emptyGarden = document.getElementById('emptyGarden');
    const addPlantFab = document.getElementById('addPlantFab');
    const addPlantModal = document.getElementById('addPlantModal');
    const modalClose = document.getElementById('modalClose');
    const plantCarousel = document.getElementById('plantCarousel');
    const cancelBtn = document.getElementById('cancelBtn');
    const addSelectedBtn = document.getElementById('addSelectedBtn');
    const confettiContainer = document.getElementById('confettiContainer');
    
    // Wait for Firebase auth
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadGardenData();
            init();
        }
    });
    
    function init() {
        if (!gardenGrid) {
            console.log('Garden elements not found');
            return;
        }
        renderGarden();
        setupEventListeners();
        updateStats();
        animateEntrance();
    }
    
    function setupEventListeners() {
        addPlantFab.addEventListener('click', openAddPlantModal);
        modalClose.addEventListener('click', closeAddPlantModal);
        cancelBtn.addEventListener('click', closeAddPlantModal);
        addSelectedBtn.addEventListener('click', addSelectedPlant);
        
        addPlantModal.addEventListener('click', function(e) {
            if (e.target === addPlantModal) closeAddPlantModal();
        });
    }
    
    function renderGarden() {
        console.log('Rendering garden with', myGarden.length, 'plants');
        
        if (myGarden.length === 0) {
            gardenGrid.innerHTML = '';
            gardenGrid.appendChild(emptyGarden);
            return;
        }
        
        gardenGrid.innerHTML = '';
        
        myGarden.forEach((plant, index) => {
            const plantCard = createGardenPlantCard(plant, index);
            gardenGrid.appendChild(plantCard);
        });
        
        // Initialize drag and drop (if Sortable is available)
        if (typeof Sortable !== 'undefined') {
            if (sortable) sortable.destroy();
            sortable = new Sortable(gardenGrid, {
                animation: 300,
                ghostClass: 'dragging',
                onStart: function(evt) {
                    evt.item.classList.add('dragging');
                },
                onEnd: function(evt) {
                    evt.item.classList.remove('dragging');
                    // Update garden order
                    const newOrder = Array.from(gardenGrid.children).map(card => 
                        parseInt(card.dataset.plantIndex)
                    );
                    myGarden = newOrder.map(index => myGarden[index]);
                    localStorage.setItem('myGarden', JSON.stringify(myGarden));
                }
            });
        }
    }
    
    function createGardenPlantCard(plant, index) {
        const progress = Math.floor(Math.random() * 100); // Random progress for demo
        const nickname = plant.nickname || plant.name;
        
        const card = document.createElement('div');
        card.className = 'garden-plant-card';
        card.dataset.plantIndex = index;
        
        card.innerHTML = `
            <div class="plant-image-container" style="background-image: url('${plant.image}')">
                <div class="progress-ring">
                    <svg>
                        <circle class="progress-ring-bg" cx="25" cy="25" r="20"></circle>
                        <circle class="progress-ring-fill" cx="25" cy="25" r="20" 
                                style="stroke-dashoffset: ${126 - (progress * 126) / 100}"></circle>
                    </svg>
                    <div class="progress-text">${progress}%</div>
                </div>
            </div>
            <div class="plant-card-content">
                <div class="plant-nickname">${nickname}</div>
                <div class="plant-species">${plant.name}</div>
                <div class="plant-actions">
                    <button class="action-btn water" onclick="waterPlant(${index})">
                        <i class="fas fa-tint"></i>
                    </button>
                    <button class="action-btn fertilize" onclick="fertilizePlant(${index})">
                        <i class="fas fa-leaf"></i>
                    </button>
                    <button class="action-btn remove" onclick="removePlant(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function openAddPlantModal() {
        // Populate carousel
        plantCarousel.innerHTML = '';
        availablePlants.forEach(plant => {
            const plantOption = document.createElement('div');
            plantOption.className = 'carousel-plant-card';
            plantOption.dataset.plantId = plant.id;
            plantOption.innerHTML = `
                <div class="carousel-plant-image" style="background-image: url('${plant.image}')"></div>
                <div class="carousel-plant-name">${plant.name}</div>
            `;
            
            plantOption.addEventListener('click', () => selectPlant(plant.id, plantOption));
            plantCarousel.appendChild(plantOption);
        });
        
        addPlantModal.classList.add('active');
        
        // Modal entrance animation
        anime({
            targets: '.add-plant-modal .modal-content',
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Stagger plant options
        anime({
            targets: '.carousel-plant-card',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .8)',
            delay: anime.stagger(50)
        });
    }
    
    function closeAddPlantModal() {
        anime({
            targets: '.add-plant-modal .modal-content',
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeOutQuad',
            complete: function() {
                addPlantModal.classList.remove('active');
                selectedPlantId = null;
                addSelectedBtn.disabled = true;
            }
        });
    }
    
    function selectPlant(plantId, element) {
        // Remove previous selection
        document.querySelectorAll('.carousel-plant-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection
        element.classList.add('selected');
        selectedPlantId = plantId;
        addSelectedBtn.disabled = false;
        
        // Selection animation
        anime({
            targets: element,
            scale: [1, 1.1, 1.05],
            duration: 300,
            easing: 'easeOutElastic(1, .8)'
        });
    }
    
    async function addSelectedPlant() {
        if (!selectedPlantId) return;
        
        const selectedPlant = availablePlants.find(p => p.id === selectedPlantId);
        const newPlant = {
            ...selectedPlant,
            id: Date.now(), // Unique ID for garden
            nickname: selectedPlant.name,
            addedDate: new Date().toISOString(),
            progress: 0
        };
        
        myGarden.push(newPlant);
        console.log('Added plant, garden now has:', myGarden.length, 'plants');
        await saveGardenData();
        
        closeAddPlantModal();
        
        // Confetti celebration
        createConfetti();
        
        // Re-render garden with bounce animation
        setTimeout(() => {
            renderGarden();
            updateStats();
            
            // Animate new plant card
            const newCard = gardenGrid.lastElementChild;
            if (newCard && !newCard.classList.contains('empty-garden')) {
                anime({
                    targets: newCard,
                    scale: [0, 1.1, 1],
                    opacity: [0, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .8)'
                });
            }
        }, 300);
    }
    
    function createConfetti() {
        const colors = ['#48bb78', '#68d391', '#f6ad55', '#ed8936', '#fc8181'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            
            confettiContainer.appendChild(confetti);
            
            anime({
                targets: confetti,
                translateY: window.innerHeight + 100,
                translateX: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 360,
                duration: Math.random() * 2000 + 1000,
                easing: 'easeOutQuad',
                complete: function() {
                    confetti.remove();
                }
            });
        }
    }
    
    function updateStats() {
        const plantCount = myGarden.length;
        const healthyCount = Math.floor(plantCount * 0.8); // 80% healthy for demo
        const pointsCount = plantCount * 50; // 50 points per plant
        
        // Animate counters
        anime({
            targets: '#plantCount',
            innerHTML: [0, plantCount],
            duration: 1000,
            easing: 'easeOutQuad',
            round: 1
        });
        
        anime({
            targets: '#healthyCount',
            innerHTML: [0, healthyCount],
            duration: 1000,
            easing: 'easeOutQuad',
            round: 1,
            delay: 200
        });
        
        anime({
            targets: '#pointsCount',
            innerHTML: [0, pointsCount],
            duration: 1000,
            easing: 'easeOutQuad',
            round: 1,
            delay: 400
        });
    }
    
    function animateEntrance() {
        // Header animation
        anime({
            targets: '.garden-header h1',
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
        
        // Stats cards staggered
        anime({
            targets: '.stat-card',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: anime.stagger(100, {start: 200})
        });
        
        // Garden grid
        anime({
            targets: '.garden-grid',
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuad',
            delay: 500
        });
    }
    
    // Global functions for plant actions
    window.waterPlant = function(index) {
        const card = document.querySelector(`[data-plant-index="${index}"]`);
        
        anime({
            targets: card.querySelector('.action-btn.water'),
            scale: [1, 1.2, 1],
            duration: 300,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Update progress
        updatePlantProgress(index, 10);
    };
    
    window.fertilizePlant = function(index) {
        const card = document.querySelector(`[data-plant-index="${index}"]`);
        
        anime({
            targets: card.querySelector('.action-btn.fertilize'),
            scale: [1, 1.2, 1],
            duration: 300,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Update progress
        updatePlantProgress(index, 15);
    };
    
    window.removePlant = function(index) {
        const card = document.querySelector(`[data-plant-index="${index}"]`);
        
        anime({
            targets: card,
            scale: [1, 0],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeOutQuad',
            complete: function() {
                myGarden.splice(index, 1);
                saveGardenData();
                renderGarden();
                updateStats();
            }
        });
    };
    
    function updatePlantProgress(index, increment) {
        const progressRing = document.querySelector(`[data-plant-index="${index}"] .progress-ring-fill`);
        const progressText = document.querySelector(`[data-plant-index="${index}"] .progress-text`);
        
        let currentProgress = parseInt(progressText.textContent);
        let newProgress = Math.min(currentProgress + increment, 100);
        
        // Animate progress ring
        anime({
            targets: progressRing,
            strokeDashoffset: 126 - (newProgress * 126) / 100,
            duration: 500,
            easing: 'easeOutQuad'
        });
        
        // Animate progress text
        anime({
            targets: progressText,
            innerHTML: [currentProgress, newProgress],
            duration: 500,
            easing: 'easeOutQuad',
            round: 1,
            complete: function() {
                progressText.textContent = newProgress + '%';
            }
        });
        
        // Celebration if 100%
        if (newProgress === 100) {
            createConfetti();
        }
    }
    
    // Firebase functions
    async function saveGardenData() {
        if (!currentUser) return;
        
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            await setDoc(doc(window.db, 'gardens', currentUser.uid), {
                plants: myGarden,
                lastUpdated: new Date()
            });
            console.log('Garden data saved successfully');
        } catch (error) {
            console.error('Error saving garden:', error);
        }
    }
    
    async function loadGardenData() {
        if (!currentUser) return;
        
        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const docSnap = await getDoc(doc(window.db, 'gardens', currentUser.uid));
            
            if (docSnap.exists()) {
                myGarden = docSnap.data().plants || [];
                console.log('Loaded garden data:', myGarden);
            } else {
                console.log('No garden data found');
                myGarden = [];
            }
        } catch (error) {
            console.error('Error loading garden:', error);
            myGarden = [];
        }
    }
});