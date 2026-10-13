/* ==========================================================================
   STACKLY BI - APPLICATION CONTROLLER & ROLE-BASED DASHBOARD ENGINE
   Full Business Intelligence Platform Architecture
   ========================================================================== */

// Application State
const AppState = {
  currentPage: 'home',
  currentUser: null,
  currentRole: 'executive', // 'executive' | 'engineer' | 'marketing'
  pricingAnnual: true,
  currentConnectorFilter: 'all',
  currentBlogFilter: 'all',
};

// Role Metadata & Data Profiles
const RoleProfiles = {
  executive: {
    title: "Chief Analytics Officer / Executive",
    name: "Dr. Evelyn Vance",
    avatar: "EV",
    badge: "Executive Intelligence",
    kpis: [
      { label: "Annual Recurring Revenue", val: "$48.6M", trend: "+34.2% YoY", isUp: true, sub: "Exceeding Q3 target" },
      { label: "Net Revenue Retention", val: "128.4%", trend: "+5.1%", isUp: true, sub: "Enterprise tier cohort" },
      { label: "Predictive Q4 ARR", val: "$54.2M", trend: "98.4% Confidence", isUp: true, sub: "ML Monte Carlo model" },
      { label: "Blended CAC Payback", val: "8.2 Mo", trend: "-1.8 Mo", isUp: true, sub: "Efficiency up 22%" }
    ],
    chartTitle: "Executive Revenue Growth vs. Predictive AI Projection",
    tableHeaders: ["Department", "Budget Allocation", "Realized Revenue", "ROI Velocity", "Health Status"],
    tableRows: [
      ["Enterprise Cloud", "$4,200,000", "$18,450,000", "4.39x", "🟢 Optimum"],
      ["Mid-Market SaaS", "$2,100,000", "$9,800,000", "4.66x", "🟢 Optimum"],
      ["Self-Service BI", "$850,000", "$5,240,000", "6.16x", "🟢 Strong"],
      ["Embedded Analytics API", "$1,400,000", "$6,900,000", "4.92x", "🟢 Strong"],
      ["AI Copilot Add-on", "$600,000", "$3,120,000", "5.20x", "🟢 High Growth"]
    ]
  },
  engineer: {
    title: "Lead BI Data Engineer",
    name: "Marcus Chen",
    avatar: "MC",
    badge: "Pipeline & ETL Architecture",
    kpis: [
      { label: "Stream Ingestion Speed", val: "4.8M msg/s", trend: "99.99% Uptime", isUp: true, sub: "Kafka & Redpanda cluster" },
      { label: "Snowflake CDC Latency", val: "14.2 ms", trend: "-6.4 ms", isUp: true, sub: "Sub-second sync active" },
      { label: "Failed Schema Migrations", val: "0 Errors", trend: "100% Passed", isUp: true, sub: "dbt cloud automated tests" },
      { label: "Active Semantic Models", val: "1,248 Nodes", trend: "+82 this week", isUp: true, sub: "Cube & DuckDB cache" }
    ],
    chartTitle: "Real-Time Ingestion Throughput & Kafka Consumer Lag (ms)",
    tableHeaders: ["Pipeline Node", "Source Engine", "Rows Processed / Sec", "Lag (ms)", "Status"],
    tableRows: [
      ["Snowflake Prod Sync", "Snowpipe Streaming", "1,850,200", "8.2 ms", "🟢 Healthy"],
      ["PostgreSQL CDC Feed", "Debezium / Kafka", "940,000", "12.4 ms", "🟢 Healthy"],
      ["BigQuery Analytics Mart", "dbt Cloud Core", "1,200,400", "15.1 ms", "🟢 Healthy"],
      ["Salesforce CRM Ingest", "Stackly Reverse ETL", "420,000", "22.0 ms", "🟢 Healthy"],
      ["ClickHouse High-Freq Mart", "Native Vector Driver", "2,400,000", "4.1 ms", "🟢 Optimum"]
    ]
  },
  marketing: {
    title: "VP Marketing & Revenue Operations",
    name: "Sarah Jenkins",
    avatar: "SJ",
    badge: "Growth & Funnel Attribution",
    kpis: [
      { label: "Pipeline Velocity", val: "$14.2M", trend: "+41.8% QoQ", isUp: true, sub: "Enterprise qualified deals" },
      { label: "MQL to SQL Conversion", val: "38.2%", trend: "+8.4%", isUp: true, sub: "Lead scoring optimization" },
      { label: "Blended Customer CAC", val: "$4,280", trend: "-14.2%", isUp: true, sub: "Organic channel dominance" },
      { label: "Multi-Touch ROI", val: "5.8x", trend: "+1.2x", isUp: true, sub: "Stackly Attribution Engine" }
    ],
    chartTitle: "Multi-Touch Campaign Attribution & Sales Pipeline Conversion",
    tableHeaders: ["Campaign Channel", "Spend", "Attributed ARR", "ROAS", "Conversion Rate"],
    tableRows: [
      ["LinkedIn Executive Ads", "$180,000", "$1,450,000", "8.05x", "4.8%"],
      ["Organic Search (SEO)", "$45,000", "$920,000", "20.4x", "7.2%"],
      ["Gartner / G2 Intent", "$65,000", "$780,000", "12.0x", "9.1%"],
      ["Product-Led Growth (PLG)", "$30,000", "$1,120,000", "37.3x", "14.4%"],
      ["Partner Co-Marketing", "$50,000", "$640,000", "12.8x", "6.5%"]
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initAppRouter();
  initHeaderScroll();
  initMobileDrawer();
  initAuthModals();
  initSandboxTabs();
  initConnectorFilter();
  initAICopilot();
  initPricingToggle();
  initContactForm();
  initBlogFilter();
  initSpotlightCards();
  initDashboard();
});

/* 1. APP ROUTER & SECTION TRANSITIONS */
function initAppRouter() {
  const navLinks = document.querySelectorAll('[data-route]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const route = link.getAttribute('data-route');
      if (['about', 'services', 'blog', 'contact'].includes(route)) {
        window.location.href = route + '.html';
        return;
      }
      if (route === 'home') {
        if (!document.getElementById('page-home')) {
          window.location.href = 'index.html';
          return;
        }
      }
      e.preventDefault();
      navigateTo(route);
    });
  });

  // Handle URL hash if present
  const hash = window.location.hash.replace('#', '');
  if (hash === 'dashboard') {
    navigateTo('dashboard');
  } else if (['about', 'services', 'blog', 'contact'].includes(hash)) {
    window.location.href = hash + '.html';
  }
}

