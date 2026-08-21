/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * SUPER ADMIN CONTROLLER (FULL POWER & DIRECT MEDIA UPLOAD)
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
    }
    window.scrollTo(0, 0);
  } else {
    if (adminView) adminView.style.display = 'none';
    if (publicView) publicView.style.display = 'block';
    window.scrollTo(0, 0);
  }
};

// Top Live Clock
function initAdminLiveClock() {
  const clock = document.getElementById('adminLiveClock');
  if (!clock) return;

  function update() {
    const now = new Date();
    clock.textContent = `🕒 ${now.toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos', hour12: true })} WAT`;
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
        setTimeout(renderAdminCharts, 50);
      }
    });
  });
}

// Global Image Upload Handler (FileReader -> base64 Data URL)
window.handleImageUpload = function(inputEl, previewImgId, hiddenInputName) {
  const file = inputEl.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image file too large! Please choose an image under 5MB.', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Data = e.target.result;
    const previewEl = document.getElementById(previewImgId);
    if (previewEl) {
      previewEl.src = base64Data;
      previewEl.style.display = 'block';
    }
    const hiddenInput = document.querySelector(`input[name="${hiddenInputName}"]`);
    if (hiddenInput) {
      hiddenInput.value = base64Data;
    }
    showToast('Image uploaded and preview ready!', 'success');
  };
  reader.readAsDataURL(file);
};

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
      const file = dt.files[0];
      const fileInput = zone.querySelector('input[type="file"]');
      if (fileInput && file) {
        fileInput.files = dt.files;
        const previewId = fileInput.getAttribute('data-preview-id');
        const hiddenName = fileInput.getAttribute('data-hidden-name');
        window.handleImageUpload(fileInput, previewId, hiddenName);
      }
    });
  });
}

// Master Render
function renderAdminDashboard() {
  renderAdminKPIs();
  renderAdminHeroSlidesTable();
  renderAdminProjectsTable();
  renderAdminBlogTable();
  renderAdminTeamTable();
  renderAdminGalleryTable();
  renderAdminPartnersTable();
  renderAdminDonationsTable();
  renderAdminVolunteersTable();
  renderAdminInquiriesTable();
  renderAdminSettingsForm();
  renderAdminCharts();
}

// 1. KPIs
function renderAdminKPIs() {
  const donations = BHBStore.getDonations();
  const projects = BHBStore.getProjects();
  const volunteers = BHBStore.getVolunteers();
  const inquiries = BHBStore.getInquiries();

  const totalFunds = donations.reduce((sum, d) => sum + (d.currency === 'USD' ? d.amount * 1550 : d.amount), 0);
  
  const fundsEl = document.getElementById('kpiTotalDonations');
  if (fundsEl) fundsEl.textContent = `₦${totalFunds.toLocaleString()}`;

  const projEl = document.getElementById('kpiActiveProjects');
  if (projEl) projEl.textContent = projects.length;

  const volEl = document.getElementById('kpiPendingVolunteers');
  const volCount = volunteers.filter(v => v.status === 'Pending').length;
  if (volEl) volEl.textContent = volCount;

  const sidebarVol = document.getElementById('adminSidebarVolCount');
  if (sidebarVol) sidebarVol.textContent = volCount;

  const sidebarInq = document.getElementById('adminSidebarInqCount');
  const unreadInq = inquiries.filter(i => i.status === 'Unread').length;
  if (sidebarInq) sidebarInq.textContent = unreadInq;
}

