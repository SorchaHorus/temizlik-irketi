document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
        observer.observe(elem);
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        }
    });

    // Mobile menu toggle (basic implementation)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if(navMenu.style.display === 'block') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'block';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.background = '#fff';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                
                const ul = navMenu.querySelector('ul');
                ul.style.flexDirection = 'column';
                ul.style.alignItems = 'center';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if(window.innerWidth <= 768 && navMenu.style.display === 'block') {
                    navMenu.style.display = 'none';
                }
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Sayfanın yenilenmesini engelle

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // Get form values
            const name = document.getElementById('name').value;
            
            // Get selected service text
            const serviceSelect = document.getElementById('service');
            const service = serviceSelect.options[serviceSelect.selectedIndex].text;
            
            const message = document.getElementById('message').value;

            // Loading state
            submitBtn.innerHTML = 'Yönlendiriliyor... <i class="fa-brands fa-whatsapp fa-spin"></i>';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Prepare WhatsApp message
                let waMessage = `Merhaba, ben ${name}.\n`;
                waMessage += `Hizmet: ${service}\n`;
                if(message.trim() !== "") {
                    waMessage += `Mesaj/Detay: ${message}`;
                }

                // Encode message for URL
                const encodedMessage = encodeURIComponent(waMessage);
                
                // Open WhatsApp in new tab
                window.open(`https://wa.me/905015794191?text=${encodedMessage}`, '_blank');
                
                // Reset button
                submitBtn.innerHTML = 'WhatsApp\'a Gidildi <i class="fa-solid fa-check"></i>';
                submitBtn.style.background = '#25D366'; // WhatsApp Green
                
                // Show notification
                showNotification('WhatsApp\'a yönlendiriliyorsunuz. Lütfen mesajı gönderin.', 'success');
                
                // Reset form
                contactForm.reset();

                // Restore button after 4 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = 'var(--primary-blue)';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 4000);
            }, 800);
        });
    }

    // Notification System
    function showNotification(message, type) {
        let notif = document.createElement('div');
        notif.className = `custom-notification ${type}`;
        notif.innerHTML = `
            <div class="notif-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="notif-text">${message}</div>
            <div class="notif-close"><i class="fa-solid fa-xmark"></i></div>
        `;
        document.body.appendChild(notif);

        // Animate in
        setTimeout(() => {
            notif.style.transform = 'translateX(0)';
            notif.style.opacity = '1';
        }, 10);

        // Add close event
        notif.querySelector('.notif-close').addEventListener('click', () => {
            notif.style.transform = 'translateX(120%)';
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 400);
        });

        // Auto remove
        setTimeout(() => {
            if(document.body.contains(notif)) {
                notif.style.transform = 'translateX(120%)';
                notif.style.opacity = '0';
                setTimeout(() => notif.remove(), 400);
            }
        }, 5000);
    }
});
