// =========================
// ДАННЫЕ (меняй тут картинки/тексты)
// =========================
const DATA = {
    heroBrandImage: "/static/images/brand_logo.png",

    heroSlides: [
        {
            title: "УНИКАЛЬНЫЕ\nПРЕДЛОЖЕНИЯ",
            text: "Стиль, качество и забота о вашем зрении. Найдите свою идеальную оправу уже сегодня.",
            img: "/static/images/brand_logo.png"
        },
        {
            title: "ВАШ ЛИЧНЫЙ\nОПТИК",
            text: "Лаконичный каталог: категории + хиты. Остальное — через умный тест и консультацию.",
            img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=2000&q=80"
        },
        {
            title: "ВЗГЛЯНИТЕ НА МИР ЯСНО",
            text: "Минимум лишнего — максимум уверенности. Запись на проверку зрения и подбор за 1 минуту.",
            img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=2000&q=80"
        }
    ],

    categories: window.CATEGORY_DATA || [],
    get hits() { return window.HITS_DATA || []; }, // Dynamic access
    blog: window.BLOG_DATA || [],

    testimonials: [
        {
            text: "Спасибо большое студии оптики, очень профессионально и качественно все сделано. Очень приятные и отзывчивые врачи. Будем вас советовать всем своим друзьям!",
            name: "Анастасия Бурмейстер",
            date: "8 августа 2025"
        },
        {
            text: "Два года назад приобрела очки с фотохромными линзами. Прошло достаточно времени, чтобы понять, что деньги потрачены не зря. Спасибо всем девочкам за терпение и радушие. Особенно Надежде Кушнеровой. Очки отличные!",
            name: "Нонна Дулова",
            date: "19 мая 2025"
        },
        {
            text: "Сердечно благодарю оптометриста Елену за то, что открыла для меня мир японских мультифокальных линз \"Миру\". Долгое время я мучилась от необходимости постоянно менять очки, линзы, чтобы видеть четко как вблизи, так и вдаль. Елена подробно рассказала о преимуществах этих линз, их инновационной технологии и комфорте при ношении. Рекомендую Вашу оптику своим знакомым. Спасибо.",
            name: "Вика Ситникова",
            date: "8 апреля 2025"
        },
        {
            text: "Подобрали в этом Салоне очки для дочки. Остались очень довольны доброжелательностью и профессионализмом сотрудников) Спасибо вам! 😊 Большой выбор оправ, в том числе для детей (на любой возраст), причём в разном ценовом диапазоне. Удобное расположение в центре города. Будем рекомендовать друзьям и знакомым! 👍",
            name: "Ирина Снегирева",
            date: "18 октября 2024"
        },
    ],
};

const $ = (s) => document.querySelector(s);

// === Initializing Data ===

// 1. Categories
const catContainer = document.getElementById("categoryCards");
const catStates = DATA.categories.map(() => 0); // tracks current img index for each category

function updateCatImage(catIdx) {
    if (!catContainer) return;
    const card = catContainer.children[catIdx];
    if (!card) return;
    const img = card.querySelector('.catMedia img');
    if (!img) return;

    const newSrc = DATA.categories[catIdx].images[catStates[catIdx]];
    if (!newSrc) return;

    img.style.opacity = 0;
    setTimeout(() => {
        img.src = newSrc;
        img.onload = () => img.style.opacity = 1;
    }, 200);
}

window.changeCatImage = (catIdx, dir) => {
    if (!DATA.categories[catIdx]) return;
    let next = catStates[catIdx] + dir;
    const total = DATA.categories[catIdx].images.length;
    if (next < 0) next = total - 1;
    if (next >= total) next = 0;
    catStates[catIdx] = next;
    updateCatImage(catIdx);
};

// 2. Hits Slider