function navigateTo(routeName) {
  if (['about', 'services', 'blog', 'contact'].includes(routeName)) {
    window.location.href = routeName + '.html';
    return;
  }

  AppState.currentPage = routeName;
  window.location.hash = routeName;

  // Toggle views
  const siteHeader = document.querySelector('.site-header');
  const siteFooter = document.querySelector('.site-footer');
  const dashView = document.getElementById('dashboardView');
  const pageHome = document.getElementById('page-home');

  if (routeName === 'dashboard') {
    // Show Dashboard view, hide standard site header/footer
    if (siteHeader) siteHeader.style.display = 'none';
    if (siteFooter) siteFooter.style.display = 'none';
    if (pageHome) pageHome.style.display = 'none';
    if (dashView) {
      dashView.classList.add('active-dash');
      dashView.style.display = 'flex';
      renderDashboardForRole(AppState.currentRole);
    }
  } else {
    // Show marketing pages
    if (siteHeader) siteHeader.style.display = 'block';
    if (siteFooter) siteFooter.style.display = 'block';
    if (dashView) {
      dashView.classList.remove('active-dash');
      dashView.style.display = 'none';
    }
    if (pageHome) {
      pageHome.style.display = 'block';
      pageHome.classList.add('active-page');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile drawer if open
  closeMobileDrawer();
}

/* 2. HEADER SCROLL EFFECT */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled-header');
    } else {
      header.classList.remove('scrolled-header');
    }
  }, { passive: true });
}

/* 3. MOBILE DRAWER */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('closeMobileDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.classList.remove('open');
      }
    });
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileNavDrawer');
  if (drawer) drawer.classList.remove('open');
}

/* 4. AUTH MODALS (LOGIN & SIGN UP WITH ROLE PICKER) */
function initAuthModals() {
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const openLoginBtns = document.querySelectorAll('.open-login-btn');
  const openSignupBtns = document.querySelectorAll('.open-signup-btn');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  openLoginBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    if (signupModal) signupModal.classList.remove('active');
    if (loginModal) loginModal.classList.add('active');
  }));

  openSignupBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginModal) loginModal.classList.remove('active');
    if (signupModal) signupModal.classList.add('active');
  }));

  closeBtns.forEach(b => b.addEventListener('click', () => {
    if (loginModal) loginModal.classList.remove('active');
    if (signupModal) signupModal.classList.remove('active');
    const demoModal = document.getElementById('demoModal');
    if (demoModal) demoModal.classList.remove('active');
  }));

  // Handle Login submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roleSelect = document.getElementById('loginRoleSelect');
      const selectedRole = roleSelect ? roleSelect.value : 'executive';
      AppState.currentRole = selectedRole;
      AppState.currentUser = RoleProfiles[selectedRole].name;
      
      if (loginModal) loginModal.classList.remove('active');
      showToast(`Welcome back, ${AppState.currentUser}! Loading ${RoleProfiles[selectedRole].badge}...`);
      
      setTimeout(() => {
        navigateTo('dashboard');
      }, 600);
    });
  }

  // Handle Signup submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roleSelect = document.getElementById('signupRoleSelect');
      const selectedRole = roleSelect ? roleSelect.value : 'executive';
      AppState.currentRole = selectedRole;
      AppState.currentUser = "New Enterprise Admin";

      if (signupModal) signupModal.classList.remove('active');
      showToast(`Account successfully initialized! Directing to Stackly BI OS...`);
      
      setTimeout(() => {
        navigateTo('dashboard');
      }, 600);
    });
  }
}

