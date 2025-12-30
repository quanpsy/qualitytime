/**
 * Quality Time - Landing Page JavaScript V2
 * Enhanced with Custom Cursor, Confetti, Spin Wheel, Instant Tilt
 */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    if (cursor && cursorFollower && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Cursor follows instantly
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, select, .glass-card, .college-tag');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            });
        });
    }

    // ========================================
    // INSTANT TILT EFFECT FOR CARDS
    // ========================================
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            // Update glow position
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            card.style.setProperty('--mouse-x', percentX + '%');
            card.style.setProperty('--mouse-y', percentY + '%');

            // INSTANT transform - no transition delay
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ========================================
    // PARALLAX EFFECT
    // ========================================
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.shape');

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero ? hero.offsetHeight : 0;

        if (scrolled < heroHeight && hero) {
            // Move shapes at different speeds
            shapes.forEach((shape, index) => {
                const speed = 0.03 + (index * 0.02);
                const direction = index % 2 === 0 ? 1 : -1;
                shape.style.transform = `translateY(${scrolled * speed * direction}px)`;
            });

            // Fade hero content on scroll
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const opacity = 1 - (scrolled / (heroHeight * 0.5));
                heroContent.style.opacity = Math.max(0, opacity);
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // ========================================
    // MOUSE PARALLAX FOR SHAPES (Desktop)
    // ========================================
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            shapes.forEach((shape, index) => {
                const intensity = 15 + (index * 8);
                const x = mouseX * intensity;
                const y = mouseY * intensity;
                const currentTransform = shape.style.transform || '';
                const translateY = currentTransform.match(/translateY\(([^)]+)\)/);
                const existingY = translateY ? translateY[1] : '0px';
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ========================================
    // WAITLIST COUNTER ANIMATION
    // ========================================
    const counterEl = document.getElementById('waitlistCount');
    if (counterEl) {
        const targetCount = Math.floor(Math.random() * 50) + 47; // Random between 47-97
        let currentCount = 0;
        const duration = 2000;
        const startTime = Date.now();

        function animateCounter() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentCount = Math.floor(easeOut * targetCount);

            counterEl.textContent = currentCount;

            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            }
        }

        // Start counter animation when page loads
        setTimeout(animateCounter, 1500);
    }

    // ========================================
    // CONFETTI EFFECT
    // ========================================
    const confettiContainer = document.getElementById('confetti-container');
    const ctaButton = document.getElementById('ctaButton');
    const submitBtn = document.getElementById('submitBtn');

    function createConfetti(originX, originY) {
        const colors = ['#FF6B35', '#FF8A5C', '#E55A2B', '#FFB088', '#FFF'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = originX + 'px';
            confetti.style.top = originY + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

            confettiContainer.appendChild(confetti);

            // Animate
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 400 + 200;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 300;
            const rotation = Math.random() * 720 - 360;

            confetti.animate([
                {
                    transform: 'translate(0, 0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${vx}px, ${vy + 600}px) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ], {
                duration: 1500 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }
    }

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            const rect = ctaButton.getBoundingClientRect();
            createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    // ========================================
    // EXPERIENCE WHEEL
    // ========================================
    const spinButton = document.getElementById('spinButton');
    const wheelInner = document.querySelector('.wheel-inner');
    const experienceResult = document.getElementById('experienceResult');
    const segments = document.querySelectorAll('.wheel-segment');

    const experiences = [
        { title: 'Icebreaker Games', desc: 'Fun games to break the ice and get conversations flowing!' },
        { title: 'Group Discussions', desc: 'Engaging topics that spark interesting debates and connections.' },
        { title: 'Fun Challenges', desc: 'Team challenges that bring out your competitive spirit!' },
        { title: 'Pizza & Drinks', desc: 'Delicious food and refreshing drinks while you mingle.' },
        { title: 'Number Exchange', desc: 'Connect with your favorites at the end of the event.' }
    ];

    let isSpinning = false;
    let currentRotation = 0;

    if (spinButton && wheelInner) {
        spinButton.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;

            // Remove active from all segments
            segments.forEach(s => s.classList.remove('active'));

            // Random spin
            const spins = 3 + Math.random() * 2;
            const targetIndex = Math.floor(Math.random() * 5);
            const targetRotation = currentRotation + (spins * 360) + (targetIndex * 72);

            wheelInner.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            wheelInner.style.transform = `rotate(-${targetRotation}deg)`;

            currentRotation = targetRotation;

            setTimeout(() => {
                const experience = experiences[targetIndex];
                experienceResult.innerHTML = `
                    <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">${experience.title}</h3>
                    <p class="result-text">${experience.desc}</p>
                `;
                segments[targetIndex].classList.add('active');
                isSpinning = false;
            }, 3000);
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll(
        '.feature-card, .step, .pricing-card, .college-tag, .signup-info, .signup-form-container, .testimonial-card'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    checkReveal();
    window.addEventListener('scroll', checkReveal);

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // FORM HANDLING WITH CONFETTI
    // ========================================
    const form = document.getElementById('interestForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            console.log('Form submitted:', data);

            const submitBtn = form.querySelector('.submit-button');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Submitting...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                form.style.display = 'none';
                formSuccess.classList.add('show');

                // Create confetti celebration
                const rect = formSuccess.getBoundingClientRect();
                createConfetti(rect.left + rect.width / 2, rect.top);

                // Store in localStorage
                const submissions = JSON.parse(localStorage.getItem('qualityTimeSubmissions') || '[]');
                submissions.push({
                    ...data,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('qualityTimeSubmissions', JSON.stringify(submissions));

                // Update counter
                if (counterEl) {
                    const currentCount = parseInt(counterEl.textContent);
                    counterEl.textContent = currentCount + 1;
                }

            }, 1200);
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    console.log('Quality Time V2 - Landing page initialized with enhanced features');
});
