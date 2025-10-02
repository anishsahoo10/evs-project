// AI Smart Task Generation and Scheduling
async function generateSmartTasks() {
    const tasksContainer = document.getElementById('aiGeneratedTasks');
    if (!tasksContainer) return;
    
    tasksContainer.innerHTML = '<div class="loading-tasks">🤖 Generating personalized tasks...</div>';

    try {
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
        const user = window.auth?.currentUser;
        
        let gardenData = [];
        if (user) {
            const gardenDoc = await getDoc(doc(window.db, 'gardens', user.uid));
            if (gardenDoc.exists()) {
                gardenData = gardenDoc.data().plants || [];
            }
        }

        const weatherTemp = document.getElementById('weatherTemp')?.textContent || '22°C';
        const weatherDesc = document.getElementById('weatherDesc')?.textContent || 'partly cloudy';
        const location = document.getElementById('weatherLocation')?.textContent || 'London';
        const currentDate = new Date().toDateString();
        const currentTime = new Date().getHours();

        const prompt = `As an expert gardener, generate 5 specific, actionable tasks for today based on:
        Plants: ${gardenData.map(p => p.name).join(', ') || 'No plants yet'}
        Weather: ${weatherTemp}, ${weatherDesc} in ${location}
        Date: ${currentDate}
        Current time: ${currentTime}:00

        For each task, provide:
        1. Task name (brief)
        2. Priority (High/Medium/Low)
        3. Best time to do it (e.g., "7 AM", "Evening", "Afternoon")
        4. Estimated duration (e.g., "15 min", "30 min")
        5. Brief reason why it's needed today

        Format as JSON array:
        [{"task":"Water basil","priority":"High","time":"7 AM","duration":"10 min","reason":"Soil looks dry and morning watering is best"}]`;

        const aiResponse = await callGeminiAPI(prompt);
        
        try {
            // Try to parse JSON response
            const tasks = JSON.parse(aiResponse.replace(/```json|```/g, '').trim());
            displayGeneratedTasks(tasks);
        } catch (parseError) {
            // Fallback to text parsing if JSON fails
            displayTasksFromText(aiResponse);
        }
        
    } catch (error) {
        console.error('Error generating smart tasks:', error);
        tasksContainer.innerHTML = '<div class="error-tasks">Unable to generate tasks right now. Please try again later.</div>';
    }
}

function displayGeneratedTasks(tasks) {
    const tasksContainer = document.getElementById('aiGeneratedTasks');
    
    const tasksHTML = tasks.map((task, index) => {
        const priorityClass = task.priority?.toLowerCase() || 'medium';
        const priorityIcon = getPriorityIcon(task.priority);
        
        return `
            <div class="smart-task-item" data-priority="${priorityClass}">
                <div class="task-header">
                    <div class="task-priority ${priorityClass}">
                        ${priorityIcon} ${task.priority || 'Medium'}
                    </div>
                    <div class="task-timing">
                        <span class="task-time">⏰ ${task.time || 'Anytime'}</span>
                        <span class="task-duration">⏱️ ${task.duration || '15 min'}</span>
                    </div>
                </div>
                <div class="task-content">
                    <h4 class="task-title">${task.task || `Task ${index + 1}`}</h4>
                    <p class="task-reason">${task.reason || 'AI recommended task for your garden'}</p>
                </div>
                <div class="task-actions">
                    <button class="btn btn-sm btn-success" onclick="completeSmartTask(this)">
                        <i class="fas fa-check"></i> Complete
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="scheduleTask(this, '${task.task}', '${task.time}')">
                        <i class="fas fa-clock"></i> Schedule
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    tasksContainer.innerHTML = `
        <div class="smart-tasks-header">
            <h3>🤖 AI Generated Tasks for Today</h3>
            <div class="tasks-summary">
                ${tasks.length} personalized tasks • Sorted by priority
            </div>
        </div>
        <div class="smart-tasks-list">
            ${tasksHTML}
        </div>
    `;
}

function displayTasksFromText(aiResponse) {
    const tasksContainer = document.getElementById('aiGeneratedTasks');
    
    tasksContainer.innerHTML = `
        <div class="smart-tasks-header">
            <h3>🤖 AI Generated Tasks for Today</h3>
        </div>
        <div class="ai-tasks-text">
            ${aiResponse.replace(/\n/g, '<br>')}
        </div>
        <button class="btn btn-primary" onclick="generateSmartTasks()">
            <i class="fas fa-refresh"></i> Generate New Tasks
        </button>
    `;
}

function getPriorityIcon(priority) {
    switch(priority?.toLowerCase()) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '🟡';
    }
}

function completeSmartTask(button) {
    const taskItem = button.closest('.smart-task-item');
    taskItem.style.opacity = '0.6';
    taskItem.style.textDecoration = 'line-through';
    button.innerHTML = '<i class="fas fa-check"></i> Completed';
    button.disabled = true;
    button.className = 'btn btn-sm btn-outline-success';
    
    // Add completion animation
    if (typeof anime !== 'undefined') {
        anime({
            targets: taskItem,
            scale: [1, 0.98, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    }
}

function scheduleTask(button, taskName, suggestedTime) {
    const now = new Date();
    const timeString = suggestedTime || 'in 1 hour';
    
    // Simple scheduling notification
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                setTimeout(() => {
                    new Notification('Garden Task Reminder', {
                        body: `Time to: ${taskName}`,
                        icon: '🌱'
                    });
                }, 5000); // Demo: 5 seconds, in real app calculate actual time
            }
        });
    }
    
    button.innerHTML = '<i class="fas fa-bell"></i> Scheduled';
    button.className = 'btn btn-sm btn-outline-primary';
    button.disabled = true;
}

// Weather-aware task scheduling
async function getWeatherAwareTasks() {
    try {
        const weatherDesc = document.getElementById('weatherDesc')?.textContent || 'partly cloudy';
        const weatherTemp = document.getElementById('weatherTemp')?.textContent || '22°C';
        
        const prompt = `Based on current weather (${weatherTemp}, ${weatherDesc}), suggest 3 weather-appropriate gardening tasks for today. Consider if tasks should be moved indoors, delayed, or prioritized due to weather conditions.`;
        
        const aiResponse = await callGeminiAPI(prompt);
        
        return aiResponse;
    } catch (error) {
        console.error('Error getting weather-aware tasks:', error);
        return 'Check your plants and water if soil is dry.';
    }
}

// Plant-specific task intervals
function getPlantSpecificSchedule(plantName) {
    const schedules = {
        'basil': { water: 'every 2-3 days', fertilize: 'every 2 weeks', prune: 'weekly' },
        'tomato': { water: 'daily in summer', fertilize: 'every 10 days', prune: 'bi-weekly' },
        'lettuce': { water: 'every 2 days', fertilize: 'every 3 weeks', harvest: 'when mature' },
        'mint': { water: 'keep moist', fertilize: 'monthly', prune: 'as needed' },
        'default': { water: 'every 2-3 days', fertilize: 'every 2 weeks', check: 'daily' }
    };
    
    return schedules[plantName.toLowerCase()] || schedules.default;
}