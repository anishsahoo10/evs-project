// Tasks JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Sample tasks data
    const tasks = [
        {
            id: 1,
            title: "Water Monstera",
            plant: "Monstera Deliciosa",
            description: "Check soil moisture and water if dry",
            type: "water",
            icon: "💧",
            dueDate: new Date(),
            points: 10,
            completed: false
        },
        {
            id: 2,
            title: "Fertilize Basil",
            plant: "Sweet Basil",
            description: "Apply liquid fertilizer for healthy growth",
            type: "fertilize",
            icon: "🌿",
            dueDate: new Date(Date.now() + 86400000), // Tomorrow
            points: 15,
            completed: false
        },
        {
            id: 3,
            title: "Prune Snake Plant",
            plant: "Snake Plant",
            description: "Remove dead or yellowing leaves",
            type: "prune",
            icon: "✂️",
            dueDate: new Date(Date.now() - 86400000), // Yesterday (overdue)
            points: 20,
            completed: false
        },
        {
            id: 4,
            title: "Repot Pothos",
            plant: "Golden Pothos",
            description: "Plant has outgrown current pot",
            type: "repot",
            icon: "🔄",
            dueDate: new Date(Date.now() + 172800000), // 2 days
            points: 25,
            completed: false
        },
        {
            id: 5,
            title: "Water Tomatoes",
            plant: "Cherry Tomatoes",
            description: "Daily watering for fruit development",
            type: "water",
            icon: "💧",
            dueDate: new Date(),
            points: 10,
            completed: false
        },
        {
            id: 6,
            title: "Fertilize Lavender",
            plant: "English Lavender",
            description: "Monthly feeding for better blooms",
            type: "fertilize",
            icon: "🌿",
            dueDate: new Date(Date.now() + 259200000), // 3 days
            points: 15,
            completed: false
        }
    ];
    
    let completedToday = 0;
    let pointsToday = 0;
    
    const pointsCount = document.getElementById('pointsCount');
    const taskCounter = document.getElementById('taskCounter');
    const todaysWidget = document.getElementById('todaysWidget');
    const urgentTasks = document.getElementById('urgentTasks');
    const particlesContainer = document.getElementById('particlesContainer');
    
    // Task containers
    const wateringTasks = document.getElementById('wateringTasks');
    const fertilizingTasks = document.getElementById('fertilizingTasks');
    const pruningTasks = document.getElementById('pruningTasks');
    const repottingTasks = document.getElementById('repottingTasks');
    
    // Initialize with error handling
    try {
        init();
    } catch (error) {
        console.log('Tasks initialization error:', error);
    }
    
    function init() {
        if (!wateringTasks || !fertilizingTasks || !pruningTasks || !repottingTasks) {
            console.log('Task elements not found');
            return;
        }
        renderTasks();
        updateStats();
        animateEntrance();
        checkUrgentTasks();
    }
    
    function renderTasks() {
        // Clear containers
        wateringTasks.innerHTML = '';
        fertilizingTasks.innerHTML = '';
        pruningTasks.innerHTML = '';
        repottingTasks.innerHTML = '';
        
        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            
            switch(task.type) {
                case 'water':
                    wateringTasks.appendChild(taskCard);
                    break;
                case 'fertilize':
                    fertilizingTasks.appendChild(taskCard);
                    break;
                case 'prune':
                    pruningTasks.appendChild(taskCard);
                    break;
                case 'repot':
                    repottingTasks.appendChild(taskCard);
                    break;
            }
        });
    }
    
    function createTaskCard(task) {
        const isToday = isDateToday(task.dueDate);
        const isOverdue = task.dueDate < new Date() && !isToday;
        
        const card = document.createElement('div');
        card.className = `task-card ${task.type} ${task.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="task-header">
                <div class="task-info">
                    <div class="task-icon">${task.icon}</div>
                    <div class="task-title">${task.title}</div>
                    <div class="task-plant">${task.plant}</div>
                    <div class="task-description">${task.description}</div>
                </div>
                <button class="task-toggle ${task.completed ? 'completed' : ''}" 
                        onclick="toggleTask(${task.id})"></button>
            </div>
            <div class="task-meta">
                <div class="task-due ${isOverdue ? 'overdue' : isToday ? 'today' : ''}">
                    <i class="fas fa-clock"></i>
                    ${formatDueDate(task.dueDate)}
                </div>
                <div class="task-points">+${task.points} pts</div>
            </div>
        `;
        
        return card;
    }
    
    function createUrgentTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'urgent-task-card';
        card.innerHTML = `
            <div class="urgent-task-icon">${task.icon}</div>
            <div class="urgent-task-info">
                <div class="urgent-task-title">${task.title}</div>
                <div class="urgent-task-plant">${task.plant}</div>
            </div>
            <button class="urgent-task-toggle ${task.completed ? 'completed' : ''}" 
                    onclick="toggleTask(${task.id})"></button>
        `;
        
        return card;
    }
    
    function checkUrgentTasks() {
        const today = new Date();
        const urgentTasksList = tasks.filter(task => {
            const isToday = isDateToday(task.dueDate);
            const isOverdue = task.dueDate < today && !isToday;
            return (isToday || isOverdue) && !task.completed;
        });
        
        urgentTasks.innerHTML = '';
        
        if (urgentTasksList.length > 0) {
            todaysWidget.classList.add('pulsing');
            urgentTasksList.forEach(task => {
                const urgentCard = createUrgentTaskCard(task);
                urgentTasks.appendChild(urgentCard);
            });
        } else {
            todaysWidget.classList.remove('pulsing');
            urgentTasks.innerHTML = '<p style="color: #68d391; text-align: center; font-weight: 600;">🎉 All caught up!</p>';
        }
        
        updateTaskCounter();
    }
    
    function updateTaskCounter() {
        const todayTasks = tasks.filter(task => isDateToday(task.dueDate) || task.dueDate < new Date());
        const completedTodayTasks = todayTasks.filter(task => task.completed);
        
        taskCounter.textContent = `${completedTodayTasks.length}/${todayTasks.length}`;
    }
    
    function updateStats() {
        // Animate points counter
        anime({
            targets: pointsCount,
            innerHTML: [0, pointsToday],
            duration: 1000,
            easing: 'easeOutQuad',
            round: 1
        });
    }
    
    function animateEntrance() {
        // Header animation
        anime({
            targets: '.tasks-header h1',
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
        
        // Points widget
        anime({
            targets: '.points-widget',
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)',
            delay: 200
        });
        
        // Today's widget
        anime({
            targets: '.todays-tasks-widget',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: 300
        });
        
        // Task cards staggered
        anime({
            targets: '.task-card',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: anime.stagger(100, {start: 500})
        });
    }
    
    function isDateToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    function formatDueDate(date) {
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        return `In ${diffDays} days`;
    }
    
    function createParticleBurst(x, y, type = 'star') {
        const colors = {
            star: ['#fbbf24', '#f59e0b', '#d97706'],
            heart: ['#f87171', '#ef4444', '#dc2626'],
            leaf: ['#48bb78', '#10b981', '#059669']
        };
        
        const particleColors = colors[type];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            if (type === 'heart') {
                particle.innerHTML = '♥';
                particle.style.backgroundColor = 'transparent';
                particle.style.color = particleColors[Math.floor(Math.random() * particleColors.length)];
                particle.style.fontSize = '12px';
            }
            
            particlesContainer.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 50 + Math.random() * 50;
            
            anime({
                targets: particle,
                translateX: Math.cos(angle) * velocity,
                translateY: Math.sin(angle) * velocity - 30,
                scale: [1, 0],
                opacity: [1, 0],
                duration: 800 + Math.random() * 400,
                easing: 'easeOutQuad',
                complete: function() {
                    particle.remove();
                }
            });
        }
    }
    
    // Global function for toggling tasks
    window.toggleTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const wasCompleted = task.completed;
        task.completed = !task.completed;
        
        // Find the toggle button
        const toggles = document.querySelectorAll(`[onclick="toggleTask(${taskId})"]`);
        
        toggles.forEach(toggle => {
            const card = toggle.closest('.task-card, .urgent-task-card');
            
            if (task.completed) {
                // Completion animation
                toggle.classList.add('completed');
                if (card.classList.contains('task-card')) {
                    card.classList.add('completed');
                }
                
                // Particle burst at toggle position
                const rect = toggle.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                createParticleBurst(x, y, 'star');
                
                // Points animation
                if (!wasCompleted) {
                    pointsToday += task.points;
                    completedToday++;
                    
                    anime({
                        targets: pointsCount,
                        innerHTML: [pointsToday - task.points, pointsToday],
                        duration: 600,
                        easing: 'easeOutQuad',
                        round: 1
                    });
                    
                    // Points widget celebration
                    anime({
                        targets: '.points-widget',
                        scale: [1, 1.1, 1],
                        duration: 400,
                        easing: 'easeOutElastic(1, .8)'
                    });
                }
                
                // Toggle animation
                anime({
                    targets: toggle,
                    scale: [1, 1.2, 1],
                    duration: 300,
                    easing: 'easeOutElastic(1, .8)'
                });
                
            } else {
                // Uncomplete animation
                toggle.classList.remove('completed');
                if (card.classList.contains('task-card')) {
                    card.classList.remove('completed');
                }
                
                if (wasCompleted) {
                    pointsToday -= task.points;
                    completedToday--;
                    
                    anime({
                        targets: pointsCount,
                        innerHTML: [pointsToday + task.points, pointsToday],
                        duration: 400,
                        easing: 'easeOutQuad',
                        round: 1
                    });
                }
            }
        });
        
        // Update urgent tasks and counter
        setTimeout(() => {
            checkUrgentTasks();
        }, 300);
    };
    
    // Add some initial completed tasks for demo
    setTimeout(() => {
        // Auto-complete one task for demo
        if (tasks.length > 0) {
            toggleTask(tasks[0].id);
        }
    }, 2000);
});