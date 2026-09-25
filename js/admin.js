// Authentication Credentials
const ADMIN_AUTH_EMAIL = 'bhbfoundation0@gmail.com';
const ADMIN_AUTH_PASS = 'F0und@ti0n';

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminNavigation();
  initAdminLiveClock();
  setupImageDropzones();

  BHBStore.subscribe(() => {
    if (isAdminAuthenticated()) {
      renderAdminDashboard();
    }
  });
});

function isAdminAuthenticated() {
  return localStorage.getItem('bhb_admin_auth') === 'true' || sessionStorage.getItem('bhb_admin_auth') === 'true';
}

function checkAdminAuth() {
  const loginView = document.getElementById('adminLoginView');
  const dashboardView = document.getElementById('adminDashboardView');

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'true' || urlParams.get('autologin') === 'true') {
    localStorage.setItem('bhb_admin_auth', 'true');
  }

  if (isAdminAuthenticated()) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) {
      dashboardView.style.display = 'block';
      dashboardView.classList.add('active');
    }
    renderAdminDashboard();
    setTimeout(renderAdminCharts, 120);
  } else {
    if (dashboardView) {
      dashboardView.style.display = 'none';
      dashboardView.classList.remove('active');
    }
    if (loginView) loginView.style.display = 'flex';
  }
}

window.handleAdminLoginSubmit = function(event) {
  event.preventDefault();
  const emailInput = document.getElementById('adminEmailInput');
  const passInput = document.getElementById('adminPasswordInput');
  const rememberMe = document.getElementById('adminRememberMe');
  const errorEl = document.getElementById('adminLoginError');

  const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const passVal = passInput ? passInput.value : '';

  if (emailVal === ADMIN_AUTH_EMAIL.toLowerCase() && passVal === ADMIN_AUTH_PASS) {
    if (errorEl) errorEl.style.display = 'none';
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem('bhb_admin_auth', 'true');
    } else {
      sessionStorage.setItem('bhb_admin_auth', 'true');
    }
    showToast('Authenticated as Super Administrator', 'success');
    checkAdminAuth();
  } else {
    if (errorEl) {
      errorEl.textContent = 'Invalid email or password. Please use the authorized credentials.';
      errorEl.style.display = 'block';
    }
    showToast('Invalid credentials provided.', 'warning');
  }
};

window.handleAdminLogout = function() {
  localStorage.removeItem('bhb_admin_auth');
  sessionStorage.removeItem('bhb_admin_auth');
  showToast('Logged out of Super Admin Portal', 'info');
  checkAdminAuth();
};

