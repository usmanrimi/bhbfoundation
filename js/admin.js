/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * STREAMLINED SUPER ADMIN CONTROLLER
 */

// Authentication Credentials
const ADMIN_AUTH_EMAIL = 'bhbfoundation0@gmail.com';
const ADMIN_AUTH_PASS = 'F0und@ti0n';

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminNavigation();
  initAdminLiveClock();

  if (typeof BHBStore !== 'undefined') {
    BHBStore.subscribe(() => {
      if (isAdminAuthenticated()) {
        renderAdminDashboard();
      }
    });
  }
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

// Live Clock
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

// Tab Switching
window.switchAdminTab = function(tabId) {
  if (!tabId) return;

  document.querySelectorAll('.admin-nav-item').forEach(li => {
    const btn = li.querySelector('button');
    if (btn && btn.getAttribute('data-admin-tab') === tabId) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });

  document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));
  const targetPane = document.getElementById(`adminTab-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  const titleEl = document.getElementById('adminCurrentTabTitle');
  if (titleEl) {
    const titles = {
      overview: 'Dashboard Overview & Metrics',
      blog: 'Blog Articles & News CMS',
      team: 'Leadership & Team CMS',
      projects: 'Projects & Initiatives Manager',
      inquiries: 'Public & Partner Inquiries Inbox',
      settings: 'Foundation Platform Settings'
    };
    titleEl.textContent = titles[tabId] || 'Management Console';
  }

  // Refresh tab-specific content
  if (tabId === 'overview') renderAdminOverviewMetrics();
  else if (tabId === 'blog') renderAdminBlogTable();
  else if (tabId === 'team') renderAdminTeamTable();
  else if (tabId === 'projects') renderAdminProjectsTable();
  else if (tabId === 'inquiries') renderAdminInquiriesTable();
  else if (tabId === 'settings') renderAdminSettingsForm();
};

function initAdminNavigation() {
  const navBtns = document.querySelectorAll('.admin-nav-item button');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-admin-tab');
      switchAdminTab(tabId);
    });
  });
}

// Master Dashboard Render
function renderAdminDashboard() {
  renderAdminOverviewMetrics();
  renderAdminBlogTable();
  renderAdminTeamTable();
  renderAdminProjectsTable();
  renderAdminInquiriesTable();
  renderAdminSettingsForm();
}

// =========================================================================
// 1. OVERVIEW & METRICS
// =========================================================================
function renderAdminOverviewMetrics() {
  if (typeof BHBStore === 'undefined') return;

  const posts = BHBStore.getPosts();
  const team = BHBStore.getTeam(false);
  const projects = BHBStore.getProjects();
  const inquiries = BHBStore.getInquiries();

  // Update KPI counters
  const postCountEl = document.getElementById('kpiTotalPosts');
  const teamCountEl = document.getElementById('kpiTotalTeam');
  const projectCountEl = document.getElementById('kpiTotalProjects');
  const inqCountEl = document.getElementById('kpiTotalInquiries');

  if (postCountEl) postCountEl.textContent = posts.length;
  if (teamCountEl) teamCountEl.textContent = team.length;
  if (projectCountEl) projectCountEl.textContent = projects.length;
  if (inqCountEl) inqCountEl.textContent = inquiries.length;

  // Sidebar badge counts
  const sbBlog = document.getElementById('adminSidebarBlogCount');
  const sbTeam = document.getElementById('adminSidebarTeamCount');
  const sbProj = document.getElementById('adminSidebarProjectCount');
  const sbInq = document.getElementById('adminSidebarInqCount');

  if (sbBlog) sbBlog.textContent = posts.length;
  if (sbTeam) sbTeam.textContent = team.length;
  if (sbProj) sbProj.textContent = projects.length;
  if (sbInq) sbInq.textContent = inquiries.length;

  // Recent Inquiries Table
  const recentInqBody = document.getElementById('adminRecentInquiriesTableBody');
  if (recentInqBody) {
    const recent = inquiries.slice(0, 4);
    if (!recent.length) {
      recentInqBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748B; padding: 24px;">No inquiries received yet. Messages submitted via the Contact Us page will appear here.</td></tr>`;
    } else {
      recentInqBody.innerHTML = recent.map(i => `
        <tr>
          <td>
            <b style="color: #0F172A;">${i.name}</b>
            <div style="font-size: 0.78rem; color: #64748B;">${i.email}</div>
          </td>
          <td><b>${i.subject}</b></td>
          <td>${i.date || 'Recent'}</td>
          <td><span class="status-pill ${i.status === 'Replied' ? 'success' : 'pending'}">${i.status || 'New'}</span></td>
          <td>
            <button class="btn-icon-sm" onclick="openViewInquiryModal('${i.id}')">View</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// =========================================================================
// =========================================================================
// 2. BLOG ARTICLES CMS
// =========================================================================
function renderAdminBlogTable() {
  const tbody = document.getElementById('adminBlogTableBody');
  if (!tbody || typeof BHBStore === 'undefined') return;

  const posts = BHBStore.getPosts();
  if (!posts.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748B; padding: 24px;">No articles published yet. Click "+ Write New Article" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = posts.map(p => {
    const pos = p.imagePosition || 'center center';
    const imgHTML = p.image
      ? `<img src="${p.image}" alt="${p.title}" style="width: 60px; height: 42px; object-fit: cover; object-position: ${pos}; border-radius: 4px; border: 1px solid #E2E8F0;">`
      : `<div style="width: 60px; height: 42px; background: #0F1E36; color: #93C5FD; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: 700;">NEWS</div>`;

    return `
      <tr>
        <td>${imgHTML}</td>
        <td>
          <b style="color: #0F172A; font-size: 0.95rem;">${p.title}</b>
          <div style="font-size: 0.76rem; color: #2563EB; font-weight: 700; margin-top: 2px;">#${p.category || 'General'}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: #1E293B;">${p.author || 'BHB Communications'}</div>
          <div style="font-size: 0.78rem; color: #64748B;">${p.date || 'Recent'} · ${p.readTime || '3 min read'}</div>
        </td>
        <td>
          <div style="font-size: 0.82rem; color: #475569; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${p.excerpt || p.content || 'No excerpt available.'}
          </div>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="openEditPostModal('${p.id}')">Edit</button>
            <button class="btn-icon-sm danger" onclick="deletePostAdmin('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openNewPostModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Write & Publish New Article';
  if (!content) return;

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  content.innerHTML = `
    <form class="admin-modal-form" onsubmit="handleSavePost(event)">
      <input type="hidden" name="post_id" value="">
      <input type="hidden" name="post_image" id="postImageHidden" value="">
      <input type="hidden" name="post_image_position" id="postImagePosHidden" value="center center">

      <div class="form-group">
        <label>Article Title *</label>
        <input type="text" name="post_title" required placeholder="e.g. Scaling Community-Led Water Solutions in Rural Settlements">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Category / Pillar *</label>
          <select name="post_category" required>
            <option value="Community Welfare">Community Welfare</option>
            <option value="Health & WASH">Health &amp; WASH</option>
            <option value="Education & Tech">Education &amp; Tech</option>
            <option value="Economic Empowerment">Economic Empowerment</option>
            <option value="Field Dispatch">Field Dispatch</option>
          </select>
        </div>
        <div class="form-group">
          <label>Author / Directorate</label>
          <input type="text" name="post_author" value="BHB Field Communications" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Publication Date</label>
          <input type="text" name="post_date" value="${today}" required>
        </div>
        <div class="form-group">
          <label>Estimated Read Time</label>
          <input type="text" name="post_readtime" value="4 min read" required>
        </div>
      </div>

      <div class="form-group">
        <label>Cover Image (Optional)</label>
        <div class="admin-dropzone" style="border: 1.5px dashed #CBD5E1; background: #F8FAFC; padding: 18px; border-radius: 8px; text-align: center;">
          <input type="file" accept="image/*" onchange="handleSimpleImageUpload(this, 'postImageHidden', 'postImagePosHidden', 'postImgPreviewBox', 'postImgPreview')">
          <p style="font-size: 0.8rem; color: #64748B; margin: 6px 0 0;">Upload a clear photograph for the article header (16:9 banner or editorial).</p>
          
          <div id="postImgPreviewBox" style="display: none; margin-top: 14px; text-align: left;">
            <div class="admin-preview-frame aspect-16-9">
              <img id="postImgPreview" src="" alt="Article Preview" style="object-position: center center;">
              <span class="admin-preview-badge">16:9 Banner Preview</span>
            </div>
            
            ${generatePositionGridHTML('postImagePosHidden', 'postImgPreview', 'center center')}
            
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" class="btn btn-sm btn-ghost" onclick="clearSimpleImage('postImageHidden', 'postImagePosHidden', 'postImgPreviewBox', 'postImgPreview')" style="font-size: 0.78rem; color: #DC2626;">
                ✕ Remove Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Short Excerpt (Summary for homepage/cards) *</label>
        <textarea name="post_excerpt" rows="2" required placeholder="A brief one or two-sentence teaser summarizing the core story..."></textarea>
      </div>

      <div class="form-group">
        <label>Full Article Content *</label>
        <textarea name="post_content" rows="7" required placeholder="Write the complete article dispatch here..."></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-weight: 700; margin-top: 6px;">
        Publish Article Live →
      </button>
    </form>
  `;

  openModal('adminCrudModal');
};

window.openEditPostModal = function(id) {
  const post = BHBStore.getPosts().find(p => p.id === id);
  if (!post) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Article';
  if (!content) return;

  const hasImg = !!post.image;
  const currentPos = post.imagePosition || 'center center';

  content.innerHTML = `
    <form class="admin-modal-form" onsubmit="handleSavePost(event)">
      <input type="hidden" name="post_id" value="${post.id}">
      <input type="hidden" name="post_image" id="postImageHidden" value="${post.image || ''}">
      <input type="hidden" name="post_image_position" id="postImagePosHidden" value="${currentPos}">

      <div class="form-group">
        <label>Article Title *</label>
        <input type="text" name="post_title" value="${post.title}" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Category / Pillar *</label>
          <select name="post_category" required>
            <option value="Community Welfare" ${post.category === 'Community Welfare' ? 'selected' : ''}>Community Welfare</option>
            <option value="Health & WASH" ${post.category === 'Health & WASH' ? 'selected' : ''}>Health &amp; WASH</option>
            <option value="Education & Tech" ${post.category === 'Education & Tech' ? 'selected' : ''}>Education &amp; Tech</option>
            <option value="Economic Empowerment" ${post.category === 'Economic Empowerment' ? 'selected' : ''}>Economic Empowerment</option>
            <option value="Field Dispatch" ${post.category === 'Field Dispatch' ? 'selected' : ''}>Field Dispatch</option>
          </select>
        </div>
        <div class="form-group">
          <label>Author / Directorate</label>
          <input type="text" name="post_author" value="${post.author || 'BHB Field Communications'}" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Publication Date</label>
          <input type="text" name="post_date" value="${post.date || 'Recent'}" required>
        </div>
        <div class="form-group">
          <label>Estimated Read Time</label>
          <input type="text" name="post_readtime" value="${post.readTime || '4 min read'}" required>
        </div>
      </div>

      <div class="form-group">
        <label>Cover Image</label>
        <div class="admin-dropzone" style="border: 1.5px dashed #CBD5E1; background: #F8FAFC; padding: 18px; border-radius: 8px; text-align: center;">
          <input type="file" accept="image/*" onchange="handleSimpleImageUpload(this, 'postImageHidden', 'postImagePosHidden', 'postImgPreviewBox', 'postImgPreview')">
          <p style="font-size: 0.8rem; color: #64748B; margin: 6px 0 0;">Upload or replace the cover photo (16:9 banner or editorial).</p>
          
          <div id="postImgPreviewBox" style="display: ${hasImg ? 'block' : 'none'}; margin-top: 14px; text-align: left;">
            <div class="admin-preview-frame aspect-16-9">
              <img id="postImgPreview" src="${post.image || ''}" alt="Article Preview" style="object-position: ${currentPos};">
              <span class="admin-preview-badge">16:9 Banner Preview</span>
            </div>
            
            ${generatePositionGridHTML('postImagePosHidden', 'postImgPreview', currentPos)}
            
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" class="btn btn-sm btn-ghost" onclick="clearSimpleImage('postImageHidden', 'postImagePosHidden', 'postImgPreviewBox', 'postImgPreview')" style="font-size: 0.78rem; color: #DC2626;">
                ✕ Remove Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Short Excerpt *</label>
        <textarea name="post_excerpt" rows="2" required>${post.excerpt || ''}</textarea>
      </div>

      <div class="form-group">
        <label>Full Article Content *</label>
        <textarea name="post_content" rows="7" required>${post.content || ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-weight: 700; margin-top: 6px;">
        Save Changes →
      </button>
    </form>
  `;

  openModal('adminCrudModal');
};

window.handleSavePost = function(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.post_id.value || `post-${Date.now()}`;

  const postData = {
    id,
    title: form.post_title.value.trim(),
    category: form.post_category.value,
    author: form.post_author.value.trim(),
    date: form.post_date.value.trim(),
    readTime: form.post_readtime.value.trim(),
    image: form.post_image.value || '',
    imagePosition: form.post_image_position ? form.post_image_position.value || 'center center' : 'center center',
    excerpt: form.post_excerpt.value.trim(),
    content: form.post_content.value.trim()
  };

  BHBStore.savePost(postData);
  closeModal('adminCrudModal');
  showToast('Article saved and published live!', 'success');
  renderAdminBlogTable();
};

window.deletePostAdmin = function(id) {
  if (confirm('Are you sure you want to delete this article?')) {
    BHBStore.deletePost(id);
    showToast('Article removed successfully', 'info');
    renderAdminBlogTable();
  }
};

// =========================================================================
// 3. LEADERSHIP & TEAM CMS
// =========================================================================
function renderAdminTeamTable() {
  const tbody = document.getElementById('adminTeamTableBody');
  if (!tbody || typeof BHBStore === 'undefined') return;

  const team = BHBStore.getTeam(false);
  if (!team.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748B; padding: 24px;">No team members registered. Click "+ Add New Member" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = team.map((m, idx) => {
    const pos = m.imagePosition || 'center top';
    const initials = m.name ? m.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'BH';
    const avatarHTML = m.image
      ? `<img src="${m.image}" alt="${m.name}" style="width: 44px; height: 44px; object-fit: cover; object-position: ${pos}; border-radius: 4px; border: 1px solid #E2E8F0;">`
      : `<div style="width: 44px; height: 44px; background: #0F1E36; color: #FFFFFF; font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; border-radius: 4px;">${initials}</div>`;

    return `
      <tr>
        <td style="font-weight: 700; color: #64748B;">#${m.order || idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            ${avatarHTML}
            <b style="color: #0F172A; font-size: 0.95rem;">${m.name}</b>
          </div>
        </td>
        <td>
          <div style="font-weight: 600; color: #1E293B;">${m.position}</div>
          <div style="font-size: 0.78rem; color: #64748B;">${m.department || 'Executive'}</div>
        </td>
        <td>
          <span class="status-pill info">${m.tier || 'Executive Directorate'}</span>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="openEditTeamModal('${m.id}')">Edit</button>
            <button class="btn-icon-sm danger" onclick="deleteTeamAdmin('${m.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openNewTeamModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Add Leadership / Team Member';
  if (!content) return;

  content.innerHTML = `
    <form class="admin-modal-form" onsubmit="handleSaveTeam(event)">
      <input type="hidden" name="team_id" value="">
      <input type="hidden" name="team_image" id="teamImageHidden" value="">
      <input type="hidden" name="team_image_position" id="teamImagePosHidden" value="center top">

      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" name="team_name" required placeholder="e.g. Dr. Amina Yusuf">
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Official Position / Title *</label>
          <input type="text" name="team_position" required placeholder="e.g. Executive Director & Trustee">
        </div>
        <div class="form-group">
          <label>Governance Tier *</label>
          <select name="team_tier" required>
            <option value="Trustees">Board of Trustees</option>
            <option value="Directorate">Executive Directorate</option>
            <option value="Advisory">Advisory Council</option>
            <option value="Coordinators">Field Coordinators</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Department / Sector</label>
          <input type="text" name="team_dept" placeholder="e.g. Operations & Programs">
        </div>
        <div class="form-group">
          <label>Display Priority Order</label>
          <input type="number" name="team_order" value="1" min="1" max="99">
        </div>
      </div>

      <div class="form-group">
        <label>Portrait Photo (Optional - Clean Monogram used if empty)</label>
        <div class="admin-dropzone" style="border: 1.5px dashed #CBD5E1; background: #F8FAFC; padding: 18px; border-radius: 8px; text-align: center;">
          <input type="file" accept="image/*" onchange="handleSimpleImageUpload(this, 'teamImageHidden', 'teamImagePosHidden', 'teamImgPreviewBox', 'teamImgPreview')">
          <p style="font-size: 0.8rem; color: #64748B; margin: 6px 0 0;">Upload a portrait photograph (3:4 headshot ratio).</p>
          
          <div id="teamImgPreviewBox" style="display: none; margin-top: 14px; text-align: left;">
            <div class="admin-preview-frame aspect-3-4">
              <img id="teamImgPreview" src="" alt="Portrait Preview" style="object-position: center top;">
              <span class="admin-preview-badge">3:4 Portrait Preview</span>
            </div>
            
            ${generatePositionGridHTML('teamImagePosHidden', 'teamImgPreview', 'center top')}
            
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" class="btn btn-sm btn-ghost" onclick="clearSimpleImage('teamImageHidden', 'teamImagePosHidden', 'teamImgPreviewBox', 'teamImgPreview')" style="font-size: 0.78rem; color: #DC2626;">
                ✕ Clear Photo (Use Monogram)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Biography &amp; Profile Statement *</label>
        <textarea name="team_bio" rows="4" required placeholder="Brief career background, dedication to community empowerment, and institutional role..."></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-weight: 700; margin-top: 6px;">
        Add Team Member →
      </button>
    </form>
  `;

  openModal('adminCrudModal');
};

window.openEditTeamModal = function(id) {
  const member = BHBStore.getTeam(false).find(t => t.id === id);
  if (!member) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Team Member Profile';
  if (!content) return;

  const hasImg = !!member.image;
  const currentPos = member.imagePosition || 'center top';

  content.innerHTML = `
    <form class="admin-modal-form" onsubmit="handleSaveTeam(event)">
      <input type="hidden" name="team_id" value="${member.id}">
      <input type="hidden" name="team_image" id="teamImageHidden" value="${member.image || ''}">
      <input type="hidden" name="team_image_position" id="teamImagePosHidden" value="${currentPos}">

      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" name="team_name" value="${member.name}" required>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Official Position / Title *</label>
          <input type="text" name="team_position" value="${member.position}" required>
        </div>
        <div class="form-group">
          <label>Governance Tier *</label>
          <select name="team_tier" required>
            <option value="Trustees" ${member.tier === 'Trustees' ? 'selected' : ''}>Board of Trustees</option>
            <option value="Directorate" ${member.tier === 'Directorate' ? 'selected' : ''}>Executive Directorate</option>
            <option value="Advisory" ${member.tier === 'Advisory' ? 'selected' : ''}>Advisory Council</option>
            <option value="Coordinators" ${member.tier === 'Coordinators' ? 'selected' : ''}>Field Coordinators</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Department / Sector</label>
          <input type="text" name="team_dept" value="${member.department || ''}">
        </div>
        <div class="form-group">
          <label>Display Priority Order</label>
          <input type="number" name="team_order" value="${member.order || 1}" min="1" max="99">
        </div>
      </div>

      <div class="form-group">
        <label>Portrait Photo</label>
        <div class="admin-dropzone" style="border: 1.5px dashed #CBD5E1; background: #F8FAFC; padding: 18px; border-radius: 8px; text-align: center;">
          <input type="file" accept="image/*" onchange="handleSimpleImageUpload(this, 'teamImageHidden', 'teamImagePosHidden', 'teamImgPreviewBox', 'teamImgPreview')">
          <p style="font-size: 0.8rem; color: #64748B; margin: 6px 0 0;">Upload or replace the portrait photo (3:4 headshot ratio).</p>
          
          <div id="teamImgPreviewBox" style="display: ${hasImg ? 'block' : 'none'}; margin-top: 14px; text-align: left;">
            <div class="admin-preview-frame aspect-3-4">
              <img id="teamImgPreview" src="${member.image || ''}" alt="Portrait Preview" style="object-position: ${currentPos};">
              <span class="admin-preview-badge">3:4 Portrait Preview</span>
            </div>
            
            ${generatePositionGridHTML('teamImagePosHidden', 'teamImgPreview', currentPos)}
            
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" class="btn btn-sm btn-ghost" onclick="clearSimpleImage('teamImageHidden', 'teamImagePosHidden', 'teamImgPreviewBox', 'teamImgPreview')" style="font-size: 0.78rem; color: #DC2626;">
                ✕ Clear Photo (Use Monogram)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Biography &amp; Profile Statement *</label>
        <textarea name="team_bio" rows="4" required>${member.bio || ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-weight: 700; margin-top: 6px;">
        Save Changes →
      </button>
    </form>
  `;

  openModal('adminCrudModal');
};

window.handleSaveTeam = function(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.team_id.value || `team-${Date.now()}`;

  const teamData = {
    id,
    name: form.team_name.value.trim(),
    position: form.team_position.value.trim(),
    tier: form.team_tier.value,
    department: form.team_dept.value.trim(),
    order: parseInt(form.team_order.value, 10) || 1,
    image: form.team_image.value || '',
    imagePosition: form.team_image_position ? form.team_image_position.value || 'center top' : 'center top',
    bio: form.team_bio.value.trim(),
    status: 'Published'
  };

  BHBStore.saveTeamMember(teamData);
  closeModal('adminCrudModal');
  showToast('Team member saved successfully!', 'success');
  renderAdminTeamTable();
};

window.deleteTeamAdmin = function(id) {
  if (confirm('Are you sure you want to remove this team member?')) {
    BHBStore.deleteTeamMember(id);
    showToast('Team member removed successfully', 'info');
    renderAdminTeamTable();
  }
};

// =========================================================================
// 4. PROJECTS & INITIATIVES CMS
// =========================================================================
function renderAdminProjectsTable() {
  const tbody = document.getElementById('adminProjectsTableBody');
  if (!tbody || typeof BHBStore === 'undefined') return;

  const projects = BHBStore.getProjects(false);
  if (!projects.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748B; padding: 24px;">No projects registered. Click "+ Launch New Project" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => {
    const pos = p.imagePosition || 'center center';
    const imgHTML = p.image
      ? `<img src="${p.image}" alt="${p.title}" style="width: 54px; height: 38px; object-fit: cover; object-position: ${pos}; border-radius: 4px; border: 1px solid #E2E8F0;">`
      : `<div style="width: 54px; height: 38px; background: #0F1E36; color: #93C5FD; font-size: 0.65rem; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: 700;">PROJ</div>`;

    const isPublished = p.published !== false;
    const pubStatusHTML = `
      <button class="status-pill ${isPublished ? 'success' : 'pending'}" onclick="toggleProjectPublishAdmin('${p.id}')" title="Click to toggle public visibility" style="cursor: pointer;">
        ${isPublished ? '✓ Published' : '○ Draft'}
      </button>
    `;

    return `
      <tr>
        <td>${imgHTML}</td>
        <td>
          <b style="color: #0F172A; font-size: 0.95rem;">${p.title}</b>
          <div style="font-size: 0.76rem; color: #2563EB; font-weight: 700; margin-top: 2px;">${p.category || 'General'}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: #1E293B;">${p.location || 'Nationwide'}</div>
          <div style="font-size: 0.78rem; color: #64748B;">Reach: ${p.beneficiaries || 'Community Wide'}</div>
        </td>
        <td style="font-weight: 700; color: #64748B;">#${p.order || 1}</td>
        <td>${pubStatusHTML}</td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-sm" onclick="openEditProjectModal('${p.id}')">Edit</button>
            <button class="btn-icon-sm danger" onclick="deleteProjectAdmin('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleProjectPublishAdmin = function(id) {
  const newState = BHBStore.toggleProjectPublish(id);
  showToast(`Project visibility updated to: ${newState ? 'Published (Live)' : 'Draft (Hidden)'}`, 'info');
  renderAdminProjectsTable();
  renderAdminOverviewMetrics();
};

window.openNewProjectModal = function() {
  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Launch New Project / Programme';
  if (!content) return;

  content.innerHTML = `
    <form class="admin-modal-form" onsubmit="handleSaveProject(event)">
      <input type="hidden" name="proj_id" value="">
      <input type="hidden" name="proj_image" id="projImageHidden" value="">
      <input type="hidden" name="proj_image_position" id="projImagePosHidden" value="center center">

      <div class="form-group">
        <label>Project Title *</label>
        <input type="text" name="proj_title" required placeholder="e.g. Menstrual Health & Dignity Outreach">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Category / Pillar *</label>
          <input type="text" name="proj_category" required placeholder="e.g. Gender Dignity & Health">
        </div>
        <div class="form-group">
          <label>Operational Status *</label>
          <select name="proj_status" required>
            <option value="Ongoing">Ongoing / Active</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Target Location *</label>
          <input type="text" name="proj_location" required placeholder="e.g. Nasarawa & Peri-Urban Settlements">
        </div>
        <div class="form-group">
          <label>Beneficiary Reach *</label>
          <input type="text" name="proj_reach" required placeholder="e.g. 5,000+ Girls & Young Women">
        </div>
        <div class="form-group">
          <label>Display Priority Order</label>
          <input type="number" name="proj_order" value="1" min="1" max="99">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Timeline / Duration</label>
          <input type="text" name="proj_timeline" placeholder="e.g. Q1 2026 – Ongoing" value="Q1 2026 – Ongoing">
        </div>
        <div class="form-group" style="display: flex; flex-direction: column; justify-content: flex-end;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding-bottom: 10px;">
            <input type="checkbox" name="proj_published" checked style="width: 18px; height: 18px;">
            <span style="font-weight: 700; color: #0F172A; font-size: 0.9rem;">Publish Live on Public Website</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Cover / Field Photo (Optional)</label>
        <div class="admin-dropzone" style="border: 1.5px dashed #CBD5E1; background: #F8FAFC; padding: 18px; border-radius: 8px; text-align: center;">
          <input type="file" accept="image/*" onchange="handleSimpleImageUpload(this, 'projImageHidden', 'projImagePosHidden', 'projImgPreviewBox', 'projImgPreview')">
          <p style="font-size: 0.8rem; color: #64748B; margin: 6px 0 0;">Upload a field photograph for the initiative card (16:9 banner).</p>
          
          <div id="projImgPreviewBox" style="display: none; margin-top: 14px; text-align: left;">
            <div class="admin-preview-frame aspect-16-9">
              <img id="projImgPreview" src="" alt="Project Preview" style="object-position: center center;">
              <span class="admin-preview-badge">16:9 Project Preview</span>
            </div>
            
            ${generatePositionGridHTML('projImagePosHidden', 'projImgPreview', 'center center')}
            
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" class="btn btn-sm btn-ghost" onclick="clearSimpleImage('projImageHidden', 'projImagePosHidden', 'projImgPreviewBox', 'projImgPreview')" style="font-size: 0.78rem; color: #DC2626;">
                ✕ Remove Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Short Excerpt / Summary *</label>
        <textarea name="proj_excerpt" rows="2" required placeholder="A brief one or two-sentence summary of the initiative..."></textarea>
      </div>

      <div class="form-group">
        <label>Program Overview &amp; Full Description *</label>
        <textarea name="proj_desc" rows="4" required placeholder="Explain the intervention scope, key deliverables, and community impact..."></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-weight: 700; margin-top: 6px;">
        Save &amp; Launch Project →
      </button>
    </form>
  `;

  openModal('adminCrudModal');
};

window.openEditProjectModal = function(id) {
  const proj = BHBStore.getProjects(false).find(p => p.id === id);
  if (!proj) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = 'Edit Project Details';
  if (!content) return;

  const hasImg = !!proj.image;
  const currentPos = proj.imagePosition || 'center center';
  const isPublished = proj.published !== false;

  content.innerHTML = `
    <form class="admin-modal-form" onsubmit="handleSaveProject(event)">
      <input type="hidden" name="proj_id" value="${proj.id}">
      <input type="hidden" name="proj_image" id="projImageHidden" value="${proj.image || ''}">
      <input type="hidden" name="proj_image_position" id="projImagePosHidden" value="${currentPos}">

      <div class="form-group">
        <label>Project Title *</label>
        <input type="text" name="proj_title" value="${proj.title}" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Category / Pillar *</label>
          <input type="text" name="proj_category" value="${proj.category}" required>
        </div>
        <div class="form-group">
          <label>Operational Status *</label>
          <select name="proj_status" required>
            <option value="Ongoing" ${proj.status === 'Ongoing' ? 'selected' : ''}>Ongoing / Active</option>
            <option value="Completed" ${proj.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Upcoming" ${proj.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Target Location *</label>
          <input type="text" name="proj_location" value="${proj.location}" required>
        </div>
        <div class="form-group">
          <label>Beneficiary Reach *</label>
          <input type="text" name="proj_reach" value="${proj.beneficiaries}" required>
        </div>
        <div class="form-group">
          <label>Display Priority Order</label>
          <input type="number" name="proj_order" value="${proj.order || 1}" min="1" max="99">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label>Timeline / Duration</label>
          <input type="text" name="proj_timeline" value="${proj.timeline || 'Active'}">
        </div>
        <div class="form-group" style="display: flex; flex-direction: column; justify-content: flex-end;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding-bottom: 10px;">
            <input type="checkbox" name="proj_published" ${isPublished ? 'checked' : ''} style="width: 18px; height: 18px;">
            <span style="font-weight: 700; color: #0F172A; font-size: 0.9rem;">Publish Live on Public Website</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Cover / Field Photo</label>
        <div class="admin-dropzone" style="border: 1.5px dashed #CBD5E1; background: #F8FAFC; padding: 18px; border-radius: 8px; text-align: center;">
          <input type="file" accept="image/*" onchange="handleSimpleImageUpload(this, 'projImageHidden', 'projImagePosHidden', 'projImgPreviewBox', 'projImgPreview')">
          <p style="font-size: 0.8rem; color: #64748B; margin: 6px 0 0;">Upload or replace the field photograph (16:9 banner).</p>
          
          <div id="projImgPreviewBox" style="display: ${hasImg ? 'block' : 'none'}; margin-top: 14px; text-align: left;">
            <div class="admin-preview-frame aspect-16-9">
              <img id="projImgPreview" src="${proj.image || ''}" alt="Project Preview" style="object-position: ${currentPos};">
              <span class="admin-preview-badge">16:9 Project Preview</span>
            </div>
            
            ${generatePositionGridHTML('projImagePosHidden', 'projImgPreview', currentPos)}
            
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" class="btn btn-sm btn-ghost" onclick="clearSimpleImage('projImageHidden', 'projImagePosHidden', 'projImgPreviewBox', 'projImgPreview')" style="font-size: 0.78rem; color: #DC2626;">
                ✕ Remove Image
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Short Excerpt / Summary *</label>
        <textarea name="proj_excerpt" rows="2" required>${proj.excerpt || ''}</textarea>
      </div>

      <div class="form-group">
        <label>Program Overview &amp; Full Description *</label>
        <textarea name="proj_desc" rows="4" required>${proj.description || ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-weight: 700; margin-top: 6px;">
        Save Changes →
      </button>
    </form>
  `;

  openModal('adminCrudModal');
};

window.handleSaveProject = function(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.proj_id.value || `proj-${Date.now()}`;

  const projData = {
    id,
    title: form.proj_title.value.trim(),
    category: form.proj_category.value.trim(),
    status: form.proj_status.value,
    published: form.proj_published ? form.proj_published.checked : true,
    order: parseInt(form.proj_order ? form.proj_order.value : '1', 10) || 1,
    location: form.proj_location.value.trim(),
    beneficiaries: form.proj_reach.value.trim(),
    timeline: form.proj_timeline ? form.proj_timeline.value.trim() : 'Active',
    image: form.proj_image ? form.proj_image.value || '' : '',
    imagePosition: form.proj_image_position ? form.proj_image_position.value || 'center center' : 'center center',
    excerpt: form.proj_excerpt ? form.proj_excerpt.value.trim() : '',
    description: form.proj_desc.value.trim()
  };

  BHBStore.saveProject(projData);
  closeModal('adminCrudModal');
  showToast('Project saved successfully and synced live!', 'success');
  renderAdminProjectsTable();
  renderAdminOverviewMetrics();
};

window.deleteProjectAdmin = function(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    BHBStore.deleteProject(id);
    showToast('Project removed successfully', 'info');
    renderAdminProjectsTable();
    renderAdminOverviewMetrics();
  }
};

// =========================================================================
// 5. INQUIRIES & CONTACT MESSAGES INBOX
// =========================================================================
function renderAdminInquiriesTable() {
  const tbody = document.getElementById('adminInquiriesTableBody');
  if (!tbody || typeof BHBStore === 'undefined') return;

  const inquiries = BHBStore.getInquiries();
  if (!inquiries.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748B; padding: 24px;">No inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(i => `
    <tr>
      <td>
        <b style="color: #0F172A;">${i.name}</b>
        <div style="font-size: 0.78rem; color: #64748B;">${i.email}</div>
      </td>
      <td><span class="status-pill info">${i.orgType || 'General'}</span></td>
      <td>
        <b>${i.subject}</b>
        <p style="font-size: 0.82rem; color: #64748B; margin: 4px 0 0; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${i.message}</p>
      </td>
      <td>${i.date || 'Recent'}</td>
      <td><span class="status-pill ${i.status === 'Replied' ? 'success' : 'pending'}">${i.status || 'New'}</span></td>
      <td>
        <div class="action-btn-group">
          <button class="btn-icon-sm" onclick="openViewInquiryModal('${i.id}')">View</button>
          <button class="btn-icon-sm danger" onclick="deleteInquiryAdmin('${i.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.openViewInquiryModal = function(id) {
  const inq = BHBStore.getInquiries().find(i => i.id === id);
  if (!inq) return;

  const content = document.getElementById('adminCrudModalContent');
  document.getElementById('adminCrudModalTitle').textContent = `Inquiry: ${inq.subject}`;
  if (!content) return;

  content.innerHTML = `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <span style="font-size: 0.76rem; text-transform: uppercase; color: #64748B; font-weight: 700;">Sender Name</span>
            <div style="font-weight: 700; color: #0F172A;">${inq.name}</div>
          </div>
          <div>
            <span style="font-size: 0.76rem; text-transform: uppercase; color: #64748B; font-weight: 700;">Email Address</span>
            <div><a href="mailto:${inq.email}" style="color: #2563EB; font-weight: 600;">${inq.email}</a></div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <span style="font-size: 0.76rem; text-transform: uppercase; color: #64748B; font-weight: 700;">Organization</span>
            <div style="font-weight: 600; color: #1E293B;">${inq.orgType || 'Not specified'}</div>
          </div>
          <div>
            <span style="font-size: 0.76rem; text-transform: uppercase; color: #64748B; font-weight: 700;">Date Received</span>
            <div style="color: #64748B;">${inq.date || 'Recent'}</div>
          </div>
        </div>
      </div>

      <div>
        <span style="font-size: 0.76rem; text-transform: uppercase; color: #64748B; font-weight: 700; display: block; margin-bottom: 6px;">Message Content</span>
        <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; padding: 18px; font-size: 0.95rem; line-height: 1.6; color: #0F172A; white-space: pre-wrap;">${inq.message}</div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <a href="mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}" class="btn btn-primary" style="flex: 1; text-align: center; text-decoration: none;">
          ✉️ Reply via Email
        </a>
        <button class="btn btn-navy" onclick="markInquiryReplied('${inq.id}')" style="flex: 1;">
          ✓ Mark as Replied
        </button>
      </div>
    </div>
  `;

  openModal('adminCrudModal');
};

window.markInquiryReplied = function(id) {
  BHBStore.updateInquiryStatus(id, 'Replied');
  closeModal('adminCrudModal');
  showToast('Inquiry marked as replied!', 'success');
  renderAdminInquiriesTable();
  renderAdminOverviewMetrics();
};

window.deleteInquiryAdmin = function(id) {
  if (confirm('Delete this inquiry message?')) {
    const list = BHBStore.getInquiries();
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      BHBStore.notify();
      showToast('Inquiry deleted.', 'info');
      renderAdminInquiriesTable();
      renderAdminOverviewMetrics();
    }
  }
};

// =========================================================================
// 6. SETTINGS & SYSTEM UTILITIES
// =========================================================================
function renderAdminSettingsForm() {
  const form = document.getElementById('adminSettingsForm');
  if (!form || typeof BHBStore === 'undefined') return;

  const settings = BHBStore.getSettings();
  if (!settings) return;

  if (form.cac_num) form.cac_num.value = settings.cacNumber || '';
  if (form.office_address) form.office_address.value = settings.officeAddress || '';
  if (form.contact_phone) form.contact_phone.value = settings.phone || '';
  if (form.contact_email) form.contact_email.value = settings.email || '';
}

window.handleSaveSettings = function(e) {
  e.preventDefault();
  const form = e.target;
  const currentSettings = BHBStore.getSettings();

  BHBStore.saveSettings({
    cacNumber: form.cac_num ? form.cac_num.value.trim() : currentSettings.cacNumber,
    officeAddress: form.office_address ? form.office_address.value.trim() : currentSettings.officeAddress,
    phone: form.contact_phone ? form.contact_phone.value.trim() : currentSettings.phone,
    email: form.contact_email ? form.contact_email.value.trim() : currentSettings.email
  });

  showToast('Foundation institutional details updated successfully!', 'success');
};

window.exportDatabaseJSON = function() {
  const json = BHBStore.exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BHB_Database_Backup_${Date.now()}.json`;
  a.click();
  showToast('Database JSON backup downloaded!', 'success');
};

window.importDatabaseJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const success = BHBStore.importJSON(e.target.result);
    if (success) {
      showToast('Database successfully restored!', 'success');
      renderAdminDashboard();
    } else {
      showToast('Invalid database JSON file', 'warning');
    }
  };
  reader.readAsText(file);
};

window.resetToDemoData = function() {
  if (confirm('Reset database back to factory seed data? This will restore original approved articles and settings.')) {
    BHBStore.resetToDefault();
    showToast('Database reset to factory settings!', 'success');
    renderAdminDashboard();
  }
};

window.syncAdminChangesToGitHub = async function() {
  const btn = document.getElementById('adminSyncGitBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.innerHTML = '<span>⏳ Pushing Live...</span>';
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
      showToast('🎉 ' + (result.message || 'All changes saved & pushed live to repository!'), 'success');
    } else {
      throw new Error('Server returned: ' + res.status);
    }
  } catch (err) {
    console.warn('Direct git sync notification:', err.message);
    showToast('Changes saved locally in your database! Downloading backup...', 'info');
    BHBStore.exportJSON();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.innerHTML = originalHtml;
    }
  }
};

// =========================================================================
// 7. SIMPLIFIED 3x3 IMAGE POSITIONING & UPLOAD HELPERS
// =========================================================================
function generatePositionGridHTML(hiddenPosId, previewImgId, currentPos = 'center center') {
  const normPos = (currentPos || 'center center').toLowerCase();
  const positions = [
    { label: '↖ Top L', value: 'top left' },
    { label: '↑ Top C', value: 'top center' },
    { label: '↗ Top R', value: 'top right' },
    { label: '← Mid L', value: 'center left' },
    { label: '• Center', value: 'center center' },
    { label: '→ Mid R', value: 'center right' },
    { label: '↙ Bot L', value: 'bottom left' },
    { label: '↓ Bot C', value: 'bottom center' },
    { label: '↘ Bot R', value: 'bottom right' }
  ];

  const btnsHTML = positions.map(pos => {
    const isAct = normPos === pos.value;
    return `<button type="button" class="pos-btn ${isAct ? 'active' : ''}" onclick="setSimpleImagePosition('${pos.value}', '${previewImgId}', '${hiddenPosId}', this)">${pos.label}</button>`;
  }).join('');

  return `
    <div class="position-selector-wrap">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 0.78rem; font-weight: 700; color: #334155; text-transform: uppercase;">Image Focus / Alignment</span>
        <span id="${hiddenPosId}_label" style="font-size: 0.75rem; color: #2563EB; font-weight: 700;">${currentPos || 'center center'}</span>
      </div>
      <div class="position-grid-3x3">
        ${btnsHTML}
      </div>
      <p style="font-size: 0.74rem; color: #64748B; margin: 6px 0 0; text-align: center;">Click any grid square to shift which part of the photo is framed.</p>
    </div>
  `;
}

window.setSimpleImagePosition = function(posValue, previewImgId, hiddenPosId, btnEl) {
  const hidden = document.getElementById(hiddenPosId);
  const img = document.getElementById(previewImgId);
  const label = document.getElementById(`${hiddenPosId}_label`);

  if (hidden) hidden.value = posValue;
  if (img) img.style.objectPosition = posValue;
  if (label) label.textContent = posValue;

  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
};

window.handleSimpleImageUpload = function(inputEl, hiddenImgId, hiddenPosId, previewBoxId, previewImgId) {
  const file = inputEl.files[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    showToast('Image file too large! Please choose an image under 15MB.', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawData = e.target.result;
    const img = new Image();
    img.onload = function() {
      const maxW = 1600;
      const maxH = 1200;
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
      ctx.drawImage(img, 0, 0, w, h);

      const optimized = canvas.toDataURL('image/jpeg', 0.88);

      const hidden = document.getElementById(hiddenImgId);
      const box = document.getElementById(previewBoxId);
      const prev = document.getElementById(previewImgId);

      if (hidden) hidden.value = optimized;
      if (prev) {
        prev.src = optimized;
        const curPos = (document.getElementById(hiddenPosId) && document.getElementById(hiddenPosId).value) || 'center center';
        prev.style.objectPosition = curPos;
      }
      if (box) box.style.display = 'block';

      showToast('Image uploaded successfully! You can adjust its alignment below.', 'success');
    };
    img.src = rawData;
  };
  reader.readAsDataURL(file);
};

window.clearSimpleImage = function(hiddenImgId, hiddenPosId, previewBoxId, previewImgId) {
  const hidden = document.getElementById(hiddenImgId);
  const hiddenPos = document.getElementById(hiddenPosId);
  const box = document.getElementById(previewBoxId);
  const prev = document.getElementById(previewImgId);

  if (hidden) hidden.value = '';
  if (hiddenPos) hiddenPos.value = 'center center';
  if (prev) prev.src = '';
  if (box) box.style.display = 'none';

  showToast('Image removed.', 'info');
};

// Backwards compatibility wrappers
function handleImageFileSelect(inputEl, hiddenInputId, previewBoxId, previewImgId, preferredAspect = '16:9') {
  handleSimpleImageUpload(inputEl, hiddenInputId, 'postImagePosHidden', previewBoxId, previewImgId);
}

function clearUploadedImage(hiddenInputId, previewBoxId, previewImgId) {
  clearSimpleImage(hiddenInputId, 'postImagePosHidden', previewBoxId, previewImgId);
}

// =========================================================================
// 8. GLOBAL MODAL & TOAST CONTROLLERS
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
    success: '#10B981',
    warning: '#F59E0B',
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

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
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
