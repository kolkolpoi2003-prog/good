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
            text: "Спасибо большое студии оптики, очень профессионально and качественно все сделано. Очень приятные and отзывчивые врачи. Будем вас советовать всем своим друзьям!",
            name: "Анастасия Бурмейстер",
            date: "8 августа 2025"
        },
        {
            text: "Два года назад приобрела очки с фотохромными линзами. Прошло достаточно времени, чтобы понять, что деньги потрачены не зря. Спасибо всем девочкам за терпение and радушие. Особенно Надежде Кушнеровой. Очки отличные!",
            name: "Нонна Дулова",
            date: "19 мая 2025"
        },
        {
            text: "Сердечно благодарю оптометриста Елену за то, что открыла для меня мир японских мультифокальных линз \"Миру\". Долгое время я мучилась от необходимости постоянно менять очки, линзы, чтобы видеть четко как вблизи, так and вдаль. Елена подробно рассказала о преимуществах этих линз, их инновационной технологии and комфорте при ношении. Рекомендую Вашу оптику своим знакомым. Спасибо.",
            name: "Вика Ситникова",
            date: "8 апреля 2025"
        },
        {
            text: "Подобрали в этом Салоне очки для дочки. Остались очень довольны доброжелательностью and профессионализмом сотрудников) Спасибо вам! 😊 Большой выбор оправ, в том числе для детей (на любой возраст), причём в разном ценовом диапазоне. Удобное расположение в центре города. Будем рекомендовать друзьям and знакомым! 👍",
            name: "Ирина Снегирева",
            date: "18 октября 2024"
        },
    ],
};

const $ = (s) => document.querySelector(s);

// Global flags to prevent click conflicts during/after drag
window.lastHitsDragEnd = 0;
window.lastTestimonialsDragEnd = 0;

// === Categories ===
const catStates = (DATA.categories || []).map(() => 0);
function updateCatImage(catIdx) {
    const card = document.getElementById("categoryCards")?.children[catIdx];
    const img = card?.querySelector('.catMedia img');
    if (!img) return;
    const newSrc = DATA.categories[catIdx].images[catStates[catIdx]];
    if (window.gsap) {
        const tl = gsap.timeline();
        tl.to(img, { opacity: 0, scale: 0.92, rotationY: 8, duration: 0.4, ease: "power2.in", onComplete: () => { img.src = newSrc; } });
        tl.to(img, { opacity: 1, scale: 1, rotationY: 0, duration: 0.8, ease: "power3.out" });
    } else {
        img.src = newSrc;
    }
}
window.changeCatImage = (catIdx, dir) => {
    if (!DATA.categories[catIdx]) return;
    let next = (catStates[catIdx] + dir + DATA.categories[catIdx].images.length) % DATA.categories[catIdx].images.length;
    catStates[catIdx] = next;
    updateCatImage(catIdx);
};

