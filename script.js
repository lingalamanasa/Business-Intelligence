document.addEventListener("DOMContentLoaded", () => {
    // 1. Spring Board Mobile Menu Navigation & Overlay
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const nav = document.querySelector("nav");
    const header = document.querySelector("header, .header-static");

    if (mobileMenuBtn && nav) {
        // Ensure backdrop overlay exists inside header (or body as fallback)
        let navOverlay = document.querySelector(".nav-overlay");
        if (!navOverlay) {
            navOverlay = document.createElement("div");
            navOverlay.className = "nav-overlay";
            navOverlay.id = "nav-overlay";
            if (header) {
                header.insertBefore(navOverlay, nav);
            } else {
                document.body.appendChild(navOverlay);
            }
        }

        // Ensure brand header inside mobile drawer with STACKLY Logo & close button
        let drawerTop = nav.querySelector(".drawer-top");
        if (!drawerTop) {
            drawerTop = document.createElement("div");
            drawerTop.className = "drawer-top";
            drawerTop.innerHTML = `
                <a href="index.html" class="drawer-logo" aria-label="Stackly Home">
                    <img src="images/logo-dark.webp?v=3.0" alt="STACKLY Logo" class="drawer-logo-img" />
                </a>
                <button type="button" class="drawer-close-btn" id="drawer-close-btn" aria-label="Close menu">
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>
            `;
            nav.prepend(drawerTop);
        }

        // Bind close button handler
        const drawerCloseBtns = nav.querySelectorAll(".drawer-close-btn");
        drawerCloseBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        });

        // Add Font Awesome arrow icons to nav links for mobile drawer only (pure FA icons)
        nav.querySelectorAll("ul li a").forEach(a => {
            if (!a.querySelector(".nav-drawer-arrow")) {
                const arrow = document.createElement("i");
                arrow.className = "fa-solid fa-chevron-right nav-drawer-arrow";
                arrow.setAttribute("aria-hidden", "true");
                a.appendChild(arrow);
            }
        });

        // Set sequential spring animation indices for nav list items only
        const menuItems = nav.querySelectorAll("ul > li");
        menuItems.forEach((item, idx) => {
            item.style.setProperty("--item-idx", idx);
        });

        const icon = mobileMenuBtn.querySelector("i");

        const openMenu = () => {
            nav.classList.add("active");
            navOverlay.classList.add("active");
            mobileMenuBtn.classList.add("open");
            mobileMenuBtn.setAttribute("aria-expanded", "true");
            document.body.classList.add("menu-open");
            document.documentElement.classList.add("menu-open");
            if (icon) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            }
        };

        const closeMenu = () => {
            nav.classList.remove("active");
            navOverlay.classList.remove("active");
            mobileMenuBtn.classList.remove("open");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
            document.documentElement.classList.remove("menu-open");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        };

        const toggleMenu = () => {
            const isOpen = nav.classList.contains("active");
            isOpen ? closeMenu() : openMenu();
        };

        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when clicking overlay
        navOverlay.addEventListener("click", (e) => {
            e.stopPropagation();
            closeMenu();
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Hash links smooth-close
        nav.querySelectorAll("ul li a").forEach(a => {
            a.addEventListener("click", () => {
                const href = a.getAttribute("href");
                if (href && href.startsWith("#")) {
                    closeMenu();
                }
            });
        });

        // Ensure auth buttons work immediately and reliably navigate
        nav.querySelectorAll(".auth-mobile a").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const href = btn.getAttribute("href");
                if (href && !href.startsWith("#")) {
                    window.location.href = href;
                }
            });
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && nav.classList.contains("active")) {
                closeMenu();
                mobileMenuBtn.focus();
            }
        });

        // Auto-close on resize if viewport expands beyond mobile breakpoint (992px)
        window.addEventListener("resize", () => {
            if (window.innerWidth > 992 && nav.classList.contains("active")) {
                closeMenu();
            }
        }, { passive: true });
    }

    // 1.5. Hero Background Slideshow (Cross-fade one by one)
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.slider-dot');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        let slideTimer;

        const setSlide = (idx) => {
            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === idx);
            });
            heroDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
            currentSlide = idx;
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % heroSlides.length;
            setSlide(next);
        };

        const startTimer = () => {
            clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, 5000);
        };

        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                setSlide(idx);
                startTimer();
            });
        });

        startTimer();
    }

    // 2. Dynamic Active Links
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav ul li a");
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.classList.remove("active");
            const linkPath = link.getAttribute("href");
            if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
                link.classList.add("active");
            }
        });
    }

    // 3. Global CTA & Card Button Navigation
    const ctaButtons = document.querySelectorAll(".btn-add, .deal-card, .recipe-link, .read-more, .category-card");
    ctaButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const href = btn.getAttribute("href") || (btn.dataset && btn.dataset.href);
            if (href === "404.html" || btn.classList.contains("category-card") || btn.classList.contains("btn-add")) {
                window.location.href = "404.html";
            }
        });
    });

    // 4. Form Submissions Simulation
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        if (form.id !== 'loginForm' && form.id !== 'signupForm' && !form.classList.contains('news-form') && !form.classList.contains('contact-form') && !form.getAttribute("onsubmit")) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                form.reset();
            });
        }
    });

    // 5. Stats Counter Animation
    const statCounters = document.querySelectorAll('.stat-new h3, .stat-item h3');
    if (statCounters.length > 0) {
        const animateCounter = (el) => {
            const originalText = el.innerText.trim();
            const match = originalText.match(/^([^\d]*)([\d\.]+)(.*)$/);
            if (!match) return;
            
            const prefix = match[1] || '';
            const target = parseFloat(match[2]);
            const suffix = match[3] || '';
            const isFloat = match[2].includes('.');
            
            let current = 0;
            const increment = target / 60;
            const duration = 1500;
            const interval = duration / 60;
            
            const updateText = () => {
                current += increment;
                if (current >= target) {
                    el.innerText = prefix + (isFloat ? target.toFixed(1) : Math.ceil(target)) + suffix;
                    clearInterval(timer);
                } else {
                    el.innerText = prefix + (isFloat ? current.toFixed(1) : Math.ceil(current)) + suffix;
                }
            };
            
            el.innerText = prefix + '0' + suffix;
            const timer = setInterval(updateText, interval);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        statCounters.forEach(counter => observer.observe(counter));
    }

    // 6. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // 7. Tasteful Wobble Card Enter Animation
    function initWobbleCards() {
        const cardSelectors = [
            '.wobble-card',
            '.wobble-card-enter',
            '[data-wobble]',
            '.diet-card',
            '.deal-card',
            '.service-card-clean',
            '.service-card',
            '.step-card',
            '.recipe-card',
            '.farmer-card',
            '.testimonial-card',
            '.blog-card',
            '.category-card',
            '.product-card',
            '.values-card',
            '.value-card',
            '.stat-card',
            '.stat-item',
            '.faq-item',
            '.office-card',
            '.contact-card',
            '.doctor-card',
            '.department-card',
            '.appointment-card',
            '.patient-card',
            '.dash-stat-card',
            '.dash-quick-card',
            '.insight-item',
            '.dash-chart-card',
            '.dash-table-card',
            '.hub-card',
            '.feature'
        ].join(',');

        const cards = Array.from(document.querySelectorAll(cardSelectors));
        if (!cards.length) return;

        // Stagger siblings in grid containers with --wobble-delay
        const parents = new Set(cards.map(c => c.parentElement).filter(Boolean));
        parents.forEach(parent => {
            const siblings = Array.from(parent.querySelectorAll(':scope > ' + cardSelectors.split(',').join(', :scope > ')));
            siblings.forEach((card, idx) => {
                if (!card.style.getPropertyValue('--wobble-delay')) {
                    card.style.setProperty('--wobble-delay', idx % 4);
                }
                card.classList.add('wobble-card');
            });
        });

        // If reduced motion or no IntersectionObserver, reveal immediately
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            cards.forEach(card => card.classList.add('wobble-revealed'));
            return;
        }

        const wobbleObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('wobble-revealed');
                        wobbleObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        );

        cards.forEach(card => {
            card.classList.add('wobble-card');
            wobbleObserver.observe(card);
        });
    }

    initWobbleCards();
});


