document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.style.padding = '15px 5%';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.padding = '20px 5%';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Show donation forms
    const donateBtn = document.querySelector('.donate-btn');
    const donateFoodBtn = document.querySelector('.donate-food-btn');
    const donateMoneyBtn = document.querySelector('.donate-money-btn');
    const partnerBtn = document.querySelector('.partner-btn');
    const partnerSignupBtn = document.querySelector('.partner-signup-btn');
    const donationFormSection = document.getElementById('donation-form');
    const moneyDonationFormSection = document.getElementById('money-donation-form');
    const restaurantFormSection = document.getElementById('restaurant-form');

    function hideAllForms() {
        donationFormSection.classList.add('hidden');
        moneyDonationFormSection.classList.add('hidden');
        restaurantFormSection.classList.add('hidden');
    }

    donateBtn.addEventListener('click', function() {
        hideAllForms();
        donationFormSection.classList.remove('hidden');
        window.scrollTo({
            top: donationFormSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    donateFoodBtn.addEventListener('click', function() {
        hideAllForms();
        donationFormSection.classList.remove('hidden');
        window.scrollTo({
            top: donationFormSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    donateMoneyBtn.addEventListener('click', function() {
        hideAllForms();
        moneyDonationFormSection.classList.remove('hidden');
        window.scrollTo({
            top: moneyDonationFormSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    partnerBtn.addEventListener('click', function() {
        hideAllForms();
        restaurantFormSection.classList.remove('hidden');
        window.scrollTo({
            top: restaurantFormSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    partnerSignupBtn.addEventListener('click', function() {
        hideAllForms();
        restaurantFormSection.classList.remove('hidden');
        window.scrollTo({
            top: restaurantFormSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    // Amount options in money donation form
    const amountOptions = document.querySelectorAll('.amount-option');
    const customAmountInput = document.getElementById('custom-amount');

    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            amountOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            customAmountInput.value = '';
        });
    });

    customAmountInput.addEventListener('focus', function() {
        amountOptions.forEach(opt => opt.classList.remove('active'));
    });

    // Form submissions
    const foodDonationForm = document.getElementById('food-donation-form');
    const moneyDonationForm = document.getElementById('money-donation-form');
    const restaurantPartnershipForm = document.getElementById('restaurant-partnership-form');
    const contactForm = document.getElementById('contact-form');

    foodDonationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send the form data to a server
        alert('Thank you for your food donation! We will process your request and connect you with a restaurant partner.');
        this.reset();
        hideAllForms();
    });

    moneyDonationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send the form data to a server and redirect to a payment gateway
        let amount = customAmountInput.value;
        if (!amount) {
            const activeOption = document.querySelector('.amount-option.active');
            if (activeOption) {
                amount = activeOption.getAttribute('data-amount');
            }
        }
        if (amount) {
            alert(`Thank you for your donation of $${amount}! We will redirect you to our secure payment gateway.`);
        } else {
            alert('Please select or enter a donation amount.');
            return;
        }
        this.reset();
        hideAllForms();
    });

    restaurantPartnershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send the form data to a server
        alert('Thank you for your interest in becoming a restaurant partner! Our team will contact you soon.');
        this.reset();
        hideAllForms();
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would send the form data to a server
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Simulated restaurant finder functionality
    // In a real application, this would use geolocation and a database of restaurant partners
    const locationInput = document.getElementById('location');
    locationInput.addEventListener('blur', function() {
        if (this.value) {
            console.log(`Finding restaurants near ${this.value}...`);
            // Simulated API call to find nearby restaurants
            setTimeout(() => {
                console.log('Found 5 restaurant partners in this area.');
            }, 1000);
        }
    });

    // Simulated authentication functionality
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');

    loginBtn.addEventListener('click', function() {
        alert('Login functionality would be implemented here.');
    });

    signupBtn.addEventListener('click', function() {
        alert('Sign up functionality would be implemented here.');
    });

    // Add animation to steps and cards
    function animateOnScroll() {
        const elements = document.querySelectorAll('.step, .donation-card, .benefit');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial state for animation
    const animatedElements = document.querySelectorAll('.step, .donation-card, .benefit');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run once on page load
    animateOnScroll();
});