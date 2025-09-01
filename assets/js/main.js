// Main JavaScript file for custom scripts

// Contact obfuscation to protect from crawlers
function initContactObfuscation() {
    // Email obfuscation
    const user = 'kontakt';
    const domain = 'czeczow-28-36.pl';
    const email = user + '@' + domain;
    
    const contactSpan = document.getElementById('email-contact');
    const detailsSpan = document.getElementById('email-details');
    
    if (contactSpan) {
        contactSpan.innerHTML = '<a href="mailto:' + email + '" class="text-blue-400 hover:text-blue-300">' + email + '</a>';
    }
    
    if (detailsSpan) {
        detailsSpan.innerHTML = '<a href="mailto:' + email + '" class="text-blue-400 hover:text-blue-300">' + email + '</a>';
    }
    
    // Phone obfuscation
    const phoneNumbers = ['+48', '534', '382', '146'];
    const phone = phoneNumbers.join(' ');
    const phoneHref = 'tel:' + phoneNumbers.join('');
    
    const phoneElements = document.querySelectorAll('[data-phone-placeholder]');
    phoneElements.forEach(element => {
        element.innerHTML = '<a href="' + phoneHref + '" class="text-blue-400 hover:text-blue-300">' + phone + '</a>';
    });
    
    // Email message button functionality
    const writeMessageBtn = document.getElementById('write-message-btn');
    if (writeMessageBtn) {
        writeMessageBtn.addEventListener('click', function() {
            const subject = encodeURIComponent('Zapytanie odnośnie oferty Czeczów 28/36');
            const mailtoLink = 'mailto:' + email + '?subject=' + subject;
            window.location.href = mailtoLink;
        });
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    initContactObfuscation();
    
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize PhotoSwipe gallery when PhotoSwipe is loaded
    if (window.PhotoSwipeLightbox) {
        initPhotoSwipe();
    } else {
        // Wait for PhotoSwipe to load
        const checkPhotoSwipe = setInterval(() => {
            if (window.PhotoSwipeLightbox) {
                clearInterval(checkPhotoSwipe);
                initPhotoSwipe();
            }
        }, 100);
    }

    initMobileSwiper();
    initParkingGalleries();
});

// PhotoSwipe Gallery Initialization
function initPhotoSwipe() {
    // Get all gallery images from HTML
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    // Build images array from HTML data attributes
    const propertyImages = Array.from(galleryImages).map(link => ({
        src: link.getAttribute('data-pswp-src'),
        width: parseInt(link.getAttribute('data-pswp-width')),
        height: parseInt(link.getAttribute('data-pswp-height')),
        alt: link.getAttribute('data-alt') || ''
    }));

    // Initialize PhotoSwipe lightbox
    const lightbox = new window.PhotoSwipeLightbox({
        gallery: '#gallery',
        children: 'a.gallery-image',
        pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.2/dist/photoswipe.esm.js'),
        padding: { top: 20, bottom: 40, left: 100, right: 100 },
        bgOpacity: 0.9,
        showHideAnimationType: 'zoom',
        showAnimationDuration: 333,
        hideAnimationDuration: 333,
    });

    // Add custom UI elements
    lightbox.on('uiRegister', function() {
        lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            className: 'pswp__custom-caption',
            appendTo: 'root',
            onInit: (el) => {
                lightbox.pswp.on('change', () => {
                    const currSlide = lightbox.pswp.currSlide;
                    let captionHTML = '';
                    
                    if (currSlide && currSlide.data) {
                        // Get the element from the slide data
                        const currSlideElement = currSlide.data.element;
                        
                        if (currSlideElement) {
                            // First check for custom description
                            const description = currSlideElement.getAttribute('data-description');
                            const alt = currSlideElement.getAttribute('data-alt');
                            
                            if (description && alt) {
                                // If there's a custom description, show both title and description
                                captionHTML = `
                                    <div class="pswp__caption__center">
                                        <div style="font-weight: 600; margin-bottom: 8px;">${alt}</div>
                                        <div style="font-weight: 400; opacity: 0.9;">${description}</div>
                                    </div>
                                `;
                            } else if (alt) {
                                // Fallback to just alt text
                                captionHTML = `<div class="pswp__caption__center">${alt}</div>`;
                            }
                        }
                    }
                    el.innerHTML = captionHTML || '';
                });
            }
        });
    });

    // Custom data source function - read from HTML attributes
    lightbox.addFilter('itemData', (itemData, index) => {
        const element = galleryImages[index];
        if (element) {
            return {
                src: element.getAttribute('data-pswp-src'),
                width: parseInt(element.getAttribute('data-pswp-width')),
                height: parseInt(element.getAttribute('data-pswp-height')),
                alt: element.getAttribute('data-alt') || '',
                element: element // Keep reference to element for caption
            };
        }
        return itemData;
    });

    // Initialize the lightbox
    lightbox.init();

    // Add click handlers for desktop gallery images
    galleryImages.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            lightbox.loadAndOpen(index);
        });
    });

    // Handle "Zobacz wszystkie zdjęcia" button
    const showAllBtn = document.getElementById('show-all-photos');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            lightbox.loadAndOpen(0);
        });
    }

    // Handle mobile gallery image clicks - open in new tab instead of PhotoSwipe
    const mobileGalleryImages = document.querySelectorAll('.mobile-gallery-image');
    mobileGalleryImages.forEach((img) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Get the full resolution image URL
            const fullResUrl = img.getAttribute('data-pswp-src');
            if (fullResUrl) {
                // Open image in new tab
                window.open(fullResUrl, '_blank');
            }
        });
    });
}

