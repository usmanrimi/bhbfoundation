/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * CENTRAL DATA STORE & LOCALSTORAGE PERSISTENCE ENGINE
 */

const BHB_STORAGE_KEY = 'BHB_FOUNDATION_STORE_V9';

const RAW_DEFAULT_STORE_DATA = (typeof window !== 'undefined' && window.BHB_SEED_DATA) ? window.BHB_SEED_DATA : {
  settings: {
    foundationName: "BHB Family Support and Development Foundation",
    shortName: "BHB Foundation",
    cacNumber: "9670692",
    establishedYear: "2026",
    officeAddress: "Office No. 66/67 Sulaiman Crescent, Nasarawa, Kano State, Nigeria",
    phone: "+234 201 454 5878",
    email: "info@bhbfoundation.com",
    workingHours: "Monday – Friday, 8:00 AM – 5:00 PM (WAT)",
    contactEmail: "contact@bhborganization.org",
    tagline: "Empowering Families. Strengthening Communities. Creating Sustainable Futures.",
    mission: "To support vulnerable and underserved individuals and communities by improving access to essential health and social services, education and economic opportunities, while promoting dignity, resilience, inclusion and self-reliance.",
    vision: "To build inclusive, resilient and empowered communities where every individual can live with dignity and realise their full potential.",
    aboutImage: "",
    communityCoDesignImage: "",
    primaryCurrency: "NGN",
    usdRate: 1550,
    zenithBank: {
      bankName: "Zenith Bank Plc",
      accountName: "BHB Family Support & Dev Foundation",
      accountNumber: "1224906781",
      sortCode: "057150013"
    }
  },
  heroSlides: [
    {
      id: "slide-1",
      label: "BHB Foundation Mandate",
      title: "Empowering Families. Building Resilient Communities.",
      lead: "We walk alongside individuals, families, and underserved communities to overcome barriers, restore dignity, and create sustainable futures across Northern Nigeria.",
      image: "",
      primaryCtaText: "Partner With Us →",
      primaryCtaLink: "contact.html",
      secondaryCtaText: "Explore Our Work",
      secondaryCtaLink: "what-we-do.html"
    },
    {
      id: "slide-2",
      label: "Sustainable Transformation",
      title: "Turning Vulnerability into Lasting Opportunity.",
      lead: "Equipping adolescent girls with disabilities, widows, and vulnerable youth with healthcare access, digital literacy, and economic self-reliance across Kano State.",
      image: "",
      primaryCtaText: "Partner With Us →",
      primaryCtaLink: "contact.html",
      secondaryCtaText: "Explore Our Programs",
      secondaryCtaLink: "what-we-do.html"
    }
  ],
  focusAreas: [],
  projects: [],
  posts: [],
  comments: [],
  team: [],
  partners: [],
  donations: [],
  volunteers: [],
  inquiries: []
};

const DEFAULT_STORE_DATA = (typeof window !== 'undefined' && window.BHB_SEED_DATA && window.BHB_SEED_DATA.settings) ? window.BHB_SEED_DATA : RAW_DEFAULT_STORE_DATA;

// High-Capacity IndexedDB Engine for Fail-Safe Persistent Storage
const BHB_IDB_NAME = 'BHBFoundationDB';
const BHB_IDB_STORE = 'keyval';
const BHB_IDB_DOC_KEY = 'bhb_master_state';

let bhbIDBInstance = null;

function getIDBConnection() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    if (bhbIDBInstance) return resolve(bhbIDBInstance);

    try {
      const request = indexedDB.open(BHB_IDB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(BHB_IDB_STORE)) {
          db.createObjectStore(BHB_IDB_STORE);
        }
      };
      request.onsuccess = (e) => {
        bhbIDBInstance = e.target.result;
        resolve(bhbIDBInstance);
      };
      request.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
}

function writeToIDB(data) {
  getIDBConnection().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(BHB_IDB_STORE, 'readwrite');
      tx.objectStore(BHB_IDB_STORE).put(data, BHB_IDB_DOC_KEY);
    } catch (err) {}
  });
}

