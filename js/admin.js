/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * SUPER ADMIN CONTROLLER (LIGHT PROFESSIONAL CORPORATE THEME)
 * EQUIPPED WITH LIVE ANALYTICS, BLOG CMS, COMMENTS MODERATION, AND IMAGE CROPPER
 */

let donationsChartInstance = null;
let beneficiariesChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initAdminNavigation();
  initAdminLiveClock();
  setupImageDropzones();
  renderAdminDashboard();

  BHBStore.subscribe(() => {
    renderAdminDashboard();
  });
});

// View Toggle
window.toggleAdminView = function(showAdmin) {
  const publicView = document.getElementById('publicPortalView');
  const adminView = document.getElementById('adminDashboardView');
  
  if (showAdmin) {
    if (publicView) publicView.style.display = 'none';
    if (adminView) {
      adminView.style.display = 'block';
      renderAdminDashboard();
      setTimeout(renderAdminCharts, 100);
    }
    window.scrollTo(0, 0);
  } else {
    if (adminView) adminView.style.display = 'none';
    if (publicView) publicView.style.display = 'block';
    if (typeof renderAllSections === 'function') {
      renderAllSections();
    }
    window.scrollTo(0, 0);
  }
};

// Top Live Clock
function initAdminLiveClock() {
  const clock = document.getElementById('adminLiveClock');
  if (!clock) return;

  function update() {
    const now = new Date();
    clock.textContent = `${now.toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos', hour12: true })} WAT`;
  }
  update();
  setInterval(update, 1000);
}

// Admin Navigation Tabs
function initAdminNavigation() {
  const navBtns = document.querySelectorAll('.admin-nav-item button');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-admin-tab');
      if (!tabId) return;

      document.querySelectorAll('.admin-nav-item').forEach(li => li.classList.remove('active'));
      btn.closest('.admin-nav-item').classList.add('active');

      document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));
      const targetPane = document.getElementById(`adminTab-${tabId}`);
      if (targetPane) targetPane.classList.add('active');

      const titleEl = document.getElementById('adminCurrentTabTitle');
      if (titleEl) {
        titleEl.textContent = btn.innerText.replace(/[^\w\s&]/gi, '').trim() + ' Management';
      }

      if (tabId === 'overview') {
        setTimeout(renderAdminCharts, 80);
      }
    });
  });
}

// Drag & Drop Setup
function setupImageDropzones() {
  document.querySelectorAll('.admin-dropzone').forEach(zone => {
    ['dragenter', 'dragover'].forEach(eventName => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
      }, false);
    });

    zone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      const fileInput = zone.querySelector('input[type="file"]');
      if (files.length && fileInput) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event('change'));
      }
    }, false);
  });
}

