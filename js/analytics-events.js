document.addEventListener('DOMContentLoaded', function () {
    // Helper function to safely add an event listener to a single element
    function addSafeEventListener(selector, eventType, handler, parent = document) {
        const element = parent.querySelector(selector);
        if (element) {
            element.addEventListener(eventType, handler);
        } else {
            // console.log(`Analytics: Element not found for selector "${selector}" on page ${window.location.pathname}`);
        }
    }

    // Helper function to safely add event listeners to multiple elements
    function addSafeEventListeners(selector, eventType, handler, parent = document) {
        const elements = parent.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(element => element.addEventListener(eventType, handler));
        } else {
            // console.log(`Analytics: No elements found for selector "${selector}" on page ${window.location.pathname}`);
        }
    }

    // --- COMMON EVENT TRACKING ---

    // Footer navigation links (present on multiple pages)
    addSafeEventListeners('footer .container a[href]', 'click', function () {
        let linkText = this.textContent.trim() || this.getAttribute('href');
        let linkUrl = this.getAttribute('href');
        gtag('event', 'navigation_click', {
            'nav_element': `footer_link_${linkText.toLowerCase().replace(/\s+/g, '_')}`,
            'link_url': linkUrl,
            'page_path': window.location.pathname
        });
    });

    // "Back to App" button in the nav bar of legal/contact pages
    addSafeEventListeners('nav a[href="index.html#download"].text-sm', 'click', function () {
        let pageContext = 'unknown_page_context';
        const path = window.location.pathname;
        if (path.includes('privacy.html')) pageContext = 'privacy_policy';
        else if (path.includes('terms.html')) pageContext = 'terms_of_use';
        else if (path.includes('contact.html')) pageContext = 'contact_us';

        gtag('event', 'navigation_click', {
            'nav_element': 'back_to_app_nav_bar',
            'link_url': this.href,
            'page_context': pageContext
        });
    });


    // --- INDEX.HTML SPECIFIC EVENTS ---
    // Check if an element unique to index.html (like mobile-menu-button or slideshow-container) exists
    if (document.body.contains(document.getElementById('mobile-menu-button'))) { // Check if we are on a page with these elements (likely index.html)

        // Main navigation links (index.html)
        addSafeEventListeners('nav .hidden.md\\:flex a[href^="#"]', 'click', function () {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1) {
                gtag('event', 'navigation_click', {
                    'nav_element': `main_nav_${targetId.substring(1)}`,
                    'link_url': targetId
                });
            }
        });

        // Hero section "Download the App" CTA button (index.html)
        addSafeEventListener('header.hero-section a.cta-button', 'click', function () {
            gtag('event', 'cta_click', {
                'cta_type': 'download_app_hero',
                'cta_location': 'hero_section',
                'link_url': this.href,
                'button_text': this.textContent.trim()
            });
        });

        // App Store badge click in Hero (index.html)
        addSafeEventListener('header.hero-section a[href*="apps.apple.com"]', 'click', function () {
            gtag('event', 'cta_click', {
                'cta_type': 'app_store_badge',
                'cta_location': 'hero_section',
                'link_url': this.href
            });
        });

        //  Google Play badge click in Hero (index.html) - Placeholder if you add it
        addSafeEventListener('header.hero-section a[href*="play.google.com"]', 'click', function () {
            gtag('event', 'cta_click', {
                'cta_type': 'google_play_badge',
                'cta_location': 'hero_section',
                'link_url': this.href
            });
        });

        // Slideshow "Next" button click (index.html)
        addSafeEventListener('#nextSlide', 'click', function () {
            // You might want to include the current slide index if easily available
            gtag('event', 'slideshow_interaction', {
                'interaction_type': 'next_slide'
            });
        });

        // Slideshow "Previous" button click (index.html)
        addSafeEventListener('#prevSlide', 'click', function () {
            gtag('event', 'slideshow_interaction', {
                'interaction_type': 'prev_slide'
            });
        });

        // Slideshow indicator clicks (index.html)
        addSafeEventListeners('.slideshow-container .indicators .indicator', 'click', function () {
            let slideIndex = -1;
            // Try to determine index based on position among siblings
            const parent = this.parentNode;
            if (parent) {
                slideIndex = Array.from(parent.children).indexOf(this);
            }
            gtag('event', 'slideshow_interaction', {
                'interaction_type': 'indicator_click',
                'slide_number': slideIndex !== -1 ? slideIndex : 'unknown' // 0-indexed
            });
        });

        // Mobile menu toggle (index.html)
        addSafeEventListener('#mobile-menu-button', 'click', function () {
            const mobileMenu = document.getElementById('mobile-menu');
            // This event fires *before* the class is toggled by your other script.
            // So, if 'hidden' is present, it means the menu is currently closed and is about to be opened.
            const isOpening = mobileMenu && mobileMenu.classList.contains('hidden');
            if (isOpening) {
                gtag('event', 'mobile_menu_toggle', {
                    'status': 'opened'
                });
            }
        });
    }

    // --- CONTACT.HTML SPECIFIC EVENTS ---
    // Uncomment this block if you want to track events on contact.html
    /*
    if (window.location.pathname.includes('contact.html')) {
        Mailto link click (contact.html)
        addSafeEventListener('a[href="mailto:support@doa-app.com"]', 'click', function() {
            gtag('event', 'contact_interaction', {
                'interaction_type': 'mailto_click',
                'email_address': 'support@doa-app.com'
            });
        });
            }
    */

});