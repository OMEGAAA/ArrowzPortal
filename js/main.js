window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    setTimeout(() => {
        loader.classList.add("fade-out");
    }, 2000); // Wait for animation
});



document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle (Basic implementation) -> Moved inside DOMContentLoaded for safety if it wasn't

    // ... (rest of code follows)

    // Mobile Menu Toggle (Basic implementation)
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");

    menuToggle.addEventListener("click", () => {
        navList.style.display = navList.style.display === "flex" ? "none" : "flex";
        if (navList.style.display === "flex") {
            navList.style.flexDirection = "column";
            navList.style.position = "absolute";
            navList.style.top = "100%";
            navList.style.left = "0";
            navList.style.width = "100%";
            navList.style.backgroundColor = "var(--bg-color)";
            navList.style.padding = "2rem";
            navList.style.borderBottom = "1px solid var(--border-color)";
        }
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll(".section-title, .about-text, .about-image, .news-card, .team-member");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Stop observing after revealed to prevent re-triggering (optional, depends on preference)
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add("hidden");
        revealObserver.observe(el);
    });

    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 6000; // Change every 6 seconds

        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Move to next
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active to next
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }
});
