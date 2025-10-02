// Secure Plant Library JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Utility function to safely create text nodes and prevent XSS
    function createSafeElement(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }
    
    // Utility function to safely set background image
    function setSafeBackgroundImage(element, imageUrl) {
        // Basic URL validation
        if (imageUrl && (imageUrl.startsWith('https://') || imageUrl.startsWith('http://'))) {
            // Escape single quotes and backslashes to prevent CSS injection
            const escapedUrl = imageUrl.replace(/'/g, "\\''").replace(/\\/g, "\\\\");
            element.style.backgroundImage = `url('${escapedUrl}')`;
        }
    }
    
    // Plant data
    const plants = [
        {
            id: 1,
            name: "Monstera Deliciosa",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
            description: "Beautiful split-leaf plant perfect for bright indoor spaces.",
            fullDescription: "The Monstera Deliciosa is a stunning tropical plant known for its large, glossy leaves with natural splits and holes. It's perfect for adding a tropical feel to any indoor space and is relatively easy to care for.",
            difficulty: "easy",
            water: "Weekly",
            light: "Bright Indirect",
            humidity: "Medium",
            temperature: "65-80°F",
            tags: ["Low Maintenance", "Air Purifying"]
        },
        {
            id: 2,
            name: "Basil",
            type: "Herb",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
            description: "Aromatic herb perfect for cooking and balcony gardens.",
            fullDescription: "Fresh basil is a must-have for any urban garden. This aromatic herb is perfect for cooking, making pesto, and adding fresh flavor to your meals. It grows well in containers and loves sunny spots.",
            difficulty: "easy",
            water: "2-3 times/week",
            light: "Full Sun",
            humidity: "Low",
            temperature: "70-85°F",
            tags: ["Edible", "Aromatic", "Fast Growing"]
        },
        {
            id: 3,
            name: "Snake Plant",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop",
            description: "Nearly indestructible plant that thrives in low light.",
            fullDescription: "The Snake Plant is perfect for beginners and busy people. It can survive in low light conditions and requires minimal watering. Known for its air-purifying qualities and striking upright leaves.",
            difficulty: "easy",
            water: "Every 2-3 weeks",
            light: "Low to Bright",
            humidity: "Low",
            temperature: "60-80°F",
            tags: ["Low Light", "Air Purifying", "Drought Tolerant"]
        },
        {
            id: 4,
            name: "Cherry Tomatoes",
            type: "Vegetable",
            image: "https://images.unsplash.com/photo-1592841200221-21e1c4e6e8e5?w=400&h=300&fit=crop",
            description: "Sweet, bite-sized tomatoes perfect for container growing.",
            fullDescription: "Cherry tomatoes are ideal for urban gardening. They produce abundant small, sweet fruits and can be grown in containers on balconies or rooftops. Perfect for salads and snacking.",
            difficulty: "medium",
            water: "Daily",
            light: "Full Sun",
            humidity: "Medium",
            temperature: "65-85°F",
            tags: ["Edible", "Productive", "Container Friendly"]
        },
        {
            id: 5,
            name: "Pothos",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400&h=300&fit=crop",
            description: "Trailing vine that's perfect for hanging baskets.",
            fullDescription: "Pothos is one of the easiest houseplants to grow. Its trailing vines look beautiful in hanging baskets or climbing up moss poles. It's very forgiving and can tolerate various light conditions.",
            difficulty: "easy",
            water: "Weekly",
            light: "Low to Bright",
            humidity: "Low to Medium",
            temperature: "65-85°F",
            tags: ["Trailing", "Air Purifying", "Low Maintenance"]
        },
        {
            id: 6,
            name: "Lavender",
            type: "Herb",
            image: "https://images.unsplash.com/photo-1611909023032-2d4b3a2e7d3d?w=400&h=300&fit=crop",
            description: "Fragrant purple flowers with calming properties.",
            fullDescription: "Lavender brings beautiful purple blooms and incredible fragrance to your garden. It's drought-tolerant once established and attracts beneficial pollinators. Perfect for aromatherapy and crafts.",
            difficulty: "medium",
            water: "Weekly",
            light: "Full Sun",
            humidity: "Low",
            temperature: "60-80°F",
            tags: ["Fragrant", "Drought Tolerant", "Pollinator Friendly"]
        },
        {
            id: 7,
            name: "Fiddle Leaf Fig",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400&h=300&fit=crop",
            description: "Stunning large-leafed tree perfect as a statement plant.",
            fullDescription: "The Fiddle Leaf Fig is a popular indoor tree with large, violin-shaped leaves. It makes an excellent statement plant and can grow quite tall indoors with proper care.",
            difficulty: "medium",
            water: "Weekly",
            light: "Bright Indirect",
            humidity: "Medium",
            temperature: "65-75°F",
            tags: ["Statement Plant", "Large Leaves", "Tree"]
        },
        {
            id: 8,
            name: "Rosemary",
            type: "Herb",
            image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=300&fit=crop",
            description: "Woody herb with needle-like leaves, perfect for cooking.",
            fullDescription: "Rosemary is a hardy, aromatic herb that's perfect for Mediterranean cooking. It's drought-tolerant and can be grown year-round in containers. Great for roasted vegetables and meats.",
            difficulty: "easy",
            water: "Weekly",
            light: "Full Sun",
            humidity: "Low",
            temperature: "60-80°F",
            tags: ["Edible", "Drought Tolerant", "Aromatic"]
        },
        {
            id: 9,
            name: "Peace Lily",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
            description: "Elegant white flowers with glossy green leaves.",
            fullDescription: "Peace Lilies are known for their beautiful white blooms and ability to thrive in low light. They're excellent air purifiers and will tell you when they need water by drooping slightly.",
            difficulty: "easy",
            water: "Weekly",
            light: "Low to Medium",
            humidity: "Medium",
            temperature: "65-80°F",
            tags: ["Flowering", "Air Purifying", "Low Light"]
        },
        {
            id: 10,
            name: "Lettuce",
            type: "Vegetable",
            image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
            description: "Fresh, crisp greens perfect for salads and sandwiches.",
            fullDescription: "Lettuce is one of the easiest vegetables to grow in containers. It grows quickly and you can harvest leaves continuously. Perfect for fresh salads and a great starter vegetable for beginners.",
            difficulty: "easy",
            water: "Daily",
            light: "Partial Sun",
            humidity: "Medium",
            temperature: "60-70°F",
            tags: ["Edible", "Fast Growing", "Cool Season"]
        },
        {
            id: 11,
            name: "Spider Plant",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400&h=300&fit=crop",
            description: "Easy-care plant that produces baby plantlets.",
            fullDescription: "Spider Plants are incredibly easy to care for and propagate. They produce small plantlets that can be rooted to create new plants. Great for beginners and perfect in hanging baskets.",
            difficulty: "easy",
            water: "Weekly",
            light: "Bright Indirect",
            humidity: "Low to Medium",
            temperature: "65-75°F",
            tags: ["Easy Propagation", "Air Purifying", "Hanging"]
        },
        {
            id: 12,
            name: "Mint",
            type: "Herb",
            image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&h=300&fit=crop",
            description: "Refreshing herb perfect for teas and cocktails.",
            fullDescription: "Mint is a vigorous herb that's perfect for containers (it can be invasive in gardens). Great for making fresh teas, mojitos, and adding to summer dishes. Very easy to grow and propagate.",
            difficulty: "easy",
            water: "2-3 times/week",
            light: "Partial Sun",
            humidity: "Medium",
            temperature: "65-80°F",
            tags: ["Edible", "Refreshing", "Fast Growing"]
        },
        {
            id: 13,
            name: "Rubber Plant",
            type: "Indoor",
            image: "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400&h=300&fit=crop",
            description: "Glossy-leafed plant that's perfect for beginners.",
            fullDescription: "Rubber Plants have beautiful, glossy leaves and are very forgiving for beginners. They can grow quite large and make excellent statement plants. They're also great air purifiers.",
            difficulty: "easy",
            water: "Weekly",
            light: "Bright Indirect",
            humidity: "Low to Medium",
            temperature: "65-80°F",
            tags: ["Glossy Leaves", "Air Purifying", "Statement Plant"]
        },
        {
            id: 14,
            name: "Cilantro",
            type: "Herb",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
            description: "Fresh herb essential for Mexican and Asian cuisine.",
            fullDescription: "Cilantro is a fast-growing herb that's essential for many cuisines. It prefers cooler weather and can bolt quickly in heat, so succession planting is recommended for continuous harvest.",
            difficulty: "easy",
            water: "2-3 times/week",
            light: "Partial Sun",
            humidity: "Medium",
            temperature: "50-70°F",
            tags: ["Edible", "Fast Growing", "Cool Season"]
        },
        {
            id: 15,
            name: "Aloe Vera",
            type: "Succulent",
            image: "https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=400&h=300&fit=crop",
            description: "Medicinal succulent with healing gel in its leaves.",
            fullDescription: "Aloe Vera is a useful succulent known for its healing properties. The gel inside the leaves can soothe burns and cuts. It's very low-maintenance and perfect for sunny windowsills.",
            difficulty: "easy",
            water: "Every 2-3 weeks",
            light: "Bright Direct",
            humidity: "Low",
            temperature: "60-80°F",
            tags: ["Medicinal", "Drought Tolerant", "Low Maintenance"]
        },
        {
            id: 16,
            name: "Peppers",
            type: "Vegetable",
            image: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop",
            description: "Colorful peppers perfect for container gardening.",
            fullDescription: "Peppers are excellent for container growing and come in many varieties from sweet bell peppers to hot chilis. They're productive plants that love warm weather and full sun.",
            difficulty: "medium",
            water: "Daily",
            light: "Full Sun",
            humidity: "Medium",
            temperature: "70-85°F",
            tags: ["Edible", "Colorful", "Productive"]
        }
    ];
    
    const plantGrid = document.getElementById('plantGrid');
    const searchInput = document.getElementById('searchInput');
    const plantModal = document.getElementById('plantModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    
    // Initialize with null checks
    init();
    
    function init() {
        if (!plantGrid) {
            console.error('Plant grid element not found');
            return;
        }
        renderPlants(plants);
        setupEventListeners();
        animateEntrance();
    }
    
    function setupEventListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (plantModal) {
            plantModal.addEventListener('click', function(e) {
                if (e.target === plantModal) closeModal();
            });
        }
        
        // Search box glow effect
        if (searchInput && typeof anime !== 'undefined') {
            searchInput.addEventListener('focus', function() {
                const searchBox = document.querySelector('.search-box');
                if (searchBox) {
                    anime({
                        targets: searchBox,
                        boxShadow: '0 8px 32px rgba(104, 211, 145, 0.3)',
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
            
            searchInput.addEventListener('blur', function() {
                const searchBox = document.querySelector('.search-box');
                if (searchBox) {
                    anime({
                        targets: searchBox,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }
    }
    
    function renderPlants(plantsToRender) {
        if (!plantGrid) return;
        
        plantGrid.innerHTML = '';
        
        plantsToRender.forEach((plant, index) => {
            const plantCard = createPlantCard(plant);
            plantGrid.appendChild(plantCard);
            
            // Staggered entrance animation
            if (typeof anime !== 'undefined') {
                anime({
                    targets: plantCard,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    scale: [0.8, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .8)',
                    delay: index * 100
                });
            }
        });
    }
    
    function createPlantCard(plant) {
        const card = createSafeElement('div', 'plant-card card');
        
        // Create image container
        const imageDiv = createSafeElement('div', 'plant-image');
        setSafeBackgroundImage(imageDiv, plant.image);
        
        // Create info container
        const infoDiv = createSafeElement('div', 'plant-info card-body');
        
        // Create name element
        const nameDiv = createSafeElement('div', 'plant-name card-title', plant.name);
        
        // Create type element
        const typeDiv = createSafeElement('div', 'plant-type text-primary-600', plant.type);
        
        // Create description element
        const descDiv = createSafeElement('div', 'plant-description text-gray-600', plant.description);
        
        // Create tags container
        const tagsDiv = createSafeElement('div', 'plant-tags flex flex-wrap gap-2 mt-4');
        
        // Add difficulty tag
        const difficultyTag = createSafeElement('span', `plant-tag difficulty-${plant.difficulty} px-2 py-1 rounded-full text-xs font-medium`, plant.difficulty);
        tagsDiv.appendChild(difficultyTag);
        
        // Add other tags safely
        if (plant.tags && Array.isArray(plant.tags)) {
            plant.tags.forEach(tag => {
                const tagElement = createSafeElement('span', 'plant-tag px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700', tag);
                tagsDiv.appendChild(tagElement);
            });
        }
        
        // Assemble the card
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(typeDiv);
        infoDiv.appendChild(descDiv);
        infoDiv.appendChild(tagsDiv);
        
        card.appendChild(imageDiv);
        card.appendChild(infoDiv);
        
        // Add click event listener
        card.addEventListener('click', () => openPlantModal(plant));
        
        return card;
    }
    
    function handleSearch() {
        if (!searchInput) return;
        
        const query = searchInput.value.toLowerCase();
        const filteredPlants = plants.filter(plant => 
            plant.name.toLowerCase().includes(query) ||
            plant.type.toLowerCase().includes(query) ||
            plant.tags.some(tag => tag.toLowerCase().includes(query))
        );
        
        // Fade out current plants
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.plant-card',
                opacity: 0,
                scale: 0.8,
                duration: 200,
                easing: 'easeOutQuad',
                complete: function() {
                    renderPlants(filteredPlants);
                }
            });
        } else {
            renderPlants(filteredPlants);
        }
    }
    
    function openPlantModal(plant) {
        if (!modalBody || !plantModal) return;
        
        // Clear modal body
        modalBody.innerHTML = '';
        
        // Create modal hero image
        const heroDiv = createSafeElement('div', 'modal-hero');
        setSafeBackgroundImage(heroDiv, plant.image);
        
        // Create title
        const titleDiv = createSafeElement('div', 'modal-title text-2xl font-bold mb-2', plant.name);
        
        // Create type
        const typeDiv = createSafeElement('div', 'modal-type text-primary-600 font-medium mb-4', plant.type);
        
        // Create description
        const descDiv = createSafeElement('div', 'modal-description text-gray-700 mb-6', plant.fullDescription);
        
        // Create care info container
        const careDiv = createSafeElement('div', 'care-info grid grid-cols-2 gap-4 mb-6');
        
        // Care items
        const careItems = [
            { icon: '💧', label: `Water: ${plant.water}` },
            { icon: '☀️', label: `Light: ${plant.light}` },
            { icon: '💨', label: `Humidity: ${plant.humidity}` },
            { icon: '🌡️', label: `Temp: ${plant.temperature}` }
        ];
        
        careItems.forEach(item => {
            const careItem = createSafeElement('div', 'care-item flex items-center gap-2');
            const iconDiv = createSafeElement('div', 'care-icon text-xl', item.icon);
            const labelDiv = createSafeElement('div', 'care-label text-sm text-gray-600', item.label);
            
            careItem.appendChild(iconDiv);
            careItem.appendChild(labelDiv);
            careDiv.appendChild(careItem);
        });
        
        // Create add to garden button
        const addButton = createSafeElement('button', 'add-to-garden btn btn-primary w-full');
        const buttonIcon = createSafeElement('i', 'fas fa-plus');
        const buttonText = createSafeElement('span', '', ' Add to My Garden');
        addButton.appendChild(buttonIcon);
        addButton.appendChild(buttonText);
        addButton.addEventListener('click', () => addToGarden(plant.id));
        
        // Assemble modal
        modalBody.appendChild(heroDiv);
        modalBody.appendChild(titleDiv);
        modalBody.appendChild(typeDiv);
        modalBody.appendChild(descDiv);
        modalBody.appendChild(careDiv);
        modalBody.appendChild(addButton);
        
        plantModal.classList.add('active');
        
        // Modal entrance animation
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.modal-content',
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
        }
    }
    
    function closeModal() {
        if (!plantModal) return;
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.modal-content',
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeOutQuad',
                complete: function() {
                    plantModal.classList.remove('active');
                }
            });
        } else {
            plantModal.classList.remove('active');
        }
    }
    
    function animateEntrance() {
        if (typeof anime === 'undefined') return;
        
        // Header animation
        const headerH1 = document.querySelector('.library-header h1, .main-header h1');
        if (headerH1) {
            anime({
                targets: headerH1,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
        }
        
        // Search box animation
        const searchContainer = document.querySelector('.search-container, .main-header > div:last-child');
        if (searchContainer) {
            anime({
                targets: searchContainer,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 600,
                easing: 'easeOutQuad',
                delay: 200
            });
        }
    }
    
    // Secure function for adding to garden
    async function addToGarden(plantId) {
        // Validate plantId
        if (!plantId || typeof plantId !== 'number') {
            console.error('Invalid plant ID');
            return;
        }
        
        const plant = plants.find(p => p.id === plantId);
        if (!plant) {
            console.error('Plant not found');
            return;
        }
        
        const addButton = document.querySelector('.add-to-garden');
        
        // Save to Firebase if user is authenticated
        try {
            if (window.auth && window.auth.currentUser && window.db) {
                const { doc, getDoc, setDoc, updateDoc, arrayUnion } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
                
                const user = window.auth.currentUser;
                const gardenRef = doc(window.db, 'gardens', user.uid);
                const gardenDoc = await getDoc(gardenRef);
                
                if (gardenDoc.exists()) {
                    const existingPlants = gardenDoc.data().plants || [];
                    if (!existingPlants.find(p => p.id === plantId)) {
                        await updateDoc(gardenRef, {
                            plants: arrayUnion(plant)
                        });
                    }
                } else {
                    await setDoc(gardenRef, {
                        plants: [plant],
                        createdAt: new Date()
                    });
                }
            }
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
        
        // Also save to localStorage as backup
        try {
            let myGarden = JSON.parse(localStorage.getItem('myGarden') || '[]');
            if (!myGarden.find(p => p.id === plantId)) {
                myGarden.push(plant);
                localStorage.setItem('myGarden', JSON.stringify(myGarden));
            }
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
        
        // Celebration animation
        if (typeof anime !== 'undefined' && addButton) {
            anime({
                targets: addButton,
                scale: [1, 1.1, 1],
                duration: 300,
                easing: 'easeOutElastic(1, .8)',
                complete: function() {
                    // Show success message
                    addButton.innerHTML = '';
                    const checkIcon = createSafeElement('i', 'fas fa-check');
                    const successText = createSafeElement('span', '', ' Added!');
                    addButton.appendChild(checkIcon);
                    addButton.appendChild(successText);
                    addButton.style.background = 'linear-gradient(135deg, #48bb78, #68d391)';
                    
                    setTimeout(() => {
                        addButton.innerHTML = '';
                        const plusIcon = createSafeElement('i', 'fas fa-plus');
                        const buttonText = createSafeElement('span', '', ' Add to My Garden');
                        addButton.appendChild(plusIcon);
                        addButton.appendChild(buttonText);
                        addButton.style.background = '';
                    }, 2000);
                }
            });
        }
        
        console.log(`Added ${plant.name} to garden!`);
    }
    
    // Make addToGarden available globally but securely
    window.addToGarden = addToGarden;
});