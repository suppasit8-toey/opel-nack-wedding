/* ============================================ */
/* Wedding Invitation — Opel & Nack            */
/* Premium Mobile-First Interactive Script     */
/* ============================================ */

(function () {
    'use strict';

    // ========================================
    // CONFIG
    // ========================================
    const CONFIG = {
        weddingDate: new Date('2027-03-20T16:00:00+07:00'),
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', // Replace with actual video
        sections: ['cover', 'couple', 'countdown', 'schedule', 'video', 'gallery', 'rsvp', 'location', 'theme']
    };

    // ========================================
    // ENVELOPE OPENING ANIMATION
    // ========================================
    function initLoading() {
        window.scrollTo(0, 0);
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        const loadingScreen = document.getElementById('loading-screen');
        const envelope = document.getElementById('envelope');
        const tapText = document.getElementById('tap-to-open');
        let isOpened = false;

        function openEnvelope() {
            if (isOpened) return;
            isOpened = true;

            // Try to play music automatically on user interaction
            const bgMusic = document.getElementById('bg-music');
            if (bgMusic) {
                bgMusic.volume = 0.5;
                bgMusic.play().catch(e => console.log('Audio autoplay blocked', e));
            }

            // Hide tap text
            tapText.classList.add('hide');

            const envelopeImg = document.getElementById('envelope-img');
            
            // Step 1: Slide static image down to align perfectly with GIF's envelope position
            if (envelopeImg) {
                envelopeImg.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                envelopeImg.style.transform = 'translateY(20px)'; // Adjust this value to match GIF perfectly
            }

            // Step 2: Swap to animated GIF after slide finishes
            setTimeout(() => {
                if (envelopeImg) {
                    envelopeImg.style.transition = 'none'; // Remove transition
                    envelopeImg.style.transform = 'translateY(0)'; // Reset container position
                    envelopeImg.src = 'logo/จดหมายขยับได้.gif?t=' + new Date().getTime();
                }

                // Add magical glow effect
                if (envelope) {
                    envelope.classList.add('magical-glow');
                }
            }, 400);

            // Step 3: Trigger the magic flash overlay before transition (at 3400ms)
            const magicFlash = document.getElementById('magic-flash');
            setTimeout(() => {
                if (magicFlash) {
                    magicFlash.classList.add('active');
                }
            }, 3400);

            // Wait for GIF animation to play then fade out loading screen (at 4400ms)
            setTimeout(() => {
                if (envelope) {
                    envelope.style.opacity = '0';
                    envelope.style.transform = 'scale(1.1)';
                }
            }, 4400);

            // Step 4: Fade out loading screen and reveal the website (at 4900ms when flash is brightest)
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.getElementById('cover').classList.add('revealed');
                
                // Fade out the magic flash to reveal the website
                if (magicFlash) {
                    magicFlash.classList.remove('active');
                }

                // Initialize AOS after loading
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 800,
                        once: true,
                        offset: 50,
                        easing: 'ease-out-cubic'
                    });
                }
                // Init icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 4900);
        }

        // Open on click/tap
        loadingScreen.addEventListener('click', openEnvelope);

        // Also init icons immediately for the envelope
        window.addEventListener('load', () => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // ========================================
    // COUNTDOWN TIMER
    // ========================================
    function initCountdown() {
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minutesEl = document.getElementById('cd-minutes');
        const secondsEl = document.getElementById('cd-seconds');

        function updateCountdown() {
            const now = new Date();
            const diff = CONFIG.weddingDate - now;

            if (diff <= 0) {
                daysEl.textContent = '0';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Animate number change
            animateNumber(daysEl, days.toString().padStart(3, '0'));
            animateNumber(hoursEl, hours.toString().padStart(2, '0'));
            animateNumber(minutesEl, minutes.toString().padStart(2, '0'));
            animateNumber(secondsEl, seconds.toString().padStart(2, '0'));
        }

        function animateNumber(el, newValue) {
            if (el.textContent !== newValue) {
                el.style.transform = 'translateY(-4px)';
                el.style.opacity = '0.5';
                setTimeout(() => {
                    el.textContent = newValue;
                    el.style.transform = 'translateY(0)';
                    el.style.opacity = '1';
                }, 150);
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ========================================
    // NAVIGATION DOTS
    // ========================================
    function initNavDots() {
        const navDots = document.getElementById('nav-dots');
        const dots = document.querySelectorAll('.nav-dot');
        let currentSection = 'cover';

        // Click handlers
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Intersection Observer for active dot
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    currentSection = entry.target.id;
                    updateActiveDot(currentSection);

                    // Reveal section
                    entry.target.classList.add('revealed');

                    // Show/hide nav dots
                    if (currentSection === 'cover') {
                        navDots.classList.remove('visible');
                    } else {
                        navDots.classList.add('visible');
                    }
                }
            });
        }, {
            threshold: [0.3]
        });

        CONFIG.sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        function updateActiveDot(sectionId) {
            dots.forEach(dot => {
                dot.classList.toggle('active', dot.dataset.section === sectionId);
            });
        }
    }

    // ========================================
    // VIDEO PLAYER
    // ========================================
    function initVideo() {
        const playBtn = document.getElementById('play-video-btn');
        const placeholder = document.getElementById('video-placeholder');
        const embed = document.getElementById('video-embed');
        const iframe = document.getElementById('video-iframe');

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                placeholder.style.display = 'none';
                embed.style.display = 'block';
                iframe.src = CONFIG.videoUrl;
            });
        }
    }

    // ========================================
    // PHOTO GALLERY & LIGHTBOX
    // ========================================
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');

        const images = [];
        let currentIndex = 0;

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('.gallery-img');
            images.push(img.src);

            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox(images[currentIndex]);
            });
        });

        function openLightbox(src) {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImg.src = '';
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex];
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex];
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showNext();
                } else {
                    showPrev();
                }
            }
        }, { passive: true });
    }

    // ========================================
    // RSVP FORM
    // ========================================
    function initRSVP() {
        const form = document.getElementById('rsvp-form');
        const successEl = document.getElementById('rsvp-success');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                console.log('RSVP Data:', data);

                // Show success message
                form.style.display = 'none';
                successEl.style.display = 'block';

                // Re-init icons for success message
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    }

    // ========================================
    // MUSIC TOGGLE (placeholder)
    // ========================================
    function initMusic() {
        const toggle = document.getElementById('music-toggle');
        let isPlaying = false;

        // Create audio element (replace with actual wedding music URL)
        const audio = new Audio();
        // audio.src = 'path-to-your-wedding-song.mp3';
        audio.loop = true;

        toggle.addEventListener('click', () => {
            const iconOn = toggle.querySelector('.music-icon-on');
            const iconOff = toggle.querySelector('.music-icon-off');

            if (isPlaying) {
                audio.pause();
                iconOn.style.display = 'none';
                iconOff.style.display = 'block';
            } else {
                audio.play().catch(() => {
                    // Autoplay was prevented
                });
                iconOn.style.display = 'block';
                iconOff.style.display = 'none';
            }
            isPlaying = !isPlaying;
        });
    }

    // ========================================
    // FLOATING PARTICLES
    // ========================================
    function initParticles() {
        const countdownSection = document.getElementById('countdown');
        if (!countdownSection) return;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            countdownSection.appendChild(particle);
        }
    }

    // ========================================
    // SCROLL REVEAL (Fallback for AOS)
    // ========================================
    function initScrollReveal() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => observer.observe(section));
    }

    // ========================================
    // SMOOTH SCROLL FOR SCROLL INDICATOR
    // ========================================
    function initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const coupleSection = document.getElementById('couple');
                if (coupleSection) {
                    coupleSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // ========================================
    // MUSIC TOGGLE
    // ========================================
    function initMusic() {
        const musicToggle = document.getElementById('music-toggle');
        const bgMusic = document.getElementById('bg-music');
        const iconOn = document.querySelector('.music-icon-on');
        const iconOff = document.querySelector('.music-icon-off');

        if (musicToggle && bgMusic) {
            bgMusic.volume = 0.5;

            musicToggle.addEventListener('click', () => {
                if (bgMusic.paused) {
                    bgMusic.play();
                    iconOn.style.display = 'block';
                    iconOff.style.display = 'none';
                } else {
                    bgMusic.pause();
                    iconOn.style.display = 'none';
                    iconOff.style.display = 'block';
                }
            });
        }
    }

    // ========================================
    // HAPTIC FEEDBACK (for supported devices)
    // ========================================
    function initHaptics() {
        const buttons = document.querySelectorAll('button, .google-calendar-btn, .venue-direction-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    function init() {
        initLoading();
        initCountdown();
        initNavDots();
        initVideo();
        initGallery();
        initRSVP();
        initMusic();
        initParticles();
        initScrollReveal();
        initScrollIndicator();
        initHaptics();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