function readFromIDB() {
  return new Promise((resolve) => {
    getIDBConnection().then((db) => {
      if (!db) return resolve(null);
      try {
        const tx = db.transaction(BHB_IDB_STORE, 'readonly');
        const req = tx.objectStore(BHB_IDB_STORE).get(BHB_IDB_DOC_KEY);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  });
}

class StoreEngine {
  constructor() {
    this.subscribers = [];
    this.data = this.load();

    if (typeof window !== 'undefined') {
      readFromIDB().then((idbData) => {
        if (idbData && typeof idbData === 'object' && idbData.settings) {
          this.data = idbData;
          this.notifySubscribersOnly();
        } else {
          writeToIDB(this.data);
        }
      });

      window.addEventListener('storage', (e) => {
        if (e.key === BHB_STORAGE_KEY && e.newValue) {
          try {
            this.data = JSON.parse(e.newValue);
            this.notifySubscribersOnly();
          } catch (err) {}
        }
      });
    }
  }

  load() {
    try {
      const stored = localStorage.getItem(BHB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof window !== 'undefined' && window.BHB_SEED_DATA && window.BHB_SEED_DATA.lastUpdated && (!parsed.lastUpdated || window.BHB_SEED_DATA.lastUpdated > parsed.lastUpdated)) {
          this.persist(window.BHB_SEED_DATA);
          return JSON.parse(JSON.stringify(window.BHB_SEED_DATA));
        }
        if (!parsed.settings) parsed.settings = DEFAULT_STORE_DATA.settings;
        parsed.settings.mission = DEFAULT_STORE_DATA.settings.mission;
        parsed.settings.officeAddress = DEFAULT_STORE_DATA.settings.officeAddress;
        if (!parsed.team || !parsed.team.length) parsed.team = DEFAULT_STORE_DATA.team;
        if (!parsed.heroSlides || !parsed.heroSlides.length) parsed.heroSlides = DEFAULT_STORE_DATA.heroSlides;
        if (!parsed.focusAreas || !parsed.focusAreas.length) parsed.focusAreas = DEFAULT_STORE_DATA.focusAreas;
        if (!parsed.projects || !parsed.projects.length) parsed.projects = DEFAULT_STORE_DATA.projects;
        if (!parsed.posts || !parsed.posts.length) parsed.posts = DEFAULT_STORE_DATA.posts;
        if (!parsed.donations || !parsed.donations.length) parsed.donations = DEFAULT_STORE_DATA.donations;
        if (!parsed.volunteers || !parsed.volunteers.length) parsed.volunteers = DEFAULT_STORE_DATA.volunteers;
        if (!parsed.inquiries || !parsed.inquiries.length) parsed.inquiries = DEFAULT_STORE_DATA.inquiries;
        return parsed;
      }
    } catch (e) {
      console.warn("Storage load fallback", e);
    }
    this.persist(DEFAULT_STORE_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
  }

  persist(dataToSave) {
    if (typeof window !== 'undefined') {
      writeToIDB(dataToSave);
    }

    try {
      localStorage.setItem(BHB_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("LocalStorage quota fallback", e);
    }
  }

  notify() {
    this.persist(this.data);
    this.notifySubscribersOnly();
  }

  notifySubscribersOnly() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.data);
      } catch (err) {
        console.error("Subscriber notification error", err);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bhb:store-updated', { detail: this.data }));
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Getters
  getSettings() { return this.data.settings || DEFAULT_STORE_DATA.settings; }
  getHeroSlides() { return this.data.heroSlides || []; }
  getFocusAreas() { return this.data.focusAreas || []; }
  getProjects() { return this.data.projects || []; }
  getPosts() { return this.data.posts || []; }
  getPostById(id) { return (this.data.posts || []).find(p => p.id === id); }
  getTeam(publishedOnly = false) {
    let list = this.data.team || [];
    if (publishedOnly) {
      list = list.filter(m => m.published !== false);
    }
    return list.slice().sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  }
  getPartners() { return this.data.partners || []; }
  getDonations() { return this.data.donations || []; }
  getVolunteers() { return this.data.volunteers || []; }
  getInquiries() { return this.data.inquiries || []; }
  getAllComments() { return this.data.comments || []; }
  getCommentsByPost(postId) {
    return (this.data.comments || []).filter(c => c.postId === postId && c.status === 'approved');
  }

  // Setters / Mutators
  saveSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.notify();
  }

  saveHeroSlide(slide) {
    if (!this.data.heroSlides) this.data.heroSlides = [];
    if (!slide.id) {
      slide.id = `slide-${Date.now()}`;
      this.data.heroSlides.push(slide);
    } else {
      const idx = this.data.heroSlides.findIndex(s => s.id === slide.id);
      if (idx !== -1) this.data.heroSlides[idx] = { ...this.data.heroSlides[idx], ...slide };
      else this.data.heroSlides.push(slide);
    }
    this.notify();
  }

  deleteHeroSlide(id) {
    this.data.heroSlides = (this.data.heroSlides || []).filter(s => s.id !== id);
    this.notify();
  }

  saveFocusArea(area) {
    if (!this.data.focusAreas) this.data.focusAreas = [];
    if (!area.id) {
      area.id = `focus-${Date.now()}`;
      this.data.focusAreas.push(area);
    } else {
      const idx = this.data.focusAreas.findIndex(a => a.id === area.id);
      if (idx !== -1) this.data.focusAreas[idx] = { ...this.data.focusAreas[idx], ...area };
      else this.data.focusAreas.push(area);
    }
    this.notify();
  }

  deleteFocusArea(id) {
    this.data.focusAreas = (this.data.focusAreas || []).filter(a => a.id !== id);
    this.notify();
  }

  saveProject(project) {
    if (!this.data.projects) this.data.projects = [];
    if (!project.id) {
      project.id = `proj-${Date.now()}`;
      this.data.projects.push(project);
    } else {
      const idx = this.data.projects.findIndex(p => p.id === project.id);
      if (idx !== -1) this.data.projects[idx] = { ...this.data.projects[idx], ...project };
      else this.data.projects.push(project);
    }
    this.notify();
  }

  deleteProject(id) {
    this.data.projects = (this.data.projects || []).filter(p => p.id !== id);
    this.notify();
  }

  savePost(post) {
    if (!this.data.posts) this.data.posts = [];
    if (!post.id) {
      post.id = `post-${Date.now()}`;
      post.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      post.likes = 0;
      post.likedByUser = false;
      this.data.posts.unshift(post);
    } else {
      const idx = this.data.posts.findIndex(p => p.id === post.id);
      if (idx !== -1) this.data.posts[idx] = { ...this.data.posts[idx], ...post };
      else this.data.posts.unshift(post);
    }
    this.notify();
  }

  deletePost(id) {
    this.data.posts = (this.data.posts || []).filter(p => p.id !== id);
    this.data.comments = (this.data.comments || []).filter(c => c.postId !== id);
    this.notify();
  }

  likePost(postId) {
    const post = this.getPostById(postId);
    if (!post) return 0;

    if (!post.likedByUser) {
      post.likes = (post.likes || 0) + 1;
      post.likedByUser = true;
    } else {
      post.likes = Math.max(0, (post.likes || 1) - 1);
      post.likedByUser = false;
    }
    this.notify();
    return post.likes;
  }

  addComment(comment) {
    if (!this.data.comments) this.data.comments = [];
    const post = this.getPostById(comment.postId);
    const newComment = {
      id: `comm-${Date.now()}`,
      postId: comment.postId,
      postTitle: post ? post.title : 'Field Article',
      authorName: comment.authorName || 'Community Member',
      authorEmail: comment.authorEmail || '',
      content: comment.content || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'approved'
    };
    this.data.comments.unshift(newComment);
    this.notify();
    return newComment;
  }

  updateCommentStatus(commentId, newStatus) {
    const comm = (this.data.comments || []).find(c => c.id === commentId);
    if (comm) {
      comm.status = newStatus;
      this.notify();
    }
  }

  deleteComment(commentId) {
    this.data.comments = (this.data.comments || []).filter(c => c.id !== commentId);
    this.notify();
  }

  saveTeamMember(member) {
    if (!this.data.team) this.data.team = [];
    if (member.published === undefined) member.published = true;
    if (member.order === undefined || member.order === null || isNaN(member.order)) {
      member.order = this.data.team.length + 1;
    } else {
      member.order = Number(member.order);
    }
    if (!member.id) {
      member.id = `team-${Date.now()}`;
      this.data.team.push(member);
    } else {
      const idx = this.data.team.findIndex(t => t.id === member.id);
      if (idx !== -1) this.data.team[idx] = { ...this.data.team[idx], ...member };
      else this.data.team.push(member);
    }
    this.notify();
  }

  toggleTeamMemberPublish(id) {
    const member = (this.data.team || []).find(t => t.id === id);
    if (member) {
      member.published = member.published === false ? true : false;
      this.notify();
      return member.published;
    }
    return false;
  }

  deleteTeamMember(id) {
    this.data.team = (this.data.team || []).filter(t => t.id !== id);
    this.notify();
  }

  addDonation(donation) {
    if (!this.data.donations) this.data.donations = [];
    const newDonation = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Completed',
      ...donation
    };
    this.data.donations.unshift(newDonation);
    this.notify();
    return newDonation;
  }

  addVolunteer(volunteer) {
    if (!this.data.volunteers) this.data.volunteers = [];
    const newVol = {
      id: `vol-${Date.now()}`,
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      ...volunteer
    };
    this.data.volunteers.unshift(newVol);
    this.notify();
    return newVol;
  }

  updateVolunteerStatus(id, status) {
    const vol = (this.data.volunteers || []).find(v => v.id === id);
    if (vol) {
      vol.status = status;
      this.notify();
    }
  }

  addInquiry(inquiry) {
    if (!this.data.inquiries) this.data.inquiries = [];
    const newInq = {
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Unread',
      ...inquiry
    };
    this.data.inquiries.unshift(newInq);
    this.notify();
    return newInq;
  }

  updateInquiryStatus(id, status) {
    const inq = (this.data.inquiries || []).find(i => i.id === id);
    if (inq) {
      inq.status = status;
      this.notify();
    }
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings && parsed.projects) {
        this.data = parsed;
        this.notify();
        return true;
      }
    } catch (e) {
      console.error("Invalid database JSON", e);
    }
    return false;
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
    this.notify();
  }
}

