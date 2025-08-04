document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initNavigation();
    initMapView();
    initFilterDropdown();
    initViewToggle();
    initAuthModal();
    initItemModal();
    initPhotoUpload();
    initFormSubmission();
    initAnimations();
    initDistanceSlider();
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        authButtons.classList.toggle('active');
        
        // Animate hamburger icon
        const lines = hamburger.querySelectorAll('.line');
        lines.forEach(line => line.classList.toggle('active'));
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (hamburger.classList.contains('active')) {
                hamburger.click();
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - header.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero button navigation
    document.querySelector('.browse-btn').addEventListener('click', function() {
        document.querySelector('#browse').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
    
    document.querySelector('.post-btn').addEventListener('click', function() {
        document.querySelector('#post').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - header.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Map view functionality
function initMapView() {
    const mapViewBtn = document.getElementById('map-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const mapView = document.getElementById('map-view');
    const gridView = document.getElementById('grid-view');
    
    if (mapViewBtn && gridViewBtn) {
        mapViewBtn.addEventListener('click', function() {
            mapViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            mapView.classList.add('active');
            gridView.classList.remove('active');
            
            // Initialize map if it hasn't been already
            if (typeof mapboxgl !== 'undefined' && !window.mapInitialized) {
                initMap();
                window.mapInitialized = true;
            }
        });
        
        gridViewBtn.addEventListener('click', function() {
            gridViewBtn.classList.add('active');
            mapViewBtn.classList.remove('active');
            gridView.classList.add('active');
            mapView.classList.remove('active');
        });
    }
}

// Initialize Mapbox map
function initMap() {
    const mapElement = document.getElementById('map');
    
    if (mapElement && typeof mapboxgl !== 'undefined') {
        // Note: In a real application, you would use your own Mapbox access token
        mapboxgl.accessToken = 'pk.placeholder.token'; // Replace with actual token in production
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40], // Default center (would be user's location in real app)
            zoom: 9
        });
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());
        
        // Add geolocation control
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
        
        // Add sample markers (in a real app, these would come from your database)
        const sampleItems = [
            { lng: -74.5, lat: 40, title: 'Broken Laptop for Parts', distance: '2.3 km' },
            { lng: -74.48, lat: 40.02, title: 'Moving Boxes (5)', distance: '1.5 km' },
            { lng: -74.52, lat: 39.98, title: 'Fabric Scraps for Crafting', distance: '3.7 km' },
            { lng: -74.45, lat: 40.05, title: 'Old Smartphone (Working)', distance: '4.1 km' },
            { lng: -74.51, lat: 40.01, title: 'Assorted Computer Cables', distance: '0.8 km' }
        ];
        
        sampleItems.forEach(item => {
            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'custom-marker';
            markerEl.style.backgroundColor = '#4CAF50';
            markerEl.style.width = '25px';
            markerEl.style.height = '25px';
            markerEl.style.borderRadius = '50%';
            markerEl.style.cursor = 'pointer';
            markerEl.style.border = '3px solid white';
            markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            
            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${item.title}</h4><p>${item.distance} away</p>`);
            
            // Add marker to map
            new mapboxgl.Marker(markerEl)
                .setLngLat([item.lng, item.lat])
                .setPopup(popup)
                .addTo(map);
        });
        
        // Click event for map item list
        document.querySelectorAll('.map-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                if (index < sampleItems.length) {
                    map.flyTo({
                        center: [sampleItems[index].lng, sampleItems[index].lat],
                        zoom: 14,
                        essential: true
                    });
                }
            });
        });
    } else {
        console.warn('Map element not found or Mapbox GL JS not loaded');
        // Fallback for when Mapbox isn't available
        if (mapElement) {
            mapElement.innerHTML = '<div style="padding: 20px; text-align: center;">Map view requires an internet connection. Please try again later.</div>';
        }
    }
}

// Filter dropdown functionality
function initFilterDropdown() {
    const filterBtn = document.querySelector('.filter-btn');
    const filterContent = document.querySelector('.filter-content');
    
    if (filterBtn && filterContent) {
        filterBtn.addEventListener('click', function() {
            filterContent.style.display = filterContent.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.filter-dropdown')) {
                filterContent.style.display = 'none';
            }
        });
    }
}

// View toggle functionality
function initViewToggle() {
    // Already handled in initMapView function
}

// Auth modal functionality
function initAuthModal() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const joinBtn = document.querySelector('.join-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = authModal?.querySelector('.close-modal');
    const authTabs = authModal?.querySelectorAll('.auth-tab');
    
    // Open modal
    [loginBtn, signupBtn, joinBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                if (authModal) {
                    authModal.style.display = 'block';
                    
                    // Set active tab based on which button was clicked
                    if (authTabs) {
                        authTabs.forEach(tab => tab.classList.remove('active'));
                        
                        if (this === signupBtn || this === joinBtn) {
                            authTabs[1].classList.add('active'); // Signup tab
                            document.getElementById('login-form').classList.remove('active');
                            document.getElementById('signup-form').classList.add('active');
                        } else {
                            authTabs[0].classList.add('active'); // Login tab
                            document.getElementById('signup-form').classList.remove('active');
                            document.getElementById('login-form').classList.add('active');
                        }
                    }
                }
            });
        }
    });
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Tab switching
    if (authTabs) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.getAttribute('data-tab');
                
                // Update active tab
                authTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding form
                document.getElementById('login-form').classList.remove('active');
                document.getElementById('signup-form').classList.remove('active');
                document.getElementById(`${tabType}-form`).classList.add('active');
            });
        });
    }
    
    // Form submission
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would handle login authentication here
            alert('Login functionality would be implemented in a real application.');
            authModal.style.display = 'none';
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would handle signup here
            alert('Sign up functionality would be implemented in a real application.');
            authModal.style.display = 'none';
        });
    }
}

// Item modal functionality
function initItemModal() {
    const itemCards = document.querySelectorAll('.item-card');
    const itemModal = document.getElementById('item-modal');
    const closeModal = itemModal?.querySelector('.close-modal');
    const modalBody = itemModal?.querySelector('.modal-body');
    
    // Open modal when clicking on an item card
    itemCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on the request button
            if (e.target.classList.contains('request-btn')) {
                return;
            }
            
            if (itemModal && modalBody) {
                // Get item details
                const itemImage = this.querySelector('.item-image').style.backgroundImage;
                const itemCategory = this.querySelector('.item-category').textContent;
                const itemTitle = this.querySelector('h3').textContent;
                const itemDescription = this.querySelector('p').textContent;
                const itemMeta = this.querySelector('.item-meta').innerHTML;
                const userInfo = this.querySelector('.user-info').innerHTML;
                
                // Create modal content
                modalBody.innerHTML = `
                    <div class="modal-item-details">
                        <div class="modal-item-image" style="${itemImage}; height: 300px; background-size: cover; background-position: center; border-radius: 8px;"></div>
                        <div class="modal-item-info">
                            <div class="modal-item-category">${itemCategory}</div>
                            <h2>${itemTitle}</h2>
                            <p>${itemDescription}</p>
                            <div class="modal-item-meta">${itemMeta}</div>
                            <div class="modal-user-info">${userInfo}</div>
                            <div class="modal-actions">
                                <button class="request-btn">Request Item</button>
                                <button class="message-btn"><i class="fas fa-comment"></i> Message Owner</button>
                                <button class="share-btn"><i class="fas fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Show modal
                itemModal.style.display = 'block';
                
                // Add event listener to request button in modal
                modalBody.querySelector('.request-btn').addEventListener('click', function() {
                    alert('Request sent! The owner will be notified of your interest.');
                    itemModal.style.display = 'none';
                });
                
                // Add event listener to message button in modal
                modalBody.querySelector('.message-btn').addEventListener('click', function() {
                    alert('Messaging functionality would be implemented in a real application.');
                });
                
                // Add event listener to share button in modal
                modalBody.querySelector('.share-btn').addEventListener('click', function() {
                    alert('Sharing functionality would be implemented in a real application.');
                });
            }
        });
    });
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            itemModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === itemModal) {
            itemModal.style.display = 'none';
        }
    });
}

