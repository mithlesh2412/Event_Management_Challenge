document.addEventListener('DOMContentLoaded', function() {
        lucide.createIcons();

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });

        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu on link click
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Animate on scroll
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Testimonial Slider
        const sliderContainer = document.querySelector('#testimonials .relative.w-full');
        const slider = document.getElementById('testimonial-slider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const testimonials = document.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        const totalTestimonials = testimonials.length;
        let autoSlideInterval;

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalTestimonials;
                updateSlider();
            }, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex + 1) % totalTestimonials;
            updateSlider();
            startAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
            updateSlider();
            startAutoSlide();
        });
        
        startAutoSlide();

        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }

        // --- HERO CANVAS CAROUSEL ---
        const canvas = document.getElementById('hero-canvas');
        const ctx = canvas.getContext('2d');

        // Array of high-quality, actual event image URLs for the carousel
        const imageUrls = [
            'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Corporate Event
            'https://images.unsplash.com/photo-1597157639073-69284dc0fdaf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wedding
            'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Concert
            'https://images.unsplash.com/photo-1505373877841-8c25f7d46678?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Social Gathering / Conference
        ];
        
        let loadedImages = [];
        let currentImageIndex = 0;
        let nextImageIndex = 1;
        let fadeAlpha = 0; // Current opacity for the fading image
        const fadeDuration = 1000; // milliseconds for fade transition
        const displayDuration = 4000; // milliseconds to display each image
        let lastTime = 0;
        let timeSinceLastTransition = 0;

        // Function to load all images
        function loadImages(urls, callback) {
            let imagesToLoad = urls.length;
            if (imagesToLoad === 0) {
                callback();
                return;
            }
            urls.forEach((url, index) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; // Handle potential CORS issues with unsplash
                img.src = url;
                img.onload = () => {
                    loadedImages[index] = img;
                    imagesToLoad--;
                    if (imagesToLoad === 0) {
                        callback(); // All images loaded
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${url}`);
                    imagesToLoad--; // Still decrement to avoid infinite loading
                    if (imagesToLoad === 0) {
                        callback();
                    }
                };
            });
        }

        // Function to resize canvas to fit parent
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        // Function to draw an image covering the canvas while maintaining aspect ratio
        function drawCoverImage(img, context, canvasWidth, canvasHeight) {
            const imgAspectRatio = img.width / img.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            let renderWidth, renderHeight, x, y;

            if (imgAspectRatio > canvasAspectRatio) {
                // Image is wider than canvas, so fit to height
                renderHeight = canvasHeight;
                renderWidth = img.width * (canvasHeight / img.height);
                x = (canvasWidth - renderWidth) / 2;
                y = 0;
            } else {
                // Image is taller or same aspect ratio as canvas, so fit to width
                renderWidth = canvasWidth;
                renderHeight = img.height * (canvasWidth / img.width);
                x = 0;
                y = (canvasHeight - renderHeight) / 2;
            }
            context.drawImage(img, x, y, renderWidth, renderHeight);
        }

        // Main animation loop
        function animateCarousel(currentTime) {
            if (!lastTime) lastTime = currentTime;
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            timeSinceLastTransition += deltaTime;

            // Update fade alpha after display duration has passed
            if (timeSinceLastTransition > displayDuration) {
                fadeAlpha += deltaTime / fadeDuration;
                if (fadeAlpha >= 1) {
                    currentImageIndex = nextImageIndex;
                    nextImageIndex = (currentImageIndex + 1) % loadedImages.length;
                    fadeAlpha = 0;
                    timeSinceLastTransition = 0; // Reset timer for next cycle
                }
            }
            
            // Prevent drawing if canvas has no size
            if (canvas.width === 0 || canvas.height === 0) {
                requestAnimationFrame(animateCarousel);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            // Draw the current image
            if (loadedImages[currentImageIndex]) {
                ctx.globalAlpha = 1;
                drawCoverImage(loadedImages[currentImageIndex], ctx, canvas.width, canvas.height);
            }

            // Draw the next image on top with increasing opacity for fade effect
            if (loadedImages[nextImageIndex] && fadeAlpha > 0) {
                ctx.globalAlpha = Math.min(fadeAlpha, 1); // Clamp alpha to 1
                drawCoverImage(loadedImages[nextImageIndex], ctx, canvas.width, canvas.height);
            }

            // Restore globalAlpha for other potential canvas operations
            ctx.globalAlpha = 1; 

            requestAnimationFrame(animateCarousel);
        }

        // Initialize carousel
        loadImages(imageUrls, () => {
            if (loadedImages.length === 0) {
                console.error("No images could be loaded for the carousel.");
                return;
            }
            resizeCanvas(); // Set initial canvas size
            window.addEventListener('resize', resizeCanvas); // Resize canvas on window resize
            requestAnimationFrame(animateCarousel); // Start animation loop
        });
    });