// 2. Charts
function renderAdminCharts() {
  const donCanvas = document.getElementById('adminDonationsChart');
  const benCanvas = document.getElementById('adminBeneficiariesChart');
  if (!donCanvas || !benCanvas) return;

  if (donationsChartInstance) donationsChartInstance.destroy();
  if (beneficiariesChartInstance) beneficiariesChartInstance.destroy();

  donationsChartInstance = new Chart(donCanvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug 2026'],
      datasets: [{
        label: 'Funds Mobilized (₦ Millions)',
        data: [2.5, 4.8, 8.2, 14.5, 19.8],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#CBD5E1' } } },
      scales: {
        x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });

  beneficiariesChartInstance = new Chart(benCanvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Healthcare', 'Disability Tech', 'Women Agrobiz', 'Youth Skills'],
      datasets: [{
        data: [42, 18, 25, 15],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#CBD5E1' } } }
    }
  });
}

// 3. Hero Slides Manager
function renderAdminHeroSlidesTable() {
  const tbody = document.getElementById('adminHeroSlidesTableBody');
  if (!tbody) return;

  const slides = BHBStore.getHeroSlides();
  tbody.innerHTML = slides.map(s => `
    <tr>
      <td>
        <img src="${s.image}" style="width: 70px; height: 42px; object-fit: cover; border-radius: 4px;">
      </td>
      <td><b style="color: #FFFFFF;">${s.title}</b></td>
      <td style="font-size: 0.85rem; color: #94A3B8;">${s.label}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editHeroSlideModal('${s.id}')">Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.deleteHeroSlide('${s.id}')" style="color: #F87171;">Delete</button>
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
        <input type="hidden" name="slide_image" id="slideImageHidden" value="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80">
        
        <div class="form-group">
          <label>Slide Headline / Title</label>
          <input type="text" name="slide_title" required placeholder="e.g. Empowering Families. Building Resilient Communities.">
        </div>

        <div class="form-group">
          <label>Category Label (Top Eyebrow)</label>
          <input type="text" name="slide_label" required placeholder="e.g. Inclusive Technology & Education">
        </div>

        <div class="form-group">
          <label>Supporting Lead Statement</label>
          <textarea name="slide_lead" rows="3" required placeholder="Short mission text"></textarea>
        </div>

        <div class="form-group">
          <label>Slide Background Photo (Upload directly)</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 20px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'heroSlideImgPreview', 'slide_image')" style="margin-bottom: 8px;">
            <img id="heroSlideImgPreview" src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: block;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Save Hero Slide</button>
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
        <input type="hidden" name="slide_image" id="slideImageHidden" value="${slide.image}">
        
        <div class="form-group">
          <label>Slide Headline / Title</label>
          <input type="text" name="slide_title" value="${slide.title}" required>
        </div>

        <div class="form-group">
          <label>Category Label (Top Eyebrow)</label>
          <input type="text" name="slide_label" value="${slide.label}" required>
        </div>

        <div class="form-group">
          <label>Supporting Lead Statement</label>
          <textarea name="slide_lead" rows="3" required>${slide.lead}</textarea>
        </div>

        <div class="form-group">
          <label>Slide Background Photo</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 20px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'heroSlideImgPreview', 'slide_image')" style="margin-bottom: 8px;">
            <img id="heroSlideImgPreview" src="${slide.image}" style="max-height: 140px; margin: 10px auto; border-radius: 4px; display: block;">
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
  showToast('Hero slide saved successfully!', 'success');
};

// 4. Projects CRUD
function renderAdminProjectsTable() {
  const tbody = document.getElementById('adminProjectsTableBody');
  if (!tbody) return;

  const projects = BHBStore.getProjects();
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${p.image}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px;">
          <div>
            <b style="color: #FFFFFF;">${p.title}</b>
            <div style="font-size: 0.78rem; color: #94A3B8;">${p.location}</div>
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td>₦${(p.raised || 0).toLocaleString()} / ₦${(p.goal || 0).toLocaleString()}</td>
      <td>${p.beneficiaries}</td>
      <td><span class="status-pill ${p.status === 'Active' ? 'success' : 'neutral'}">${p.status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editProjectModal('${p.id}')">Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.deleteProject('${p.id}')" style="color: #F87171;">Delete</button>
      </td>
    </tr>
  `).join('');
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
          <label>Project Title</label>
          <input type="text" name="proj_title" required placeholder="e.g. Maternal Mobile Clinic Expansion">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category</label>
            <input type="text" name="proj_category" required placeholder="Community Health">
          </div>
          <div class="form-group">
            <label>Location / LGA</label>
            <input type="text" name="proj_location" required placeholder="Nasarawa LGA, Kano">
          </div>
        </div>

        <div class="form-group">
          <label>Direct Beneficiary Reach</label>
          <input type="text" name="proj_beneficiaries" required placeholder="e.g. 500 Mothers & Children">
        </div>

        <div class="form-group">
          <label>Project Description</label>
          <textarea name="proj_desc" rows="3" required placeholder="Detailed project summary"></textarea>
        </div>

        <div class="form-group">
          <label>Project Banner Photo (Upload Directly)</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 18px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'projImgPreview', 'proj_image')" style="margin-bottom: 8px;">
            <img id="projImgPreview" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block;">
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
          <label>Project Title</label>
          <input type="text" name="proj_title" value="${proj.title}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category</label>
            <input type="text" name="proj_category" value="${proj.category}" required>
          </div>
          <div class="form-group">
            <label>Location / LGA</label>
            <input type="text" name="proj_location" value="${proj.location}" required>
          </div>
        </div>

        <div class="form-group">
          <label>Direct Beneficiary Reach</label>
          <input type="text" name="proj_beneficiaries" value="${proj.beneficiaries}" required>
        </div>

        <div class="form-group">
          <label>Project Description</label>
          <textarea name="proj_desc" rows="3" required>${proj.description}</textarea>
        </div>

        <div class="form-group">
          <label>Project Banner Photo</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 18px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'projImgPreview', 'proj_image')" style="margin-bottom: 8px;">
            <img id="projImgPreview" src="${proj.image}" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block;">
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
    location: form.proj_location.value,
    beneficiaries: form.proj_beneficiaries.value,
    description: form.proj_desc.value,
    image: form.proj_image.value,
    status: "Active"
  };
  BHBStore.saveProject(proj);
  closeModal('adminCrudModal');
  showToast('Project saved successfully!', 'success');
};