// Photo upload preview functionality
function initPhotoUpload() {
    const photoInput = document.getElementById('item-photos');
    const previewContainer = document.querySelector('.photo-preview-container');
    
    if (photoInput && previewContainer) {
        photoInput.addEventListener('change', function() {
            previewContainer.innerHTML = ''; // Clear existing previews
            
            if (this.files) {
                Array.from(this.files).forEach(file => {
                    if (!file.type.match('image.*')) {
                        return;
                    }
                    
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const preview = document.createElement('div');
                        preview.className = 'photo-preview';
                        preview.style.width = '120px';
                        preview.style.height = '120px';
                        preview.style.backgroundImage = `url(${e.target.result})`;
                        preview.style.backgroundSize = 'cover';
                        preview.style.backgroundPosition = 'center';
                        preview.style.borderRadius = '8px';
                        preview.style.position = 'relative';
                        
                        const removeBtn = document.createElement('button');
                        removeBtn.className = 'remove-photo';
                        removeBtn.innerHTML = '&times;';
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '5px';
                        removeBtn.style.right = '5px';
                        removeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                        removeBtn.style.color = 'white';
                        removeBtn.style.border = 'none';
                        removeBtn.style.borderRadius = '50%';
                        removeBtn.style.width = '25px';
                        removeBtn.style.height = '25px';
                        removeBtn.style.cursor = 'pointer';
                        removeBtn.style.display = 'flex';
                        removeBtn.style.alignItems = 'center';
                        removeBtn.style.justifyContent = 'center';
                        
                        removeBtn.addEventListener('click', function() {
                            preview.remove();
                        });
                        
                        preview.appendChild(removeBtn);
                        previewContainer.appendChild(preview);
                    };
                    
                    reader.readAsDataURL(file);
                });
            }
        });
    }
}

