// Profile JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let userProfile = {};

    // Wait for Firebase auth
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadUserProfile();
            displayAccountInfo();
        }
    });

    // Load user profile from Firestore
    async function loadUserProfile() {
        if (!currentUser) return;

        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            const docSnap = await getDoc(doc(window.db, 'users', currentUser.uid));
            
            if (docSnap.exists()) {
                userProfile = docSnap.data();
                populateForm();
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // Save user profile to Firestore
    async function saveUserProfile() {
        if (!currentUser) return;

        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            await setDoc(doc(window.db, 'users', currentUser.uid), {
                ...userProfile,
                email: currentUser.email,
                lastUpdated: new Date()
            });
            
            // Show success message
            showToast('Profile saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving profile:', error);
            showToast('Error saving profile', 'error');
        }
    }

    // Display account information
    function displayAccountInfo() {
        document.getElementById('userEmail').textContent = currentUser.email;
        
        const creationTime = new Date(currentUser.metadata.creationTime);
        document.getElementById('memberSince').textContent = creationTime.toLocaleDateString();
        
        const lastSignIn = new Date(currentUser.metadata.lastSignInTime);
        document.getElementById('lastLogin').textContent = lastSignIn.toLocaleDateString();
    }

    // Populate form with user data
    function populateForm() {
        document.getElementById('displayName').value = userProfile.displayName || '';
        document.getElementById('bio').value = userProfile.bio || '';
        document.getElementById('location').value = userProfile.location || '';
        document.getElementById('experience').value = userProfile.experience || '';
        
        if (userProfile.photoURL) {
            document.getElementById('avatarImage').src = userProfile.photoURL;
            document.getElementById('avatarImage').style.display = 'block';
            document.getElementById('avatarPlaceholder').style.display = 'none';
        }
    }

    // Handle avatar upload
    document.getElementById('avatarInput').addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Show loading
            const avatarPlaceholder = document.getElementById('avatarPlaceholder');
            avatarPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Upload to Firebase Storage
            const photoURL = await uploadAvatar(file);
            
            // Update UI
            document.getElementById('avatarImage').src = photoURL;
            document.getElementById('avatarImage').style.display = 'block';
            avatarPlaceholder.style.display = 'none';
            
            // Update profile
            userProfile.photoURL = photoURL;
            await saveUserProfile();
            
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showToast('Error uploading photo', 'error');
            document.getElementById('avatarPlaceholder').innerHTML = '👤';
        }
    });

    // Upload avatar to Firebase Storage
    async function uploadAvatar(file) {
        const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js');
        const storageRef = ref(window.storage, `avatars/${currentUser.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    }

    // Handle form submission
    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Update profile object
        userProfile.displayName = document.getElementById('displayName').value;
        userProfile.bio = document.getElementById('bio').value;
        userProfile.location = document.getElementById('location').value;
        userProfile.experience = document.getElementById('experience').value;
        
        await saveUserProfile();
    });

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

    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#ef4444'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});