/* ==========================================================================
   INTERACTIVE UI/UX SIMULATOR CONTROLLERS
   ========================================================================== */

// 1. AI Copilot Prompt & SQL Selector
window.selectPrompt = function(idx) {
    const prompts = [
        {
            text: 'What was net cohort ARR retention for enterprise accounts in Q3?',
            sql: '<span class="keyword">SELECT</span> cohort_quarter, <span class="func">SUM</span>(arr_expansion) / <span class="func">SUM</span>(arr_starting) * <span class="num">100</span> AS nrr_pct<br><span class="keyword">FROM</span> telemetry_lakehouse.enterprise_subscriptions<br><span class="keyword">WHERE</span> fiscal_year = <span class="num">2026</span> <span class="keyword">GROUP BY</span> <span class="num">1</span>;',
            latency: '28ms'
        },
        {
            text: 'Compare EMEA vs APAC gross margins across recurring cloud tiers',
            sql: '<span class="keyword">SELECT</span> region, <span class="func">AVG</span>(gross_margin_rate) AS margin_avg, <span class="func">COUNT</span>(*) AS active_nodes<br><span class="keyword">FROM</span> telemetry_lakehouse.regional_pnl_stream<br><span class="keyword">WHERE</span> region IN (\'EMEA\', \'APAC\') <span class="keyword">GROUP BY</span> <span class="num">1</span>;',
            latency: '34ms'
        },
        {
            text: 'Detect P&L churn anomalies across accounts exceeding $250k ARR',
            sql: '<span class="keyword">SELECT</span> account_id, churn_probability, z_score_variance<br><span class="keyword">FROM</span> ml_radars.churn_early_warning<br><span class="keyword">WHERE</span> tier = \'Tier-1 Enterprise\' AND z_score_variance > <span class="num">2.5</span>;',
            latency: '41ms'
        }
    ];

    const input = document.getElementById('copilotPromptInput');
    const code = document.getElementById('copilotCodeView');
    const latency = document.getElementById('copilotLatency');
    const chips = document.querySelectorAll('.ux-chips-row .ux-chip');

    if (input && code && prompts[idx]) {
        input.value = prompts[idx].text;
        code.innerHTML = prompts[idx].sql;
        if (latency) latency.textContent = prompts[idx].latency;

        chips.forEach((c, i) => {
            if (i === idx) c.classList.add('active');
            else c.classList.remove('active');
        });
    }
};