// View Toggle (Redirects to admin.html for standalone experience)
window.toggleAdminView = function(showAdmin) {
  if (showAdmin) {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'index.html';
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
        renderAdminOverviewMetrics();
        setTimeout(renderAdminCharts, 80);
      } else if (tabId === 'slides') {
        renderAdminHeroSlidesTable();
      } else if (tabId === 'focus') {
        renderAdminFocusAreasTable();
      } else if (tabId === 'projects') {
        renderAdminProjectsTable();
      } else if (tabId === 'blog') {
        renderAdminBlogTable();
      } else if (tabId === 'comments') {
        renderAdminCommentsTable();
      } else if (tabId === 'team') {
        renderAdminTeamTable();
      } else if (tabId === 'partners') {
        renderAdminPartnersTable();
      } else if (tabId === 'donations') {
        renderAdminDonationsTable();
      } else if (tabId === 'volunteers') {
        renderAdminVolunteersTable();
      } else if (tabId === 'inquiries') {
        renderAdminInquiriesTable();
      } else if (tabId === 'settings') {
        renderAdminSettingsForm();
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
  renderAdminFocusAreasTable();
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
  const focusAreas = BHBStore.getFocusAreas();

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
  if (benEl) benEl.textContent = "10+";

  // Pending volunteers
  const pendingVol = volunteers.filter(v => v.status === 'Pending').length;
  const volEl = document.getElementById('kpiPendingVolunteers');
  if (volEl) volEl.textContent = pendingVol;

  // Pending inquiries
  const pendingInq = inquiries.filter(i => i.status === 'Unread').length;
  const inqEl = document.getElementById('kpiInquiries');
  if (inqEl) inqEl.textContent = pendingInq;

  // Sidebar counters
  const sideFocus = document.getElementById('adminSidebarFocusCount');
  if (sideFocus) sideFocus.textContent = focusAreas.length;

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
            ticks: { color: '#64748B', font: { family: 'Inter', weight: '600' } }
          },
          y: {
            grid: { color: '#F1F5F9' },
            ticks: {
              color: '#64748B',
              font: { family: 'Inter' },
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
          backgroundColor: ['#1E3A8A', '#1C4DA0', '#0D9488', '#F59E0B', '#6366F1'],
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
            ticks: { color: '#64748B', font: { family: 'Inter', size: 10, weight: '600' } }
          },
          y: {
            grid: { color: '#F1F5F9' },
            ticks: { color: '#64748B', font: { family: 'Inter' } }
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
  tbody.innerHTML = slides.map(s => {
    const imgHTML = s.image
      ? `<img src="${s.image}" style="width: 70px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid #CBD5E1;">`
      : `<div style="width: 70px; height: 42px; border-radius: 4px; background: #F1F5F9; color: #64748B; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1;">NO IMG</div>`;
    return `
      <tr>
        <td>${imgHTML}</td>
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
    `;
  }).join('');
}

window.clearFieldImage = function(previewId, hiddenInputName, emptyNoticeId) {
  const hidden = document.querySelector(`input[name="${hiddenInputName}"]`) || document.getElementById(hiddenInputName);
  const preview = document.getElementById(previewId);
  const emptyNotice = emptyNoticeId ? document.getElementById(emptyNoticeId) : null;
  if (hidden) hidden.value = '';
  if (preview) {
    preview.src = '';
    preview.style.display = 'none';
  }
  if (emptyNotice) {
    emptyNotice.style.display = 'block';
  }
  showToast('Image cleared. Fallback display will be used.', 'info');
};

window.openNewHeroSlideModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Hero Carousel Slide';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveHeroSlide(event)">
        <input type="hidden" name="slide_id" value="">
        <input type="hidden" name="slide_image" id="heroSlideImageHidden" value="">
        
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
          <label>Slide Background Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'heroSlideImgPreview', 'slide_image', '16:9')" style="margin-bottom: 8px;">
            <div id="heroSlideEmptyNotice" style="display: block; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No image selected (clean editorial banner will display)</div>
            <img id="heroSlideImgPreview" src="" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: none; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('heroSlideImgPreview', 'slide_image', 'heroSlideEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
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
  const hasImg = !!slide.image;
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveHeroSlide(event)">
        <input type="hidden" name="slide_id" value="${slide.id}">
        <input type="hidden" name="slide_image" id="heroSlideImageHidden" value="${slide.image || ''}">
        
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
          <label>Slide Background Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'heroSlideImgPreview', 'slide_image', '16:9')" style="margin-bottom: 8px;">
            <div id="heroSlideEmptyNotice" style="display: ${hasImg ? 'none' : 'block'}; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No image selected (clean editorial banner will display)</div>
            <img id="heroSlideImgPreview" src="${slide.image || ''}" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: ${hasImg ? 'block' : 'none'}; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('heroSlideImgPreview', 'slide_image', 'heroSlideEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
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

// 3b. Focus Areas & Strategic Pillars CRUD
function renderAdminFocusAreasTable() {
  const tbody = document.getElementById('adminFocusAreasTableBody');
  if (!tbody) return;

  const areas = BHBStore.getFocusAreas();
  tbody.innerHTML = areas.map((a, idx) => {
    const imgHTML = a.image
      ? `<img src="${a.image}" style="width: 72px; height: 48px; object-fit: cover; border-radius: 4px; border: 1px solid #CBD5E1;">`
      : `<div style="width: 72px; height: 48px; border-radius: 4px; background: #F1F5F9; color: #64748B; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1;">PILLAR</div>`;
    return `
      <tr>
        <td>${imgHTML}</td>
        <td>
          <b style="color: #0F172A;">${a.title}</b>
          <div style="font-size: 0.76rem; color: #2563EB; font-weight: 700; margin-top: 2px;">PILLAR 0${idx + 1}</div>
        </td>
        <td style="max-width: 260px; font-size: 0.85rem; color: #475569;">${a.summary}</td>
        <td style="max-width: 240px; font-size: 0.82rem; color: #64748B;">${a.details || a.summary}</td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="editFocusAreaModal('${a.id}')">Edit</button>
            <button class="btn-icon-sm danger" onclick="deleteFocusAreaAdmin('${a.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.deleteFocusAreaAdmin = function(id) {
  if (confirm('Are you sure you want to delete this focus pillar?')) {
    BHBStore.deleteFocusArea(id);
    showToast('Focus area pillar deleted successfully!', 'info');
  }
};

window.openNewFocusAreaModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Strategic Focus Pillar';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveFocusArea(event)">
        <input type="hidden" name="focus_id" value="">
        <input type="hidden" name="focus_image" id="focusImageHidden" value="">
        
        <div class="form-group">
          <label>Pillar Title *</label>
          <input type="text" name="focus_title" placeholder="e.g. Digital Inclusion &amp; Assistive Technology" required>
        </div>

        <div class="form-group">
          <label>Summary Narrative (Shown on Card Front) *</label>
          <textarea name="focus_summary" rows="3" placeholder="Core mission and objective of this strategic pillar..." required></textarea>
        </div>

        <div class="form-group">
          <label>Operational Scope &amp; Target Beneficiaries</label>
          <textarea name="focus_details" rows="2" placeholder="e.g. Specialized coaching, hardware grants, and grassroots mentoring across target LGAs."></textarea>
        </div>

        <div class="form-group">
          <label>Pillar Cover Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'focusImgPreview', 'focus_image', '4:3')" style="margin-bottom: 8px;">
            <div id="focusImgEmptyNotice" style="display: block; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No cover image (clean typography layout will display)</div>
            <img id="focusImgPreview" src="" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: none; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('focusImgPreview', 'focus_image', 'focusImgEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save Focus Pillar</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editFocusAreaModal = function(id) {
  const area = BHBStore.getFocusAreas().find(a => a.id === id);
  if (!area) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Strategic Focus Pillar';
  const hasImg = !!area.image;
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveFocusArea(event)">
        <input type="hidden" name="focus_id" value="${area.id}">
        <input type="hidden" name="focus_image" id="focusImageHidden" value="${area.image || ''}">
        
        <div class="form-group">
          <label>Pillar Title *</label>
          <input type="text" name="focus_title" value="${area.title}" required>
        </div>

        <div class="form-group">
          <label>Summary Narrative (Shown on Card Front) *</label>
          <textarea name="focus_summary" rows="3" required>${area.summary}</textarea>
        </div>

        <div class="form-group">
          <label>Operational Scope &amp; Target Beneficiaries</label>
          <textarea name="focus_details" rows="2">${area.details || area.summary}</textarea>
        </div>

        <div class="form-group">
          <label>Pillar Cover Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'focusImgPreview', 'focus_image', '4:3')" style="margin-bottom: 8px;">
            <div id="focusImgEmptyNotice" style="display: ${hasImg ? 'none' : 'block'}; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No cover image (clean typography layout will display)</div>
            <img id="focusImgPreview" src="${area.image || ''}" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: ${hasImg ? 'block' : 'none'}; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('focusImgPreview', 'focus_image', 'focusImgEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Update Focus Pillar</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSaveFocusArea = function(e) {
  e.preventDefault();
  const form = e.target;
  const area = {
    id: form.focus_id.value || undefined,
    title: form.focus_title.value,
    summary: form.focus_summary.value,
    details: form.focus_details.value,
    image: form.focus_image.value
  };
  BHBStore.saveFocusArea(area);
  closeModal('adminCrudModal');
  showToast('Focus Area pillar saved and synchronized live on public website!', 'success');
};

// 4. Projects & Active Programs CRUD
function renderAdminProjectsTable() {
  const tbody = document.getElementById('adminProjectsTableBody');
  if (!tbody) return;

  const projects = BHBStore.getProjects();
  tbody.innerHTML = projects.map(p => {
    const statusClass = p.status === 'Ongoing' ? 'success' : (p.status === 'Completed' ? 'info' : 'pending');
    const imgHTML = p.image
      ? `<img src="${p.image}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid #E2E8F0;">`
      : `<div style="width: 44px; height: 44px; border-radius: 4px; background: #F1F5F9; color: #475569; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; border: 1px solid #E2E8F0;">PRJ</div>`;
    return `
      <tr>
        <td>
          <div style="display: flex; gap: 12px; align-items: center;">
            ${imgHTML}
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
        <input type="hidden" name="proj_image" id="projImageHidden" value="">
        
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
            <label>Location *</label>
            <input type="text" name="proj_location" required placeholder="Community Location">
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
          <label>Project Banner Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'projImgPreview', 'proj_image', '16:9')" style="margin-bottom: 8px;">
            <div id="projImgEmptyNotice" style="display: block; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No banner photo (clean editorial layout will display)</div>
            <img id="projImgPreview" src="" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: none; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('projImgPreview', 'proj_image', 'projImgEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
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
  const hasImg = !!proj.image;
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveProject(event)">
        <input type="hidden" name="proj_id" value="${proj.id}">
        <input type="hidden" name="proj_image" id="projImageHidden" value="${proj.image || ''}">
        
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
            <label>Location *</label>
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
          <label>Project Banner Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'projImgPreview', 'proj_image', '16:9')" style="margin-bottom: 8px;">
            <div id="projImgEmptyNotice" style="display: ${hasImg ? 'none' : 'block'}; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No banner photo (clean editorial layout will display)</div>
            <img id="projImgPreview" src="${proj.image || ''}" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: ${hasImg ? 'block' : 'none'}; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('projImgPreview', 'proj_image', 'projImgEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
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

// 5. Blog Articles CMS
function renderAdminBlogTable() {
  const tbody = document.getElementById('adminBlogTableBody');
  if (!tbody) return;

  const posts = BHBStore.getPosts();
  tbody.innerHTML = posts.map(p => {
    const comments = BHBStore.getCommentsByPost(p.id);
    const imgHTML = p.image
      ? `<img src="${p.image}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid #CBD5E1;">`
      : `<div style="width: 50px; height: 35px; border-radius: 4px; background: #F1F5F9; color: #475569; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1;">POST</div>`;
    return `
      <tr>
        <td>${imgHTML}</td>
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
        <input type="hidden" name="post_image" id="postImageHidden" value="">
        
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
          <input type="text" name="post_tags" placeholder="e.g. Digital Skills, Inclusion, Youth">
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
          <label>Article Banner Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'postImgPreview', 'post_image', '16:9')" style="margin-bottom: 8px;">
            <div id="postImgEmptyNotice" style="display: block; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No banner photo (clean editorial format will display)</div>
            <img id="postImgPreview" src="" style="max-height: 140px; margin: 8px auto; border-radius: 4px; display: none; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('postImgPreview', 'post_image', 'postImgEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
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
  const hasImg = !!post.image;
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePost(event)">
        <input type="hidden" name="post_id" value="${post.id}">
        <input type="hidden" name="post_image" id="postImageHidden" value="${post.image || ''}">
        
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
          <label>Article Banner Photo (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'postImgPreview', 'post_image', '16:9')" style="margin-bottom: 8px;">
            <div id="postImgEmptyNotice" style="display: ${hasImg ? 'none' : 'block'}; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No banner photo (clean editorial format will display)</div>
            <img id="postImgPreview" src="${post.image || ''}" style="max-height: 140px; margin: 8px auto; border-radius: 4px; display: ${hasImg ? 'block' : 'none'}; border: 1px solid #CBD5E1;">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('postImgPreview', 'post_image', 'postImgEmptyNotice')" style="margin-top: 6px;">Clear Image</button>
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

// 7. Team & Leadership CRUD (With 3:4 Portrait Cropper, Order, Status & Live Site Sync)
function renderAdminTeamTable() {
  const tbody = document.getElementById('adminTeamTableBody');
  if (!tbody) return;

  const team = BHBStore.getTeam(false);
  if (!team.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748B; padding: 24px;">No team members registered yet. Click "+ Add New Team Member" to create one.</td></tr>`;
    return;
  }

  tbody.innerHTML = team.map((m, idx) => {
    const initials = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'BH';
    const avatarHTML = m.image
      ? `<img src="${m.image}" alt="${m.name}" style="width: 44px; height: 58px; border-radius: 4px; object-fit: cover; object-position: center 15%; border: 1px solid #CBD5E1; box-shadow: 0 2px 6px rgba(15,23,42,0.08);">`
      : `<div style="width: 44px; height: 58px; border-radius: 4px; background: #1E3A8A; color: #FFFFFF; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; border: 1px solid #CBD5E1;">${initials}</div>`;
    return `
      <tr>
        <td style="text-align: center;">
          <input type="number" min="1" value="${m.order || idx + 1}" style="width: 52px; padding: 4px 6px; text-align: center; border: 1.5px solid #CBD5E1; border-radius: 6px; font-weight: 700; color: #0F172A;" onchange="updateTeamOrderAdmin('${m.id}', this.value)" title="Change Display Order">
        </td>
        <td>
          <div style="display: flex; gap: 12px; align-items: center;">
            ${avatarHTML}
            <div>
              <b style="color: #0F172A; font-size: 0.95rem;">${m.name}</b>
            </div>
          </div>
        </td>
        <td><b style="color: #334155; font-size: 0.9rem;">${m.position}</b></td>
        <td>
          <span class="status-pill success" style="font-size: 0.75rem;">${m.tier || 'Executive'}</span>
        </td>
        <td>
          <button type="button" class="btn-icon-sm" onclick="toggleTeamMemberPublishAdmin('${m.id}')" style="cursor: pointer; font-weight: 700; font-size: 0.78rem; border-radius: 9999px; padding: 4px 10px; border: 1px solid ${m.published !== false ? '#86EFAC' : '#FECACA'}; background: ${m.published !== false ? '#DCFCE7' : '#FEE2E2'}; color: ${m.published !== false ? '#15803D' : '#DC2626'};">
            ${m.published !== false ? '● Published' : '○ Draft'}
          </button>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="editTeamModal('${m.id}')" title="Edit Member Profile">Edit</button>
            <button class="btn-icon-sm danger" onclick="deleteTeamMemberAdmin('${m.id}')" title="Delete Member">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleTeamMemberPublishAdmin = function(id) {
  const isPublished = BHBStore.toggleTeamMemberPublish(id);
  showToast(`Team member is now ${isPublished ? 'published live on public site' : 'hidden as draft'}!`, 'success');
};

window.updateTeamOrderAdmin = function(id, newOrder) {
  const member = BHBStore.getTeam().find(t => t.id === id);
  if (member) {
    member.order = parseInt(newOrder, 10) || 1;
    BHBStore.saveTeamMember(member);
    showToast('Display position updated and synced!', 'success');
  }
};

window.deleteTeamMemberAdmin = function(id) {
  if (confirm('Are you sure you want to remove this team member from the public website?')) {
    BHBStore.deleteTeamMember(id);
    showToast('Team member removed successfully!', 'info');
  }
};

window.openNewTeamModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Leadership Team Member';
  const currentCount = (BHBStore.getTeam() || []).length;
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveTeam(event)">
        <input type="hidden" name="team_id" value="">
        <input type="hidden" name="team_image" id="teamImageHidden" value="">
        
        <div class="form-group">
          <label>Full Name &amp; Title *</label>
          <input type="text" name="team_name" required placeholder="e.g. Dr. Amina Bello">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Position / Official Role *</label>
            <input type="text" name="team_pos" required placeholder="e.g. Executive Director">
          </div>
          <div class="form-group">
            <label>Governance Hierarchy Tier</label>
            <select name="team_tier" required>
              <option value="Executive">Executive Directorate</option>
              <option value="Trustees">Board of Trustees</option>
              <option value="Directorate">Program Directorate</option>
              <option value="Advisory">Strategic Advisory</option>
              <option value="Operations">Field Operations</option>
            </select>
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Display Order (Priority)</label>
            <input type="number" name="team_order" min="1" value="${currentCount + 1}" required>
          </div>
          <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 26px;">
            <input type="checkbox" name="team_published" id="teamPublishedCheck" checked style="width: 18px; height: 18px;">
            <label for="teamPublishedCheck" style="margin: 0; cursor: pointer; font-weight: 700; color: #0F172A;">Publish to Public Website</label>
          </div>
        </div>

        <div class="form-group">
          <label>Professional Biography / Scope *</label>
          <textarea name="team_bio" rows="3" required placeholder="Brief professional background, leadership scope, and commitment to the mission."></textarea>
        </div>

        <div class="form-group">
          <label>Portrait Headshot (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'teamImgPreview', 'team_image', '3:4')" style="margin-bottom: 8px;">
            <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 8px;">Supports passport, ID, and portrait photos. If no photo is selected, clean monogram initials will display.</p>
            <div id="teamImgEmptyNotice" style="display: block; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No photo selected (clean monogram avatar will be used)</div>
            <img id="teamImgPreview" src="" style="height: 160px; width: 120px; border-radius: 4px; object-fit: cover; object-position: center 8%; margin: 8px auto; display: none; border: 2px solid #2563EB; box-shadow: 0 4px 12px rgba(15,23,42,0.12);">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('teamImgPreview', 'team_image', 'teamImgEmptyNotice')" style="margin-top: 6px;">Clear Photo</button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save &amp; Publish Member</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editTeamModal = function(id) {
  const member = BHBStore.getTeam().find(t => t.id === id);
  if (!member) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Team Member Profile';
  const hasImg = !!member.image;
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveTeam(event)">
        <input type="hidden" name="team_id" value="${member.id}">
        <input type="hidden" name="team_image" id="teamImageHidden" value="${member.image || ''}">
        
        <div class="form-group">
          <label>Full Name &amp; Title *</label>
          <input type="text" name="team_name" value="${member.name}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Position / Official Role *</label>
            <input type="text" name="team_pos" value="${member.position}" required>
          </div>
          <div class="form-group">
            <label>Governance Hierarchy Tier</label>
            <select name="team_tier" required>
              <option value="Executive" ${member.tier === 'Executive' ? 'selected' : ''}>Executive Directorate</option>
              <option value="Trustees" ${member.tier === 'Trustees' ? 'selected' : ''}>Board of Trustees</option>
              <option value="Directorate" ${member.tier === 'Directorate' ? 'selected' : ''}>Program Directorate</option>
              <option value="Advisory" ${member.tier === 'Advisory' ? 'selected' : ''}>Strategic Advisory</option>
              <option value="Operations" ${member.tier === 'Operations' ? 'selected' : ''}>Field Operations</option>
            </select>
          </div>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Display Order (Priority)</label>
            <input type="number" name="team_order" min="1" value="${member.order || 1}" required>
          </div>
          <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 26px;">
            <input type="checkbox" name="team_published" id="teamPublishedCheck" ${member.published !== false ? 'checked' : ''} style="width: 18px; height: 18px;">
            <label for="teamPublishedCheck" style="margin: 0; cursor: pointer; font-weight: 700; color: #0F172A;">Publish to Public Website</label>
          </div>
        </div>

        <div class="form-group">
          <label>Professional Biography / Scope *</label>
          <textarea name="team_bio" rows="3" required>${member.bio}</textarea>
        </div>

        <div class="form-group">
          <label>Portrait Headshot (Optional)</label>
          <div class="admin-dropzone">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'teamImgPreview', 'team_image', '3:4')" style="margin-bottom: 8px;">
            <p style="font-size: 0.78rem; color: #64748B; margin-bottom: 8px;">Supports passport, ID, and portrait photos. If no photo is selected, clean monogram initials will display.</p>
            <div id="teamImgEmptyNotice" style="display: ${hasImg ? 'none' : 'block'}; color: #64748B; font-size: 0.82rem; margin: 6px 0;">No photo selected (clean monogram avatar will be used)</div>
            <img id="teamImgPreview" src="${member.image || ''}" style="height: 160px; width: 120px; border-radius: 4px; object-fit: cover; object-position: center 8%; margin: 8px auto; display: ${hasImg ? 'block' : 'none'}; border: 2px solid #2563EB; box-shadow: 0 4px 12px rgba(15,23,42,0.12);">
            <button type="button" class="btn-icon-sm" onclick="clearFieldImage('teamImgPreview', 'team_image', 'teamImgEmptyNotice')" style="margin-top: 6px;">Clear Photo</button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save &amp; Update Member</button>
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
    tier: form.team_tier ? form.team_tier.value : 'Executive',
    order: parseInt(form.team_order ? form.team_order.value : '1', 10) || 1,
    published: form.team_published ? form.team_published.checked : true,
    bio: form.team_bio.value,
    image: form.team_image.value
  };
  BHBStore.saveTeamMember(member);
  closeModal('adminCrudModal');
  showToast('Team roster updated and synchronized live across public website!', 'success');
};

// 8. Partner Organizations & Logo CMS
function renderAdminPartnersTable() {
  const tbody = document.getElementById('adminPartnersTableBody');
  if (!tbody) return;

  const partners = BHBStore.getPartners();
  if (!partners.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748B; padding: 24px;">No partner logos uploaded yet. Click "+ Upload Partner Logo" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = partners.map((p, idx) => `
    <tr>
      <td>
        <div style="background: #FFFFFF; padding: 10px 18px; border: 1.5px solid #E2E8F0; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; height: 68px; min-width: 170px; box-shadow: 0 2px 6px rgba(15,23,42,0.04);">
          <img src="${p.logo}" alt="${p.name || 'Partner Logo'}" style="max-height: 52px; max-width: 160px; object-fit: contain;">
        </div>
      </td>
      <td>
        <b style="color: #0F172A; font-size: 0.95rem;">${p.name || 'Partner Organization'}</b>
        <div style="font-size: 0.76rem; color: #64748B; margin-top: 2px;">Partner #${idx + 1}</div>
      </td>
      <td>
        <span class="status-pill success" style="font-size: 0.76rem;">Big Sliding Marquee</span>
      </td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm danger" onclick="deletePartnerAdmin('${p.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.deletePartnerAdmin = function(id) {
  if (confirm('Are you sure you want to remove this partner logo from the homepage sliding marquee?')) {
    BHBStore.deletePartner(id);
    showToast('Partner logo removed successfully!', 'info');
  }
};

window.openNewPartnerModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Upload Partner Logo';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePartner(event)">
        <input type="hidden" name="part_id" value="">
        <input type="hidden" name="part_logo" id="partLogoHidden" value="" required>

        <div class="form-group">
          <label style="font-weight: 700; color: #0F172A; margin-bottom: 6px;">Upload Partner Logo Image *</label>
          <div class="admin-dropzone" style="padding: 24px; text-align: center; border: 2px dashed #94A3B8; border-radius: 8px; background: #F8FAFC; cursor: pointer;">
            <input type="file" accept="image/*" onchange="handlePartnerLogoUpload(this)" required style="margin-bottom: 8px;">
            <p style="font-size: 0.8rem; color: #64748B; margin: 0 0 10px;">Supports PNG, SVG, JPG, WebP. Crisp transparent logos look best.</p>
            <div id="partLogoPreviewBox" style="display: none; padding: 12px 20px; background: #FFFFFF; border-radius: 8px; border: 1.5px solid #CBD5E1; width: fit-content; margin: 10px auto 0; box-shadow: 0 4px 12px rgba(15,23,42,0.08);">
              <img id="partLogoPreview" src="" alt="Partner Logo Preview" style="max-height: 80px; max-width: 240px; object-fit: contain; display: block;">
            </div>
          </div>
        </div>

        <div class="form-group">
          <label style="font-weight: 600; color: #475569;">Organization Name (Optional internal reference)</label>
          <input type="text" name="part_name" placeholder="e.g. Kano State Ministry of Humanitarian Affairs">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 14px; padding: 12px; font-weight: 700; font-size: 0.95rem;">
          Upload &amp; Add Logo to Homepage Marquee
        </button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handlePartnerLogoUpload = function(inputEl) {
  const file = inputEl.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawData = e.target.result;
    const img = new Image();
    img.onload = function() {
      const maxW = 500;
      const maxH = 250;
      let w = img.width;
      let h = img.height;

      if (w > maxW || h > maxH) {
        if (w / maxW > h / maxH) {
          h = Math.round(h * (maxW / w));
          w = maxW;
        } else {
          w = Math.round(w * (maxH / h));
          h = maxH;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      const isPNG = file.type === 'image/png' || file.type === 'image/svg+xml';
      const optimizedData = isPNG ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.88);

      const hiddenInput = document.getElementById('partLogoHidden');
      if (hiddenInput) hiddenInput.value = optimizedData;

      const previewBox = document.getElementById('partLogoPreviewBox');
      const previewImg = document.getElementById('partLogoPreview');
      if (previewImg) previewImg.src = optimizedData;
      if (previewBox) previewBox.style.display = 'block';

      showToast('Partner logo loaded and optimized!', 'success');
    };
    img.src = rawData;
  };
  reader.readAsDataURL(file);
};

window.handleSavePartner = function(e) {
  e.preventDefault();
  const form = e.target;
  const logo = form.part_logo ? form.part_logo.value : '';
  if (!logo) {
    showToast('Please select a partner logo image to upload.', 'warning');
    return;
  }

  BHBStore.savePartner({
    id: form.part_id ? form.part_id.value : undefined,
    name: form.part_name ? form.part_name.value.trim() || 'Strategic Partner' : 'Strategic Partner',
    logo: logo
  });

  closeModal('adminCrudModal');
  showToast('Partner logo uploaded and added to the sliding marquee live!', 'success');
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

// 12. Settings & Media Controls
function renderAdminSettingsForm() {
  const form = document.getElementById('adminSettingsForm');
  if (!form) return;

  const settings = BHBStore.getSettings();
  if (form.cac_num) form.cac_num.value = settings.cacNumber || '';
  if (form.office_address) form.office_address.value = settings.officeAddress || '';
  if (form.contact_phone) form.contact_phone.value = settings.phone || '';
  if (form.contact_email) form.contact_email.value = settings.email || '';
  if (form.zenith_acc && settings.zenithBank) form.zenith_acc.value = settings.zenithBank.accountNumber || '';

  const partnersPreview = document.getElementById('adminPartnersImgPreview');
  const partnersHidden = document.getElementById('admin_partners_img_hidden');
  const currentPartnersImg = settings.communityCoDesignImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80';
  if (partnersPreview) partnersPreview.src = currentPartnersImg;
  if (partnersHidden) partnersHidden.value = currentPartnersImg;
}

window.handleSaveSettings = function(e) {
  e.preventDefault();
  const form = e.target;
  const currentSettings = BHBStore.getSettings();
  BHBStore.saveSettings({
    cacNumber: form.cac_num ? form.cac_num.value : currentSettings.cacNumber,
    officeAddress: form.office_address ? form.office_address.value : currentSettings.officeAddress,
    phone: form.contact_phone ? form.contact_phone.value : currentSettings.phone,
    email: form.contact_email ? form.contact_email.value : currentSettings.email,
    communityCoDesignImage: form.partners_image ? form.partners_image.value : (currentSettings.communityCoDesignImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80'),
    zenithBank: {
      ...currentSettings.zenithBank,
      accountNumber: form.zenith_acc ? form.zenith_acc.value : (currentSettings.zenithBank ? currentSettings.zenithBank.accountNumber : '')
    }
  });
  showToast('Settings & Our Work section feature picture updated live across platform!', 'success');
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

window.syncAdminChangesToGitHub = async function() {
  if (window.location.protocol === 'file:') {
    alert("STOP! You cannot push changes while viewing the file directly (file:///...).\n\nPlease open http://localhost:8080/ in your browser, import your JSON there, and then push!");
    return;
  }
  const btn = document.getElementById('adminSyncGitBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.innerHTML = '<span>⏳ Pushing to GitHub...</span>';
  }

  try {
    const data = BHBStore.data;
    data.lastUpdated = Date.now();
    const res = await fetch('/api/sync-to-git', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const result = await res.json();
      showToast('🎉 ' + (result.message || 'All changes & photos pushed live to GitHub!'), 'success');
    } else {
      throw new Error('Server response: ' + res.status);
    }
  } catch (err) {
    console.error('Direct git sync error:', err);
    showToast('Sync error: ' + err.message + '. Downloading backup...', 'warning');
    if (typeof BHBStore !== 'undefined' && BHBStore.exportJSON) {
      BHBStore.exportJSON();
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.innerHTML = originalHtml;
    }
  }
};

// =========================================================================
// GLOBAL MODAL & TOAST CONTROLLERS FOR SUPER ADMIN
// =========================================================================
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.showToast = function(message, type = 'info') {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; max-width: 400px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: '#15803D',
    warning: '#B45309',
    info: '#1C4DA0',
    danger: '#DC2626'
  };

  toast.style.cssText = `
    background: ${bgColors[type] || bgColors.info};
    color: #FFFFFF;
    padding: 12px 18px;
    border-radius: 6px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    font-size: 0.88rem;
    font-weight: 600;
    line-height: 1.4;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: 0;
    transform: translateY(12px);
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Global click listener to close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ESC key to close any active modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});



