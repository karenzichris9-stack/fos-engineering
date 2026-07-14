document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Mobile menu (simple alert for demo purposes)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            alert("Mobile menu toggled! In a full app, this would open a side drawer.");
        });
    }

    // --- Canvas Scroll Sequence ---
    const canvas = document.getElementById('sequence-canvas');
    if (canvas && typeof gsap !== 'undefined') {
        const ctx = canvas.getContext('2d');
        const frameCount = 240;
        const currentFrame = (index) => `GIF/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;
        const images = [];
        const sequenceInfo = {
            frame: 0
        };
        
        let imagesLoaded = 0;
        const progressEl = document.getElementById('loading-progress');
        const overlay = document.querySelector('.loading-overlay');
        const prompt = document.querySelector('.scroll-prompt');

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if (progressEl) {
                    progressEl.innerText = Math.floor((imagesLoaded / frameCount) * 100);
                }
                if (imagesLoaded === frameCount) {
                    initSequence();
                }
            };
            images.push(img);
        }

        function render() {
            if (!images[sequenceInfo.frame]) return;
            const img = images[sequenceInfo.frame];

            // Setup high DPI canvas
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * pixelRatio;
            canvas.height = window.innerHeight * pixelRatio;
            
            // For CSS, we manage size using width/height 100% in CSS, but we can also set inline
            // Setting the drawing context scale ensures sharpness
            ctx.scale(pixelRatio, pixelRatio);

            // Calculate object-fit: cover equivalent
            const canvasW = window.innerWidth;
            const canvasH = window.innerHeight;
            const imgW = img.width;
            const imgH = img.height;
            
            const scale = Math.max(canvasW / imgW, canvasH / imgH);
            const x = (canvasW / 2) - (imgW / 2) * scale;
            const y = (canvasH / 2) - (imgH / 2) * scale;
            
            ctx.clearRect(0, 0, canvasW, canvasH);
            ctx.drawImage(img, x, y, imgW * scale, imgH * scale);
        }

        function initSequence() {
            // Hide loading overlay
            if (overlay) overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
                if (prompt) prompt.classList.add('visible');
            }, 500);

            // Draw first frame
            render();

            window.addEventListener('resize', render);

            // GSAP ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);
            
            gsap.to(sequenceInfo, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: ".scroll-sequence",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5,
                    onUpdate: () => {
                        if (prompt && sequenceInfo.frame > 5) {
                            prompt.classList.remove('visible');
                        }
                    }
                },
                onUpdate: render
            });
        }
    }
});
