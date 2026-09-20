/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * EDITORIAL NGO PORTAL CONTROLLER (WITH BLOG, LIKES, COMMENTS & SOCIAL SHARING)
 */

let heroCurrentSlide = 0;
let heroSlideTimer = null;
let currentBlogCategory = 'All';
let currentBlogSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderAllSections();
  setupNavigation();

  if (window.location.pathname === '/admin' || window.location.pathname === '/admin/' || window.location.search.includes('openAdmin=true') || localStorage.getItem('openAdmin') === 'true') {
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
            ${s.label ? `<span class="section-label label-light">${s.label}</span>` : ''}
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
      <button class="slider-arrow-btn" onclick="prevSlide()" aria-label="Previous Slide">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="slider-arrow-btn" onclick="nextSlide()" aria-label="Next Slide">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
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

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
    }, { passive: true });
  }
}

function startHeroAutoPlay() {
  stopHeroAutoPlay();
  heroSlideTimer = setInterval(() => {
    nextSlide();
  }, 6000);
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
  if (slides[heroCurrentSlide]) slides[heroCurrentSlide].classList.add('active');
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
  renderBlogPage();
  renderTeam();
  renderPartners();
  renderSettingsMetadata();

  if (typeof window.initScrollReveals === 'function') {
    window.initScrollReveals();
  }
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

// 4. Focus Areas (High-Standard Animated Cards)
function renderFocusAreas() {
  const container = document.getElementById('focusAreasGrid');
  if (!container) return;

  const areas = BHBStore.getFocusAreas();
  container.innerHTML = areas.map((a, idx) => `
    <div class="focus-area-item interactive-lift reveal-up in" onclick="location.href='projects.html'">
      <div class="focus-area-thumb-wrapper">
        <img src="${a.image}" alt="${a.title}" class="focus-area-thumb" loading="lazy">
        <div class="focus-area-badge">Pillar 0${idx + 1}</div>
      </div>
      <div class="focus-area-body">
        <div>
          <h3>${a.title}</h3>
          <p>${a.summary}</p>
        </div>
        <div class="focus-area-footer">
          <span>Priority Field Program</span>
          <span class="arrow">Explore Projects →</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 5. Projects & Programs (Active Programs Dynamic Rendering)
function renderProjects() {
  const projects = BHBStore.getProjects();

  // A. Homepage Grid Container
  const homeGrid = document.getElementById('homepageProjectsGrid');
  if (homeGrid) {
    const featuredList = projects.slice(0, 3);
    if (!featuredList.length) {
      homeGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">No active programs currently published.</div>';
    } else {
      homeGrid.innerHTML = featuredList.map(p => `
        <div class="portfolio-card interactive-lift reveal-up in" style="border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid #E2E8F0; display: flex; flex-direction: column; cursor: pointer;" onclick="openProjectDetailsModal('${p.id}')">
          <div class="portfolio-card-thumb-wrap" style="position: relative;">
            <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 220px; object-fit: cover; display: block;">
            <div style="position: absolute; top: 12px; left: 12px; background: rgba(15,30,54,0.85); color: #FFF; padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; text-transform: uppercase; font-weight: 700;">${p.category}</div>
          </div>
          <div class="portfolio-card-body" style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1;">
            <div style="flex-grow: 1;">
              <h3 style="font-size: 1.15rem; color: var(--navy); margin-bottom: 8px; line-height: 1.35;">${p.title}</h3>
              <p style="font-size: 0.9rem; color: var(--text-body); line-height: 1.55; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</p>
            </div>
            <div class="portfolio-meta-list" style="font-size: 0.85rem; border-top: 1px solid var(--border-light); padding-top: 12px; margin-top: 12px;">
              <div class="portfolio-meta-item" style="margin-bottom: 4px;">
                <span style="color: var(--text-muted);">Timeline:</span>
                <b style="color: var(--navy);">${p.timeline || 'Active'}</b>
              </div>
              <div class="portfolio-meta-item">
                <span style="color: var(--text-muted);">Status:</span>
                <b style="color: var(--blue);">${p.status || 'Ongoing'}</b>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // B. Legacy Secondary Containers
  const featuredContainer = document.getElementById('projectFeaturedContainer');
  const secondaryContainer = document.getElementById('projectSecondaryGrid');
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

// 6. Full Dynamic Blog Rendering (Supports blog.html and homepage index.html)
function renderBlogPage() {
  const allPosts = BHBStore.getPosts();

  // Filter by category and search query
  let filtered = allPosts;
  if (currentBlogCategory && currentBlogCategory !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(currentBlogCategory.toLowerCase()));
  }
  if (currentBlogSearchQuery.trim()) {
    const q = currentBlogSearchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.content && p.content.toLowerCase().includes(q)) ||
      (p.author && p.author.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  // Clear lead containers if they exist (clean uniform grid layout)
  const blogLeadContainer = document.getElementById('blogLeadContainer');
  if (blogLeadContainer) blogLeadContainer.style.display = 'none';

  // Render unified grid in blogSecondaryGrid for blog.html
  const blogSecondaryGrid = document.getElementById('blogSecondaryGrid');
  if (blogSecondaryGrid) {
    if (filtered.length === 0) {
      blogSecondaryGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No reports match your search criteria.</div>';
    } else {
      blogSecondaryGrid.style.display = 'grid';
      blogSecondaryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
      blogSecondaryGrid.style.gap = '30px';

      blogSecondaryGrid.innerHTML = filtered.map(p => `
        <div class="news-card blog-card interactive-lift reveal-up in" style="border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid #E2E8F0; display: flex; flex-direction: column; cursor: pointer; height: 100%;" onclick="openBlogPostReader('${p.id}')">
          <div style="position: relative;">
            <img src="${p.image}" alt="${p.title}" class="blog-card-thumb" style="width: 100%; height: 220px; object-fit: cover; display: block;">
            <div style="position: absolute; top: 12px; left: 12px; background: rgba(15,30,54,0.85); color: #FFF; padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; text-transform: uppercase; font-weight: 700;">${p.category}</div>
          </div>
          <div class="blog-card-body" style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                <span>${p.date || 'Recent Report'}</span> · <span>${p.readTime || '3 min read'}</span>
              </div>
              <h3 style="font-size: 1.15rem; color: var(--navy); margin-bottom: 8px; line-height: 1.35; min-height: 2.7em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.title}</h3>
              <p style="font-size: 0.9rem; color: var(--text-body); line-height: 1.55; margin-bottom: 12px; min-height: 4.2em; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${p.excerpt || p.content.substring(0, 110) + '...'}</p>
            </div>
            <div style="font-size: 0.85rem; border-top: 1px solid var(--border-light); padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center; color: var(--text-muted);">
              <span>${p.author || 'BHB Editorial'}</span>
              <span style="color: var(--blue); font-weight: 700;">Read Article →</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // B. Render for index.html (Homepage)
  const homeBlogGrid = document.getElementById('homeBlogGrid');
  if (homeBlogGrid) {
    const homePosts = allPosts.slice(0, 3);
    if (!homePosts.length) {
      homeBlogGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">No stories currently published.</div>';
    } else {
      homeBlogGrid.style.display = 'grid';
      homeBlogGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
      homeBlogGrid.style.gap = '30px';
      homeBlogGrid.innerHTML = homePosts.map(p => `
        <div class="news-card blog-card interactive-lift reveal-up in" style="border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid #E2E8F0; display: flex; flex-direction: column; cursor: pointer; height: 100%;" onclick="openBlogPostReader('${p.id}')">
          <div style="position: relative;">
            <img src="${p.image}" alt="${p.title}" class="blog-card-thumb" style="width: 100%; height: 220px; object-fit: cover; display: block;">
            <div style="position: absolute; top: 12px; left: 12px; background: rgba(15,30,54,0.85); color: #FFF; padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; text-transform: uppercase; font-weight: 700;">${p.category}</div>
          </div>
          <div class="blog-card-body" style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                <span>${p.date || 'Recent Report'}</span> · <span>${p.readTime || '3 min read'}</span>
              </div>
              <h3 style="font-size: 1.15rem; color: var(--navy); margin-bottom: 8px; line-height: 1.35; min-height: 2.7em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.title}</h3>
              <p style="font-size: 0.9rem; color: var(--text-body); line-height: 1.55; margin-bottom: 12px; min-height: 4.2em; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${p.excerpt || p.content.substring(0, 110) + '...'}</p>
            </div>
            <div style="font-size: 0.85rem; border-top: 1px solid var(--border-light); padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center; color: var(--text-muted);">
              <span>${p.author || 'BHB Editorial'}</span>
              <span style="color: var(--blue); font-weight: 700;">Read Article →</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

window.filterBlogCategory = function(cat) {
  currentBlogCategory = cat;
  document.querySelectorAll('.blog-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === cat);
  });
  renderBlogPage();
};

window.handleBlogSearch = function(query) {
  currentBlogSearchQuery = query;
  renderBlogPage();
};

// Interactive Blog Post Reader (With Likes, Social Sharing, Comments)
window.openBlogPostReader = function(postId) {
  const post = BHBStore.getPostById(postId);
  if (!post) return;

  const comments = BHBStore.getCommentsByPost(postId);
  const content = document.getElementById('blogReaderModalContent');
  if (!content) return;

  const currentUrl = window.location.origin + window.location.pathname;

  content.innerHTML = `
    <div class="blog-reader-container">
      <div class="blog-reader-header">
        <span class="blog-reader-tag">${post.category} · ${post.date}</span>
        <h1 class="blog-reader-title">${post.title}</h1>
        
        <div class="blog-author-row">
          <div class="blog-author-info">
            <div class="blog-author-avatar">${post.author.charAt(0)}</div>
            <div>
              <div style="font-weight: 700; color: var(--navy); font-size: 0.95rem;">${post.author}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${post.authorRole || 'BHB Editorial Team'} · ${post.readTime || '4 min read'}</div>
            </div>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Published in Kano, Nigeria
          </div>
        </div>
      </div>

      <img src="${post.image}" alt="${post.title}" class="blog-reader-banner">

      <div class="blog-reader-content">${post.content || post.excerpt}</div>

      ${(post.tags && post.tags.length) ? `
        <div class="blog-tags-list">
          ${post.tags.map(t => `<span class="blog-tag-pill">#${t}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Interactive Actions Bar (Like & Share) -->
      <div class="blog-actions-bar">
        <div>
          <button class="like-btn-action ${post.likedByUser ? 'liked' : ''}" id="readerLikeBtn" onclick="toggleLikePost('${post.id}')">
            <span>${post.likedByUser ? '❤️ Liked' : '🤍 Like'}</span>
            <span id="readerLikeCount">${post.likes || 0}</span> Likes
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-size: 0.84rem; font-weight: 700; color: var(--navy);">Share Article:</span>
          <div class="share-btn-group">
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + currentUrl)}" target="_blank" class="share-icon-btn" title="Share on WhatsApp">
              WhatsApp
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}" target="_blank" class="share-icon-btn" title="Share on X / Twitter">
              X (Twitter)
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}" target="_blank" class="share-icon-btn" title="Share on Facebook">
              Facebook
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}" target="_blank" class="share-icon-btn" title="Share on LinkedIn">
              LinkedIn
            </a>
            <button class="share-icon-btn" onclick="copyArticleLink('${currentUrl}')" title="Copy Link">
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <!-- Live Comments Section -->
      <div class="blog-comments-container">
        <h3 style="font-size: 1.3rem; color: var(--navy); margin-bottom: 20px;">
          Community Discussion (${comments.length})
        </h3>

        <!-- Comments List -->
        <div id="blogPostCommentsList">
          ${comments.length ? comments.map(c => `
            <div class="comment-item">
              <div class="comment-header">
                <span class="comment-author">${c.authorName}</span>
                <span class="comment-date">${c.date}</span>
              </div>
              <div class="comment-body">${c.content}</div>
            </div>
          `).join('') : `
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">No comments yet. Be the first to join the discussion!</p>
          `}
        </div>

        <!-- Leave a Comment Form -->
        <div style="background: var(--bg-off); border: 1px solid var(--border-light); padding: 24px; margin-top: 24px;">
          <h4 style="color: var(--navy); margin-bottom: 14px; font-size: 1.1rem;">Leave a Comment</h4>
          <form onsubmit="submitBlogComment(event, '${post.id}')">
            <div class="form-row">
              <div class="form-group">
                <label>Your Name *</label>
                <input type="text" id="commentAuthorName" required placeholder="e.g. Dr. Aminu Kano">
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" id="commentAuthorEmail" required placeholder="name@email.com">
              </div>
            </div>
            <div class="form-group">
              <label>Your Thoughts &amp; Feedback *</label>
              <textarea id="commentBody" rows="3" required placeholder="Share your perspective on this initiative..."></textarea>
            </div>
            <button type="submit" class="btn btn-navy btn-sm" style="margin-top: 10px;">Post Comment →</button>
          </form>
        </div>

      </div>

    </div>
  `;

  openModal('blogReaderModal');
};

// Like Toggle Handler
window.toggleLikePost = function(postId) {
  const newCount = BHBStore.likePost(postId);
  const post = BHBStore.getPostById(postId);
  const btn = document.getElementById('readerLikeBtn');
  const countEl = document.getElementById('readerLikeCount');

  if (btn && post) {
    btn.classList.toggle('liked', post.likedByUser);
    btn.querySelector('span').textContent = post.likedByUser ? '❤️ Liked' : '🤍 Like';
  }
  if (countEl) countEl.textContent = newCount;

  showToast(post.likedByUser ? 'Thank you for liking this dispatch!' : 'Removed like', 'info');
  renderBlogPage();
};

// Copy Article Link
window.copyArticleLink = function(url) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Article link copied to clipboard!', 'success');
    });
  } else {
    showToast('Link copied: ' + url, 'info');
  }
};

// Comment Submission Handler
window.submitBlogComment = function(e, postId) {
  e.preventDefault();
  const name = document.getElementById('commentAuthorName').value;
  const email = document.getElementById('commentAuthorEmail').value;
  const body = document.getElementById('commentBody').value;

  BHBStore.addComment({
    postId,
    authorName: name,
    authorEmail: email,
    content: body
  });

  showToast('Your comment has been posted live!', 'success');
  // Refresh modal reader view
  openBlogPostReader(postId);
  renderBlogPage();
};

// 7. Team & Leadership Showcase (Dynamic Live Rendering from Store)
function renderTeam() {
  let team = BHBStore.getTeam();
  if (!team || !team.length) {
    team = (typeof DEFAULT_STORE_DATA !== 'undefined' && DEFAULT_STORE_DATA.team) ? DEFAULT_STORE_DATA.team : [];
  }
  if (!team || !team.length) return;

  const chairman = team.find(m => m.tier === 'Trustees' || m.position.toLowerCase().includes('chairman') || m.id === 'team-1') || team[0];
  const others = team.filter(m => m.id !== chairman.id);

  // 1. Render Chairman Spotlight on both index.html and team.html
  const spotlightContainers = document.querySelectorAll('.dynamic-team-spotlight');
  spotlightContainers.forEach(container => {
    container.classList.add('in');
    container.innerHTML = `
      <div class="executive-spotlight-photo-frame">
        <img src="${chairman.image}" alt="${chairman.name}" class="executive-spotlight-photo">
        <div class="executive-badge-ribbon">Board of Trustees · Institutional Founder</div>
      </div>
      <div class="executive-spotlight-details">
        <div>
          <span class="executive-tier-tag">Executive Leadership</span>
          <h3 class="executive-name">${chairman.name}</h3>
          <div class="executive-title">${chairman.position}</div>
          <div class="executive-quote">
            “Our mandate is to build self-sustaining community structures where every family, woman, and youth is treated with unconditional dignity and given the practical tools to thrive.”
          </div>
          <p class="executive-bio-text">${chairman.bio}</p>
        </div>
        <div class="executive-purview-tags">
          <span class="purview-tag">Strategic Governance</span>
          <span class="purview-tag">Health Equity</span>
          <span class="purview-tag">Grassroots Mobilization</span>
          <span class="purview-tag">Northern Nigeria Focus</span>
        </div>
      </div>
    `;
  });

  // 2. Render Directorate & Staff Grid on both index.html and team.html
  const gridContainers = document.querySelectorAll('.dynamic-team-grid');
  gridContainers.forEach(container => {
    const isHomePage = container.hasAttribute('data-home-limit');
    const displayList = isHomePage ? others.slice(0, 3) : others;

    container.innerHTML = displayList.map(m => `
      <div class="team-card-cinematic interactive-lift reveal-up in">
        <div class="team-card-photo-wrapper">
          <img src="${m.image}" alt="${m.name}" loading="lazy" class="team-card-portrait">
          <div class="team-card-photo-vignette"></div>
          
          <!-- Default Base Info (Name & Role) -->
          <div class="team-card-default-info">
            <h4 class="team-card-name">${m.name}</h4>
            <div class="team-card-role">${m.position}</div>
            <div class="team-hover-hint">Hover for bio <span>→</span></div>
          </div>

          <!-- Cinematic Slide-Up Hover Overlay (Reveals "About You") -->
          <div class="team-card-hover-overlay">
            <div>
              <h4 class="team-hover-name">${m.name}</h4>
              <div class="team-hover-role">${m.position}</div>
            </div>

            <div class="team-hover-about">
              <div class="team-hover-about-label">Biography &amp; Leadership Profile</div>
              <p class="team-hover-bio">${m.bio}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  });
}

// 8. Partners (Sliding Big Logo Marquee)
function renderPartners() {
  const container = document.getElementById('partnersTrack') || document.querySelector('.partners-track') || document.getElementById('partnersStrip');
  if (!container) return;

  if (typeof renderPartnersHTML === 'function') {
    container.innerHTML = renderPartnersHTML();
  }
}

// 9. Settings & Metadata
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

  // Dynamic About Section Feature Image
  const aboutImg = settings.aboutImage || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
  document.querySelectorAll('[data-bind-src="aboutImage"], #aboutShowcaseImg, #aboutStoryImg').forEach(el => {
    el.src = aboutImg;
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

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 20px; flex-wrap: wrap; gap: 10px;">
          <span style="font-size: 0.9rem; color: var(--text-muted);">Status: <b>${proj.status}</b> | Beneficiaries: <b>${proj.beneficiaries}</b></span>
          <button class="btn btn-navy btn-sm" onclick="openDonateModal()">Support This Initiative →</button>
        </div>
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
