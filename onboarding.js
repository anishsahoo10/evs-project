// Onboarding Flow JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    const totalSteps = 4;
    let selectedSpace = null;
    let selectedExperience = null;
    
    const carousel = document.querySelector('.onboarding-carousel');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const nextBtn = document.getElementById('nextBtn');
    const skipBtn = document.getElementById('skipBtn');
    const startBtn = document.getElementById('startBtn');
    
    // Initialize
    init();
    
    function init() {
        setupEventListeners();
        animateCurrentStep();
    }
    
    function setupEventListeners() {
        // Next button
        nextBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                nextStep();
            }
        });
        
        // Skip button
        skipBtn.addEventListener('click', () => {
            completeOnboarding();
        });
        
        // Start button
        startBtn.addEventListener('click', () => {
            completeOnboarding();
        });
        
        // Space selection
        document.querySelectorAll('.space-option').forEach(option => {
            option.addEventListener('click', function() {
                selectSpace(this);
            });
        });
        
        // Experience selection
        document.querySelectorAll('.exp-option').forEach(option => {
            option.addEventListener('click', function() {
                selectExperience(this);
            });
        });
    }
    
    function nextStep() {
        // Validate current step
        if (!validateStep()) return;
        
        currentStep++;
        updateCarousel();
        updateProgress();
        updateButtons();
        animateCurrentStep();
    }
    
    function validateStep() {
        if (currentStep === 2 && !selectedSpace) {
            // Pulse space options to indicate selection needed
            anime({
                targets: '.space-option',
                scale: [1, 1.05, 1],
                duration: 300,
                easing: 'easeOutElastic(1, .6)'
            });
            return false;
        }
        
        if (currentStep === 3 && !selectedExperience) {
            // Pulse experience options
            anime({
                targets: '.exp-option',
                scale: [1, 1.05, 1],
                duration: 300,
                easing: 'easeOutElastic(1, .6)'
            });
            return false;
        }
        
        return true;
    }
    
    function updateCarousel() {
        const translateX = -(currentStep - 1) * 25;
        carousel.style.transform = `translateX(${translateX}%)`;
    }
    
    function updateProgress() {
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `${currentStep} of ${totalSteps}`;
        
        // Animate progress bar
        anime({
            targets: '.progress-fill',
            scaleX: [0.8, 1],
            duration: 400,
            easing: 'easeOutQuad'
        });
    }
    
    function updateButtons() {
        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
            skipBtn.style.opacity = '0.5';
        }
    }
    
    function selectSpace(option) {
        // Remove previous selection
        document.querySelectorAll('.space-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection
        option.classList.add('selected');
        selectedSpace = option.dataset.space;
        
        // Bounce animation
        anime({
            targets: option,
            scale: [1, 1.1, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Enable next button
        nextBtn.disabled = false;
    }
    
    function selectExperience(option) {
        // Remove previous selection
        document.querySelectorAll('.exp-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection
        option.classList.add('selected');
        selectedExperience = option.dataset.level;
        
        // Bounce animation
        anime({
            targets: option,
            scale: [1, 1.1, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Enable next button
        nextBtn.disabled = false;
    }
    
    function animateCurrentStep() {
        const currentCard = document.querySelector(`[data-step="${currentStep}"]`);
        
        // Fade in card content
        anime({
            targets: currentCard.querySelector('.card-content'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: 200
        });
        
        // Step-specific animations
        switch(currentStep) {
            case 1:
                animateWelcomeStep();
                break;
            case 2:
                animateSpaceStep();
                break;
            case 3:
                animateExperienceStep();
                break;
            case 4:
                animateCelebrationStep();
                break;
        }
    }
    
    function animateWelcomeStep() {
        // Animate floating leaves
        anime({
            targets: '.floating-leaves span',
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutQuad',
            delay: anime.stagger(200, {start: 400})
        });
    }
    
    function animateSpaceStep() {
        // Stagger space options
        anime({
            targets: '.space-option',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .8)',
            delay: anime.stagger(100, {start: 300})
        });
    }
    
    function animateExperienceStep() {
        // Stagger experience options
        anime({
            targets: '.exp-option',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .8)',
            delay: anime.stagger(100, {start: 300})
        });
    }
    
    function animateCelebrationStep() {
        // Confetti burst
        anime({
            targets: '.confetti span',
            translateY: [0, -100],
            rotate: [0, 360],
            opacity: [1, 0],
            duration: 2000,
            easing: 'easeOutQuad',
            delay: anime.stagger(200, {start: 500}),
            loop: true
        });
        
        // Trophy bounce
        anime({
            targets: '.trophy',
            scale: [0.8, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)',
            delay: 300
        });
    }
    
    function completeOnboarding() {
        // Save user preferences
        const userData = {
            space: selectedSpace,
            experience: selectedExperience,
            onboardingComplete: true
        };
        
        localStorage.setItem('gardenUserData', JSON.stringify(userData));
        
        // Celebration animation
        anime({
            targets: '.onboarding-container',
            scale: [1, 1.05, 0.95],
            opacity: [1, 0],
            duration: 800,
            easing: 'easeInQuad',
            complete: function() {
                // Redirect to main app
                window.location.href = 'index.html';
            }
        });
    }
    
    // Button hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        btn.addEventListener('click', function() {
            anime({
                targets: this,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Initial entrance animation
    anime({
        targets: '.progress-container',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
    });
    
    anime({
        targets: '.onboarding-nav',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
        delay: 200
    });
});