// Global Singleton Instance
window.BHBStore = new StoreEngine();

// =========================================================================
// SYNCHRONOUS EDITORIAL HTML RENDERERS (IMAGE-FREE & CARD-REDUCED)
// =========================================================================

// 1. Editorial Hero Banner
window.renderHeroSliderHTML = function() {
  if (typeof BHBStore === 'undefined') return '';
  const slides = BHBStore.getHeroSlides();
  if (!slides || !slides.length) return '';
  const s = slides[0];

  return `
    <div class="hero-editorial-content">
      <span class="section-tag light">${s.label || 'BHB Foundation'}</span>
      <h1>${s.title}</h1>
      <p class="lead">${s.lead}</p>
      <div class="hero-cta-group">
        <a href="${s.primaryCtaLink || 'contact.html'}" class="btn btn-primary">${s.primaryCtaText || 'Partner With Us →'}</a>
        <a href="${s.secondaryCtaLink || 'what-we-do.html'}" class="btn btn-outline-white">${s.secondaryCtaText || 'Explore Our Work'}</a>
      </div>
    </div>
  `;
};

// 2. The 6 Pillars Landscape / Editorial List (With Rhythmic Alternating Backgrounds & Bottom Aligned CTA)
window.renderFocusAreasHTML = function() {
  if (typeof BHBStore === 'undefined') return '';
  const areas = BHBStore.getFocusAreas();
  if (!areas || !areas.length) return '';

  return areas.map((a, idx) => {
    const isBrand = (idx % 2 === 1);
    const rowClass = isBrand ? 'pillar-row-brand' : 'pillar-row-light';
    const btnClass = isBrand ? 'btn-pillar-white' : 'btn-pillar-brand';

    return `
      <div class="pillar-landscape-row ${rowClass} interactive-lift">
        <div class="pillar-row-header">
          <div class="pillar-num">0${idx + 1}</div>
          <div class="pillar-title-col">
            <h3>${a.title}</h3>
          </div>
          <div class="pillar-desc-col">
            <p>${a.summary}</p>
          </div>
        </div>
        <div class="pillar-bottom-bar">
          <a href="projects.html" class="${btnClass}">Explore Initiatives →</a>
        </div>
      </div>
    `;
  }).join('');
};