// 5. Blog / News Manager
function renderAdminBlogTable() {
  const tbody = document.getElementById('adminBlogTableBody');
  if (!tbody) return;

  const posts = BHBStore.getPosts();
  tbody.innerHTML = posts.map(p => `
    <tr>
      <td>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${p.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
          <b style="color: #FFFFFF;">${p.title}</b>
        </div>
      </td>
      <td>${p.category}</td>
      <td>${p.author}</td>
      <td>${p.date}</td>
      <td><span class="status-pill success">Published</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editPostModal('${p.id}')">Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.deletePost('${p.id}')" style="color: #F87171;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.openNewPostModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Create News Article';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePost(event)">
        <input type="hidden" name="post_id" value="">
        <input type="hidden" name="post_image" id="postImageHidden" value="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80">
        
        <div class="form-group">
          <label>Article Title</label>
          <input type="text" name="post_title" required placeholder="e.g. Expanding Maternal Health Clinics">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category</label>
            <input type="text" name="post_category" required placeholder="Program Highlights">
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" name="post_author" required value="BHB Communications">
          </div>
        </div>

        <div class="form-group">
          <label>Short Excerpt</label>
          <input type="text" name="post_excerpt" required placeholder="Brief one-sentence summary">
        </div>

        <div class="form-group">
          <label>Article Content</label>
          <textarea name="post_content" rows="5" required placeholder="Full article body"></textarea>
        </div>

        <div class="form-group">
          <label>Featured Image (Upload directly)</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 16px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'postImgPreview', 'post_image')" style="margin-bottom: 8px;">
            <img id="postImgPreview" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Publish Article</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.editPostModal = function(id) {
  const post = BHBStore.getPosts().find(p => p.id === id);
  if (!post) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Article';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSavePost(event)">
        <input type="hidden" name="post_id" value="${post.id}">
        <input type="hidden" name="post_image" id="postImageHidden" value="${post.image}">
        
        <div class="form-group">
          <label>Article Title</label>
          <input type="text" name="post_title" value="${post.title}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category</label>
            <input type="text" name="post_category" value="${post.category}" required>
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" name="post_author" value="${post.author}" required>
          </div>
        </div>

        <div class="form-group">
          <label>Short Excerpt</label>
          <input type="text" name="post_excerpt" value="${post.excerpt}" required>
        </div>

        <div class="form-group">
          <label>Article Content</label>
          <textarea name="post_content" rows="5" required>${post.content || ''}</textarea>
        </div>

        <div class="form-group">
          <label>Featured Image</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 16px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'postImgPreview', 'post_image')" style="margin-bottom: 8px;">
            <img id="postImgPreview" src="${post.image}" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Update Article</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSavePost = function(e) {
  e.preventDefault();
  const form = e.target;
  const post = {
    id: form.post_id.value || undefined,
    title: form.post_title.value,
    category: form.post_category.value,
    author: form.post_author.value,
    excerpt: form.post_excerpt.value,
    content: form.post_content.value,
    image: form.post_image.value,
    status: 'published'
  };
  BHBStore.savePost(post);
  closeModal('adminCrudModal');
  showToast('Article updated live!', 'success');
};

// 6. Team CRUD
function renderAdminTeamTable() {
  const tbody = document.getElementById('adminTeamTableBody');
  if (!tbody) return;

  const team = BHBStore.getTeam();
  tbody.innerHTML = team.map(m => `
    <tr>
      <td>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${m.image}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;">
          <b style="color: #FFFFFF;">${m.name}</b>
        </div>
      </td>
      <td>${m.position}</td>
      <td>${m.department}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editTeamModal('${m.id}')">Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.deleteTeamMember('${m.id}')" style="color: #F87171;">Delete</button>
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
          <label>Full Name</label>
          <input type="text" name="team_name" required placeholder="e.g. Dr. Aminu Kano">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Position / Role</label>
            <input type="text" name="team_pos" required placeholder="Executive Director">
          </div>
          <div class="form-group">
            <label>Department</label>
            <input type="text" name="team_dept" required placeholder="Executive Leadership">
          </div>
        </div>

        <div class="form-group">
          <label>Biography</label>
          <textarea name="team_bio" rows="3" required placeholder="Short professional background"></textarea>
        </div>

        <div class="form-group">
          <label>Portrait Photo (Upload directly)</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 16px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'teamImgPreview', 'team_image')" style="margin-bottom: 8px;">
            <img id="teamImgPreview" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" style="max-height: 100px; width: 100px; border-radius: 50%; object-fit: cover; margin: 8px auto; display: block;">
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
          <label>Full Name</label>
          <input type="text" name="team_name" value="${member.name}" required>
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Position / Role</label>
            <input type="text" name="team_pos" value="${member.position}" required>
          </div>
          <div class="form-group">
            <label>Department</label>
            <input type="text" name="team_dept" value="${member.department}" required>
          </div>
        </div>

        <div class="form-group">
          <label>Biography</label>
          <textarea name="team_bio" rows="3" required>${member.bio}</textarea>
        </div>

        <div class="form-group">
          <label>Portrait Photo</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 16px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'teamImgPreview', 'team_image')" style="margin-bottom: 8px;">
            <img id="teamImgPreview" src="${member.image}" style="max-height: 100px; width: 100px; border-radius: 50%; object-fit: cover; margin: 8px auto; display: block;">
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
  showToast('Team roster updated!', 'success');
};