// === Hits Slider Modal ===
let currentModalIdx = 0;
window.openProductModal = (idx, isNav = false, dir = 1) => {
    // Prevent opening if we just dragged
    if (!isNav && (Date.now() - window.lastHitsDragEnd < 300)) return;

    currentModalIdx = idx;
    const product = DATA.hits[idx];
    if (!product) return;

    const updateContent = () => {
        if ($('#modalTitle')) $('#modalTitle').textContent = product.name || "";
        if ($('#modalPrice')) $('#modalPrice').textContent = product.price || "";
        if ($('#modalImg')) $('#modalImg').src = product.img || "";
        if ($('#modalBreadcrumbs')) $('#modalBreadcrumbs').textContent = `Catalog / ${product.category || "General"} / ${product.brand || ""}`;
        const list = $('#modalDetailsList');
        if (list) {
            let h = '';
            if (product.material) h += `<li>${product.material}</li>`;
            if (product.color) h += `<li>${product.color}</li>`;
            if (product.protection) h += `<li>Protection: ${product.protection}</li>`;
            if (product.description) h += `<li style="margin-top:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; list-style:none;">${product.description}</li>`;
            list.innerHTML = h || '<li>Подробности уточняйте у менеджера</li>';
        }
    };

    const modal = $('#productModal');
    if (!modal) return;

    if (!isNav) {
        updateContent();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.gsap) gsap.fromTo('.modal-content', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" });
    } else {
        if (window.gsap) {
            const tl = gsap.timeline();
            const sweepElements = '.modal-breadcrumbs, .modal-title, .modal-price, #modalDetailsContainer, .modal-img-container img';
            tl.to(sweepElements, {
                opacity: 0,
                x: -dir * 30,
                scale: 0.96,
                duration: 0.3,
                stagger: 0.02,
                ease: "power2.inOut",
                onComplete: () => {
                    updateContent();
                    gsap.set(sweepElements, { x: dir * 30, opacity: 0, scale: 1.04 });
                }
            });
            tl.to(sweepElements, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.03,
                ease: "expo.out",
                clearProps: "all"
            });
        } else { updateContent(); }
    }
};
window.closeProductModal = () => { $('#productModal')?.classList.remove('active'); document.body.style.overflow = ''; };
window.navProductModal = (dir) => { if (DATA.hits.length) openProductModal((currentModalIdx + dir + DATA.hits.length) % DATA.hits.length, true, dir); };
if ($('#productModal')) $('#productModal').onclick = (e) => { if (e.target === $('#productModal')) closeProductModal(); };

// === Testimonials Carousel ===
(function () {
    const track = document.getElementById("testimonialsTrack");
    if (!track || !DATA.testimonials?.length) return;

    track.innerHTML = DATA.testimonials.map(t => `<div class="testimonialCard reveal-hidden"><div class="testimonialStars">★★★★★</div><div class="testimonialName">${t.name}</div><p class="testimonialText">${t.text}</p><div class="testimonialDate">${t.date}</div></div>`).join('');

    const items = Array.from(track.children), total = items.length, clones = 5;
    const pre = items.slice(-clones).map(n => n.cloneNode(true));
    const suf = items.slice(0, clones).map(n => n.cloneNode(true));
    pre.reverse().forEach(n => track.insertBefore(n, track.firstChild));
    suf.forEach(n => track.appendChild(n));

    let idx = clones;
    const getStep = () => (track.querySelector('.testimonialCard')?.offsetWidth + 24) || 0;
    const setPos = () => { const s = getStep(); if (s > 18) gsap.set(track, { x: -idx * s }); };

    window.scrollTestimonials = (dir) => {
        const s = getStep(); if (!s) return;
        if (idx >= total + clones) { idx -= total; gsap.set(track, { x: -idx * s }); }
        else if (idx < clones) { idx += total; gsap.set(track, { x: -idx * s }); }
        idx += dir;
        gsap.to(track, {
            x: -idx * s, duration: 0.7, ease: "power3.out", overwrite: true, onComplete: () => {
                if (idx >= total + clones) { idx -= total; gsap.set(track, { x: -idx * s }); }
                else if (idx < clones) { idx += total; gsap.set(track, { x: -idx * s }); }
            }
        });
    };

    const bP = document.getElementById("testimonialPrev"), bN = document.getElementById("testimonialNext");
    if (bP) bP.onclick = () => { if (Date.now() - window.lastTestimonialsDragEnd > 300) window.scrollTestimonials(-1); };
    if (bN) bN.onclick = () => { if (Date.now() - window.lastTestimonialsDragEnd > 300) window.scrollTestimonials(1); };

    let isDrag = false, sX = 0, sTX = 0, moved = false;
    const container = track.parentElement;
    if (container) {
        container.style.cursor = 'grab';
        const start = (e) => {
            isDrag = true;
            moved = false;
            sX = e.pageX || e.touches?.[0].pageX;
            sTX = gsap.getProperty(track, "x");
            container.style.cursor = 'grabbing';
            document.body.classList.add('is-dragging');
            gsap.killTweensOf(track);
        };
        const move = (e) => {
            if (!isDrag) return;
            const x = e.pageX || e.touches?.[0].pageX;
            const walk = x - sX;
            if (Math.abs(walk) > 5) moved = true;
            gsap.set(track, { x: sTX + walk });
        };
        const end = () => {
            if (!isDrag) return;
            isDrag = false;
            container.style.cursor = 'grab';
            document.body.classList.remove('is-dragging');
            if (moved) window.lastTestimonialsDragEnd = Date.now();
            const s = getStep(); if (!s) return;
            idx = -Math.round(gsap.getProperty(track, "x") / s);
            gsap.to(track, {
                x: -idx * s, duration: 0.5, ease: "power2.out", overwrite: true, onComplete: () => {
                    if (idx >= total + clones) { idx -= total; gsap.set(track, { x: -idx * s }); }
                    else if (idx < clones) { idx += total; gsap.set(track, { x: -idx * s }); }
                }
            });
        };
        container.addEventListener('mousedown', start);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        container.addEventListener('touchstart', start, { passive: true });
        window.addEventListener('touchmove', move, { passive: true });
        window.addEventListener('touchend', end);
        container.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    }
    window.addEventListener('load', setPos);
    setTimeout(setPos, 100);
    window.addEventListener('resize', setPos);
})();

