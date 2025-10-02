// Journal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Journal entries
    let journalEntries = [];
    let currentUser = null;
    
    let totalPoints = 1250;
    let currentLevel = "Plant Master";
    let currentXP = 750;
    let maxXP = 1000;
    
    const addEntryBtn = document.getElementById('addEntryBtn');
    const fabAddEntry = document.getElementById('fabAddEntry');
    const entryModal = document.getElementById('entryModal');
    const modalClose = document.getElementById('modalClose');
    const photoUpload = document.getElementById('photoUpload');
    const photoInput = document.getElementById('photoInput');
    const entryText = document.getElementById('entryText');
    const cancelEntry = document.getElementById('cancelEntry');
    const saveEntry = document.getElementById('saveEntry');
    const journalTimeline = document.getElementById('journalTimeline');
    const confettiContainer = document.getElementById('confettiContainer');
    const totalPointsEl = document.getElementById('totalPoints');
    
    let selectedTags = [];
    let uploadedPhoto = null;
    
    // Wait for Firebase auth
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadJournalData();
            init();
        }
    });
    
    function init() {
        setupEventListeners();
        renderJournalEntries();
        updatePointsDisplay();
        
        // Animate after a short delay to ensure DOM is ready
        setTimeout(() => {
            animateEntrance();
        }, 100);
    }
    
    function setupEventListeners() {
        addEntryBtn.addEventListener('click', openModal);
        fabAddEntry.addEventListener('click', openModal);
        modalClose.addEventListener('click', closeModal);
        cancelEntry.addEventListener('click', closeModal);
        saveEntry.addEventListener('click', handleSaveEntry);
        
        photoUpload.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', handlePhotoUpload);
        
        // Tag selection
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tag = this.dataset.tag;
                toggleTag(tag, this);
            });
        });
        
        // Close modal on outside click
        entryModal.addEventListener('click', function(e) {
            if (e.target === entryModal) closeModal();
        });
    }
    
    function openModal() {
        entryModal.classList.add('active');
        
        // Reset form
        entryText.value = '';
        selectedTags = [];
        uploadedPhoto = null;
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
        resetPhotoUpload();
        
        // Focus textarea
        setTimeout(() => {
            entryText.focus();
        }, 300);
    }
    
    function closeModal() {
        entryModal.classList.remove('active');
    }
    
    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedPhoto = e.target.result;
            
            // Replace upload placeholder with preview
            photoUpload.innerHTML = `
                <div class="photo-preview" style="background-image: url('${uploadedPhoto}')"></div>
            `;
            photoUpload.style.border = '2px solid #48bb78';
        };
        reader.readAsDataURL(file);
    }
    
    function resetPhotoUpload() {
        photoUpload.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-camera"></i>
                <span>Add Photo</span>
            </div>
        `;
        photoUpload.style.border = '2px dashed #68d391';
    }
    
    function toggleTag(tag, element) {
        if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter(t => t !== tag);
            element.classList.remove('selected');
        } else {
            selectedTags.push(tag);
            element.classList.add('selected');
        }
    }
    
    function handleSaveEntry() {
        const text = entryText.value.trim();
        if (!text) {
            entryText.focus();
            return;
        }
        
        // Create new entry
        const newEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            text: text,
            photo: uploadedPhoto || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
            tags: [...selectedTags],
            points: calculatePoints(text, selectedTags, uploadedPhoto),
            timestamp: new Date()
        };
        
        // Add to beginning of entries
        journalEntries.unshift(newEntry);
        
        // Save to Firebase
        saveJournalEntry(newEntry);
        
        // Update points
        totalPoints += newEntry.points;
        currentXP += newEntry.points;
        
        // Check for level up
        if (currentXP >= maxXP) {
            levelUp();
        }
        
        // Close modal
        closeModal();
        
        // Re-render timeline
        renderJournalEntries();
        updatePointsDisplay();
        
        // Show points animation
        showPointsAnimation(newEntry.points);
        
        // Animate new entry
        setTimeout(() => {
            const newEntryElement = journalTimeline.querySelector('.journal-entry');
            anime({
                targets: newEntryElement,
                scale: [0.8, 1.1, 1],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutElastic(1, .8)'
            });
        }, 100);
    }
    
    function calculatePoints(text, tags, photo) {
        let points = 10; // Base points
        
        if (photo) points += 10; // Photo bonus
        if (text.length > 100) points += 5; // Detailed entry bonus
        if (tags.length > 0) points += tags.length * 3; // Tag bonus
        
        return points;
    }
    
    function renderJournalEntries() {
        // Keep timeline line
        const timelineLine = journalTimeline.querySelector('.timeline-line');
        journalTimeline.innerHTML = '';
        if (timelineLine) journalTimeline.appendChild(timelineLine);
        
        journalEntries.forEach((entry, index) => {
            const entryElement = createJournalEntry(entry, index);
            journalTimeline.appendChild(entryElement);
        });
    }
    
    function createJournalEntry(entry, index) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'journal-entry';
        
        entryDiv.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="entry-card">
                <div class="entry-photo" style="background-image: url('${entry.photo}')">
                    <div class="entry-date">${formatDate(entry.date)}</div>
                </div>
                <div class="entry-text">${entry.text}</div>
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="entry-tag">${getTagEmoji(tag)} ${tag}</span>`).join('')}
                </div>
                <div class="entry-points">
                    <span class="points-earned">+${entry.points} points</span>
                    <span class="entry-time">${entry.time}</span>
                </div>
            </div>
        `;
        
        return entryDiv;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    function getTagEmoji(tag) {
        const emojis = {
            watering: '💧',
            growth: '🌱',
            harvest: '🍅',
            problem: '⚠️'
        };
        return emojis[tag] || '🌿';
    }
    
    function updatePointsDisplay() {
        totalPointsEl.textContent = totalPoints.toLocaleString();
        
        // Animate points counter
        anime({
            targets: totalPointsEl,
            scale: [1, 1.2, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const progressPercent = (currentXP / maxXP) * 100;
        
        progressFill.style.width = progressPercent + '%';
        progressText.textContent = `${currentXP}/${maxXP} XP`;
    }
    
    function showPointsAnimation(points) {
        // Create floating points
        const pointsEl = document.createElement('div');
        pointsEl.textContent = `+${points}`;
        pointsEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            color: #f6ad55;
            font-size: 2rem;
            font-weight: 800;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(pointsEl);
        
        anime({
            targets: pointsEl,
            translateY: [-50, -150],
            translateX: -50,
            scale: [1, 1.5, 0],
            opacity: [1, 1, 0],
            duration: 2000,
            easing: 'easeOutQuad',
            complete: function() {
                pointsEl.remove();
            }
        });
    }
    
    function levelUp() {
        currentXP = currentXP - maxXP;
        maxXP += 200; // Increase XP requirement
        
        // Create confetti
        createConfetti();
        
        // Show level up message
        const levelUpEl = document.createElement('div');
        levelUpEl.textContent = 'LEVEL UP! 🎉';
        levelUpEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #f6ad55;
            font-size: 3rem;
            font-weight: 800;
            pointer-events: none;
            z-index: 10000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(levelUpEl);
        
        anime({
            targets: levelUpEl,
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
            duration: 3000,
            easing: 'easeOutElastic(1, .8)',
            complete: function() {
                levelUpEl.remove();
            }
        });
    }
    
    function createConfetti() {
        const colors = ['#f6ad55', '#ed8936', '#48bb78', '#68d391', '#fc8181'];
        
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
    
    function animateEntrance() {
        // Header animation
        anime({
            targets: '.journal-header h1',
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
        
        // Points display staggered
        anime({
            targets: '.points-badge, .level-badge',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 600,
            easing: 'easeOutQuad',
            delay: anime.stagger(100, {start: 200})
        });
        
        // Add entry button
        anime({
            targets: '.add-entry-btn',
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)',
            delay: 400
        });
        
        // Timeline entries staggered
        anime({
            targets: '.journal-entry',
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            easing: 'easeOutQuad',
            delay: anime.stagger(200, {start: 600})
        });
    }
    
    // Firebase functions
    async function saveJournalEntry(entry) {
        if (!currentUser || !window.db) return;
        
        try {
            // Upload photo if it's a file
            if (uploadedPhoto && photoInput.files[0]) {
                const photoURL = await uploadPhoto(photoInput.files[0]);
                entry.photo = photoURL;
            }
            
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const docRef = await addDoc(collection(window.db, 'journal', currentUser.uid, 'entries'), entry);
            entry.id = docRef.id; // Update with Firebase ID
            console.log('Saved journal entry:', entry.id);
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
    }
    
    async function loadJournalData() {
        if (!currentUser || !window.db) return;
        
        try {
            const { collection, query, orderBy, getDocs } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const q = query(collection(window.db, 'journal', currentUser.uid, 'entries'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            
            journalEntries = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                journalEntries.push({ 
                    id: doc.id, 
                    ...data,
                    date: data.date || new Date().toISOString().split('T')[0],
                    time: data.time || '12:00'
                });
            });
            
            console.log('Loaded journal entries:', journalEntries.length);
            
        } catch (error) {
            console.error('Error loading journal:', error);
            journalEntries = [];
        }
    }
    
    async function uploadPhoto(file) {
        try {
            const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js');
            const storageRef = ref(window.storage, `journal/${currentUser.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading photo:', error);
            return uploadedPhoto; // Fallback to base64
        }
    }
});