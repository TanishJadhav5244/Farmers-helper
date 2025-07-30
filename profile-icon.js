// Profile Icon Component
class ProfileIcon {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            showName: true,
            showAvatar: true,
            showDropdown: true,
            position: 'top-right',
            ...options
        };
        
        this.currentUser = null;
        this.userData = null;
        this.init();
    }

    init() {
        this.createProfileIcon();
        this.checkAuthState();
    }

    createProfileIcon() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Create profile icon HTML
        const profileIconHTML = `
            <div class="profile-icon-container" id="profileIconContainer">
                <div class="profile-icon" id="profileIcon">
                    <div class="profile-avatar" id="profileAvatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="profile-name" id="profileName" style="display: none;">User</span>
                </div>
                <div class="profile-dropdown" id="profileDropdown" style="display: none;">
                    <div class="profile-info">
                        <div class="profile-info-item">
                            <i class="fas fa-user"></i>
                            <span id="dropdownName">User</span>
                        </div>
                        <div class="profile-info-item">
                            <i class="fas fa-envelope"></i>
                            <span id="dropdownEmail">email@example.com</span>
                        </div>
                        <div class="profile-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span id="dropdownLocation">Location</span>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <a href="profile.html" class="profile-action-btn">
                            <i class="fas fa-user-circle"></i>
                            View Profile
                        </a>
                        <a href="edit_profile.html" class="profile-action-btn">
                            <i class="fas fa-edit"></i>
                            Edit Profile
                        </a>
                        <button onclick="profileIcon.logout()" class="profile-action-btn logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add CSS styles
        const styles = `
            <style>
                .profile-icon-container {
                    position: relative;
                    display: inline-block;
                }

                .profile-icon {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #e0e0e0;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .profile-icon:hover {
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateY(-1px);
                }

                .profile-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4CAF50, #81c784);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                }

                .profile-name {
                    font-weight: 500;
                    color: #333;
                    font-size: 14px;
                }

                .profile-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 280px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    border: 1px solid #e0e0e0;
                    z-index: 1000;
                    margin-top: 8px;
                    overflow: hidden;
                }

                .profile-info {
                    padding: 16px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .profile-info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-size: 13px;
                    color: #666;
                }

                .profile-info-item:last-child {
                    margin-bottom: 0;
                }

                .profile-info-item i {
                    width: 16px;
                    color: #4CAF50;
                }

                .profile-actions {
                    padding: 8px;
                }

                .profile-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    padding: 10px 12px;
                    border: none;
                    background: none;
                    color: #333;
                    text-decoration: none;
                    font-size: 14px;
                    border-radius: 8px;
                    transition: background 0.3s ease;
                    cursor: pointer;
                }

                .profile-action-btn:hover {
                    background: #f5f5f5;
                }

                .profile-action-btn.logout-btn {
                    color: #f44336;
                }

                .profile-action-btn.logout-btn:hover {
                    background: #ffebee;
                }

                .profile-action-btn i {
                    width: 16px;
                }

                /* Animation for dropdown */
                .profile-dropdown.show {
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .profile-dropdown {
                        width: 250px;
                        right: -50px;
                    }
                    
                    .profile-name {
                        display: none;
                    }
                }
            </style>
        `;

        // Add styles to head if not already present
        if (!document.getElementById('profile-icon-styles')) {
            const styleElement = document.createElement('div');
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement.firstElementChild);
        }

        container.innerHTML = profileIconHTML;
        this.bindEvents();
    }

    bindEvents() {
        const profileIcon = document.getElementById('profileIcon');
        const profileDropdown = document.getElementById('profileDropdown');

        if (profileIcon) {
            profileIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-icon-container')) {
                this.hideDropdown();
            }
        });
    }

    toggleDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            if (dropdown.style.display === 'none' || dropdown.style.display === '') {
                this.showDropdown();
            } else {
                this.hideDropdown();
            }
        }
    }

    showDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.style.display = 'block';
            dropdown.classList.add('show');
        }
    }

    hideDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
            dropdown.classList.remove('show');
        }
    }

    checkAuthState() {
        // Initialize Firebase if not already done
        if (typeof firebase === 'undefined') {
            console.error('Firebase not loaded');
            return;
        }

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadUserData();
                this.updateProfileIcon();
            } else {
                this.hideProfileIcon();
            }
        });
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const doc = await firebase.firestore().collection("users").doc(this.currentUser.uid).get();
            if (doc.exists) {
                this.userData = doc.data();
            } else {
                // Create basic user data if not exists
                this.userData = {
                    name: this.currentUser.displayName || 'User',
                    email: this.currentUser.email || '',
                    phone: '',
                    state: '',
                    district: '',
                    farmerType: ''
                };
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.userData = {
                name: this.currentUser.displayName || 'User',
                email: this.currentUser.email || '',
                phone: '',
                state: '',
                district: '',
                farmerType: ''
            };
        }
    }

    updateProfileIcon() {
        const profileName = document.getElementById('profileName');
        const profileAvatar = document.getElementById('profileAvatar');
        const dropdownName = document.getElementById('dropdownName');
        const dropdownEmail = document.getElementById('dropdownEmail');
        const dropdownLocation = document.getElementById('dropdownLocation');

        if (this.userData) {
            // Update profile name
            if (profileName) {
                profileName.textContent = this.userData.name || 'User';
                if (this.options.showName) {
                    profileName.style.display = 'inline';
                }
            }

            // Update dropdown info
            if (dropdownName) {
                dropdownName.textContent = this.userData.name || 'User';
            }

            if (dropdownEmail) {
                dropdownEmail.textContent = this.userData.email || 'No email';
            }

            if (dropdownLocation) {
                const location = [];
                if (this.userData.state) location.push(this.userData.state);
                if (this.userData.district) location.push(this.userData.district);
                dropdownLocation.textContent = location.length > 0 ? location.join(', ') : 'Location not set';
            }

            // Update avatar with user's first name initial
            if (profileAvatar && this.userData.name) {
                const initial = this.userData.name.charAt(0).toUpperCase();
                profileAvatar.innerHTML = `<span style="font-size: 14px; font-weight: 600;">${initial}</span>`;
            }
        }

        // Show the profile icon
        const container = document.getElementById('profileIconContainer');
        if (container) {
            container.style.display = 'inline-block';
        }
    }

    hideProfileIcon() {
        const container = document.getElementById('profileIconContainer');
        if (container) {
            container.style.display = 'none';
        }
    }

    logout() {
        firebase.auth().signOut().then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    }
}

// Global instance
let profileIcon;

// Initialize profile icon when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if profile icon container exists
    const container = document.getElementById('profileIconContainer');
    if (!container) {
        // Create container if it doesn't exist
        const nav = document.querySelector('.nav-links') || document.querySelector('nav');
        if (nav) {
            const iconContainer = document.createElement('div');
            iconContainer.id = 'profileIconContainer';
            nav.appendChild(iconContainer);
        }
    }
    
    // Initialize profile icon
    profileIcon = new ProfileIcon('profileIconContainer', {
        showName: true,
        showAvatar: true,
        showDropdown: true
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileIcon;
} 