// === Hits Slider ===
(function () {
    const track = document.getElementById("hitsTrack"), slider = document.getElementById("hitsSlider");
    if (!track || !slider) return;

    const items = Array.from(track.children), total = items.length, clones = 5;
    if (!total) return;

    items.slice(-clones).reverse().forEach(n => track.insertBefore(n.cloneNode(true), track.firstChild));
    items.slice(0, clones).forEach(n => track.appendChild(n.cloneNode(true)));

    let idx = clones;
    const getStep = () => (track.querySelector('.cardSmall')?.offsetWidth + 20) || 0;
    const setPos = () => { const s = getStep(); if (s > 18) gsap.set(track, { x: -idx * s }); };

    window.scrollHits = (dir) => {
        const s = getStep(); if (!s) return;
        if (idx >= total + clones) { idx -= total; gsap.set(track, { x: -idx * s }); }
        else if (idx < clones) { idx += total; gsap.set(track, { x: -idx * s }); }
        idx += dir;
        gsap.to(track, {
            x: -idx * s, duration: 0.7, ease: "power3.out", overwrite: true, onComplete: () => {
                if (idx >= total + clones) { idx -= total; gsap.set(track, { x: -idx * s }); }
                else if (idx < clones) { idx += total; gsap.set(track, { x: -idx * s }); }
            }
        });
    };

    const bP = document.getElementById("hitsPrev"), bN = document.getElementById("hitsNext");
    if (bP) bP.onclick = () => { if (Date.now() - window.lastHitsDragEnd > 300) window.scrollHits(-1); };
    if (bN) bN.onclick = () => { if (Date.now() - window.lastHitsDragEnd > 300) window.scrollHits(1); };

    let isDrag = false, sX = 0, sTX = 0, moved = false;
    slider.style.cursor = 'grab';
    const start = (e) => {
        isDrag = true;
        moved = false;
        sX = e.pageX || e.touches?.[0].pageX;
        sTX = gsap.getProperty(track, "x");
        slider.style.cursor = 'grabbing';
        document.body.classList.add('is-dragging');
        gsap.killTweensOf(track);
    };
    const move = (e) => {
        if (!isDrag) return;
        const x = e.pageX || e.touches?.[0].pageX;
        const walk = x - sX;
        if (Math.abs(walk) > 5) moved = true;
        gsap.set(track, { x: sTX + walk });
    };
    const end = () => {
        if (!isDrag) return;
        isDrag = false;
        slider.style.cursor = 'grab';
        document.body.classList.remove('is-dragging');
        if (moved) window.lastHitsDragEnd = Date.now();
        const s = getStep(); if (!s) return;
        idx = -Math.round(gsap.getProperty(track, "x") / s);
        gsap.to(track, {
            x: -idx * s, duration: 0.5, ease: "power2.out", overwrite: true, onComplete: () => {
                if (idx >= total + clones) { idx -= total; gsap.set(track, { x: -idx * s }); }
                else if (idx < clones) { idx += total; gsap.set(track, { x: -idx * s }); }
            }
        });
    };
    slider.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    slider.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);
    slider.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    window.addEventListener('load', setPos);
    setTimeout(setPos, 100);
    setTimeout(setPos, 500);
    let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(setPos, 150); });
})();

