/**
 * Script for OU Modern Languages Clone
 * Handles navigation interactivty, scroll events, and reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Prevent scrolling on body when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal Animation ---
    // Uses IntersectionObserver to trigger css animations when elements enter viewport
    const fadeElements = document.querySelectorAll('.scroll-trigger, .hero-content');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        animateOnScroll.observe(el);
    });

    // Automatically trigger visibility for hero content which is at top
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('visible');
        }
    }, 100);

    // --- Dynamic Greeting Rotator ---
    const greetings = [
        "Welcome", "Bienvenue", "مرحباً", "欢迎", "Добро пожаловать",
        "Willkommen", "Benvenuto", "ようこそ", "Bem-vindo", "ברוך הבא",
        "خوش آمدید", "¡Bienvenido!"
    ];
    let currentGreetingIndex = 0;
    const greetingEl = document.getElementById('dynamic-greeting');
    const containerEl = document.querySelector('.dynamic-greeting-container');

    if (greetingEl && containerEl) {
        // Create an invisible clone to measure true widths
        const measureSpan = document.createElement('span');
        measureSpan.style.visibility = 'hidden';
        measureSpan.style.position = 'absolute';
        measureSpan.style.whiteSpace = 'nowrap';
        measureSpan.style.fontSize = window.getComputedStyle(greetingEl).fontSize;
        measureSpan.style.fontWeight = window.getComputedStyle(greetingEl).fontWeight;
        measureSpan.style.fontFamily = window.getComputedStyle(greetingEl).fontFamily;
        document.body.appendChild(measureSpan);

        // Intialize the container width explicitly
        measureSpan.textContent = greetings[currentGreetingIndex];
        containerEl.style.width = measureSpan.offsetWidth + 'px';

        setInterval(() => {
            const nextIndex = (currentGreetingIndex + 1) % greetings.length;

            // Measure upcoming text width
            measureSpan.textContent = greetings[nextIndex];
            const nextWidth = measureSpan.offsetWidth + 'px';

            // Fade out current text
            greetingEl.classList.add('greeting-fade-out');

            setTimeout(() => {
                // Change text while invisible
                currentGreetingIndex = nextIndex;
                greetingEl.textContent = greetings[currentGreetingIndex];

                // Animate CSS width to tightly fit the new word
                containerEl.style.width = nextWidth;

                // Fade in new text
                greetingEl.classList.remove('greeting-fade-out');
                greetingEl.classList.add('greeting-fade-in');
                setTimeout(() => {
                    greetingEl.classList.remove('greeting-fade-in');
                }, 500);
            }, 500);
        }, 3000);
    }
});

// --- Language Explorer Panel Logic ---
function openLanguagePanel(regionName, languages) {
    document.getElementById('panel-region-name').textContent = regionName;
    document.getElementById('panel-languages').textContent = "Languages offered: " + languages;
    document.getElementById('language-panel').classList.add('open');
}

function closeLanguagePanel() {
    document.getElementById('language-panel').classList.remove('open');
}

// --- Living Collage Video Logic ---
function playVideo(container) {
    const video = container.querySelector('video');
    if (video) video.play();
}
function pauseVideo(container) {
    const video = container.querySelector('video');
    if (video) {
        video.pause();
    }
}

// --- Find Your Path Mini Quiz Logic ---
let quizExperience = '';

function nextQuizStep(experience) {
    quizExperience = experience;
    document.getElementById('quiz-step-1').style.display = 'none';
    document.getElementById('quiz-step-2').style.display = 'block';
}

function finishQuiz(region) {
    document.getElementById('quiz-step-2').style.display = 'none';
    const resultStep = document.getElementById('quiz-result');
    const resultText = document.getElementById('quiz-result-text');
    const resultLink = document.getElementById('quiz-result-link');

    resultStep.style.display = 'block';

    if (quizExperience === 'beginner') {
        resultText.textContent = `Great! Start your beginner journey into ${region} languages today.`;
        resultLink.textContent = "View Beginner Catalog";
        resultLink.href = "/content/cas/modlang/academics";
    } else {
        resultText.textContent = `Excellent. Let's get you placed into the right ${region} language course.`;
        resultLink.textContent = "Take Placement Test";
        resultLink.href = "mailto:llc@ou.edu";
    }
}

function resetQuiz() {
    quizExperience = '';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-step-2').style.display = 'none';
    document.getElementById('quiz-step-1').style.display = 'block';
}

// --- Hero Background Video Control (Local) ---
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('hero-local-video');
    
    if (heroVideo) {
        // Start playing at 3 seconds explicitly
        const setStartTime = () => {
            if (heroVideo.currentTime < 3) {
                heroVideo.currentTime = 3;
            }
        };

        // When metadata loads or just randomly on DOM, set 3 seconds
        heroVideo.addEventListener('loadedmetadata', setStartTime);
        heroVideo.addEventListener('play', setStartTime);

        heroVideo.addEventListener('timeupdate', () => {
            // Loop back to 3 seconds if we hit 18 seconds
            if (heroVideo.currentTime >= 18) {
                heroVideo.currentTime = 3;
            }
        });
    }
});

// --- Department Navbar Mobile Toggle ---
function toggleDeptMenu() {
    const navLinks = document.getElementById('dept-nav-links');
    const hamburgerIcon = document.getElementById('dept-hamburger');
    
    if (navLinks && hamburgerIcon) {
        navLinks.classList.toggle('active');
        hamburgerIcon.classList.toggle('open');
    }
}


