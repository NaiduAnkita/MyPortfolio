// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});
const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
for (let i = 0; i < mobileMenuLinks.length; i++) {
    mobileMenuLinks[i].addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
}

// Scroll animations for general sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

const sections = document.querySelectorAll('.fade-in-section');
sections.forEach(section => {
    observer.observe(section);
});

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    // Check for prefers-reduced-motion before applying styles and observing
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.style.transitionDelay = `${index * 80}ms`;
        projectObserver.observe(card);
    } else {
        // If reduced motion is preferred, make the card visible immediately
        card.classList.add('is-visible');
    }
});

// Timeline animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const dot = entry.target.querySelector('.timeline-dot');
        const card = entry.target.querySelector('.timeline-item');
        if (dot && card) {
            if (entry.isIntersecting) {
                card.classList.add('is-visible');
                dot.classList.add('active');
            } else {
                card.classList.remove('is-visible');
                dot.classList.remove('active');
            }
        }
    });
}, { threshold: 0.5 });

const timelineEntries = document.querySelectorAll('.right-timeline, .left-timeline');
timelineEntries.forEach(entry => {
    timelineObserver.observe(entry);
});

// Contact Form Handler
// const contactForm = document.getElementById('contact-form');
// const successMessage = document.getElementById('success-message');
// const closeModalButton = document.getElementById('close-modal-button');

// if(contactForm) {
//     contactForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         // In a real application, you would handle form submission here 
//         // (e.g., send to an API endpoint using fetch).
//         // For this demo, we'll just show the success message.
//         if(successMessage) {
//             successMessage.classList.remove('hidden');
//         }
//         contactForm.reset();
//     });
// }

// if(closeModalButton) {
//     closeModalButton.addEventListener('click', () => {
//         if(successMessage) {
//             successMessage.classList.add('hidden');
//         }
//     });
// }

(function () {
    // ⚠️ REPLACE 'YOUR_PUBLIC_KEY' WITH YOUR ACTUAL EMAILJS PUBLIC KEY
    emailjs.init('XXzVSsILkv3eBEL6q'); // Get from EmailJS Dashboard → Account → General
})();

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    

    // Create message container for notifications

    const messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    contactForm.parentNode.insertBefore(messageContainer, contactForm);

    // Handle form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form before sending
        if (!validateForm()) {
            return;
        }

        // Show loading state
        showLoading();

        // ⚠️ REPLACE THESE WITH YOUR ACTUAL EMAILJS IDs:
        // - 'YOUR_SERVICE_ID' → Your Gmail service ID (usually 'gmail')  
        // - 'YOUR_TEMPLATE_ID' → Your template ID from EmailJS dashboard
        emailjs.sendForm("service_n4pdpxe","template_ufnt15h", contactForm)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('🎉 Thank you! Your message has been sent to my Gmail successfully. I\'ll get back to you soon!', 'success');
                contactForm.reset();
            })
            .catch(function (error) {
                console.log(error);
                console.log('FAILED...', error);
                showMessage('❌ Sorry, there was an error sending your message. Please try again or contact me directly at naiduankita21@gmail.com', 'error');
            })
            .finally(function () {
                hideLoading();
            });
    });

    // Form validation function
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Clear previous error states
        clearErrorStates();

        if (!name || name.length < 2) {
            showFieldError('name', 'Please enter a valid name (at least 2 characters)');
            return false;
        }

        if (!email || !emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
            return false;
        }

        if (!message || message.length < 10) {
            showFieldError('message', 'Please enter a message (at least 10 characters)');
            return false;
        }

        return true;
    }

    // Show field-specific error
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = '#ef4444';
        field.style.borderWidth = '2px';
        showMessage(message, 'error');
    }

    // Clear error states
    function clearErrorStates() {
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.style.borderColor = '';
            field.style.borderWidth = '';
        });
    }

    // Show success/error messages
    function showMessage(message, type) {
        clearMessages();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        messageDiv.style.cssText = `
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    border: 1px solid;
                    transition: all 0.3s ease;
                    ${type === 'success'
                ? 'background-color: rgba(34, 197, 94, 0.1); color: #bbf7d0; border-color: #22c55e;'
                : 'background-color: rgba(239, 68, 68, 0.1); color: #fecaca; border-color: #ef4444;'
            }
                `;

        messageDiv.innerHTML = message;
        messageContainer.appendChild(messageDiv);

        // Scroll message into view
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-remove success messages after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 8000);
        }
    }

    // Clear all messages
    function clearMessages() {
        const existingMessages = messageContainer.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
    }

    // Show loading state
    function showLoading() {
        submitButton.disabled = true;
        submitButton.innerHTML = `
                    <span style="display: inline-block; width: 16px; height: 16px; margin-right: 8px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%;" class="animate-spin"></span>
                    Sending...
                `;
        submitButton.style.opacity = '0.75';
        submitButton.style.cursor = 'not-allowed';
    }

    // Hide loading state
    function hideLoading() {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
        submitButton.style.opacity = '';
        submitButton.style.cursor = '';
    }

    // Real-time validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            // Clear error styling when user starts typing
            this.style.borderColor = '';
            this.style.borderWidth = '';
        });
    });
});