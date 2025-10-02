// Community JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Posts data
    let posts = [];
    let currentUser = null;
    let currentPostType = 'Post';
    
    // Sample posts for demo
    const samplePosts = [
        {
            id: 1,
            username: "GreenThumb_Sarah",
            avatar: "🌻",
            time: "2 hours ago",
            type: "Success",
            text: "My tomatoes are finally ripening! 🍅 After weeks of green fruits, I'm seeing beautiful red ones. The key was consistent watering and patience.",
            image: "https://images.unsplash.com/photo-1592841200221-21e1c4e6e8e5?w=400",
            likes: 24,
            replies: [
                { username: "PlantDad_Mike", avatar: "🌱", text: "Congrats! Nothing beats homegrown tomatoes!" },
                { username: "UrbanGardener", avatar: "🏙️", text: "What variety are you growing? They look amazing!" }
            ]
        },
        {
            id: 2,
            username: "HerbLover_Emma",
            avatar: "🌿",
            time: "4 hours ago",
            type: "Tip",
            text: "Pro tip: Pinch basil flowers to keep leaves tender and flavorful! Your pesto will thank you later. 🌿✨",
            likes: 18,
            replies: [
                { username: "CookingWithPlants", avatar: "👨‍🍳", text: "Great advice! I learned this the hard way." }
            ]
        },
        {
            id: 3,
            username: "BalconyBotanist",
            avatar: "🏢",
            time: "6 hours ago",
            type: "Question",
            text: "Help! My snake plant leaves are turning yellow. I water it once a week and it gets indirect light. Any ideas? 😟",
            likes: 12,
            replies: [
                { username: "PlantDoctor_Jane", avatar: "🩺", text: "Sounds like overwatering. Try watering every 2-3 weeks instead!" },
                { username: "SucculentQueen", avatar: "🌵", text: "Also check for root rot. Yellow leaves are often the first sign." }
            ]
        },
        {
            id: 4,
            username: "MicroGreen_Max",
            avatar: "🌱",
            time: "8 hours ago",
            type: "Success",
            text: "First harvest from my microgreens setup! Radish and pea shoots are so flavorful. Perfect for winter gardening indoors! 🌱",
            image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
            likes: 31,
            replies: []
        }
    ];
    
    const composerInput = document.getElementById('composerInput');
    const composerExpanded = document.getElementById('composerExpanded');
    const composerText = document.getElementById('composerText');
    const postComposer = document.getElementById('postComposer');
    const cancelPost = document.getElementById('cancelPost');
    const submitPost = document.getElementById('submitPost');
    const communityFeed = document.getElementById('communityFeed');
    const newPostFab = document.getElementById('newPostFab');
    
    // Wait for Firebase auth
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadPosts();
            init();
            setupRealtimeListener();
        }
    });
    
    function init() {
        setupEventListeners();
        renderPosts();
        animateEntrance();
    }
    
    function setupEventListeners() {
        // Composer expansion
        composerInput.addEventListener('focus', expandComposer);
        cancelPost.addEventListener('click', collapseComposer);
        submitPost.addEventListener('click', handleSubmitPost);
        
        // FAB for mobile
        newPostFab.addEventListener('click', expandComposer);
        
        // Post type buttons
        const tipBtn = document.querySelector('.tip-btn');
        const questionBtn = document.querySelector('.question-btn');
        
        if (tipBtn) tipBtn.addEventListener('click', () => setPostType('Tip'));
        if (questionBtn) questionBtn.addEventListener('click', () => setPostType('Question'));
        
        // Click outside to collapse
        document.addEventListener('click', function(e) {
            if (!postComposer.contains(e.target) && !newPostFab.contains(e.target)) {
                if (composerText.value.trim() === '') {
                    collapseComposer();
                }
            }
        });
    }
    
    function expandComposer() {
        if (!postComposer || !composerExpanded) return;
        
        postComposer.classList.add('expanded');
        composerExpanded.classList.add('active');
        
        // Animation
        if (typeof anime !== 'undefined') {
            anime({
                targets: postComposer,
                scale: [1, 1.02, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
        }
        
        // Focus textarea
        setTimeout(() => {
            if (composerText) composerText.focus();
        }, 200);
    }
    
    function collapseComposer() {
        postComposer.classList.remove('expanded');
        composerExpanded.classList.remove('active');
        composerInput.value = '';
        composerText.value = '';
        composerInput.blur();
        composerText.blur();
        
        // Reset post type
        currentPostType = 'Post';
        resetPostTypeButtons();
    }
    
    function setPostType(type) {
        currentPostType = type;
        
        // Update button states
        resetPostTypeButtons();
        const activeBtn = document.querySelector(`.${type.toLowerCase()}-btn`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update placeholder text
        const placeholders = {
            'Tip': 'Share a helpful gardening tip with the community...',
            'Question': 'Ask the community for gardening advice...'
        };
        
        if (composerText) {
            composerText.placeholder = placeholders[type] || 'What\'s growing in your garden today?';
        }
        
        // Focus on textarea
        if (composerText) composerText.focus();
    }
    
    function resetPostTypeButtons() {
        const buttons = document.querySelectorAll('.composer-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
    }
    
    async function handleSubmitPost() {
        const text = composerText.value.trim();
        if (!text || !currentUser) return;
        
        // Disable submit button to prevent double posting
        submitPost.disabled = true;
        submitPost.textContent = 'Posting...';
        
        try {
            // Create new post
            const newPost = {
                id: Date.now().toString(),
                username: currentUser.email ? currentUser.email.split('@')[0] : 'You',
                avatar: "🌱",
                time: "Just now",
                type: currentPostType,
                text: text,
                likes: 0,
                replies: [],
                likedBy: []
            };
            
            // Save to Firebase
            await savePost(newPost);
            
            // Add to beginning of posts array
            posts.unshift(newPost);
            
            // Re-render posts
            renderPosts();
            
            // Collapse composer
            collapseComposer();
            
            // Animate new post
            const newPostElement = communityFeed.firstElementChild;
            if (newPostElement && typeof anime !== 'undefined') {
                anime({
                    targets: newPostElement,
                    scale: [0.8, 1.05, 1],
                    opacity: [0, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .8)'
                });
            }
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again.');
        } finally {
            // Re-enable submit button
            submitPost.disabled = false;
            submitPost.textContent = 'Post';
        }
    }
    
    function renderPosts() {
        communityFeed.innerHTML = '';
        
        posts.forEach(post => {
            const postCard = createPostCard(post);
            communityFeed.appendChild(postCard);
        });
    }
    
    function createPostCard(post) {
        const isLiked = currentUser && post.likedBy && post.likedBy.includes(currentUser.uid);
        
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.setAttribute('data-post-id', post.id);
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${post.avatar}</div>
                <div class="post-user-info">
                    <div class="post-username">${post.username}</div>
                    <div class="post-time">${post.time}</div>
                </div>
                <div class="post-type">${post.type}</div>
            </div>
            <div class="post-content">
                <div class="post-text">${post.text}</div>
                ${post.image ? `<div class="post-image" style="background-image: url('${post.image}')"></div>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="action-btn reply-btn" onclick="toggleReplies('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span>${post.replies.length}</span>
                </button>
                <button class="action-btn share-btn" onclick="sharePost('${post.id}')">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>
            <div class="post-replies" id="replies-${post.id}" style="display: none;">
                ${post.replies.map(reply => `
                    <div class="reply-item">
                        <div class="reply-avatar">${reply.avatar}</div>
                        <div class="reply-content">
                            <div class="reply-username">${reply.username}</div>
                            <div class="reply-text">${reply.text}</div>
                        </div>
                    </div>
                `).join('')}
                <div class="reply-composer">
                    <div class="reply-avatar">🌱</div>
                    <input type="text" class="reply-input" placeholder="Write a reply..." onkeypress="handleReplySubmit(event, '${post.id}')">
                    <button class="reply-submit" onclick="submitReply('${post.id}')">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        return postCard;
    }
    

    
    function animateEntrance() {
        if (typeof anime === 'undefined') return;
        
        // Header animation
        const header = document.querySelector('.page-header h1');
        if (header) {
            anime({
                targets: header,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
        }
        
        // Composer animation
        const composer = document.querySelector('.post-composer');
        if (composer) {
            anime({
                targets: composer,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                easing: 'easeOutQuad',
                delay: 300
            });
        }
        
        // Posts staggered animation
        const postCards = document.querySelectorAll('.post-card');
        if (postCards.length > 0) {
            anime({
                targets: postCards,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                easing: 'easeOutQuad',
                delay: anime.stagger(100, {start: 500})
            });
        }
    }
    
    // Global functions for post interactions
    window.toggleLike = async function(postId) {
        const post = posts.find(p => p.id == postId); // Use == for type coercion
        if (!post || !currentUser) return;
        
        const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
        if (!likeBtn) return;
        
        const isLiked = likeBtn.classList.contains('liked');
        
        // Update UI immediately
        if (isLiked) {
            post.likes = Math.max(0, post.likes - 1);
            likeBtn.classList.remove('liked');
        } else {
            post.likes++;
            likeBtn.classList.add('liked');
            
            // Heart animation
            if (typeof anime !== 'undefined') {
                anime({
                    targets: likeBtn.querySelector('i'),
                    scale: [1, 1.3, 1],
                    duration: 400,
                    easing: 'easeOutElastic(1, .8)'
                });
            }
        }
        
        const likeSpan = likeBtn.querySelector('span');
        if (likeSpan) likeSpan.textContent = post.likes;
        
        // Update Firebase only for real posts (not sample data)
        if (typeof post.id === 'string' && post.id.length > 10) {
            try {
                const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
                const postRef = doc(window.db, 'community_posts', post.id);
                
                const likedBy = post.likedBy || [];
                const newLikedBy = isLiked 
                    ? likedBy.filter(uid => uid !== currentUser.uid)
                    : [...likedBy, currentUser.uid];
                
                await updateDoc(postRef, {
                    likes: post.likes,
                    likedBy: newLikedBy
                });
                
                post.likedBy = newLikedBy;
            } catch (error) {
                console.error('Error updating like:', error);
            }
        }
    };
    
    window.toggleReplies = function(postId) {
        const repliesSection = document.getElementById(`replies-${postId}`);
        if (!repliesSection) return;
        
        const isVisible = repliesSection.style.display !== 'none';
        
        if (isVisible) {
            // Hide replies
            if (typeof anime !== 'undefined') {
                anime({
                    targets: repliesSection,
                    opacity: [1, 0],
                    maxHeight: [repliesSection.scrollHeight, 0],
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: function() {
                        repliesSection.style.display = 'none';
                    }
                });
            } else {
                repliesSection.style.display = 'none';
            }
        } else {
            // Show replies
            repliesSection.style.display = 'block';
            
            if (typeof anime !== 'undefined') {
                repliesSection.style.opacity = '0';
                anime({
                    targets: repliesSection,
                    opacity: [0, 1],
                    maxHeight: [0, repliesSection.scrollHeight],
                    duration: 400,
                    easing: 'easeOutQuad'
                });
            }
        }
    };
    
    window.submitReply = async function(postId) {
        const post = posts.find(p => p.id == postId); // Use == for type coercion
        const replyInput = document.querySelector(`#replies-${postId} .reply-input`);
        
        if (!replyInput || !post || !currentUser) return;
        
        const replyText = replyInput.value.trim();
        if (!replyText) return;
        
        // Add new reply to UI immediately
        const newReply = {
            username: currentUser.email ? currentUser.email.split('@')[0] : 'User',
            avatar: "🌱",
            text: replyText,
            userId: currentUser.uid,
            timestamp: new Date()
        };
        
        post.replies.push(newReply);
        replyInput.value = '';
        
        // Update reply count
        const replyBtn = document.querySelector(`[data-post-id="${postId}"] .reply-btn span`);
        if (replyBtn) {
            replyBtn.textContent = post.replies.length;
        }
        
        // Add reply to DOM
        const repliesContainer = document.getElementById(`replies-${postId}`);
        if (!repliesContainer) return;
        
        const replyComposer = repliesContainer.querySelector('.reply-composer');
        
        const replyElement = document.createElement('div');
        replyElement.className = 'reply-item';
        replyElement.innerHTML = `
            <div class="reply-avatar">${newReply.avatar}</div>
            <div class="reply-content">
                <div class="reply-username">${newReply.username}</div>
                <div class="reply-text">${newReply.text}</div>
            </div>
        `;
        
        if (replyComposer) {
            repliesContainer.insertBefore(replyElement, replyComposer);
        } else {
            repliesContainer.appendChild(replyElement);
        }
        
        // Animate new reply
        if (typeof anime !== 'undefined') {
            anime({
                targets: replyElement,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
        
        // Update Firebase only for real posts
        if (typeof post.id === 'string' && post.id.length > 10) {
            try {
                const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
                const postRef = doc(window.db, 'community_posts', post.id);
                
                await updateDoc(postRef, {
                    replies: post.replies
                });
            } catch (error) {
                console.error('Error saving reply:', error);
            }
        }
    };
    
    window.handleReplySubmit = function(event, postId) {
        if (event.key === 'Enter') {
            submitReply(postId);
        }
    };
    
    // Firebase functions
    async function savePost(post) {
        if (!currentUser) return;
        
        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const postData = {
                ...post,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                timestamp: new Date(),
                likes: 0,
                likedBy: [],
                replies: []
            };
            await addDoc(collection(window.db, 'community_posts'), postData);
        } catch (error) {
            console.error('Error saving post:', error);
        }
    }
    
    async function loadPosts() {
        try {
            if (!currentUser || !window.db) {
                posts = samplePosts;
                return;
            }
            
            const { collection, query, orderBy, limit, getDocs } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const q = query(collection(window.db, 'community_posts'), orderBy('timestamp', 'desc'), limit(20));
            const querySnapshot = await getDocs(q);
            
            posts = [];
            querySnapshot.forEach((doc) => {
                const postData = doc.data();
                if (postData.timestamp && postData.text) {
                    posts.push({
                        id: doc.id,
                        username: postData.userEmail ? postData.userEmail.split('@')[0] : 'User',
                        avatar: '🌱',
                        time: formatTime(postData.timestamp.toDate()),
                        type: postData.type || 'Post',
                        text: postData.text,
                        image: postData.image,
                        likes: postData.likes || 0,
                        likedBy: postData.likedBy || [],
                        replies: postData.replies || []
                    });
                }
            });
            
            // If no posts, use sample data
            if (posts.length === 0) {
                posts = samplePosts;
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            posts = samplePosts;
        }
    }
    
    function setupRealtimeListener() {
        try {
            // Skip realtime listener for now to avoid Firebase import issues
            console.log('Real-time updates disabled for stability');
        } catch (error) {
            console.log('Real-time listener not available, using manual refresh');
        }
    }
    
    function formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    
    // Share functionality
    window.sharePost = async function(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        const shareData = {
            title: 'Urban Garden Community Post',
            text: post.text,
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(`Check out this post: "${post.text}" - ${window.location.href}`);
                
                // Show toast notification
                const toast = document.createElement('div');
                toast.textContent = 'Link copied to clipboard!';
                toast.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #48bb78;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    z-index: 10000;
                    font-weight: 600;
                `;
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.remove();
                }, 3000);
            }
        } catch (error) {
            console.log('Share not supported');
        }
    };
});