// 2. CDC Live Stream Surge Simulator
let isSurging = false;
let surgeInterval = null;
window.toggleStreamSimulator = function() {
    const btn = document.getElementById('streamToggleBtn');
    const counter = document.getElementById('liveEvCount');
    if (!btn || !counter) return;

    if (!isSurging) {
        isSurging = true;
        btn.textContent = 'Surge: 5.8M/s';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';
        surgeInterval = setInterval(() => {
            const count = Math.floor(5800000 + Math.random() * 200000);
            counter.textContent = count.toLocaleString();
        }, 120);
    } else {
        isSurging = false;
        clearInterval(surgeInterval);
        btn.textContent = 'Simulate Surge';
        btn.style.background = '#eab308';
        btn.style.color = '#000';
        counter.textContent = '1,428,950';
    }
};

// 3. Boardroom Cockpit Cohort Switcher
window.switchCockpitCohort = function(cohort) {
    const arrEl = document.getElementById('cockpitArr');
    const nrrEl = document.getElementById('cockpitNrr');
    const marginEl = document.getElementById('cockpitMargin');
    const driverEl = document.getElementById('cockpitDriver');

    if (cohort === 'global') {
        if (arrEl) arrEl.textContent = '$84.2M';
        if (nrrEl) nrrEl.textContent = '126.2%';
        if (marginEl) marginEl.textContent = '79.4%';
        if (driverEl) driverEl.textContent = 'Consolidated Net Retention';
    } else if (cohort === 'enterprise') {
        if (arrEl) arrEl.textContent = '$52.8M';
        if (nrrEl) nrrEl.textContent = '138.4%';
        if (marginEl) marginEl.textContent = '84.1%';
        if (driverEl) driverEl.textContent = 'Multi-Year Enterprise Lockups';
    } else if (cohort === 'emea') {
        if (arrEl) arrEl.textContent = '€28.6M';
        if (nrrEl) nrrEl.textContent = '121.8%';
        if (marginEl) marginEl.textContent = '76.9%';
        if (driverEl) driverEl.textContent = 'Financial Services Expansion';
    }
};

// 4. Zero-Trust PII Masking Simulator
let isMasked = true;
window.toggleDataMasking = function() {
    const btn = document.getElementById('maskToggleBtn');
    const tbody = document.getElementById('maskTableBody');
    if (!btn || !tbody) return;

    isMasked = !isMasked;
    if (isMasked) {
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Masking: ACTIVE';
        btn.style.background = '#eab308';
        tbody.innerHTML = `
            <tr><td>#4892</td><td>Apex Global</td><td><span class="masked">••••-••-8419</span></td><td>14ms</td></tr>
            <tr><td>#6104</td><td>Vanguard Fin</td><td><span class="masked">••••-••-2231</span></td><td>18ms</td></tr>
            <tr><td>#9281</td><td>CloudScale</td><td><span class="masked">••••-••-7094</span></td><td>11ms</td></tr>
        `;
    } else {
        btn.innerHTML = '<i class="fa-solid fa-lock-open"></i> Audit: UNMASKED';
        btn.style.background = '#f97316';
        tbody.innerHTML = `
            <tr><td>#4892</td><td>Apex Global</td><td><span style="color:#4ade80;">US-982-12-8419</span></td><td>14ms</td></tr>
            <tr><td>#6104</td><td>Vanguard Fin</td><td><span style="color:#4ade80;">US-411-90-2231</span></td><td>18ms</td></tr>
            <tr><td>#9281</td><td>CloudScale</td><td><span style="color:#4ade80;">US-305-67-7094</span></td><td>11ms</td></tr>
        `;
    }
};