/* 5. INTERACTIVE LIVE BI STUDIO (SANDBOX TABS) */
function initSandboxTabs() {
  const tabs = document.querySelectorAll('.sandbox-tab-btn');
  const container = document.getElementById('sandboxMetricsContainer');
  const chartSvg = document.getElementById('sandboxChartSvg');

  if (!tabs.length || !container) return;

  const sandboxDatasets = {
    executive: {
      metrics: [
        { label: "Enterprise ARR", val: "$48.6M", trend: "+34.2%", isUp: true },
        { label: "Net Revenue Retention", val: "128.4%", trend: "+5.1%", isUp: true },
        { label: "Gross Margin", val: "84.2%", trend: "+2.8%", isUp: true },
        { label: "Customer Lifetime Value", val: "$142,500", trend: "+18.9%", isUp: true }
      ],
      points: [50, 110, 80, 160, 120, 210, 190, 260]
    },
    pipeline: {
      metrics: [
        { label: "Ingestion Velocity", val: "4.8M msg/s", trend: "100% Up", isUp: true },
        { label: "CDC Replication Delay", val: "12.4 ms", trend: "-4.2 ms", isUp: true },
        { label: "Active Pipelines", val: "248 Live", trend: "+12 New", isUp: true },
        { label: "Data Quality Score", val: "99.98%", trend: "Zero Errors", isUp: true }
      ],
      points: [140, 150, 160, 145, 180, 220, 210, 250]
    },
    retention: {
      metrics: [
        { label: "30-Day Cohort Retention", val: "94.6%", trend: "+3.2%", isUp: true },
        { label: "90-Day Cohort Retention", val: "89.1%", trend: "+4.8%", isUp: true },
        { label: "Feature Adoption Index", val: "78.4%", trend: "+12.0%", isUp: true },
        { label: "DAU / MAU Stickiness", val: "68.2%", trend: "+6.1%", isUp: true }
      ],
      points: [90, 130, 120, 175, 160, 195, 220, 240]
    },
    forecasting: {
      metrics: [
        { label: "Projected Q4 Revenue", val: "$54.2M", trend: "98.4% Acc", isUp: true },
        { label: "Cash Runway", val: "38 Months", trend: "+6 Mo", isUp: true },
        { label: "Headcount Efficiency", val: "$480K / FTE", trend: "+24%", isUp: true },
        { label: "Market Share Forecast", val: "28.5%", trend: "+5.4%", isUp: true }
      ],
      points: [60, 95, 130, 140, 190, 215, 250, 280]
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const viewKey = tab.getAttribute('data-sandbox-view');
      renderSandboxData(sandboxDatasets[viewKey]);
    });
  });

  function renderSandboxData(data) {
    if (!data) return;
    
    // Update KPI blocks
    container.innerHTML = data.metrics.map(m => `
      <div class="s-kpi">
        <div class="s-kpi-title">${m.label}</div>
        <div class="s-kpi-val">${m.val}</div>
        <div class="s-kpi-trend ${m.isUp ? 'trend-up' : 'trend-down'}">${m.trend}</div>
      </div>
    `).join('');

    // Update dynamic SVG chart polyline
    if (chartSvg) {
      const pts = data.points;
      const width = 800;
      const height = 240;
      const step = width / (pts.length - 1);
      
      const svgPoints = pts.map((val, idx) => {
        const x = idx * step;
        const y = height - (val / 300) * height + 20;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      const polyline = chartSvg.querySelector('.sandbox-dynamic-line');
      if (polyline) {
        polyline.setAttribute('points', svgPoints);
      }
    }
  }
}

/* 6. CONNECTOR FILTER & TEST PING */
function initConnectorFilter() {
  const filterBtns = document.querySelectorAll('.connector-filter-btn');
  const cards = document.querySelectorAll('.connector-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-scale-in');
        } else {
          card.style.display = 'none';
          card.classList.remove('animate-scale-in');
        }
      });
    });
  });

  // Test Ping interaction
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const ping = card.querySelector('.connector-ping');
      if (ping) {
        const orig = ping.textContent;
        ping.textContent = "Testing...";
        ping.style.color = "#FF6000";
        setTimeout(() => {
          ping.textContent = "12ms Latency ✓";
          ping.style.color = "#10B981";
          showToast(`Connected to ${card.querySelector('.connector-name').textContent}: CDC stream 100% synchronized.`);
        }, 600);
      }
    });
  });
}

