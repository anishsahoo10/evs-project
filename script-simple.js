// Simple script without navigation interference
document.addEventListener('DOMContentLoaded', function() {
    
    // Set dummy user data to prevent onboarding redirect
    if (!localStorage.getItem('gardenUserData')) {
        localStorage.setItem('gardenUserData', JSON.stringify({space: 'balcony', experience: 'beginner'}));
    }
    
    // FAB click animation
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', function() {
            // Redirect to library to add plants
            window.location.href = 'library.html';
        });
    }
    
    // Initial page load animation
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.page-content h1',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutQuad',
            delay: 200
        });
        
        anime({
            targets: '.page-content p',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: 400
        });
    }
});