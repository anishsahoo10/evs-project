// Garden-Based Tasks JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let tasks = [];
    let gardenPlants = [];
    let currentUser = null;

    // Wait for Firebase auth
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadGardenPlants();
            await loadTasks();
            generateTasksFromGarden();
            renderTasks();
        }
    });

    // Load garden plants
    async function loadGardenPlants() {
        if (!currentUser) return;

        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const docSnap = await getDoc(doc(window.db, 'gardens', currentUser.uid));
            
            if (docSnap.exists()) {
                gardenPlants = docSnap.data().plants || [];
            }
        } catch (error) {
            console.error('Error loading garden:', error);
        }
    }

    // Load task completions from Firebase
    async function loadTasks() {
        if (!currentUser) return;

        try {
            const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const q = query(collection(window.db, 'task_completions'), where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const completions = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                completions[data.taskKey] = data;
            });
            
            // Apply completions to generated tasks
            tasks.forEach(task => {
                const completion = completions[task.key];
                if (completion) {
                    task.completed = completion.completed;
                    task.completedAt = completion.completedAt;
                }
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    // Generate tasks based on garden plants
    function generateTasksFromGarden() {
        tasks = [];
        
        if (gardenPlants.length === 0) {
            return;
        }

        gardenPlants.forEach((plant, index) => {
            const plantName = plant.nickname || plant.name;
            
            // Generate different types of tasks for each plant
            const taskTypes = [
                {
                    type: 'watering',
                    title: `Water ${plantName}`,
                    icon: '💧',
                    frequency: 3 // every 3 days
                },
                {
                    type: 'fertilizing',
                    title: `Fertilize ${plantName}`,
                    icon: '🌿',
                    frequency: 14 // every 2 weeks
                },
                {
                    type: 'pruning',
                    title: `Check ${plantName} for pruning`,
                    icon: '✂️',
                    frequency: 21 // every 3 weeks
                },
                {
                    type: 'inspection',
                    title: `Inspect ${plantName} for pests`,
                    icon: '🔍',
                    frequency: 7 // weekly
                }
            ];

            taskTypes.forEach(taskType => {
                const taskKey = `${plant.id}_${taskType.type}`;
                
                tasks.push({
                    key: taskKey,
                    plantId: plant.id,
                    plantName: plantName,
                    title: taskType.title,
                    category: taskType.type,
                    icon: taskType.icon,
                    frequency: taskType.frequency,
                    completed: false,
                    completedAt: null
                });
            });
        });
    }

    // Update task completion
    async function updateTaskCompletion(taskKey, completed) {
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            await setDoc(doc(window.db, 'task_completions', `${currentUser.uid}_${taskKey}`), {
                userId: currentUser.uid,
                taskKey: taskKey,
                completed: completed,
                completedAt: completed ? new Date() : null,
                lastUpdated: new Date()
            });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Render tasks
    function renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');

        if (tasks.length === 0) {
            emptyState.innerHTML = `
                <i class="fas fa-seedling"></i>
                <h3>No plants in your garden</h3>
                <p>Add plants to your garden to see care tasks!</p>
                <a href="garden.html" style="color: #48bb78; text-decoration: none; font-weight: 600;">Go to My Garden →</a>
            `;
            taskList.innerHTML = '';
            taskList.appendChild(emptyState);
            return;
        }

        taskList.innerHTML = '';
        
        // Sort tasks: incomplete first, then by category
        const sortedTasks = tasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return a.category.localeCompare(b.category);
        });

        sortedTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    // Create task element
    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Calculate next due date based on completion
        let statusText = '';
        if (task.completed && task.completedAt) {
            const completedDate = new Date(task.completedAt.toDate ? task.completedAt.toDate() : task.completedAt);
            const nextDue = new Date(completedDate.getTime() + (task.frequency * 24 * 60 * 60 * 1000));
            const today = new Date();
            
            if (nextDue <= today) {
                statusText = `<div class="task-due">Ready again</div>`;
                task.completed = false; // Reset for next cycle
            } else {
                const daysLeft = Math.ceil((nextDue - today) / (24 * 60 * 60 * 1000));
                statusText = `<div class="task-next">Next in ${daysLeft} days</div>`;
            }
        } else {
            statusText = `<div class="task-ready">Ready to do</div>`;
        }

        taskItem.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.key}')">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-plant">${task.plantName}</div>
                ${statusText}
            </div>
            <div class="task-category category-${task.category}">
                ${task.icon} ${task.category}
            </div>
        `;

        return taskItem;
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            watering: '💧',
            fertilizing: '🌿',
            pruning: '✂️',
            repotting: '🔄'
        };
        return icons[category] || '📋';
    }

    // Toggle task completion
    window.toggleTask = async function(taskKey) {
        const task = tasks.find(t => t.key === taskKey);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date() : null;
        
        await updateTaskCompletion(taskKey, task.completed);
        renderTasks();

        // Show celebration for completion
        if (task.completed) {
            showTaskCompletion(task.title);
        }
    };

    // Show task completion animation
    function showTaskCompletion(taskTitle) {
        const celebration = document.createElement('div');
        celebration.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
            <div>Task completed!</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">${taskTitle}</div>
        `;
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #48bb78;
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 1rem;
            font-weight: 600;
            z-index: 10000;
            text-align: center;
            animation: fadeInOut 3s ease-in-out;
            box-shadow: 0 10px 25px rgba(72, 187, 120, 0.3);
        `;
        
        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 3000);
    }

    // Remove manual task creation - tasks are auto-generated from garden
    window.openTaskModal = function() {
        alert('Tasks are automatically created based on plants in your garden. Add plants to see more tasks!');
    };

    // Logout function
    window.logout = async function() {
        try {
            const { signOut } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js');
            await signOut(window.auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .task-ready { color: #059669; font-weight: 600; font-size: 0.9rem; }
        .task-next { color: #6b7280; font-size: 0.9rem; }
        .task-due { color: #dc2626; font-weight: 600; font-size: 0.9rem; }
    `;
    document.head.appendChild(style);
});