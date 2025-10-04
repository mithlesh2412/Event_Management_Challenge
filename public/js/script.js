   // Manually control scroll restoration to prevent the browser from remembering scroll position on reload
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }

        // Force scroll to top after all content (including images) is loaded
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 10); // A small delay ensures it runs after everything else
        });

        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons();

            // --- NAVIGATION & ANIMATION ---
            const header = document.getElementById('header');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const demoForm = document.getElementById('demo-form');
            const formMessage = document.getElementById('form-message');

            window.addEventListener('scroll', () => {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
            });
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); });
            });

            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target); 
                    }
                });
            }, { threshold: 0.1 });
            animatedElements.forEach(el => { observer.observe(el); });
            
            // Simulate form submission
            demoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                demoForm.reset();
                formMessage.classList.remove('hidden');
                setTimeout(() => { formMessage.classList.add('hidden'); }, 5000);
            });

            // --- FINAL CAROUSEL FUNCTIONALITY (DEFINITIVE FIX) ---
            const slides = document.querySelectorAll('.carousel-slide');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const indicatorContainer = document.getElementById('indicator-container');
            
            if (slides.length > 0) {
                let currentSlide = 0;
                let autoPlayInterval;

                // Create indicators
                slides.forEach((_, i) => {
                    const indicator = document.createElement('div');
                    indicator.classList.add('indicator', 'w-3', 'h-3', 'bg-white/50', 'rounded-full', 'cursor-pointer', 'transition-colors');
                    indicator.addEventListener('click', () => {
                        goToSlide(i);
                        resetAutoPlay();
                    });
                    indicatorContainer.appendChild(indicator);
                });
                const indicators = document.querySelectorAll('.indicator');

                function goToSlide(slideIndex) {
                    // This is the robust way: hide all, then show the one we want.
                    slides.forEach((slide, index) => {
                        slide.classList.toggle('active', index === slideIndex);
                    });
                    
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === slideIndex);
                    });
                    
                    currentSlide = slideIndex;
                }

                function nextSlide() {
                    let nextSlideIndex = (currentSlide + 1) % slides.length;
                    goToSlide(nextSlideIndex);
                }

                function prevSlide() {
                    let prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
                    goToSlide(prevSlideIndex);
                }

                function startAutoPlay() {
                    autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
                }

                function resetAutoPlay() {
                    clearInterval(autoPlayInterval);
                    startAutoPlay();
                }

                // Event Listeners
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetAutoPlay();
                });
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetAutoPlay();
                });

                // Initial setup
                goToSlide(0);
                startAutoPlay();
            }


            // --- LIVE CHAT FUNCTIONALITY ---
            const chatIconButton = document.getElementById('chat-icon-button');
            const chatBox = document.getElementById('chat-box');
            const chatCloseButton = document.getElementById('chat-close-button');
            const chatInput = document.getElementById('chat-input');
            const chatSendButton = document.getElementById('chat-send-button');
            const chatMessages = document.getElementById('chat-messages');

            let chatStep = 0;

            const toggleChat = () => {
                const isHidden = chatBox.classList.toggle('hidden');
                chatIconButton.classList.toggle('open', !isHidden);
                
                if (!isHidden) {
                    setTimeout(() => {
                        chatBox.style.transform = 'scale(1)';
                        chatBox.style.opacity = '1';
                        chatInput.focus();
                    }, 10);
                } else {
                    chatBox.style.transform = 'scale(0.8)';
                    chatBox.style.opacity = '0';
                }
            };

            chatIconButton.addEventListener('click', toggleChat);
            chatCloseButton.addEventListener('click', toggleChat);

            const appendMessage = (message, isUser = false) => {
                const div = document.createElement('div');
                div.className = isUser ? 'chat-message-user ml-auto' : 'chat-message-bot';
                div.textContent = message;
                chatMessages.appendChild(div);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };

            const sendChat = () => {
                const userMessage = chatInput.value.trim();
                if (userMessage === '') return;

                appendMessage(userMessage, true);
                chatInput.value = '';

                // Simulate bot response and lead qualification flow
                setTimeout(() => {
                    let botResponse = '';
                    if (chatStep === 0) {
                        if (userMessage.toLowerCase().includes('organizer')) {
                            botResponse = "Perfect! Our platform is built to eliminate the event chaos you face. What is your estimated annual event volume?";
                            chatStep = 1;
                        } else {
                            botResponse = "I can certainly help! For vendors/attendees, please visit our Help Center, or for sales questions, what's your event size?";
                        }
                    } else if (chatStep === 1) {
                        botResponse = "Got it. I'll connect you with a Sales Specialist who handles that volume. Please submit your work email here and they will contact you within 5 minutes to schedule a demo!";
                        chatStep = 2;
                    } else if (chatStep === 2) {
                        botResponse = `Thank you! We've created your lead profile and a specialist will follow up shortly at ${userMessage}.`;
                        chatStep = 3;
                    } else {
                        botResponse = "I'm sorry, my qualification flow is complete. Please check your email for the specialist's message!";
                    }
                    appendMessage(botResponse, false);
                }, 1000);
            };

            chatSendButton.addEventListener('click', sendChat);
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendChat();
                }
            });
        });