// Modal Logic
let currentModalIdx = 0;
window.openProductModal = (idx, isNav = false, dir = 1) => {
    currentModalIdx = idx;
    const product = DATA.hits[idx];
    if (!product) {
        console.error("Product not found at index", idx);
        return;
    }

    const title = $('#modalTitle');
    const price = $('#modalPrice');
    const img = $('#modalImg');
    const breadcrumbs = $('#modalBreadcrumbs');
    const detailsList = $('#modalDetailsList');

    const updateContent = () => {
        if (title) title.textContent = product.name || "";
        if (price) price.textContent = product.price || "";
        if (img) img.src = product.img || "";
        if (breadcrumbs) {
            const cat = product.category || "General";
            const brnd = product.brand || "";
            breadcrumbs.textContent = `Catalog / ${cat}${brnd ? ' / ' + brnd : ''}`;
        }
        if (detailsList) {
            let detailsHtml = '';
            if (product.material) detailsHtml += `<li>${product.material}</li>`;
            if (product.color) detailsHtml += `<li>${product.color}</li>`;
            if (product.protection) detailsHtml += `<li>Protection: ${product.protection}</li>`;
            if (product.isHandmade) detailsHtml += `<li>Handmade</li>`;
            if (product.package) detailsHtml += `<li>Package: ${product.package}</li>`;
            if (product.description) {
                detailsHtml += `<li style="margin-top:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; list-style:none;">${product.description}</li>`;
            }
            if (!detailsHtml) detailsHtml = '<li>Подробности уточняйте у менеджера</li>';
            detailsList.innerHTML = detailsHtml;
        }
    };

    const modal = $('#productModal');
    if (!modal) return;

    if (!isNav) {
        // --- INITIAL OPEN ---
        updateContent();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (window.gsap) {
            gsap.fromTo('.modal-content',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" }
            );
            gsap.fromTo('.modal-breadcrumbs, .modal-title, .modal-price, .modal-section-title',
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2 }
            );
            gsap.fromTo('.modal-list li',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.05, ease: "power2.out", delay: 0.5 }
            );
            gsap.fromTo('.modal-media img',
                { opacity: 0, scale: 0.95, x: 20 },
                { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "power2.out", delay: 0.1 }
            );
        }
    } else {
        // --- NAVIGATION (THE "APPLE" LOOK) ---
        if (window.gsap) {
            const moveAmt = dir * 20; // Soft, subtle movement
            const timeline = gsap.timeline();

            // Unified, heavy-ease transition
            timeline.to('.modal-details-content, .modal-media img', {
                opacity: 0,
                x: -moveAmt,
                scale: 0.98,
                duration: 0.25,
                ease: "power2.inOut",
                onComplete: () => {
                    updateContent();
                    // Instant reset for the "In" animation
                    gsap.set('.modal-details-content, .modal-media img', {
                        x: moveAmt,
                        opacity: 0,
                        scale: 1.02
                    });
                }
            });

            timeline.to('.modal-details-content, .modal-media img', {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.7, // Longer, liquid duration
                ease: "expo.out", // The Apple "snap-to-smooth" curve
                stagger: 0.02,
                clearProps: "all"
            });
        } else {
            updateContent();
        }
    }
};


window.closeProductModal = () => {
    const modal = $('#productModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
};

window.navProductModal = (dir) => {
    if (DATA.hits.length === 0) return;
    let next = currentModalIdx + dir;
    if (next < 0) next = DATA.hits.length - 1;
    if (next >= DATA.hits.length) next = 0;
    openProductModal(next, true, dir);
};

// Close on backdrop click
const productModal = $('#productModal');
if (productModal) {
    productModal.onclick = (e) => {
        if (e.target === productModal) closeProductModal();
    };
}

// 4. Testimonials Carousel
const testimonialsTrack = document.getElementById("testimonialsTrack");
let currentTestimonialIndex = 0;

if (testimonialsTrack) {
    // Rend testimonials if empty
    if (testimonialsTrack.children.length === 0 && DATA.testimonials.length > 0) {
        DATA.testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'testimonialCard';
            card.innerHTML = `
                <div class="testimonialStars">★★★★★</div>
                <div class="testimonialName">${t.name}</div>
                <p class="testimonialText">${t.text}</p>
                <div class="testimonialDate">${t.date}</div>
            `;
            testimonialsTrack.appendChild(card);
        });
    }

    function updateTestimonialCarousel() {
        const firstCard = testimonialsTrack.querySelector('.testimonialCard');
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth;
        const gap = 18;
        const offset = -(currentTestimonialIndex * (cardWidth + gap));
        testimonialsTrack.style.transform = `translateX(${offset}px)`;
    }

    const btnTestimonialPrev = document.getElementById("testimonialPrev");
    const btnTestimonialNext = document.getElementById("testimonialNext");

    if (btnTestimonialPrev) btnTestimonialPrev.onclick = () => {
        currentTestimonialIndex--;
        if (currentTestimonialIndex < 0) currentTestimonialIndex = DATA.testimonials.length - 1;
        updateTestimonialCarousel();
    };

    if (btnTestimonialNext) btnTestimonialNext.onclick = () => {
        currentTestimonialIndex++;
        if (currentTestimonialIndex >= DATA.testimonials.length) currentTestimonialIndex = 0;
        updateTestimonialCarousel();
    };

    window.addEventListener('resize', updateTestimonialCarousel);
    setTimeout(updateTestimonialCarousel, 100);
}

