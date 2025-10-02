// Plant Library JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Plant data
  const plants = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      type: "Indoor",
      image: "1.webp",
      description:
        "Beautiful split-leaf plant perfect for bright indoor spaces.",
      fullDescription:
        "The Monstera Deliciosa is a stunning tropical plant known for its large, glossy leaves with natural splits and holes. It's perfect for adding a tropical feel to any indoor space and is relatively easy to care for.",
      difficulty: "easy",
      water: "Weekly",
      light: "Bright Indirect",
      humidity: "Medium",
      temperature: "65-80°F",
      tags: ["Low Maintenance", "Air Purifying"],
    },
    {
      id: 2,
      name: "Basil",
      type: "Herb",
      image:
        "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400",
      description: "Aromatic herb perfect for cooking and balcony gardens.",
      fullDescription:
        "Fresh basil is a must-have for any urban garden. This aromatic herb is perfect for cooking, making pesto, and adding fresh flavor to your meals. It grows well in containers and loves sunny spots.",
      difficulty: "easy",
      water: "2-3 times/week",
      light: "Full Sun",
      humidity: "Low",
      temperature: "70-85°F",
      tags: ["Edible", "Aromatic", "Fast Growing"],
    },
    {
      id: 3,
      name: "Snake Plant",
      type: "Indoor",
      image:
        "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400",
      description: "Nearly indestructible plant that thrives in low light.",
      fullDescription:
        "The Snake Plant is perfect for beginners and busy people. It can survive in low light conditions and requires minimal watering. Known for its air-purifying qualities and striking upright leaves.",
      difficulty: "easy",
      water: "Every 2-3 weeks",
      light: "Low to Bright",
      humidity: "Low",
      temperature: "60-80°F",
      tags: ["Low Light", "Air Purifying", "Drought Tolerant"],
    },
    {
      id: 4,
      name: "Cherry Tomatoes",
      type: "Vegetable",
      image:
        "https://images.unsplash.com/photo-1592841200221-21e1c4e6e8e5?w=400",
      description: "Sweet, bite-sized tomatoes perfect for container growing.",
      fullDescription:
        "Cherry tomatoes are ideal for urban gardening. They produce abundant small, sweet fruits and can be grown in containers on balconies or rooftops. Perfect for salads and snacking.",
      difficulty: "medium",
      water: "Daily",
      light: "Full Sun",
      humidity: "Medium",
      temperature: "65-85°F",
      tags: ["Edible", "Productive", "Container Friendly"],
    },
    {
      id: 5,
      name: "Pothos",
      type: "Indoor",
      image:
        "https://images.unsplash.com/photo-1586093248292-4e6f6c2b8e3e?w=400",
      description: "Trailing vine that's perfect for hanging baskets.",
      fullDescription:
        "Pothos is one of the easiest houseplants to grow. Its trailing vines look beautiful in hanging baskets or climbing up moss poles. It's very forgiving and can tolerate various light conditions.",
      difficulty: "easy",
      water: "Weekly",
      light: "Low to Bright",
      humidity: "Low to Medium",
      temperature: "65-85°F",
      tags: ["Trailing", "Air Purifying", "Low Maintenance"],
    },
    {
      id: 6,
      name: "Lavender",
      type: "Herb",
      image:
        "https://images.unsplash.com/photo-1611909023032-2d4b3a2e7d3d?w=400",
      description: "Fragrant purple flowers with calming properties.",
      fullDescription:
        "Lavender brings beautiful purple blooms and incredible fragrance to your garden. It's drought-tolerant once established and attracts beneficial pollinators. Perfect for aromatherapy and crafts.",
      difficulty: "medium",
      water: "Weekly",
      light: "Full Sun",
      humidity: "Low",
      temperature: "60-80°F",
      tags: ["Fragrant", "Drought Tolerant", "Pollinator Friendly"],
    },
  ];

  const plantGrid = document.getElementById("plantGrid");
  const searchInput = document.getElementById("searchInput");
  const plantModal = document.getElementById("plantModal");
  const modalClose = document.getElementById("modalClose");
  const modalBody = document.getElementById("modalBody");

  // Initialize
  init();

  function init() {
    renderPlants(plants);
    setupEventListeners();
    animateEntrance();
  }

  function setupEventListeners() {
    searchInput.addEventListener("input", handleSearch);
    modalClose.addEventListener("click", closeModal);
    plantModal.addEventListener("click", function (e) {
      if (e.target === plantModal) closeModal();
    });

    // Search box glow effect
    searchInput.addEventListener("focus", function () {
      anime({
        targets: ".search-box",
        boxShadow: "0 8px 32px rgba(104, 211, 145, 0.3)",
        duration: 300,
        easing: "easeOutQuad",
      });
    });

    searchInput.addEventListener("blur", function () {
      anime({
        targets: ".search-box",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        duration: 300,
        easing: "easeOutQuad",
      });
    });
  }

  function renderPlants(plantsToRender) {
    plantGrid.innerHTML = "";

    plantsToRender.forEach((plant, index) => {
      const plantCard = createPlantCard(plant);
      plantGrid.appendChild(plantCard);

      // Staggered entrance animation
      anime({
        targets: plantCard,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.8, 1],
        duration: 600,
        easing: "easeOutElastic(1, .8)",
        delay: index * 100,
      });
    });
  }

  function createPlantCard(plant) {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.innerHTML = `
            <div class="plant-image" style="background-image: url('${
              plant.image
            }')"></div>
            <div class="plant-info">
                <div class="plant-name">${plant.name}</div>
                <div class="plant-type">${plant.type}</div>
                <div class="plant-description">${plant.description}</div>
                <div class="plant-tags">
                    <span class="plant-tag difficulty-${plant.difficulty}">${
      plant.difficulty
    }</span>
                    ${plant.tags
                      .map((tag) => `<span class="plant-tag">${tag}</span>`)
                      .join("")}
                </div>
            </div>
        `;

    card.addEventListener("click", () => openPlantModal(plant));

    return card;
  }

  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filteredPlants = plants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(query) ||
        plant.type.toLowerCase().includes(query) ||
        plant.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    // Fade out current plants
    anime({
      targets: ".plant-card",
      opacity: 0,
      scale: 0.8,
      duration: 200,
      easing: "easeOutQuad",
      complete: function () {
        renderPlants(filteredPlants);
      },
    });
  }

  function openPlantModal(plant) {
    modalBody.innerHTML = `
            <div class="modal-hero" style="background-image: url('${plant.image}')"></div>
            <div class="modal-title">${plant.name}</div>
            <div class="modal-type">${plant.type}</div>
            <div class="modal-description">${plant.fullDescription}</div>
            <div class="care-info">
                <div class="care-item">
                    <div class="care-icon">💧</div>
                    <div class="care-label">Water: ${plant.water}</div>
                </div>
                <div class="care-item">
                    <div class="care-icon">☀️</div>
                    <div class="care-label">Light: ${plant.light}</div>
                </div>
                <div class="care-item">
                    <div class="care-icon">💨</div>
                    <div class="care-label">Humidity: ${plant.humidity}</div>
                </div>
                <div class="care-item">
                    <div class="care-icon">🌡️</div>
                    <div class="care-label">Temp: ${plant.temperature}</div>
                </div>
            </div>
            <button class="add-to-garden" onclick="addToGarden(${plant.id})">
                <i class="fas fa-plus"></i> Add to My Garden
            </button>
        `;

    plantModal.classList.add("active");

    // Modal entrance animation
    anime({
      targets: ".modal-content",
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 400,
      easing: "easeOutElastic(1, .8)",
    });
  }

  function closeModal() {
    anime({
      targets: ".modal-content",
      scale: [1, 0.8],
      opacity: [1, 0],
      duration: 300,
      easing: "easeOutQuad",
      complete: function () {
        plantModal.classList.remove("active");
      },
    });
  }

  function animateEntrance() {
    // Header animation
    anime({
      targets: ".library-header h1",
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 600,
      easing: "easeOutQuad",
    });

    // Search box animation
    anime({
      targets: ".search-container",
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 600,
      easing: "easeOutQuad",
      delay: 200,
    });
  }

  // Global function for adding to garden
  window.addToGarden = function (plantId) {
    const plant = plants.find((p) => p.id === plantId);

    // Celebration animation
    anime({
      targets: ".add-to-garden",
      scale: [1, 1.1, 1],
      duration: 300,
      easing: "easeOutElastic(1, .8)",
      complete: function () {
        // Show success message
        const button = document.querySelector(".add-to-garden");
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = "linear-gradient(135deg, #48bb78, #68d391)";

        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = "linear-gradient(135deg, #48bb78, #68d391)";
        }, 2000);
      },
    });

    // Save to localStorage (simple implementation)
    let myGarden = JSON.parse(localStorage.getItem("myGarden") || "[]");
    if (!myGarden.find((p) => p.id === plantId)) {
      myGarden.push(plant);
      localStorage.setItem("myGarden", JSON.stringify(myGarden));
    }

    console.log(`Added ${plant.name} to garden!`);
  };
});