// Initialize Swiper for mobile carousel
function initMobileSwiper() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
        // Wait for Swiper to load
        setTimeout(initMobileSwiper, 100);
        return;
    }

    // Initialize mobile gallery swiper
    const mobileSwiper = new Swiper('.mobileGallerySwiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 5
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Enable touch gestures
        touchEventsTarget: 'container',
        simulateTouch: true,
        grabCursor: true,
        touchRatio: 1,
        touchAngle: 45,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        threshold: 5,
        touchStartPreventDefault: false,
        touchMoveStopPropagation: true,
        // Disable mousewheel control for better mobile experience
        mousewheel: false,
        // Add keyboard control for accessibility
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        // Performance optimizations
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 1,
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        // Responsive breakpoints (though we're only showing on mobile)
        breakpoints: {
            // when window width is >= 768px (tablet and up), hide this swiper
            768: {
                enabled: false
            }
        }
    });

    return mobileSwiper;
}

// Initialize parking spot galleries
function initParkingGalleries() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
        // Wait for Swiper to load
        setTimeout(initParkingGalleries, 100);
        return;
    }

    // Initialize parking spot 1 swiper
    const parking1Swiper = new Swiper('.parking1Swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: {
            el: '.parking1Swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.parking1Swiper .swiper-button-next',
            prevEl: '.parking1Swiper .swiper-button-prev',
        },
        grabCursor: true,
    });

    // Initialize parking spot 14 swiper
    const parking14Swiper = new Swiper('.parking14Swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: {
            el: '.parking14Swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.parking14Swiper .swiper-button-next',
            prevEl: '.parking14Swiper .swiper-button-prev',
        },
        grabCursor: true,
    });

    // Initialize PhotoSwipe for parking galleries
    if (window.PhotoSwipeLightbox) {
        initParkingPhotoSwipe();
    } else {
        // Wait for PhotoSwipe to load
        const checkPhotoSwipe = setInterval(() => {
            if (window.PhotoSwipeLightbox) {
                clearInterval(checkPhotoSwipe);
                initParkingPhotoSwipe();
            }
        }, 100);
    }
}

// Initialize PhotoSwipe for parking images
function initParkingPhotoSwipe() {
    // Initialize PhotoSwipe for parking spot 1
    const parking1Images = document.querySelectorAll('.parking-gallery-image[data-gallery="parking1"]');
    if (parking1Images.length > 0) {
        const parking1Lightbox = new window.PhotoSwipeLightbox({
            gallery: '.parking1Swiper',
            children: '.parking-gallery-image[data-gallery="parking1"]',
            pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.2/dist/photoswipe.esm.js'),
            padding: { top: 20, bottom: 40, left: 100, right: 100 },
            bgOpacity: 0.9,
        });

        parking1Lightbox.addFilter('itemData', (itemData, index) => {
            const element = parking1Images[index];
            if (element) {
                return {
                    src: element.getAttribute('data-pswp-src'),
                    width: parseInt(element.getAttribute('data-pswp-width')) || 1920,
                    height: parseInt(element.getAttribute('data-pswp-height')) || 1440,
                    alt: element.getAttribute('alt') || '',
                };
            }
            return itemData;
        });

        parking1Lightbox.init();

        parking1Images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                parking1Lightbox.loadAndOpen(index);
            });
        });
    }

    // Initialize PhotoSwipe for parking spot 14
    const parking14Images = document.querySelectorAll('.parking-gallery-image[data-gallery="parking14"]');
    if (parking14Images.length > 0) {
        const parking14Lightbox = new window.PhotoSwipeLightbox({
            gallery: '.parking14Swiper',
            children: '.parking-gallery-image[data-gallery="parking14"]',
            pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.2/dist/photoswipe.esm.js'),
            padding: { top: 20, bottom: 40, left: 100, right: 100 },
            bgOpacity: 0.9,
        });

        parking14Lightbox.addFilter('itemData', (itemData, index) => {
            const element = parking14Images[index];
            if (element) {
                return {
                    src: element.getAttribute('data-pswp-src'),
                    width: parseInt(element.getAttribute('data-pswp-width')) || 1920,
                    height: parseInt(element.getAttribute('data-pswp-height')) || 1440,
                    alt: element.getAttribute('alt') || '',
                };
            }
            return itemData;
        });

        parking14Lightbox.init();

        parking14Images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                parking14Lightbox.loadAndOpen(index);
            });
        });
    }
}

// Optional: Add any Stimulus controllers here
if (window.Stimulus) {
    // Example controller registration
    // Stimulus.register("gallery", GalleryController)
}