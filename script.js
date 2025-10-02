// Urban Gardening Assistant - Phase 1 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Set dummy user data to prevent onboarding redirect
    if (!localStorage.getItem('gardenUserData')) {
        localStorage.setItem('gardenUserData', JSON.stringify({space: 'balcony', experience: 'beginner'}));
    }
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link, .nav-item');
    const fab = document.querySelector('.fab');
    
    // Handle only hash navigation (community, journal)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update page content based on navigation
            updatePageContent(this.getAttribute('href').substring(1));
        });
    });
    
    // Add hover effects only
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // FAB click animation
    fab.addEventListener('click', function() {
        // Bounce animation
        anime({
            targets: this,
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Redirect to library to add plants
        window.location.href = 'library.html';
    });
    
    // Page content updates
    function updatePageContent(page) {
        const mainContent = document.querySelector('.page-content');
        
        const pageContent = {
            dashboard: {
                title: 'Dashboard 🏠',
                content: 'Welcome to your gardening dashboard! Track your plants and daily tasks.'
            },
            library: {
                title: 'Plant Library 🌿',
                content: 'Discover amazing plants perfect for urban gardening.'
            },
            garden: {
                title: 'My Garden 🌱',
                content: 'Manage your personal garden and watch your plants grow.'
            },
            tasks: {
                title: 'Tasks ✅',
                content: 'Stay on top of your gardening tasks and reminders.'
            },
            community: {
                title: 'Community 👥',
                content: 'Connect with fellow urban gardeners and share experiences.'
            },
            journal: {
                title: 'Journal 📖',
                content: 'Document your gardening journey with photos and notes.'
            }
        };
        
        const content = pageContent[page] || pageContent.dashboard;
        
        // Fade out current content
        anime({
            targets: mainContent,
            opacity: 0,
            translateY: -20,
            duration: 200,
            easing: 'easeOutQuad',
            complete: function() {
                // Update content
                mainContent.innerHTML = `
                    <h1>${content.title}</h1>
                    <p>${content.content}</p>
                `;
                
                // Fade in new content
                anime({
                    targets: mainContent,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 400,
                    easing: 'easeOutQuad'
                });
            }
        });
    }
    
    // Initial page load animation
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
    
    // FAB entrance animation
    anime({
        targets: '.fab',
        scale: [0, 1],
        rotate: [0, 360],
        duration: 800,
        easing: 'easeOutElastic(1, .8)',
        delay: 600
    });
    
    // Bottom nav items staggered entrance
    anime({
        targets: '.nav-item',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
        delay: anime.stagger(100, {start: 300})
    });
    
    // Sidebar nav items staggered entrance (desktop)
    if (window.innerWidth >= 768) {
        anime({
            targets: '.sidebar-nav li',
            translateX: [-30, 0],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuad',
            delay: anime.stagger(100, {start: 200})
        });
    }
    

    
    // Responsive behavior
    function handleResize() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Mobile-specific animations or adjustments
            console.log('Mobile view active');
        } else {
            // Desktop-specific animations or adjustments
            console.log('Desktop view active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
});