// Form submission handling
function initFormSubmission() {
    const postForm = document.getElementById('post-form');
    const useLocationBtn = document.querySelector('.use-location-btn');
    
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, you would handle form submission to your backend here
            alert('Your item has been posted successfully! It will now be visible to others in your area.');
            
            // Reset form
            this.reset();
            document.querySelector('.photo-preview-container').innerHTML = '';
            
            // Scroll to browse section
            document.querySelector('#browse').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        });
    }
    
    // Use current location button
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', function() {
            const locationInput = document.getElementById('item-location');
            
            if (locationInput && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    // In a real app, you would use a geocoding service to get the address
                    locationInput.value = `Latitude: ${position.coords.latitude.toFixed(6)}, Longitude: ${position.coords.longitude.toFixed(6)}`;
                }, function() {
                    alert('Unable to retrieve your location. Please enter it manually.');
                });
            } else {
                alert('Geolocation is not supported by your browser. Please enter your location manually.');
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, you would handle newsletter subscription here
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            this.reset();
        });
    }
    
    // Request buttons
    document.querySelectorAll('.request-btn').forEach(btn => {
        if (!btn.closest('.modal')) { // Don't add listeners to modal buttons here
            btn.addEventListener('click', function() {
                alert('Request sent! The owner will be notified of your interest.');
            });
        }
    });
}

// Animations on scroll
function initAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .category, .item-card, .testimonial, .impact-stat');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Add initial animation class
    document.querySelectorAll('.step, .category, .item-card, .testimonial, .impact-stat').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add animated class when in view
    document.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('resize', animateOnScroll);
    
    // Define the animated class effect
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Distance slider functionality
function initDistanceSlider() {
    const distanceSlider = document.getElementById('distance-slider');
    const distanceValue = document.getElementById('distance-value');
    
    if (distanceSlider && distanceValue) {
        distanceSlider.addEventListener('input', function() {
            distanceValue.textContent = this.value;
        });
    }
}