// === Hero Slider ===
(function () {
    let cur = 0; const slds = DATA.heroSlides;
    let heroAutoPlay;

    function render(i) {
        if (!slds[i]) return; cur = i;
        if ($('#heroIndex')) $('#heroIndex').textContent = `[0${i + 1}]`;
        if ($('.heroTitle')) $('.heroTitle').innerHTML = slds[i].title.replace(/\n/g, "<br/>");
        if ($('#heroText')) $('#heroText').textContent = slds[i].text;
        if ($('#heroMainImg')) {
            const img = $('#heroMainImg');
            if (!img.src) { img.src = slds[i].img; img.style.opacity = 1; }
            else { img.style.opacity = 0; setTimeout(() => { img.src = slds[i].img; img.onload = () => img.style.opacity = 1; }, 200); }
        }
        document.querySelectorAll(".mini").forEach((t, j) => t.classList.toggle("active", i === j));

        startHeroAutoplay();
    }

    function startHeroAutoplay() {
        if (heroAutoPlay) heroAutoPlay.kill();
        const bar = $('#heroProgress');
        if (!bar) return;

        gsap.set(bar, { width: "0%" });
        heroAutoPlay = gsap.to(bar, {
            width: "100%",
            duration: 6,
            ease: "none",
            onComplete: () => {
                render((cur + 1) % slds.length);
            }
        });
    }

    if ($('#heroThumbs')) {
        slds.forEach((s, i) => { const t = document.createElement("div"); t.className = `mini ${i === 0 ? 'active' : ''}`; t.onclick = () => render(i); t.innerHTML = `<img src="${s.img}">`; $('#heroThumbs').appendChild(t); });
    }
    if ($('#heroPrev')) $('#heroPrev').onclick = () => render((cur - 1 + slds.length) % slds.length);
    if ($('#heroNext')) $('#heroNext').onclick = () => render((cur + 1) % slds.length);
    render(0);
})();

// === General ===
window.addEventListener('load', () => { if (window.AOS) AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true }); });
window.addEventListener('scroll', () => {
    $('.nav')?.classList.toggle('scrolled', window.scrollY > 50);
    $('#backToTop')?.classList.toggle('active', window.scrollY > 500);
}, { passive: true });
if ($('#year')) $('#year').textContent = new Date().getFullYear();
window.callNow = () => alert("Позвонить");
window.openQuiz = () => alert("Открыть квиз");

// Mobile Menu
window.toggleMenu = () => {
    $('#menuToggle')?.classList.toggle('active');
    $('#mobileMenu')?.classList.toggle('active');
    document.body.style.overflow = $('#mobileMenu')?.classList.contains('active') ? 'hidden' : '';
};
if ($('#menuToggle')) $('#menuToggle').onclick = window.toggleMenu;

// Premium Scroll (Lenis)
(function () {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.lenisInstance = lenis;
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll('section').forEach(s => {
            const el = s.querySelectorAll('.h2, .sub, .kicker, .catCard, .cardSmall, .panel, .testimonialCard');
            if (el.length) gsap.fromTo(el, { y: 60, opacity: 0 }, { scrollTrigger: { trigger: s, start: "top 90%", once: true, onEnter: () => s.classList.add('section-active') }, y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "expo.out" });
        });
    }
})();

// Schedule
(function () {
    const items = document.querySelectorAll('.schedule-item'), badge = $('#status-badge');
    if (!items.length || !badge) return;
    const now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    const open = (day !== 0 && mins >= 600 && mins < 1080);
    items.forEach(i => {
        if (parseInt(i.dataset.day) === day) {
            i.classList.add('active');
            i.querySelector('.day').innerHTML += ' <span style="font-size:10px; background:var(--gold-soft); color:var(--ink); padding:2px 6px; border-radius:4px; margin-left:8px;">Сегодня</span>';
        }
    });
    badge.textContent = open ? 'Открыто' : 'Закрыто';
    badge.className = 'status-badge ' + (open ? 'open' : 'closed');
})();
