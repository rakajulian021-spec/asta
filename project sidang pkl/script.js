// Enhanced JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle with ARIA support
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    mobileMenuButton.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileMenu.classList.toggle('open');
        mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);

        // Change icon
        const icon = mobileMenuButton.querySelector('i');
        icon.className = isMenuOpen ? 'fas fa-times text-2xl' : 'fas fa-bars text-2xl';
    });

    // Close mobile menu when clicking outside or on links
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            if (isMenuOpen) {
                isMenuOpen = false;
                mobileMenu.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', false);
                mobileMenuButton.querySelector('i').className = 'fas fa-bars text-2xl';
            }
        }
    });

    // Close menu when clicking on navigation links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                mobileMenu.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', false);
                mobileMenuButton.querySelector('i').className = 'fas fa-bars text-2xl';
            }
        });
    });

    // Smooth scrolling for navigation links with offset for sticky header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = target.offsetTop;
                // Adjust offset for fixed header
                const offsetPosition = elementPosition - headerHeight - 20; // Added extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll progress indicator
    const scrollIndicator = document.getElementById('scroll-indicator');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight);
        scrollIndicator.style.transform = `scaleX(${scrollPercent})`;
    });

    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-fade').forEach(section => {
        observer.observe(section);
    });

    // Animated counter for statistics
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 30);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stats-counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
                statsObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }

    // Enhanced form handling with better validation and Formspree integration
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            // Only re-validate if it already has an error class
            if (input.classList.contains('border-red-400')) {
                validateField(input);
            }
        });
    });

    function validateField(field) {
        const errorElement = document.getElementById(field.name + '-error');
        let isValid = true;
        let message = '';

        // Remove existing error styles
        field.classList.remove('border-red-400');
        if (errorElement) errorElement.classList.add('hidden');

        if (field.required && !field.value.trim()) {
            isValid = false;
            message = 'Field ini harus diisi.';
        } else {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (field.value && !emailRegex.test(field.value)) {
                        isValid = false;
                        message = 'Format email tidak valid.';
                    }
                    break;
                case 'tel':
                    // Allow empty if not required, otherwise validate format
                    const phoneRegex = /^\+?[\d\s]{7,15}$/; // Basic phone number regex
                    if (field.value && !phoneRegex.test(field.value.replace(/\s/g, ''))) {
                        isValid = false;
                        message = 'Format nomor telepon tidak valid.';
                    }
                    break;
                case 'text':
                    // Specific validation for name if needed, e.g., min length
                    if (field.id === 'name' && field.value.trim().length < 2) {
                        // isValid = false;
                        // message = 'Nama terlalu pendek.';
                    }
                    break;
                case 'textarea':
                    if (field.id === 'message' && field.value.trim().length < 10) {
                        // isValid = false;
                        // message = 'Pesan terlalu pendek.';
                    }
                    break;
            }
        }

        if (!isValid) {
            showFieldError(field, errorElement, message);
        }
        return isValid;
    }

    function showFieldError(field, errorElement, message) {
        field.classList.add('border-red-400');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Validate all fields on submit
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.border-red-400');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Mengirim...';
        loadingSpinner.classList.remove('hidden');

        try {
            // Use Fetch API to submit form data to Formspree
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                successMessage.classList.remove('hidden');
                contactForm.reset(); // Clear form fields

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Hide success message after 10 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 10000);
            } else {
                // Handle server-side errors or Formspree specific errors
                const data = await response.json();
                console.error('Form submission error:', data);
                errorMessage.classList.remove('hidden');
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        } catch (error) {
            console.error('Network or unexpected error:', error);
            errorMessage.classList.remove('hidden');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.textContent = 'Kirim Pesan';
            loadingSpinner.classList.add('hidden');
        }
    });

    // Add loading states for images (already present, ensuring it works)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            });
        }
    });

    // Performance optimization: Lazy load images below the fold (already present, ensuring it works)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Check if data-src exists before trying to set src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Select images that are meant for lazy loading (e.g., with data-src)
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Keyboard navigation improvements (already present, ensuring it works)
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            mobileMenu.classList.remove('open');
            mobileMenuButton.setAttribute('aria-expanded', false);
            mobileMenuButton.querySelector('i').className = 'fas fa-bars text-2xl';
            mobileMenuButton.focus();
        }
    });

    console.log('🔥 HeatPro website loaded successfully!');
});