/* 7. AI COPILOT NATURAL LANGUAGE QUERY */
function initAICopilot() {
  const input = document.getElementById('copilotQueryInput');
  const sendBtn = document.getElementById('copilotSendBtn');
  const chips = document.querySelectorAll('.copilot-chip');
  const responseArea = document.getElementById('copilotResponseArea');
  const responseSummary = document.getElementById('copilotResponseSummary');

  if (!input || !responseArea) return;

  const responses = {
    churn: {
      summary: "Identified Q3 Enterprise Churn anomaly: 82% of downgrade events stemmed from the Legacy EU Datacenter transition. After patch deployment, churn dropped by 64% in the last 21 days.",
      dataTag: "EU Churn: 1.2% (Target < 2.0%)"
    },
    cac: {
      summary: "Blended CAC across paid channels stands at $3,450, while Organic Product-Led Growth drives 58% of new enterprise trials with near-zero CAC, yielding an exceptional 7.2x LTV/CAC ratio.",
      dataTag: "LTV/CAC: 7.2x (Industry Top 5%)"
    },
    forecast: {
      summary: "Monte Carlo simulation on 24,000 active pipeline deals forecasts Q4 ARR landing between $52.8M and $55.4M with 94.6% statistical confidence.",
      dataTag: "Q4 ARR Forecast: $54.2M"
    },
    general: {
      summary: "Stackly AI Engine scanned 1.4B records across Snowflake & Postgres: All 24 core financial KPIs are within nominal parameters. Real-time query velocity is 12ms.",
      dataTag: "Health Status: 100% Operational"
    }
  };

  function executeQuery(queryText) {
    responseArea.classList.remove('active');
    input.value = queryText;
    
    // Animate typing / processing
    setTimeout(() => {
      responseArea.classList.add('active');
      let matched = responses.general;
      const lower = queryText.toLowerCase();

      if (lower.includes('churn') || lower.includes('downgrade')) matched = responses.churn;
      else if (lower.includes('cac') || lower.includes('roi') || lower.includes('marketing')) matched = responses.cac;
      else if (lower.includes('forecast') || lower.includes('arr') || lower.includes('revenue')) matched = responses.forecast;

      if (responseSummary) {
        responseSummary.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
            <span class="radar-dot"></span>
            <strong style="color:var(--primary); font-family:var(--font-heading); font-size:1.1rem;">Stackly Autonomous Copilot Analysis</strong>
            <span style="background:#1E293B; color:#94A3B8; font-size:0.8rem; padding:4px 10px; border-radius:12px; margin-left:auto;">${matched.dataTag}</span>
          </div>
          <p style="font-size:1.02rem; line-height:1.7; color:#E2E8F0;">${matched.summary}</p>
        `;
      }
    }, 400);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (input.value.trim()) executeQuery(input.value.trim());
    });
  }

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      executeQuery(input.value.trim());
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      executeQuery(chip.textContent);
    });
  });
}

/* 8. PRICING & ROI TOGGLE */
function initPricingToggle() {
  const monthlyBtn = document.getElementById('pricingMonthlyBtn');
  const annualBtn = document.getElementById('pricingAnnualBtn');
  const starterPrice = document.getElementById('starterPriceVal');
  const proPrice = document.getElementById('proPriceVal');
  const entPrice = document.getElementById('enterprisePriceVal');

  if (!monthlyBtn || !annualBtn) return;

  function updatePrices(isAnnual) {
    AppState.pricingAnnual = isAnnual;
    if (isAnnual) {
      annualBtn.classList.add('active');
      monthlyBtn.classList.remove('active');
      if (starterPrice) starterPrice.textContent = "79";
      if (proPrice) proPrice.textContent = "199";
      if (entPrice) entPrice.textContent = "499";
    } else {
      monthlyBtn.classList.add('active');
      annualBtn.classList.remove('active');
      if (starterPrice) starterPrice.textContent = "99";
      if (proPrice) proPrice.textContent = "249";
      if (entPrice) entPrice.textContent = "599";
    }
  }

  monthlyBtn.addEventListener('click', () => updatePrices(false));
  annualBtn.addEventListener('click', () => updatePrices(true));
}

/* 9. CONTACT FORM & DEMO REQUESTS */
function initContactForm() {
  const contactForm = document.getElementById('contactEnterpriseForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = contactForm.querySelector('input[type="text"]');
    const name = nameInput ? nameInput.value : "Enterprise Leader";
    
    showToast(`Thank you, ${name}! Your Stackly BI customized architecture briefing has been scheduled.`);
    contactForm.reset();
  });
}

/* 10. BLOG CATEGORY FILTER & LIVE SEARCH */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const countEl = document.getElementById('visibleCardsCount');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-blog-cat');

      let visible = 0;
      blogCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
          card.classList.add('animate-scale-in');
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countEl) countEl.textContent = visible;
    });
  });

  // Real-Time Live Search
  const searchInput = document.getElementById('blogSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      let visible = 0;
      blogCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      if (countEl) countEl.textContent = visible;
    });
  }
}

// Quick Trending Pill Search Helper
function quickFilterBlog(term) {
  const input = document.getElementById('blogSearchInput');
  if (input) {
    input.value = term;
    input.dispatchEvent(new Event('input'));
    const grid = document.getElementById('blogCardsGrid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast(`Filtering research papers by "${term}"`);
  }
}

/* 11. ARTICLE QUICK-READ FLYOUT DRAWER DATA & CONTROLLER */
const ResearchArticlesData = {
  'article-0': {
    category: 'AI ARCHITECTURE',
    readTime: '7 min read',
    title: 'The Death of Static Dashboards: Why Autonomous Copilots Are Replacing Manual BI',
    author: 'Dr. Evelyn Vance',
    role: 'Chief Executive Officer & Former Principal Architect',
    avatar: 'EV',
    image: 'assets/images/blog-ai-future.webp',
    summary: 'Static dashboards answer yesterday\'s predetermined questions. Discover how deterministic Abstract Syntax Trees (ASTs) coupled with vectorized metric semantics allow executives to interrogate live cloud warehouses with 100% mathematical fidelity and zero SQL hallucinations.',
    sql: `-- Stackly Semantic Layer AST Parsing Pipeline
SELECT 
    f.cohort_month,
    f.net_revenue_retention,
    COALESCE(v.predicted_expansion_arr, 0) AS expansion_projection
FROM bi_virtual_lake.metrics_semantic_core f
LEFT JOIN bi_virtual_lake.neural_expansion_predictions v 
    ON f.customer_id = v.customer_id
WHERE f.report_quarter = 'Q3-2026'
GROUP BY 1, 2, 3
ORDER BY f.cohort_month DESC;`,
    takeaways: [
      '✓ Abstract Syntax Tree compilation guarantees 100% deterministic arithmetic without hallucinations',
      '✓ Vectorized metrics eliminate manual schema joins for business users',
      '✓ Real-time P99 latency dropped from 1,840ms to 12.4ms using in-memory acceleration'
    ]
  },
  'article-1': {
    category: 'AI & COPILOTS',
    readTime: '5 min read',
    title: 'Eliminating Hallucinations in Natural Language SQL Generators',
    author: 'Marcus Chen',
    role: 'Lead Architect',
    avatar: 'MC',
    image: 'assets/images/blog-ai-future.webp',
    summary: 'How Stackly couples vector embedding caches with deterministic AST validation for 100% query safety and verified metric accuracy across multi-tenant enterprise data warehouses.',
    sql: `-- Deterministic AST Parser Rule
ASSERT VALID_SCHEMA(customer_tenancy_id, arr_net, cohort_tier);
SELECT 
    cohort_tier,
    MEDIAN(arr_net) AS median_contract_value,
    COUNT(DISTINCT account_id) AS active_logos
FROM prod_analytics.executive_rollup
WHERE audit_status = 'VERIFIED'
GROUP BY 1;`,
    takeaways: [
      '✓ Pre-execution schema linting eliminates 100% of hallucinations',
      '✓ Dual-layer token security prevents unauthorized table introspection',
      '✓ 12ms query generation time with embedded Rust compiler'
    ]
  },
  'article-2': {
    category: 'DATA ENGINEERING',
    readTime: '9 min read',
    title: 'Benchmarking 4.8M Msg/s CDC Streaming with Redpanda and DuckDB',
    author: 'Soren Lindqvist',
    role: 'Streaming Lead',
    avatar: 'SL',
    image: 'assets/images/blog-data-pipeline.webp',
    summary: 'A deep-dive benchmark into sub-second replication latency from transactional Postgres to columnar in-memory analytical layers under sustained peak workloads.',
    sql: `-- Redpanda CDC Streaming Topic Consumer
CREATE TABLE STREAMING_BUFFER AS 
SELECT 
    event_timestamp,
    record_payload->>'user_id' AS user_id,
    CAST(record_payload->>'transaction_amount' AS NUMERIC) AS delta_amt
FROM kafka_topic('bi.cdc.transactions')
WITH (watermark = '500 milliseconds');`,
    takeaways: [
      '✓ 4.8 million messages/second throughput sustained with 0 dropped events',
      '✓ P99 replication latency maintained under 14ms',
      '✓ Zero transactional lock contention on production OLTP databases'
    ]
  },
  'article-3': {
    category: 'EXECUTIVE METRICS',
    readTime: '6 min read',
    title: 'The Only 5 SaaS Metrics Your Board of Directors Truly Cares About',
    author: 'Dr. Evelyn Vance',
    role: 'CEO, Stackly',
    avatar: 'EV',
    image: 'assets/images/blog-executive-kpi.webp',
    summary: 'Why Net Retention Velocity and Blended Payback outrank raw top-line volume in current enterprise evaluations and capital allocation decisions.',
    sql: `-- Executive Board KPI Calculation Formula
SELECT 
    fiscal_quarter,
    (retained_arr + expansion_arr - contraction_arr - churn_arr) / starting_arr * 100.0 AS nrr_percentage,
    sales_marketing_expense / net_new_arr * 12.0 AS cac_payback_months,
    gross_margin_percentage * rule_of_40_score AS efficiency_multiple
FROM bi_executive.board_quarterly_pack;`,
    takeaways: [
      '✓ Net Retention Rate (NRR) > 120% is the strongest predictor of SaaS enterprise valuation',
      '✓ Blended CAC payback under 12 months reflects elite organic compounding',
      '✓ Cash conversion velocity determines durable market outperformance'
    ]
  },
  'article-4': {
    category: 'DATA ENGINEERING',
    readTime: '8 min read',
    title: 'Zero-Copy Architecture: Why Data Duplication Is Killing Your Cloud Budget',
    author: 'Julian Mercer',
    role: 'CDO Guest Fellow',
    avatar: 'JM',
    image: 'assets/images/customer-case-fintech.webp',
    summary: 'How in-situ semantic virtualization eliminated $420k in annual egress and compute duplication costs across 14 petabyte lakehouses.',
    sql: `-- In-Situ Semantic Lakehouse View (Zero Data Copy)
CREATE OR REPLACE SEMANTIC VIEW bi_virtual_lake.unified_ledger AS
SELECT * FROM external_table('s3://lakehouse-data/delta/prod_orders')
WHERE transaction_year >= 2024
OPTIONS (cache_in_memory = true, zero_copy = true);`,
    takeaways: [
      '✓ Eliminated 100% of data duplication egress costs ($420k saved annually)',
      '✓ Single source of truth preserved with zero synchronization lag',
      '✓ Instant compliance audit trail without ghost snapshot copies'
    ]
  },
  'article-5': {
    category: 'AI & COPILOTS',
    readTime: '4 min read',
    title: 'Automating Anomaly Detection with Dynamic Gaussian Process Radars',
    author: 'Aria Kapoor',
    role: 'Principal ML Scientist',
    avatar: 'AK',
    image: 'assets/images/customer-case-saas.webp',
    summary: 'Replacing naive standard deviation thresholds with context-aware, holiday-adjusted machine learning curves and dynamic confidence bounds.',
    sql: `-- Gaussian Dynamic Confidence Bounds
SELECT 
    metric_timestamp,
    observed_value,
    predicted_mean,
    predicted_mean + (2.5 * predicted_std) AS upper_bound,
    predicted_mean - (2.5 * predicted_std) AS lower_bound,
    CASE WHEN observed_value > (predicted_mean + 2.5 * predicted_std) THEN 'ALERT_HIGH'
         WHEN observed_value < (predicted_mean - 2.5 * predicted_std) THEN 'ALERT_LOW'
         ELSE 'NOMINAL' END AS anomaly_status
FROM ml_inference.gaussian_kpi_radar;`,
    takeaways: [
      '✓ 94% reduction in false positive alert fatigue for operations teams',
      '✓ Automated adjustments for seasonality and non-linear holiday spikes',
      '✓ Real-time anomaly discovery in less than 30 milliseconds'
    ]
  },
  'article-6': {
    category: 'EXECUTIVE METRICS',
    readTime: '7 min read',
    title: 'The Psychology of Decision Speed: How Sub-Second BI Alters Company Strategy',
    author: 'Sarah Jenkins',
    role: 'VP RevOps',
    avatar: 'SJ',
    image: 'assets/images/about-team-collab.webp',
    summary: 'Empirical research into how eliminating dashboard wait times creates higher analytical curiosity and rapid market adaptation across enterprise teams.',
    sql: `-- Decision Speed Correlation Analysis
SELECT 
    department_cluster,
    AVG(dashboard_latency_ms) AS avg_latency_ms,
    AVG(exploratory_queries_per_day) AS query_curiosity_rate,
    AVG(time_to_strategy_decision_days) AS decision_turnaround_days
FROM audit_logs.bi_engagement_metrics
GROUP BY 1
ORDER BY avg_latency_ms ASC;`,
    takeaways: [
      '✓ Query latencies < 100ms boost user query exploration by 380%',
      '✓ Teams make critical operational decisions 4.2 days faster',
      '✓ Higher data adoption across non-technical C-suite stakeholders'
    ]
  }
};

function openArticleDrawer(articleId) {
  const data = ResearchArticlesData[articleId] || ResearchArticlesData['article-0'];
  const overlay = document.getElementById('articleDrawerOverlay');
  if (!overlay) return;

  document.getElementById('drawerCategoryPill').textContent = data.category;
  document.getElementById('drawerReadTime').textContent = data.readTime;
  document.getElementById('drawerTitle').textContent = data.title;
  document.getElementById('drawerAuthorName').textContent = data.author;
  document.getElementById('drawerAuthorRole').textContent = data.role;
  document.getElementById('drawerAuthorAvatar').textContent = data.avatar;
  document.getElementById('drawerImage').src = data.image;
  document.getElementById('drawerSummary').textContent = data.summary;
  document.getElementById('drawerCodeSnippet').textContent = data.sql;

  const takeEl = document.getElementById('drawerTakeaways');
  if (takeEl) {
    takeEl.innerHTML = data.takeaways.map(t => `<li>${t}</li>`).join('');
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticleDrawer() {
  const overlay = document.getElementById('articleDrawerOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function copyDrawerCode() {
  const code = document.getElementById('drawerCodeSnippet');
  if (code) {
    navigator.clipboard.writeText(code.textContent).then(() => {
      showToast('SQL Code copied to clipboard! Ready to run.');
    }).catch(() => {
      showToast('SQL Code copied to clipboard!');
    });
  }
}

// Card Bookmark Toggle
function toggleCardBookmark(btn, title) {
  btn.classList.toggle('bookmarked');
  if (btn.classList.contains('bookmarked')) {
    btn.textContent = '★';
    showToast(`Saved "${title}" to your reading list!`);
  } else {
    btn.textContent = '🔖';
    showToast(`Removed "${title}" from reading list.`);
  }
}

/* 12. SPEEDRUN SIMULATOR RACE CONTROLLER */
function runSpeedrunSimulation() {
  const btn = document.getElementById('runSpeedrunSimBtn');
  if (btn) btn.disabled = true;

  const barStackly = document.getElementById('simBarStackly');
  const barSnowflake = document.getElementById('simBarSnowflake');
  const barBigQuery = document.getElementById('simBarBigQuery');
  const barRedshift = document.getElementById('simBarRedshift');

  const timeStackly = document.getElementById('simTimeStackly');
  const timeSnowflake = document.getElementById('simTimeSnowflake');
  const timeBigQuery = document.getElementById('simTimeBigQuery');
  const timeRedshift = document.getElementById('simTimeRedshift');

  // Reset bars
  [barStackly, barSnowflake, barBigQuery, barRedshift].forEach(b => { if (b) b.style.width = '2%'; });
  if (timeStackly) timeStackly.textContent = 'Running...';
  if (timeSnowflake) timeSnowflake.textContent = 'Running...';
  if (timeBigQuery) timeBigQuery.textContent = 'Running...';
  if (timeRedshift) timeRedshift.textContent = 'Running...';

  showToast('Racing 10-billion row star-schema query across 4 engines...');

  // 1. Stackly Finishes Instantly (0.4s)
  setTimeout(() => {
    if (barStackly) barStackly.style.width = '100%';
    if (timeStackly) timeStackly.textContent = '0.38s ✓ WINNER';
  }, 400);

  // 2. Snowflake Finishes (1.8s in sim time)
  setTimeout(() => {
    if (barSnowflake) barSnowflake.style.width = '45%';
    if (timeSnowflake) timeSnowflake.textContent = '6.8s (17x slower)';
  }, 1800);

  // 3. BigQuery Finishes (2.6s in sim time)
  setTimeout(() => {
    if (barBigQuery) barBigQuery.style.width = '28%';
    if (timeBigQuery) timeBigQuery.textContent = '11.2s (28x slower)';
  }, 2600);

  // 4. Redshift Finishes (3.4s in sim time)
  setTimeout(() => {
    if (barRedshift) barRedshift.style.width = '14%';
    if (timeRedshift) timeRedshift.textContent = '24.5s (61x slower)';
    if (btn) btn.disabled = false;
    showToast('Speedrun Race Complete! Stackly In-Situ Lakehouse finished 61x faster than Redshift.');
  }, 3400);
}

/* 13. PODCAST PLAYER CONTROLLER */
let isPodcastPlaying = true;
function togglePodcastPlay() {
  const vis = document.getElementById('podcastVisualizer');
  const btn = document.getElementById('podcastPlayBtn');
  isPodcastPlaying = !isPodcastPlaying;

  if (isPodcastPlaying) {
    if (vis) vis.classList.remove('paused');
    if (btn) btn.innerHTML = '⏸ Pause';
    showToast('Resumed "The Autonomous Data Leader" Ep. 48');
  } else {
    if (vis) vis.classList.add('paused');
    if (btn) btn.innerHTML = '▶ Play';
    showToast('Paused podcast playback.');
  }
}

/* 14. MOUSE SPOTLIGHT BENTO CARDS */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeArticleDrawer();
  });
}

/* 15. DASHBOARD & ROLE-BASED INTELLIGENCE ENGINE */
function initDashboard() {
  const roleSelect = document.getElementById('dashRoleSelectTop');
  const returnToSiteBtn = document.getElementById('dashReturnToSite');
  const dashSidebarToggle = document.getElementById('dashSidebarToggle');
  const sidebar = document.querySelector('.dash-sidebar');

  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      AppState.currentRole = e.target.value;
      renderDashboardForRole(AppState.currentRole);
      showToast(`Switched view to ${RoleProfiles[AppState.currentRole].title}`);
    });
  }

  if (returnToSiteBtn) {
    returnToSiteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });
  }

  if (dashSidebarToggle && sidebar) {
    dashSidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open-mobile');
    });
  }

  const queryBar = document.getElementById('dashQueryInput');
  const runQueryBtn = document.getElementById('dashRunQueryBtn');
  if (queryBar && runQueryBtn) {
    runQueryBtn.addEventListener('click', () => {
      const q = queryBar.value || "SELECT department, revenue FROM bi_mart LIMIT 5";
      showToast(`Query executed in 8.4ms: 5 records refreshed.`);
      queryBar.value = '';
    });
  }
}

function renderDashboardForRole(roleKey) {
  const profile = RoleProfiles[roleKey] || RoleProfiles.executive;
  
  const roleTitleEl = document.getElementById('dashCurrentRoleBadge');
  const userNameEl = document.getElementById('dashCurrentUserName');
  const userAvatarEl = document.getElementById('dashCurrentUserAvatar');
  const chartTitleEl = document.getElementById('dashMainChartTitle');
  const selectTop = document.getElementById('dashRoleSelectTop');

  if (roleTitleEl) roleTitleEl.textContent = profile.badge;
  if (userNameEl) userNameEl.textContent = profile.name;
  if (userAvatarEl) userAvatarEl.textContent = profile.avatar;
  if (chartTitleEl) chartTitleEl.textContent = profile.chartTitle;
  if (selectTop) selectTop.value = roleKey;

  const kpiContainer = document.getElementById('dashKpisContainer');
  if (kpiContainer) {
    kpiContainer.innerHTML = profile.kpis.map(kpi => `
      <div class="dash-kpi-card wobble-card hover-lift">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <span style="font-size:0.8rem; font-weight:700; color:#94A3B8; text-transform:uppercase;">${kpi.label}</span>
          <span class="pill-tag" style="background:${kpi.isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color:${kpi.isUp ? '#10B981' : '#EF4444'}; padding:3px 8px; font-size:0.75rem;">
            ${kpi.trend}
          </span>
        </div>
        <div style="font-family:var(--font-heading); font-size:2rem; font-weight:800; color:#FFFFFF; margin-bottom:4px;">
          ${kpi.val}
        </div>
        <div style="font-size:0.82rem; color:#64748B;">${kpi.sub}</div>
      </div>
    `).join('');
  }

  const tableHead = document.getElementById('dashTableHeaders');
  const tableBody = document.getElementById('dashTableRows');
  if (tableHead && tableBody) {
    tableHead.innerHTML = profile.tableHeaders.map(h => `<th>${h}</th>`).join('');
    tableBody.innerHTML = profile.tableRows.map(row => `
      <tr>
        ${row.map((cell, idx) => `
          <td style="${idx === 0 ? 'font-weight:700; color:#FFFFFF;' : ''}">${cell}</td>
        `).join('')}
      </tr>
    `).join('');
  }
}

/* 16. TOAST NOTIFICATION UTILITY */
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="radar-dot"></span>
    <span style="font-size:0.92rem; font-weight:600;">${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Enterprise Stage Blueprint Tab Switcher
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

// STACKLY ENTERPRISE PRELOADER CONTROLLER
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
  const duration = 650;

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

  setTimeout(function() {
    if (preloader && !preloader.classList.contains('preloader-hidden')) {
      preloader.classList.add('preloader-hidden');
      setTimeout(function() { preloader.style.display = 'none'; }, 550);
    }
  }, 1400);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initStacklyPreloader);
} else {
  window.initStacklyPreloader();
}

// Previous Page Tracker for 404 Go Back
(function() {
  const curHref = window.location.href;
  if (!curHref.includes('404.html')) {
    try {
      sessionStorage.setItem('stackly_previous_page', curHref);
    } catch(e) {}
  }
})();


