/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * EDITORIAL NGO PORTAL CONTROLLER (FULLY REACTIVE WITH STORE)
 */

let heroCurrentSlide = 0;
let heroSlideTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  renderAllSections();
  setupNavigation();

  if (localStorage.getItem('openAdmin') === 'true') {
    localStorage.removeItem('openAdmin');
    if (typeof toggleAdminView === 'function') {
      toggleAdminView(true);
    }
  }

  BHBStore.subscribe(() => {
    renderAllSections();
  });
});

// 1. Full Dynamic Hero Slider
function renderHeroSlider() {
  const sliderContainer = document.querySelector('.hero-slider-container');
  if (!sliderContainer) return;

  const slides = BHBStore.getHeroSlides();
  if (!slides || !slides.length) return;

  const slidesHtml = slides.map((s, idx) => `
    <div class="hero-slide ${idx === 0 ? 'active' : ''}">
      <div class="hero-slide-item">
        <img src="${s.image}" alt="${s.title}" class="hero-slide-bg">
        <div class="hero-slide-overlay"></div>
        <div class="container">
          <div class="hero-slide-content">
            <span class="section-label label-light">${s.label || 'Non-Governmental Organization'}</span>
            <h1>${s.title}</h1>
            <p class="lead">${s.lead}</p>
            <div class="hero-cta-group">
              <a href="${s.primaryCtaLink || 'work.html'}" class="btn btn-primary">${s.primaryCtaText || 'Explore Our Work →'}</a>
              <button class="btn btn-outline-white" onclick="openDonateModal()">Support Our Mission</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  sliderContainer.innerHTML = `
    ${slidesHtml}
    <div class="hero-slider-arrows">
      <button class="slider-arrow-btn" onclick="prevSlide()" aria-label="Previous Slide">‹</button>
      <button class="slider-arrow-btn" onclick="nextSlide()" aria-label="Next Slide">›</button>
    </div>
    <div class="hero-slider-dots" id="heroSliderDots"></div>
  `;

  initHeroSlider();
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroSliderDots');
  if (!slides.length) return;

  heroCurrentSlide = 0;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  startHeroAutoPlay();

  const sliderContainer = document.querySelector('.hero-slider-container');
  if (sliderContainer) {
    sliderContainer.removeEventListener('mouseenter', stopHeroAutoPlay);
    sliderContainer.removeEventListener('mouseleave', startHeroAutoPlay);
    sliderContainer.addEventListener('mouseenter', stopHeroAutoPlay);
    sliderContainer.addEventListener('mouseleave', startHeroAutoPlay);
  }
}

function startHeroAutoPlay() {
  stopHeroAutoPlay();
  heroSlideTimer = setInterval(() => {
    nextSlide();
  }, 5500);
}

function stopHeroAutoPlay() {
  if (heroSlideTimer) clearInterval(heroSlideTimer);
}

window.goToSlide = function(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  heroCurrentSlide = (index + slides.length) % slides.length;
  slides[heroCurrentSlide].classList.add('active');
  if (dots[heroCurrentSlide]) dots[heroCurrentSlide].classList.add('active');
};

window.nextSlide = function() {
  goToSlide(heroCurrentSlide + 1);
};

window.prevSlide = function() {
  goToSlide(heroCurrentSlide - 1);
};

// 2. Render All Dynamic Sections
function renderAllSections() {
  renderHeroSlider();
  renderFocusAreas();
  renderProjects();
  renderGallery();
  renderStoriesAndNews();
  renderTeam();
  renderPartners();
  renderSettingsMetadata();
}

// 3. Navigation & Mobile Drawer
function setupNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileMenuDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => drawer.classList.toggle('open'));
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('open'));
    });
  }
}

// 4. Focus Areas
function renderFocusAreas() {
  const container = document.getElementById('focusAreasGrid');
  if (!container) return;

  const areas = BHBStore.getFocusAreas();
  container.innerHTML = areas.map(a => `
    <div class="focus-area-item">
      <img src="${a.image}" alt="${a.title}" class="focus-area-thumb">
      <h3>${a.title}</h3>
      <p>${a.summary}</p>
    </div>
  `).join('');
}

// 5. Projects & Programs
function renderProjects() {
  const featuredContainer = document.getElementById('projectFeaturedContainer');
  const secondaryContainer = document.getElementById('projectSecondaryGrid');

  const projects = BHBStore.getProjects();
  const featured = projects.find(p => p.featured) || projects[0];
  const secondaries = projects.filter(p => !featured || p.id !== featured.id);

  if (featuredContainer && featured) {
    featuredContainer.innerHTML = `
      <div class="project-featured-card">
        <img src="${featured.image}" alt="${featured.title}" class="project-featured-image">
        <div class="project-featured-body">
          <div>
            <span class="project-category-tag">Featured Initiative · ${featured.category}</span>
            <h3>${featured.title}</h3>
            <p style="color: var(--text-body); margin-bottom: 20px; font-size: 1.05rem;">${featured.description}</p>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;"><b>Location:</b> ${featured.location} &nbsp;|&nbsp; <b>Impact:</b> ${featured.beneficiaries}</p>
          </div>
          <div>
            <button class="btn btn-navy btn-sm" onclick="openProjectDetailsModal('${featured.id}')">View Project Details →</button>
          </div>
        </div>
      </div>
    `;
  }

  if (secondaryContainer) {
    secondaryContainer.innerHTML = secondaries.map(p => `
      <div class="project-item">
        <img src="${p.image}" alt="${p.title}" class="project-item-thumb">
        <div class="project-item-content">
          <div>
            <span class="project-category-tag">${p.category}</span>
            <h4>${p.title}</h4>
            <p>${p.description.substring(0, 130)}...</p>
          </div>
          <div>
            <button class="btn btn-outline btn-sm" onclick="openProjectDetailsModal('${p.id}')" style="width: 100%;">View Project →</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// 6. Photo Gallery
function renderGallery() {
  const container = document.getElementById('galleryEditorialGrid');
  if (!container) return;

  const items = BHBStore.getGallery();
  container.innerHTML = items.map(g => `
    <div class="gallery-photo-card" onclick="openGalleryModal('${g.id}')">
      <img src="${g.image}" alt="${g.title}" class="gallery-photo-img">
      <div class="gallery-photo-caption">
        <b>${g.title}</b>
        <span>${g.location} · ${g.category}</span>
      </div>
    </div>
  `).join('');
}

// 7. Stories & News
function renderStoriesAndNews() {
  const leadContainer = document.getElementById('newsLeadContainer');
  const sideContainer = document.getElementById('newsSideList');

  const posts = BHBStore.getPosts();
  const stories = BHBStore.getStories();

  const lead = posts[0] || {
    id: "post-1",
    title: "Breaking Barriers: How 10 Young Girls with Disabilities Mastered Coding in Kano",
    category: "Program Highlights",
    date: "August 18, 2026",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Inside the landmark Holiday Digital Skills Boot Camp funded directly by BHB Foundation in collaboration with The Ability First Tech Hub."
  };

  if (leadContainer) {
    leadContainer.innerHTML = `
      <div class="news-lead-article" onclick="openStoryModal('lead', '${lead.id}')" style="cursor: pointer;">
        <img src="${lead.image}" alt="${lead.title}" class="news-lead-image">
        <span class="section-label">${lead.category} · ${lead.date}</span>
        <h3>${lead.title}</h3>
        <p style="font-size: 1.05rem; color: var(--text-body);">${lead.excerpt}</p>
        <div style="margin-top: 14px;">
          <span style="color: var(--blue); font-weight: 600; font-size: 0.95rem;">Read full dispatch →</span>
        </div>
      </div>
    `;
  }

  if (sideContainer) {
    sideContainer.innerHTML = stories.map(s => `
      <div class="news-side-item" onclick="openStoryModal('story', '${s.id}')">
        <div class="news-meta">${s.category} · Community Case Study</div>
        <h4>${s.title}</h4>
        <p style="font-size: 0.92rem; color: var(--text-muted);">${s.summary}</p>
      </div>
    `).join('');
  }
}

// 8. Team
function renderTeam() {
  const container = document.getElementById('teamEditorialGrid');
  if (!container) return;

  const team = BHBStore.getTeam();
  container.innerHTML = team.map(m => `
    <div class="team-member-item">
      <img src="${m.image}" alt="${m.name}" class="team-member-photo">
      <h3>${m.name}</h3>
      <div class="team-member-role">${m.position}</div>
      <p class="team-member-bio">${m.bio}</p>
    </div>
  `).join('');
}

// 9. Partners
function renderPartners() {
  const container = document.getElementById('partnersStrip');
  if (!container) return;

  const partners = BHBStore.getPartners();
  container.innerHTML = partners.map(p => `
    <div class="partner-logo-item">
      <span>${p.name}</span>
    </div>
  `).join('');
}

// 10. Settings & Metadata
function renderSettingsMetadata() {
  const settings = BHBStore.getSettings();
  if (!settings) return;

  document.querySelectorAll('[data-bind="cacNumber"]').forEach(el => {
    el.textContent = settings.cacNumber;
  });
  document.querySelectorAll('[data-bind="officeAddress"]').forEach(el => {
    el.textContent = settings.officeAddress;
  });
  document.querySelectorAll('[data-bind="phone"]').forEach(el => {
    el.textContent = settings.phone;
  });
  document.querySelectorAll('[data-bind="email"]').forEach(el => {
    el.textContent = settings.email;
  });
}

// Modals
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

// Project Details Modal
window.openProjectDetailsModal = function(projId) {
  const proj = BHBStore.getProjects().find(p => p.id === projId);
  if (!proj) return;

  const content = document.getElementById('genericModalContent');
  if (content) {
    content.innerHTML = `
      <div style="padding: 36px;">
        <span class="section-label">${proj.category} · ${proj.location}</span>
        <h2 style="font-size: 1.8rem; color: var(--navy); margin: 8px 0 16px;">${proj.title}</h2>
        <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 320px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 20px;">
        
        <h4 style="margin-bottom: 8px;">Program Overview</h4>
        <p style="margin-bottom: 20px;">${proj.description}</p>

        <h4 style="margin-bottom: 8px;">Key Milestones &amp; Outcomes</h4>
        <ul style="padding-left: 20px; margin-bottom: 28px; color: var(--text-body);">
          ${(proj.milestones || []).map(m => `<li style="margin-bottom: 6px;">${m}</li>`).join('')}
        </ul>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 20px;">
          <span style="font-size: 0.9rem; color: var(--text-muted);">Status: <b>${proj.status}</b> | Beneficiaries: <b>${proj.beneficiaries}</b></span>
          <button class="btn btn-navy btn-sm" onclick="openDonateModal()">Support This Initiative →</button>
        </div>
      </div>
    `;
  }
  openModal('genericModal');
};

// Story & News Reader Modal
window.openStoryModal = function(type, id) {
  let title = '', category = '', date = '', image = '', body = '';

  if (type === 'lead') {
    const p = BHBStore.getPosts().find(post => post.id === id) || BHBStore.getPosts()[0];
    title = p.title;
    category = p.category;
    date = p.date;
    image = p.image;
    body = p.content || p.excerpt;
  } else {
    const s = BHBStore.getStories().find(story => story.id === id) || BHBStore.getStories()[0];
    title = s.title;
    category = s.category;
    date = "Field Documentation";
    image = s.image;
    body = s.content || s.summary;
  }

  const content = document.getElementById('genericModalContent');
  if (content) {
    content.innerHTML = `
      <div style="padding: 36px;">
        <span class="section-label">${category} · ${date}</span>
        <h2 style="font-size: 1.8rem; color: var(--navy); margin: 8px 0 16px;">${title}</h2>
        <img src="${image}" alt="${title}" style="width: 100%; height: 320px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 20px;">
        <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text-body); white-space: pre-line;">
          ${body}
        </div>
        <div style="margin-top: 28px; text-align: right;">
          <button class="btn btn-outline btn-sm" onclick="closeModal('genericModal')">Close</button>
        </div>
      </div>
    `;
  }
  openModal('genericModal');
};

// Gallery Modal
window.openGalleryModal = function(galId) {
  const item = BHBStore.getGallery().find(g => g.id === galId);
  if (!item) return;

  const content = document.getElementById('genericModalContent');
  if (content) {
    content.innerHTML = `
      <div style="padding: 24px;">
        <img src="${item.image}" alt="${item.title}" style="width: 100%; max-height: 480px; object-fit: contain; border-radius: var(--radius-sm); margin-bottom: 16px;">
        <h3 style="color: var(--navy); margin-bottom: 6px;">${item.title}</h3>
        <p style="color: var(--text-body); font-size: 0.95rem; margin-bottom: 4px;">${item.caption}</p>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${item.location} · ${item.category}</span>
      </div>
    `;
  }
  openModal('genericModal');
};

// Donate / Support Modal
window.openDonateModal = function() {
  const settings = BHBStore.getSettings();
  const content = document.getElementById('genericModalContent');

  if (content) {
    content.innerHTML = `
      <div style="padding: 36px;">
        <span class="section-label">Institutional &amp; Community Support</span>
        <h2 style="font-size: 1.7rem; color: var(--navy); margin: 6px 0 16px;">Support Our Mission</h2>
        <p style="color: var(--text-body); margin-bottom: 24px;">Your direct contribution funds verified community toolkits, mobile prenatal outreach, and disability digital inclusion programs.</p>

        <div style="background: var(--bg-off); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 20px; margin-bottom: 24px;">
          <h4 style="color: var(--navy); margin-bottom: 10px;">Official Zenith Bank Transfer:</h4>
          <p style="margin-bottom: 4px; font-size: 0.95rem;">Bank: <b>${settings.zenithBank.bankName}</b></p>
          <p style="margin-bottom: 4px; font-size: 0.95rem;">Account Name: <b>${settings.zenithBank.accountName}</b></p>
          <p style="font-size: 1.1rem; color: var(--blue); font-weight: 700;">Account Number: <b>${settings.zenithBank.accountNumber}</b></p>
        </div>

        <form onsubmit="handleDonationSubmission(event)">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name / Organisation</label>
              <input type="text" id="directDonorName" required placeholder="e.g. Alhaji Mustapha Bello">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="directDonorEmail" required placeholder="name@email.com">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Designated Program</label>
              <select id="directDonorProgram">
                <option>General Community Fund</option>
                <option>Disability Digital Skills Boot Camp</option>
                <option>Mobile Maternal & Primary Health Outreach</option>
                <option>Women Agro-Enterprise Seed Fund</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount (₦ NGN)</label>
              <input type="number" id="directDonorAmount" value="50000" required>
            </div>
          </div>
          <button type="submit" class="btn btn-navy" style="width: 100%; padding: 14px; margin-top: 10px;">Confirm &amp; Register Contribution →</button>
        </form>
      </div>
    `;
  }
  openModal('genericModal');
};

window.handleDonationSubmission = function(e) {
  e.preventDefault();
  const name = document.getElementById('directDonorName').value;
  const email = document.getElementById('directDonorEmail').value;
  const project = document.getElementById('directDonorProgram').value;
  const amount = parseFloat(document.getElementById('directDonorAmount').value) || 50000;

  BHBStore.addDonation({
    donorName: name,
    email,
    amount,
    currency: 'NGN',
    method: 'Bank Transfer',
    project,
    status: 'Completed'
  });

  closeModal('genericModal');
  showToast(`Thank you, ${name}! Your contribution of ₦${amount.toLocaleString()} has been recorded.`, 'success');
};

// Contact Form
window.submitContactForm = function(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="contact_name"]')?.value || '';
  const email = form.querySelector('[name="contact_email"]')?.value || '';
  const org = form.querySelector('[name="contact_org"]')?.value || 'Individual';
  const subject = form.querySelector('[name="contact_subject"]')?.value || 'General Inquiry';
  const message = form.querySelector('[name="contact_message"]')?.value || '';

  BHBStore.addInquiry({
    name,
    email,
    orgType: org,
    subject,
    message
  });

  showToast('Thank you for reaching out. The BHB Foundation team will respond promptly.', 'success');
  form.reset();
};