// 7. Gallery Manager
function renderAdminGalleryTable() {
  const tbody = document.getElementById('adminGalleryTableBody');
  if (!tbody) return;

  const gallery = BHBStore.getGallery();
  tbody.innerHTML = gallery.map(g => `
    <tr>
      <td>
        <img src="${g.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td><b style="color: #FFFFFF;">${g.title}</b></td>
      <td>${g.category}</td>
      <td>${g.location}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.deleteGalleryItem('${g.id}')" style="color: #F87171;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.openNewGalleryModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Upload Field Photo';
  if (content) {
    content.innerHTML = `
      <form class="admin-modal-form" onsubmit="handleSaveGallery(event)">
        <input type="hidden" name="gal_image" id="galImageHidden" value="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80">
        
        <div class="form-group">
          <label>Photo Title</label>
          <input type="text" name="gal_title" required placeholder="e.g. Assistive Computing Training Session">
        </div>

        <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Category</label>
            <input type="text" name="gal_category" required placeholder="Inclusive Tech">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" name="gal_location" required placeholder="Kano Metropolitan">
          </div>
        </div>

        <div class="form-group">
          <label>Caption</label>
          <input type="text" name="gal_caption" required placeholder="Short descriptive caption">
        </div>

        <div class="form-group">
          <label>Field Photo (Upload directly)</label>
          <div class="admin-dropzone" style="border: 2px dashed rgba(255,255,255,0.2); padding: 16px; text-align: center; border-radius: 6px;">
            <input type="file" accept="image/*" onchange="handleImageUpload(this, 'galImgPreview', 'gal_image')" style="margin-bottom: 8px;">
            <img id="galImgPreview" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80" style="max-height: 120px; margin: 8px auto; border-radius: 4px; display: block;">
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">Upload Photo to Gallery</button>
      </form>
    `;
  }
  openModal('adminCrudModal');
};

window.handleSaveGallery = function(e) {
  e.preventDefault();
  const form = e.target;
  const item = {
    title: form.gal_title.value,
    category: form.gal_category.value,
    location: form.gal_location.value,
    caption: form.gal_caption.value,
    image: form.gal_image.value
  };
  BHBStore.saveGalleryItem(item);
  closeModal('adminCrudModal');
  showToast('Photo added to gallery!', 'success');
};

// 8. Partners Manager
function renderAdminPartnersTable() {
  const tbody = document.getElementById('adminPartnersTableBody');
  if (!tbody) return;

  const partners = BHBStore.getPartners();
  tbody.innerHTML = partners.map(p => `
    <tr>
      <td><b style="color: #FFFFFF;">${p.name}</b></td>
      <td>${p.tier}</td>
      <td>${p.category}</td>
      <td><a href="${p.website}" target="_blank" style="color: #3B82F6;">${p.website}</a></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.deletePartner('${p.id}')" style="color: #F87171;">Delete</button>
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
          <label>Organization Name</label>
          <input type="text" name="part_name" required placeholder="e.g. Sahel Health Initiative">
        </div>
        <div class="form-group">
          <label>Tier</label>
          <input type="text" name="part_tier" required placeholder="Programme Partner">
        </div>
        <div class="form-group">
          <label>Sector / Category</label>
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
  showToast('Partner added!', 'success');
};

// 9. Donations Ledger
function renderAdminDonationsTable() {
  const tbody = document.getElementById('adminDonationsTableBody');
  if (!tbody) return;

  const donations = BHBStore.getDonations();
  tbody.innerHTML = donations.map(d => `
    <tr>
      <td style="font-family: var(--font-mono); font-size: 0.8rem;">#${d.id}</td>
      <td>
        <b style="color: #FFFFFF;">${d.donorName}</b>
        <div style="font-size: 0.78rem; color: #94A3B8;">${d.email}</div>
      </td>
      <td><b>${d.currency === 'USD' ? '$' : '₦'}${d.amount.toLocaleString()}</b></td>
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
        <b style="color: #FFFFFF;">${v.name}</b>
        <div style="font-size: 0.78rem; color: #94A3B8;">${v.email} | ${v.phone}</div>
      </td>
      <td>${v.rolePreference}</td>
      <td>${v.lga}</td>
      <td>${v.appliedDate}</td>
      <td><span class="status-pill ${v.status === 'Approved' ? 'success' : 'neutral'}">${v.status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.updateVolunteerStatus('${v.id}', 'Approved')" style="color: #34D399;">Approve</button>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.updateVolunteerStatus('${v.id}', 'Archived')" style="color: #94A3B8;">Archive</button>
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
        <b style="color: #FFFFFF;">${i.name}</b>
        <div style="font-size: 0.78rem; color: #94A3B8;">${i.email} (${i.orgType})</div>
      </td>
      <td>
        <b>${i.subject}</b>
        <p style="font-size: 0.82rem; color: #94A3B8; margin-top: 4px;">${i.message}</p>
      </td>
      <td>${i.date}</td>
      <td><span class="status-pill ${i.status === 'Replied' ? 'success' : 'neutral'}">${i.status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="BHBStore.updateInquiryStatus('${i.id}', 'Replied')" style="color: #38BDF8;">Mark Replied</button>
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
  showToast('Settings successfully updated!', 'success');
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