// 5. Enterprise Stage Blueprint Tab Switcher
window.switchStageTab = function(stageId, btnElement) {
    const tabs = document.querySelectorAll('.ux-stage-tab');
    const panels = document.querySelectorAll('.ux-stage-panel');

    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));

    const targetPanel = document.getElementById('stagePanel-' + stageId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    if (btnElement && btnElement.classList) {
        btnElement.classList.add('active');
    } else {
        const matchingTab = Array.from(tabs).find(t => {
            const attr = t.getAttribute('onclick') || '';
            return attr.includes(`'${stageId}'`) || attr.includes(`"${stageId}"`);
        });
        if (matchingTab) {
            matchingTab.classList.add('active');
        } else if (window.event && window.event.target) {
            const clickedBtn = window.event.target.closest('.ux-stage-tab');
            if (clickedBtn) clickedBtn.classList.add('active');
        }
    }
};

// Initialize stage tabs on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const stageTabs = document.querySelectorAll('.ux-stage-nav .ux-stage-tab');
    const stageIds = ['scaleup', 'midmarket', 'pe', 'global'];
    stageTabs.forEach(function(tab, index) {
        tab.addEventListener('click', function(e) {
            const id = stageIds[index] || 'scaleup';
            window.switchStageTab(id, tab);
        });
    });
});

// ==========================================
// STACKLY ENTERPRISE PRELOADER CONTROLLER
// ==========================================
window.initStacklyPreloader = function() {
    const preloader = document.getElementById('stacklyPreloader');
    if (!preloader || preloader.dataset.inited) return;
    preloader.dataset.inited = 'true';

    const progressBar = document.getElementById('preloaderProgress');
    const counter = document.getElementById('preloaderCounter');
    const statusEl = document.getElementById('preloaderStatus');

    let progress = 0;
    const statusMessages = [
        { at: 0, text: 'INITIALIZING TELEMETRY...' },
        { at: 35, text: 'SYNCHRONIZING CDC MESH...' },
        { at: 70, text: 'CALIBRATING LAKEHOUSE CACHE...' },
        { at: 92, text: 'SYSTEM ONLINE' }
    ];

    const startTime = Date.now();
    const duration = 650; // Snappy 650ms animation

    function update() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(Math.round((elapsed / duration) * 100), 100);

        if (progressBar) progressBar.style.width = progress + '%';
        if (counter) counter.textContent = progress + '%';

        if (statusEl) {
            const current = statusMessages.slice().reverse().find(m => progress >= m.at);
            if (current) statusEl.textContent = current.text;
        }

        if (progress < 100) {
            requestAnimationFrame(update);
        } else {
            setTimeout(function() {
                preloader.classList.add('preloader-hidden');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 550);
            }, 120);
        }
    }

    requestAnimationFrame(update);

    // Absolute fallback in case tab is in background
    setTimeout(function() {
        if (preloader && !preloader.classList.contains('preloader-hidden')) {
            preloader.classList.add('preloader-hidden');
            setTimeout(function() { preloader.style.display = 'none'; }, 550);
        }
    }, 1400);
};

// Auto-run preloader as early as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initStacklyPreloader);
} else {
    window.initStacklyPreloader();
}

// ==========================================
// PREVIOUS PAGE TRACKER FOR 404 GO BACK
// ==========================================
(function initPreviousPageTracker() {
    const curPath = window.location.pathname;
    const curHref = window.location.href;
    if (!curPath.endsWith('404.html') && !curHref.includes('404.html')) {
        try {
            sessionStorage.setItem('stackly_previous_page', curHref);
        } catch (e) {}
    }

    // Save before navigating away to any 404 destination
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a, button, [onclick]');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        const oc = link.getAttribute('onclick') || '';
        if (href.includes('404.html') || oc.includes('404.html')) {
            if (!curHref.includes('404.html')) {
                try {
                    sessionStorage.setItem('stackly_previous_page', curHref);
                } catch (err) {}
            }
        }
    }, true);
})();