// Global Toast Notifications
window.showToast = function(msg, type = 'info') {
  const toast = document.createElement('div');
  const bg = type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#2563EB';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${bg};
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
    z-index: 9999;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  toast.innerHTML = `<span>[${type.toUpperCase()}]</span> ${msg}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Main Dashboard Render
function renderAdminDashboard() {
  renderAdminOverviewMetrics();
  renderAdminCharts();
  renderAdminHeroSlidesTable();
  renderAdminProjectsTable();
  renderAdminBlogTable();
  renderAdminCommentsTable();
  renderAdminTeamTable();
  renderAdminPartnersTable();
  renderAdminDonationsTable();
  renderAdminVolunteersTable();
  renderAdminInquiriesTable();
  renderAdminSettingsForm();
}

// 1. Overview KPIs
function renderAdminOverviewMetrics() {
  const donations = BHBStore.getDonations();
  const projects = BHBStore.getProjects();
  const volunteers = BHBStore.getVolunteers();
  const inquiries = BHBStore.getInquiries();
  const comments = BHBStore.getAllComments();

  // Total funds mobilized
  let totalDonations = donations.reduce((sum, d) => {
    const amt = d.currency === 'USD' ? (d.amount * (BHBStore.getSettings().usdRate || 1550)) : (d.amount || 0);
    return sum + amt;
  }, 0);

  if (totalDonations === 0) {
    totalDonations = projects.reduce((sum, p) => sum + (p.raised || 0), 0);
  }

  const donEl = document.getElementById('kpiTotalDonations');
  if (donEl) donEl.textContent = `₦${totalDonations.toLocaleString()}`;

  // Active / Ongoing Programs
  const activeCount = projects.filter(p => p.status === 'Ongoing' || p.status === 'Active').length || projects.length;
  const projEl = document.getElementById('kpiActiveProjects');
  if (projEl) projEl.textContent = `${activeCount} Initiatives`;

  // Direct Beneficiaries
  const benEl = document.getElementById('kpiTotalBeneficiaries');
  if (benEl) benEl.textContent = "12,450+";

  // Pending volunteers
  const pendingVol = volunteers.filter(v => v.status === 'Pending').length;
  const volEl = document.getElementById('kpiPendingVolunteers');
  if (volEl) volEl.textContent = pendingVol;

  // Pending inquiries
  const pendingInq = inquiries.filter(i => i.status === 'Unread').length;
  const inqEl = document.getElementById('kpiInquiries');
  if (inqEl) inqEl.textContent = pendingInq;

  // Sidebar counters
  const sideVol = document.getElementById('adminSidebarVolCount');
  if (sideVol) sideVol.textContent = pendingVol;

  const sideInq = document.getElementById('adminSidebarInqCount');
  if (sideInq) sideInq.textContent = pendingInq;

  const sideComm = document.getElementById('adminSidebarCommCount');
  if (sideComm) sideComm.textContent = comments.length;
}

// 2. Light Theme Analytics Charts (Live Synchronized)
function renderAdminCharts() {
  if (typeof Chart === 'undefined') return;

  const ctxDon = document.getElementById('adminDonationsChart') || document.getElementById('donationsChart');
  const ctxBen = document.getElementById('adminBeneficiariesChart') || document.getElementById('beneficiariesChart');

  const projects = BHBStore.getProjects();
  const donations = BHBStore.getDonations();

  if (ctxDon) {
    if (donationsChartInstance) {
      try { donationsChartInstance.destroy(); } catch (e) {}
    }

    donationsChartInstance = new Chart(ctxDon, {
      type: 'line',
      data: {
        labels: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
        datasets: [{
          label: 'Mobilized Community Funds (₦ Millions)',
          data: [2.5, 4.8, 8.2, 13.0, 18.5, 24.1],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.09)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Funds: ₦${ctx.parsed.y}M NGN`
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#F1F5F9' },
            ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans', weight: '600' } }
          },
          y: {
            grid: { color: '#F1F5F9' },
            ticks: {
              color: '#64748B',
              font: { family: 'Plus Jakarta Sans' },
              callback: (val) => `₦${val}M`
            }
          }
        }
      }
    });
  }

  if (ctxBen) {
    if (beneficiariesChartInstance) {
      try { beneficiariesChartInstance.destroy(); } catch (e) {}
    }

    const projList = projects.slice(0, 5);
    const labels = projList.map(p => p.title.length > 22 ? p.title.substring(0, 20) + '...' : p.title);
    const dataVals = [250, 1450, 220, 350, 2500];

    beneficiariesChartInstance = new Chart(ctxBen, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['Digital Boot Camp', 'Mobile Health', 'Agro-Seeds', 'Youth Mentorship', 'Solar Borehole'],
        datasets: [{
          label: 'Direct Beneficiaries',
          data: dataVals,
          backgroundColor: ['#1E3A8A', '#0284C7', '#0D9488', '#F59E0B', '#6366F1'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' } }
          },
          y: {
            grid: { color: '#F1F5F9' },
            ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans' } }
          }
        }
      }
    });
  }
}