// 2b. Sustainable Development Goals (SDGs) Interactive Section Renderer
window.renderSDGsSectionHTML = function() {
  const sdgData = [
    { num: '01', code: 'sdg-1', name: 'No Poverty', pillar: 'Women & Youth Livelihoods' },
    { num: '02', code: 'sdg-2', name: 'Zero Hunger', pillar: 'Agro-Seeds & Child Nutrition' },
    { num: '03', code: 'sdg-3', name: 'Good Health & Well-being', pillar: 'Hygiene & Primary Care' },
    { num: '04', code: 'sdg-4', name: 'Quality Education', pillar: 'Inclusive Computing Grants' },
    { num: '05', code: 'sdg-5', name: 'Gender Equality', pillar: 'Menstrual Health & Dignity' },
    { num: '06', code: 'sdg-6', name: 'Clean Water & Sanitation', pillar: 'Solar Boreholes & WASH' },
    { num: '08', code: 'sdg-8', name: 'Decent Work & Growth', pillar: 'Vocational Apprenticeships' },
    { num: '10', code: 'sdg-10', name: 'Reduced Inequalities', pillar: 'Disability Tech Inclusion' },
    { num: '17', code: 'sdg-17', name: 'Partnerships for Goals', pillar: 'Grassroots Coalitions' }
  ];

  return `
    <div class="sdg-modules-grid">
      ${sdgData.map(s => `
        <div class="sdg-module-card ${s.code}">
          <div class="sdg-num-tag">${s.num}</div>
          <div>
            <div class="sdg-name">${s.name}</div>
            <div class="sdg-bhb-pillar-note">${s.pillar}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

// 3. Projects Landscape Rows (Clean Horizontal Layout with Bottom CTA)
window.renderHomepageProjectsHTML = function() {
  if (typeof BHBStore === 'undefined') return '';
  const projects = BHBStore.getProjects().slice(0, 3);
  if (!projects || !projects.length) return '<div style="padding: 30px 0; color: var(--text-muted);">No active programs currently published.</div>';

  return projects.map(p => `
    <div class="project-landscape-row">
      <div class="project-row-main-grid">
        <div>
          <div class="project-meta-badges">
            <span class="badge-tag">${p.category}</span>
            <span class="badge-status-pill ${p.status ? p.status.toLowerCase() : 'ongoing'}">${p.status || 'Active'}</span>
          </div>
          <h3 class="project-landscape-title">${p.title}</h3>
          <p class="project-landscape-summary">${p.description}</p>
        </div>

        <div class="project-details-grid">
          <div class="project-detail-pill">
            <span class="meta-label">LOCATION</span>
            <span class="meta-value">${p.location}</span>
          </div>
          <div class="project-detail-pill">
            <span class="meta-label">REACH</span>
            <span class="meta-value">${p.beneficiaries}</span>
          </div>
          <div class="project-detail-pill">
            <span class="meta-label">TIMELINE</span>
            <span class="meta-value">${p.timeline || 'Active'}</span>
          </div>
        </div>
      </div>

      <div class="project-row-bottom-bar">
        <button class="btn btn-navy btn-sm" onclick="openProjectDetailsModal('${p.id}')">View Project Details →</button>
      </div>
    </div>
  `).join('');
};

window.renderProjectsLandscapeHTML = function(filteredProjects) {
  const projects = filteredProjects || (typeof BHBStore !== 'undefined' ? BHBStore.getProjects() : []);
  if (!projects || !projects.length) return '<div style="padding: 40px 0; color: var(--text-muted); text-align: center;">No initiatives match the selected filter.</div>';

  return projects.map(p => `
    <div class="project-landscape-row">
      <div class="project-row-main-grid">
        <div>
          <div class="project-meta-badges">
            <span class="badge-tag">${p.category}</span>
            <span class="badge-status-pill ${p.status ? p.status.toLowerCase() : 'ongoing'}">${p.status || 'Active'}</span>
          </div>
          <h3 class="project-landscape-title">${p.title}</h3>
          <p class="project-landscape-summary">${p.description}</p>
        </div>

        <div class="project-details-grid">
          <div class="project-detail-pill">
            <span class="meta-label">LOCATION</span>
            <span class="meta-value">${p.location}</span>
          </div>
          <div class="project-detail-pill">
            <span class="meta-label">REACH</span>
            <span class="meta-value">${p.beneficiaries}</span>
          </div>
          <div class="project-detail-pill">
            <span class="meta-label">TIMELINE</span>
            <span class="meta-value">${p.timeline || 'Active'}</span>
          </div>
        </div>
      </div>

      <div class="project-row-bottom-bar">
        <button class="btn btn-navy btn-sm" onclick="openProjectDetailsModal('${p.id}')">View Full Case Study →</button>
      </div>
    </div>
  `).join('');
};

// 4. Blog 3-Column Cards (Equal Height, Clean Typography & Bottom CTA)
window.renderHomeBlogGridHTML = function() {
  if (typeof BHBStore === 'undefined') return '';
  const posts = BHBStore.getPosts().slice(0, 3);
  if (!posts || !posts.length) return '<div style="grid-column: 1/-1; padding: 30px 0; color: var(--text-muted);">No dispatches published yet.</div>';

  return posts.map(p => `
    <div class="blog-card" onclick="openBlogPostReader('${p.id}')">
      <div>
        <div class="blog-card-header-bar">
          <span class="blog-card-tag">#${(p.category || 'update').toLowerCase().replace(/[^a-z0-9]/g, '')}</span>
          <span class="blog-card-date">${p.date || 'Recent'}</span>
        </div>
        <h3 class="blog-card-title">${p.title}</h3>
        <p class="blog-card-excerpt">${p.excerpt || (p.content || '').substring(0, 110) + '...'}</p>
      </div>
      <div class="blog-card-footer">
        <span class="blog-card-link">Read full post →</span>
      </div>
    </div>
  `).join('');
};

// 5. Governance & Leadership Open Editorial Profile
window.renderChairmanSpotlightHTML = function() {
  if (typeof BHBStore === 'undefined') return '';
  const team = BHBStore.getTeam(true);
  const chairman = team.find(t => t.tier === 'Trustees' || t.id === 'team-1') || team[0];
  if (!chairman) return '';

  const initials = chairman.name ? chairman.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'BH';
  const avatarHTML = chairman.image
    ? `<img src="${chairman.image}" alt="${chairman.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-sm);">`
    : `<div class="leader-avatar-monogram">${initials}</div>`;

  return `
    <div class="leadership-open-profile">
      <div>
        ${avatarHTML}
      </div>
      <div class="leader-details">
        <span class="section-tag">Board of Trustees</span>
        <h3>${chairman.name}</h3>
        <div class="leader-role">${chairman.position}</div>
        <p class="leader-bio">${chairman.bio}</p>
      </div>
    </div>
  `;
};

window.renderTeamCardsHTML = function() {
  if (typeof BHBStore === 'undefined') return '';
  const team = BHBStore.getTeam(true);
  const chairman = team.find(t => t.tier === 'Trustees' || t.id === 'team-1') || team[0];
  const others = team.filter(t => !chairman || t.id !== chairman.id);

  return others.map(m => {
    const initials = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'BH';
    const avatarHTML = m.image
      ? `<img src="${m.image}" alt="${m.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-sm);">`
      : `<div class="leader-avatar-monogram" style="width: 100px; height: 100px; font-size: 1.8rem;">${initials}</div>`;

    return `
      <div class="leadership-open-profile">
        <div>
          ${avatarHTML}
        </div>
        <div class="leader-details">
          <span class="section-tag">${m.department || 'Executive Directorate'}</span>
          <h3>${m.name}</h3>
          <div class="leader-role">${m.position}</div>
          <p class="leader-bio">${m.bio}</p>
        </div>
      </div>
    `;
  }).join('');
};