// 5. Hero Slider Logic
let currentSlide = 0;
const slides = DATA.heroSlides;
const heroIndex = document.getElementById("heroIndex");
const heroTitle = document.querySelector(".heroTitle");
const heroText = document.getElementById("heroText");
const heroImg = document.getElementById("heroMainImg");
const thumbsRow = document.getElementById("heroThumbs");
const heroProgress = document.getElementById("heroProgress");
let autoSlideInterval;
const SLIDE_DURATION = 5000;

function renderHero(idx) {
    if (!slides[idx]) return;
    currentSlide = idx;
    resetAutoSlide();

    if (heroIndex) heroIndex.textContent = `[0${idx + 1}]`;
    if (heroTitle) heroTitle.innerHTML = slides[idx].title.replace(/\n/g, "<br/>");
    if (heroText) heroText.textContent = slides[idx].text;

    if (heroImg) {
        if (window.gsap) {
            gsap.to(heroImg, {
                opacity: 0,
                x: -15,
                scale: 0.99,
                duration: 0.15,
                ease: "power2.in",
                onComplete: () => {
                    heroImg.src = slides[idx].img;
                    heroImg.onload = () => {
                        gsap.fromTo(heroImg,
                            { opacity: 0, x: 15, scale: 1.02 },
                            { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "power3.out" }
                        );
                    };
                }
            });
        } else {
            heroImg.src = slides[idx].img;
        }
    }

    if (window.gsap) {
        if (heroTitle) gsap.fromTo(heroTitle, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        if (heroText) gsap.fromTo(heroText, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" });
    }

    const allThumbs = document.querySelectorAll(".mini");
    allThumbs.forEach((t, i) => {
        if (i === idx) t.classList.add("active");
        else t.classList.remove("active");
    });
}

if (thumbsRow && thumbsRow.children.length === 0) {
    slides.forEach((sl, i) => {
        const t = document.createElement("div");
        t.className = `mini ${i === 0 ? 'active' : ''}`;
        t.onclick = () => renderHero(i);
        t.innerHTML = `<img src="${sl.img}" alt="">`;
        thumbsRow.appendChild(t);
    });
}

const btnPrev = document.getElementById("heroPrev");
const btnNext = document.getElementById("heroNext");

if (btnPrev) btnPrev.onclick = () => {
    let newIdx = (currentSlide - 1 + slides.length) % slides.length;
    renderHero(newIdx);
};

if (btnNext) btnNext.onclick = () => {
    let newIdx = (currentSlide + 1) % slides.length;
    renderHero(newIdx);
};

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    if (heroProgress) heroProgress.style.width = '0%';
    let start = Date.now();
    autoSlideInterval = setInterval(() => {
        let elapsed = Date.now() - start;
        let progress = (elapsed / SLIDE_DURATION) * 100;
        if (heroProgress) heroProgress.style.width = `${progress}%`;
        if (elapsed >= SLIDE_DURATION) renderHero((currentSlide + 1) % slides.length);
    }, 50);
}

renderHero(0);

const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// AOS
window.addEventListener('load', () => {
    if (window.AOS) AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });
});

// Nav scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (nav) {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
});

window.openQuiz = () => alert("Открыть квиз / тест");
window.scrollHits = (dir) => {
    const hitsContainer = document.getElementById("hitsSlider");
    if (hitsContainer && window.gsap) {
        gsap.to(hitsContainer, {
            scrollLeft: hitsContainer.scrollLeft + (dir * 350),
            duration: 0.5,
            ease: "power2.out"
        });
    } else if (hitsContainer) {
        hitsContainer.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
};
window.callNow = () => alert("Позвонить");

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
window.toggleMenu = () => {
    if (menuToggle && mobileMenu) {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
}
if (menuToggle) menuToggle.addEventListener('click', window.toggleMenu);