// 3. Hero Carousel Slides CRUD
function renderAdminHeroSlidesTable() {
  const tbody = document.getElementById('adminHeroSlidesTableBody');
  if (!tbody) return;

  const slides = BHBStore.getHeroSlides();
  tbody.innerHTML = slides.map(s => `
    <tr>
      <td>
        <img src="${s.image}" style="width: 70px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid #CBD5E1;">
      </td>
      <td>
        <b style="color: #0F172A;">${s.title}</b>
        <div style="font-size: 0.78rem; color: #64748B;">${s.label || 'Standard Slide'}</div>
      </td>
      <td style="max-width: 260px; font-size: 0.85rem; color: #475569;">${s.lead}</td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm" onclick="editHeroSlideModal('${s.id}')">Edit</button>
          <button class="btn-icon-sm danger" onclick="BHBStore.deleteHeroSlide('${s.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.openNewHeroSlideModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Hero Carousel Slide';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveHeroSlide(event)">
        <input type="hidden" name="slide_id" value="">
        <input type="hidden" name="slide_image" id="heroSlideImageHidden" value="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80">
        
        <div class="form-group">
          <label>Eyebrow Label (Optional)</label>
          <input type="text" name="slide_label" placeholder="e.g. Grassroots Empowerment">
        </div>

        <div class="form-group">
          <label>Main Headline *</label>
          <input type="text" name="slide_title" placeholder="e.g. Empowering Kano Communities" required>
        </div>

        <div class="form-group">
          <label>Lead Paragraph *</label>
          <textarea name="slide_lead" rows="3" placeholder="Brief description visible on slide" required></textarea>
        </div>

        <div class="form-group">
          <label>Slide Background Photo (Interactive Cropper)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'heroSlideImgPreview', 'slide_image', '16:9')" style="margin-bottom: 8px;">
            <img id="heroSlideImgPreview" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save Slide to Homepage</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editHeroSlideModal = function(id) {
  const slide = BHBStore.getHeroSlides().find(s => s.id === id);
  if (!slide) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Hero Slide';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveHeroSlide(event)">
        <input type="hidden" name="slide_id" value="${slide.id}">
        <input type="hidden" name="slide_image" id="heroSlideImageHidden" value="${slide.image}">
        
        <div class="form-group">
          <label>Eyebrow Label (Optional)</label>
          <input type="text" name="slide_label" value="${slide.label || ''}">
        </div>

        <div class="form-group">
          <label>Main Headline *</label>
          <input type="text" name="slide_title" value="${slide.title}" required>
        </div>

        <div class="form-group">
          <label>Lead Paragraph *</label>
          <textarea name="slide_lead" rows="3" required>${slide.lead}</textarea>
        </div>

        <div class="form-group">
          <label>Slide Background Photo (Interactive Cropper)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'heroSlideImgPreview', 'slide_image', '16:9')" style="margin-bottom: 8px;">
            <img id="heroSlideImgPreview" src="${slide.image}" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Update Slide</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSaveHeroSlide = function(e) {
  e.preventDefault();
  const form = e.target;
  const slide = {
    id: form.slide_id.value || undefined,
    title: form.slide_title.value,
    label: form.slide_label.value,
    lead: form.slide_lead.value,
    image: form.slide_image.value,
    primaryCtaText: "Explore Our Work →",
    primaryCtaLink: "work.html"
  };
  BHBStore.saveHeroSlide(slide);
  closeModal('adminCrudModal');
  showToast('Hero slide saved and synced live to public website!', 'success');
};

// 4. Projects CRUD
function renderAdminProjectsTable() {
  const tbody = document.getElementById('adminProjectsTableBody');
  if (!tbody) return;

  const projects = BHBStore.getProjects();
  tbody.innerHTML = projects.map(p => {
    const statusClass = p.status === 'Ongoing' ? 'success' : (p.status === 'Completed' ? 'info' : 'pending');
    return `
      <tr>
        <td>
          <div style="display: flex; gap: 12px; align-items: center;">
            <img src="${p.image}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid #E2E8F0;">
            <div>
              <b style="color: #0F172A;">${p.title}</b>
              <div style="font-size: 0.78rem; color: #64748B;">${p.location}</div>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td>₦${(p.raised || 0).toLocaleString()} / ₦${(p.goal || 0).toLocaleString()}</td>
        <td>${p.beneficiaries}</td>
        <td><span class="status-pill ${statusClass}">${p.status}</span></td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="editProjectModal('${p.id}')">Edit</button>
            <button class="btn-icon-sm danger" onclick="BHBStore.deleteProject('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openNewProjectModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Launch New Project';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveProject(event)">
        <input type="hidden" name="proj_id" value="">
        <input type="hidden" name="proj_image" id="projImageHidden" value="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80">
        
        <div class="form-group">
          <label>Project Title *</label>
          <input type="text" name="proj_title" required placeholder="e.g. Maternal Mobile Clinic Expansion">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category *</label>
            <select name="proj_category" required>
              <option value="Digital Inclusion">Digital Inclusion</option>
              <option value="Community Health">Community Health</option>
              <option value="Women Livelihoods">Women Livelihoods</option>
              <option value="Youth Mentorship">Youth Mentorship</option>
              <option value="WASH & Hygiene">WASH & Hygiene</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status *</label>
            <select name="proj_status" required>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Location / LGA *</label>
            <input type="text" name="proj_location" required placeholder="Nasarawa LGA, Kano">
          </div>
          <div class="form-group">
            <label>Direct Beneficiary Reach *</label>
            <input type="text" name="proj_beneficiaries" required placeholder="e.g. 500 Mothers & Children">
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Funding Goal (₦ NGN)</label>
            <input type="number" name="proj_goal" value="5000000">
          </div>
          <div class="form-group">
            <label>Funds Raised (₦ NGN)</label>
            <input type="number" name="proj_raised" value="3500000">
          </div>
        </div>

        <div class="form-group">
          <label>Project Description *</label>
          <textarea name="proj_desc" rows="3" required placeholder="Detailed project summary"></textarea>
        </div>

        <div class="form-group">
          <label>Project Banner Photo (Interactive Cropper)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'projImgPreview', 'proj_image', '16:9')" style="margin-bottom: 8px;">
            <img id="projImgPreview" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save Project</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editProjectModal = function(id) {
  const proj = BHBStore.getProjects().find(p => p.id === id);
  if (!proj) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Project';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveProject(event)">
        <input type="hidden" name="proj_id" value="${proj.id}">
        <input type="hidden" name="proj_image" id="projImageHidden" value="${proj.image}">
        
        <div class="form-group">
          <label>Project Title *</label>
          <input type="text" name="proj_title" value="${proj.title}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category *</label>
            <select name="proj_category" required>
              <option value="Digital Inclusion" ${proj.category === 'Digital Inclusion' ? 'selected' : ''}>Digital Inclusion</option>
              <option value="Community Health" ${proj.category === 'Community Health' ? 'selected' : ''}>Community Health</option>
              <option value="Women Livelihoods" ${proj.category === 'Women Livelihoods' ? 'selected' : ''}>Women Livelihoods</option>
              <option value="Youth Mentorship" ${proj.category === 'Youth Mentorship' ? 'selected' : ''}>Youth Mentorship</option>
              <option value="WASH & Hygiene" ${proj.category === 'WASH & Hygiene' ? 'selected' : ''}>WASH & Hygiene</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status *</label>
            <select name="proj_status" required>
              <option value="Ongoing" ${proj.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
              <option value="Completed" ${proj.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Upcoming" ${proj.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
            </select>
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Location / LGA *</label>
            <input type="text" name="proj_location" value="${proj.location}" required>
          </div>
          <div class="form-group">
            <label>Direct Beneficiary Reach *</label>
            <input type="text" name="proj_beneficiaries" value="${proj.beneficiaries}" required>
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Funding Goal (₦ NGN)</label>
            <input type="number" name="proj_goal" value="${proj.goal || 0}">
          </div>
          <div class="form-group">
            <label>Funds Raised (₦ NGN)</label>
            <input type="number" name="proj_raised" value="${proj.raised || 0}">
          </div>
        </div>

        <div class="form-group">
          <label>Project Description *</label>
          <textarea name="proj_desc" rows="3" required>${proj.description}</textarea>
        </div>

        <div class="form-group">
          <label>Project Banner Photo (Interactive Cropper)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'projImgPreview', 'proj_image', '16:9')" style="margin-bottom: 8px;">
            <img id="projImgPreview" src="${proj.image}" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Update Project</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSaveProject = function(e) {
  e.preventDefault();
  const form = e.target;
  const proj = {
    id: form.proj_id.value || undefined,
    title: form.proj_title.value,
    category: form.proj_category.value,
    status: form.proj_status.value,
    location: form.proj_location.value,
    beneficiaries: form.proj_beneficiaries.value,
    goal: parseFloat(form.proj_goal.value) || 0,
    raised: parseFloat(form.proj_raised.value) || 0,
    description: form.proj_desc.value,
    image: form.proj_image.value
  };
  BHBStore.saveProject(proj);
  closeModal('adminCrudModal');
  showToast('Project saved and updated live on public website!', 'success');
};

// 5. Blog Articles CMS (With Cropper, Likes & Comments Tracking)
function renderAdminBlogTable() {
  const tbody = document.getElementById('adminBlogTableBody');
  if (!tbody) return;

  const posts = BHBStore.getPosts();
  tbody.innerHTML = posts.map(p => {
    const comments = BHBStore.getCommentsByPost(p.id);
    return `
      <tr>
        <td>
          <img src="${p.image}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid #CBD5E1;">
        </td>
        <td>
          <b style="color: #0F172A;">${p.title}</b>
          <div style="font-size: 0.78rem; color: #64748B;">${p.date} · ${p.readTime || '4 min read'}</div>
        </td>
        <td><span class="project-category-tag" style="margin: 0;">${p.category}</span></td>
        <td>${p.author}</td>
        <td><b style="color: #DC2626;">Likes: ${p.likes || 0}</b></td>
        <td><b style="color: #2563EB;">Comments: ${comments.length}</b></td>
        <td><span class="status-pill success">Published</span></td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="editPostModal('${p.id}')">Edit</button>
            <button class="btn-icon-sm danger" onclick="deletePostAdmin('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.deletePostAdmin = function(id) {
  if (confirm('Are you sure you want to delete this article and its comments?')) {
    BHBStore.deletePost(id);
    showToast('Article deleted successfully!', 'info');
  }
};

window.openNewPostModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Write New Blog Article';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePost(event)">
        <input type="hidden" name="post_id" value="">
        <input type="hidden" name="post_image" id="postImageHidden" value="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80">
        
        <div class="form-group">
          <label>Article Title *</label>
          <input type="text" name="post_title" required placeholder="e.g. Empowering 500 Widows Through Agricultural Seed Capital">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category *</label>
            <select name="post_category" required>
              <option value="Digital Inclusion">Digital Inclusion</option>
              <option value="Health & Maternal Care">Health & Maternal Care</option>
              <option value="Community Stories">Community Stories</option>
              <option value="Press Releases">Press Releases</option>
              <option value="Livelihoods">Livelihoods</option>
              <option value="General">General</option>
            </select>
          </div>
          <div class="form-group">
            <label>Author Full Name *</label>
            <input type="text" name="post_author" required value="BHB Editorial Team">
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Author Role / Department</label>
            <input type="text" name="post_author_role" placeholder="e.g. Field Operations Specialist" value="Communications & Field Operations">
          </div>
          <div class="form-group">
            <label>Reading Time</label>
            <input type="text" name="post_read_time" placeholder="e.g. 4 min read" value="4 min read">
          </div>
        </div>

        <div class="form-group">
          <label>Article Tags (Comma separated)</label>
          <input type="text" name="post_tags" placeholder="e.g. Kano, Digital Skills, Inclusion, Youth">
        </div>

        <div class="form-group">
          <label>Lead Excerpt (Summary for Cards) *</label>
          <input type="text" name="post_excerpt" required placeholder="Brief 1-2 sentence overview shown in blog feeds">
        </div>

        <div class="form-group">
          <label>Full Article Content *</label>
          <textarea name="post_content" rows="6" required placeholder="Write the complete article dispatch here..."></textarea>
        </div>

        <div class="form-group">
          <label>Article Banner Photo (Crop before Uploading)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'postImgPreview', 'post_image', '16:9')" style="margin-bottom: 8px;">
            <img id="postImgPreview" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80" style="max-height: 140px; margin: 8px auto; border-radius: 4px; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" name="post_featured" id="postFeaturedCheck" style="width: auto;">
          <label for="postFeaturedCheck" style="margin: 0; cursor: pointer; font-weight: 600;">Set as Featured Lead Article</label>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Publish Article Live</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editPostModal = function(id) {
  const post = BHBStore.getPostById(id);
  if (!post) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Blog Article';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePost(event)">
        <input type="hidden" name="post_id" value="${post.id}">
        <input type="hidden" name="post_image" id="postImageHidden" value="${post.image}">
        
        <div class="form-group">
          <label>Article Title *</label>
          <input type="text" name="post_title" value="${post.title}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category *</label>
            <select name="post_category" required>
              <option value="Digital Inclusion" ${post.category === 'Digital Inclusion' ? 'selected' : ''}>Digital Inclusion</option>
              <option value="Health & Maternal Care" ${post.category === 'Health & Maternal Care' ? 'selected' : ''}>Health & Maternal Care</option>
              <option value="Community Stories" ${post.category === 'Community Stories' ? 'selected' : ''}>Community Stories</option>
              <option value="Press Releases" ${post.category === 'Press Releases' ? 'selected' : ''}>Press Releases</option>
              <option value="Livelihoods" ${post.category === 'Livelihoods' ? 'selected' : ''}>Livelihoods</option>
              <option value="General" ${post.category === 'General' ? 'selected' : ''}>General</option>
            </select>
          </div>
          <div class="form-group">
            <label>Author Full Name *</label>
            <input type="text" name="post_author" value="${post.author}" required>
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Author Role / Department</label>
            <input type="text" name="post_author_role" value="${post.authorRole || ''}">
          </div>
          <div class="form-group">
            <label>Reading Time</label>
            <input type="text" name="post_read_time" value="${post.readTime || '4 min read'}">
          </div>
        </div>

        <div class="form-group">
          <label>Article Tags (Comma separated)</label>
          <input type="text" name="post_tags" value="${(post.tags || []).join(', ')}">
        </div>

        <div class="form-group">
          <label>Lead Excerpt *</label>
          <input type="text" name="post_excerpt" value="${post.excerpt}" required>
        </div>

        <div class="form-group">
          <label>Full Article Content *</label>
          <textarea name="post_content" rows="6" required>${post.content || ''}</textarea>
        </div>

        <div class="form-group">
          <label>Article Banner Photo (Crop before Uploading)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'postImgPreview', 'post_image', '16:9')" style="margin-bottom: 8px;">
            <img id="postImgPreview" src="${post.image}" style="max-height: 140px; margin: 8px auto; border-radius: 4px; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" name="post_featured" id="postFeaturedCheck" ${post.featured ? 'checked' : ''} style="width: auto;">
          <label for="postFeaturedCheck" style="margin: 0; cursor: pointer; font-weight: 600;">Set as Featured Lead Article</label>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save &amp; Update Article</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSavePost = function(e) {
  e.preventDefault();
  const form = e.target;
  const tags = form.post_tags.value.split(',').map(t => t.trim()).filter(Boolean);

  const post = {
    id: form.post_id.value || undefined,
    title: form.post_title.value,
    category: form.post_category.value,
    author: form.post_author.value,
    authorRole: form.post_author_role.value,
    readTime: form.post_read_time.value,
    tags,
    excerpt: form.post_excerpt.value,
    content: form.post_content.value,
    image: form.post_image.value,
    featured: form.post_featured.checked,
    status: 'published'
  };

  BHBStore.savePost(post);
  closeModal('adminCrudModal');
  showToast('Blog article saved and synchronized live across public website!', 'success');
};

// 6. Comments Moderation Center
function renderAdminCommentsTable() {
  const tbody = document.getElementById('adminCommentsTableBody');
  if (!tbody) return;

  const comments = BHBStore.getAllComments();
  if (!comments.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748B; padding: 24px;">No visitor comments submitted yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = comments.map(c => `
    <tr>
      <td>
        <b style="color: #0F172A;">${c.authorName}</b>
      </td>
      <td style="font-size: 0.85rem; color: #475569;">${c.authorEmail}</td>
      <td style="max-width: 180px; font-size: 0.85rem;"><b style="color: #1E3A8A;">${c.postTitle}</b></td>
      <td style="max-width: 260px; font-size: 0.88rem; color: #334155;">${c.content}</td>
      <td style="font-size: 0.8rem; color: #64748B;">${c.date}</td>
      <td>
        <span class="status-pill ${c.status === 'approved' ? 'success' : 'danger'}">
          ${c.status}
        </span>
      </td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm" onclick="toggleCommentStatusAdmin('${c.id}', '${c.status}')" style="color: ${c.status === 'approved' ? '#B45309' : '#15803D'};">
            ${c.status === 'approved' ? 'Flag' : 'Approve'}
          </button>
          <button class="btn-icon-sm danger" onclick="deleteCommentAdmin('${c.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleCommentStatusAdmin = function(id, currentStatus) {
  const newStatus = currentStatus === 'approved' ? 'flagged' : 'approved';
  BHBStore.updateCommentStatus(id, newStatus);
  showToast(`Comment status updated to "${newStatus}"!`, 'success');
};

window.deleteCommentAdmin = function(id) {
  if (confirm('Delete this comment permanently?')) {
    BHBStore.deleteComment(id);
    showToast('Comment removed from moderation center.', 'info');
  }
};

// 7. Team CRUD (With Cropper for 1:1 Portraits)
function renderAdminTeamTable() {
  const tbody = document.getElementById('adminTeamTableBody');
  if (!tbody) return;

  const team = BHBStore.getTeam();
  tbody.innerHTML = team.map(m => `
    <tr>
      <td>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${m.image}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid #E2E8F0;">
          <b style="color: #0F172A;">${m.name}</b>
        </div>
      </td>
      <td>${m.position}</td>
      <td>${m.department}</td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm" onclick="editTeamModal('${m.id}')">Edit</button>
          <button class="btn-icon-sm danger" onclick="BHBStore.deleteTeamMember('${m.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.openNewTeamModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Team Member';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveTeam(event)">
        <input type="hidden" name="team_id" value="">
        <input type="hidden" name="team_image" id="teamImageHidden" value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80">
        
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" name="team_name" required placeholder="e.g. Dr. Aminu Kano">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Position / Role *</label>
            <input type="text" name="team_pos" required placeholder="Executive Director">
          </div>
          <div class="form-group">
            <label>Department *</label>
            <input type="text" name="team_dept" required placeholder="Executive Leadership">
          </div>
        </div>

        <div class="form-group">
          <label>Biography *</label>
          <textarea name="team_bio" rows="3" required placeholder="Short professional background"></textarea>
        </div>

        <div class="form-group">
          <label>Portrait Photo (Crop with 1:1 Portrait Tool)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'teamImgPreview', 'team_image', '1:1')" style="margin-bottom: 8px;">
            <img id="teamImgPreview" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" style="max-height: 100px; width: 100px; border-radius: 50%; object-fit: cover; margin: 8px auto; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save Member</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editTeamModal = function(id) {
  const member = BHBStore.getTeam().find(t => t.id === id);
  if (!member) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Team Member';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveTeam(event)">
        <input type="hidden" name="team_id" value="${member.id}">
        <input type="hidden" name="team_image" id="teamImageHidden" value="${member.image}">
        
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" name="team_name" value="${member.name}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Position / Role *</label>
            <input type="text" name="team_pos" value="${member.position}" required>
          </div>
          <div class="form-group">
            <label>Department *</label>
            <input type="text" name="team_dept" value="${member.department}" required>
          </div>
        </div>

        <div class="form-group">
          <label>Biography *</label>
          <textarea name="team_bio" rows="3" required>${member.bio}</textarea>
        </div>

        <div class="form-group">
          <label>Portrait Photo (Crop with 1:1 Portrait Tool)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'teamImgPreview', 'team_image', '1:1')" style="margin-bottom: 8px;">
            <img id="teamImgPreview" src="${member.image}" style="max-height: 100px; width: 100px; border-radius: 50%; object-fit: cover; margin: 8px auto; display: block; border: 1px solid #CBD5E1;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Update Member</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSaveTeam = function(e) {
  e.preventDefault();
  const form = e.target;
  const member = {
    id: form.team_id.value || undefined,
    name: form.team_name.value,
    position: form.team_pos.value,
    department: form.team_dept.value,
    bio: form.team_bio.value,
    image: form.team_image.value
  };
  BHBStore.saveTeamMember(member);
  closeModal('adminCrudModal');
  showToast('Team roster updated and synchronized live!', 'success');
};

// 8. Partners Manager
function renderAdminPartnersTable() {
  const tbody = document.getElementById('adminPartnersTableBody');
  if (!tbody) return;

  const partners = BHBStore.getPartners();
  tbody.innerHTML = partners.map(p => `
    <tr>
      <td><b style="color: #0F172A;">${p.name}</b></td>
      <td>${p.tier}</td>
      <td>${p.category}</td>
      <td><a href="${p.website}" target="_blank" style="color: #2563EB; text-decoration: underline;">${p.website}</a></td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm danger" onclick="BHBStore.deletePartner('${p.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.openNewPartnerModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Partner';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePartner(event)">
        <div class="form-group">
          <label>Organization Name *</label>
          <input type="text" name="part_name" required placeholder="e.g. Sahel Health Initiative">
        </div>
        <div class="form-group">
          <label>Tier *</label>
          <input type="text" name="part_tier" required placeholder="Programme Partner">
        </div>
        <div class="form-group">
          <label>Sector / Category *</label>
          <input type="text" name="part_cat" required placeholder="Health & Well-being">
        </div>
        <div class="form-group">
          <label>Website URL</label>
          <input type="url" name="part_web" required placeholder="https://organization.org">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save Partner</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSavePartner = function(e) {
  e.preventDefault();
  const form = e.target;
  BHBStore.savePartner({
    name: form.part_name.value,
    tier: form.part_tier.value,
    category: form.part_cat.value,
    website: form.part_web.value
  });
  closeModal('adminCrudModal');
  showToast('Partner added and synced live!', 'success');
};

// 9. Donations Ledger
function renderAdminDonationsTable() {
  const tbody = document.getElementById('adminDonationsTableBody');
  if (!tbody) return;

  const donations = BHBStore.getDonations();
  tbody.innerHTML = donations.map(d => `
    <tr>
      <td style="font-family: var(--font-mono); font-size: 0.8rem; color: #64748B;">#${d.id}</td>
      <td>
        <b style="color: #0F172A;">${d.donorName}</b>
        <div style="font-size: 0.78rem; color: #64748B;">${d.email}</div>
      </td>
      <td><b style="color: #15803D;">${d.currency === 'USD' ? '$' : '₦'}${d.amount.toLocaleString()}</b></td>
      <td>${d.method}</td>
      <td>${d.project}</td>
      <td>${d.date}</td>
      <td><span class="status-pill success">${d.status}</span></td>
    </tr>
  `).join('');
}

window.exportDonationsCSV = function() {
  const donations = BHBStore.getDonations();
  let csv = "ID,Donor,Email,Amount,Currency,Method,Project,Date,Status\n";
  donations.forEach(d => {
    csv += `"${d.id}","${d.donorName}","${d.email}",${d.amount},"${d.currency}","${d.method}","${d.project}","${d.date}","${d.status}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BHB_Donations_Ledger_${new Date().toISOString().substring(0, 10)}.csv`;
  a.click();
  showToast('Donations ledger CSV downloaded!', 'success');
};

// 10. Volunteers
function renderAdminVolunteersTable() {
  const tbody = document.getElementById('adminVolunteersTableBody');
  if (!tbody) return;

  const volunteers = BHBStore.getVolunteers();
  tbody.innerHTML = volunteers.map(v => `
    <tr>
      <td>
        <b style="color: #0F172A;">${v.name}</b>
        <div style="font-size: 0.78rem; color: #64748B;">${v.email} | ${v.phone}</div>
      </td>
      <td>${v.rolePreference}</td>
      <td>${v.lga}</td>
      <td>${v.appliedDate}</td>
      <td><span class="status-pill ${v.status === 'Approved' ? 'success' : 'pending'}">${v.status}</span></td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm" onclick="BHBStore.updateVolunteerStatus('${v.id}', 'Approved')" style="color: #15803D;">Approve</button>
          <button class="btn-icon-sm danger" onclick="BHBStore.updateVolunteerStatus('${v.id}', 'Archived')">Archive</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 11. Inquiries
function renderAdminInquiriesTable() {
  const tbody = document.getElementById('adminInquiriesTableBody');
  if (!tbody) return;

  const inquiries = BHBStore.getInquiries();
  tbody.innerHTML = inquiries.map(i => `
    <tr>
      <td>
        <b style="color: #0F172A;">${i.name}</b>
        <div style="font-size: 0.78rem; color: #64748B;">${i.email} (${i.orgType})</div>
      </td>
      <td>
        <b>${i.subject}</b>
        <p style="font-size: 0.82rem; color: #64748B; margin-top: 4px;">${i.message}</p>
      </td>
      <td>${i.date}</td>
      <td><span class="status-pill ${i.status === 'Replied' ? 'success' : 'pending'}">${i.status}</span></td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm" onclick="BHBStore.updateInquiryStatus('${i.id}', 'Replied')" style="color: #0369A1;">Mark Replied</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 12. Settings
function renderAdminSettingsForm() {
  const form = document.getElementById('adminSettingsForm');
  if (!form) return;

  const settings = BHBStore.getSettings();
  form.cac_num.value = settings.cacNumber;
  form.office_address.value = settings.officeAddress;
  form.contact_phone.value = settings.phone;
  form.contact_email.value = settings.email;
  form.zenith_acc.value = settings.zenithBank.accountNumber;
}

window.handleSaveSettings = function(e) {
  e.preventDefault();
  const form = e.target;
  BHBStore.saveSettings({
    cacNumber: form.cac_num.value,
    officeAddress: form.office_address.value,
    phone: form.contact_phone.value,
    email: form.contact_email.value,
    zenithBank: {
      ...BHBStore.getSettings().zenithBank,
      accountNumber: form.zenith_acc.value
    }
  });
  showToast('Settings saved and synchronized live!', 'success');
};

window.exportDatabaseJSON = function() {
  const json = BHBStore.exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BHB_Database_Backup_${Date.now()}.json`;
  a.click();
  showToast('Full database JSON backup downloaded!', 'success');
};

window.importDatabaseJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const success = BHBStore.importJSON(e.target.result);
    if (success) showToast('Database successfully restored!', 'success');
    else showToast('Invalid database JSON file', 'warning');
  };
  reader.readAsText(file);
};

window.resetToDemoData = function() {
  if (confirm('Reset database back to factory seed data?')) {
    BHBStore.resetToDefault();
    showToast('Database reset to default factory data!', 'success');
  }
};
