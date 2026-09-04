/**
 * BHB FAMILY SUPPORT AND DEVELOPMENT FOUNDATION
 * IN-BROWSER INTERACTIVE IMAGE CROPPER & ENHANCEMENT ENGINE
 */

class AdminImageCropper {
  constructor() {
    this.modal = null;
    this.canvas = null;
    this.ctx = null;
    this.image = new Image();
    this.currentFile = null;
    this.previewElId = null;
    this.hiddenInputName = null;

    this.scale = 1;
    this.minScale = 0.2;
    this.maxScale = 4;
    this.posX = 0;
    this.posY = 0;
    this.rotation = 0; // 0, 90, 180, 270
    this.aspectRatio = 16 / 9; // default: 16:9
    this.aspectMode = '16:9';

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    document.addEventListener('DOMContentLoaded', () => {
      this.initModal();
    });
  }

  initModal() {
    // If modal already in DOM, bind it; otherwise create it
    let modal = document.getElementById('adminImageCropModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-backdrop';
      modal.id = 'adminImageCropModal';
      modal.innerHTML = `
        <div class="modal-window" style="background: #FFFFFF; color: #0F172A; max-width: 760px; width: 95%; border-radius: 8px; border: 1px solid #E2E8F0; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding: 16px 24px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0;">Crop &amp; Frame Image</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 2px 0 0;">Position, zoom, rotate, and choose an aspect ratio before uploading.</p>
            </div>
            <button onclick="adminCropper.close()" style="background:none; border:none; font-size:1.6rem; color:#64748B; cursor:pointer;">×</button>
          </div>

          <div style="padding: 20px 24px;">
            <!-- Aspect Ratio Selector -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 0.82rem; font-weight: 700; color: #475569;">Aspect Ratio:</span>
                <button type="button" class="crop-aspect-btn" data-aspect="3:4" onclick="adminCropper.setAspect('3:4', 3/4)">3:4 Headshot</button>
                <button type="button" class="crop-aspect-btn" data-aspect="4:5" onclick="adminCropper.setAspect('4:5', 4/5)">4:5 Portrait</button>
                <button type="button" class="crop-aspect-btn active" data-aspect="16:9" onclick="adminCropper.setAspect('16:9', 16/9)">16:9 Banner</button>
                <button type="button" class="crop-aspect-btn" data-aspect="4:3" onclick="adminCropper.setAspect('4:3', 4/3)">4:3 Editorial</button>
                <button type="button" class="crop-aspect-btn" data-aspect="1:1" onclick="adminCropper.setAspect('1:1', 1)">1:1 Square</button>
                <button type="button" class="crop-aspect-btn" data-aspect="free" onclick="adminCropper.setAspect('free', null)">Freeform</button>
              </div>

              <!-- Rotation Buttons -->
              <div style="display: flex; gap: 6px;">
                <button type="button" class="crop-tool-btn" onclick="adminCropper.rotate(-90)" title="Rotate Left">↶ 90°</button>
                <button type="button" class="crop-tool-btn" onclick="adminCropper.rotate(90)" title="Rotate Right">↷ 90°</button>
                <button type="button" class="crop-tool-btn" onclick="adminCropper.resetPosition()" title="Reset Position">↺ Reset</button>
              </div>
            </div>

            <!-- Canvas Viewport -->
            <div class="crop-canvas-wrapper" style="position: relative; width: 100%; height: 380px; background: #0F172A; border-radius: 6px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: grab;">
              <canvas id="cropCanvasMain" width="700" height="380" style="display: block;"></canvas>
              <div class="crop-overlay-guide" id="cropOverlayGuide"></div>
            </div>

            <!-- Zoom Controls -->
            <div style="display: flex; align-items: center; gap: 14px; margin-top: 14px;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #475569; min-width: 50px;">Zoom:</span>
              <button type="button" class="crop-tool-btn" onclick="adminCropper.stepZoom(-0.15)">-</button>
              <input type="range" id="cropZoomSlider" min="0.2" max="3.5" step="0.05" value="1" style="flex: 1; cursor: pointer;" oninput="adminCropper.onZoomChange(this.value)">
              <button type="button" class="crop-tool-btn" onclick="adminCropper.stepZoom(0.15)">+</button>
            </div>
          </div>

          <!-- Modal Footer -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #F8FAFC; border-top: 1px solid #E2E8F0;">
            <button type="button" class="btn btn-outline btn-sm" onclick="adminCropper.useOriginal()">Use Original (No Crop)</button>
            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn btn-outline btn-sm" onclick="adminCropper.close()">Cancel</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="adminCropper.applyCrop()">Apply &amp; Save Crop</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modal = modal;
    this.canvas = document.getElementById('cropCanvasMain');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.bindCanvasEvents();
    }
  }

  bindCanvasEvents() {
    if (!this.canvas) return;

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.canvas.style.cursor = 'grabbing';
      this.startX = e.clientX - this.posX;
      this.startY = e.clientY - this.posY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.posX = e.clientX - this.startX;
      this.posY = e.clientY - this.startY;
      this.render();
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.canvas) this.canvas.style.cursor = 'grab';
      }
    });

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.posX;
        this.startY = e.touches[0].clientY - this.posY;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      this.posX = e.touches[0].clientX - this.startX;
      this.posY = e.touches[0].clientY - this.startY;
      this.render();
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
      this.stepZoom(zoomFactor);
    }, { passive: false });
  }

  open(file, previewElId, hiddenInputName, preferredAspect = '3:4') {
    this.currentFile = file;
    this.previewElId = previewElId;
    this.hiddenInputName = hiddenInputName;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.image = new Image();
      this.image.onload = () => {
        this.resetPosition();
        if (preferredAspect === '3:4') this.setAspect('3:4', 3/4);
        else if (preferredAspect === '4:5') this.setAspect('4:5', 4/5);
        else if (preferredAspect === '1:1') this.setAspect('1:1', 1);
        else if (preferredAspect === '4:3') this.setAspect('4:3', 4/3);
        else if (preferredAspect === 'free') this.setAspect('free', null);
        else this.setAspect('16:9', 16/9);

        if (this.modal) this.modal.classList.add('active');
        this.render();
      };
      this.image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  close() {
    if (this.modal) this.modal.classList.remove('active');
  }

  resetPosition() {
    if (!this.canvas || !this.image) return;
    const iw = this.image.naturalWidth || this.image.width || 700;
    const ih = this.image.naturalHeight || this.image.height || 380;

    // Calculate responsive fit scale so photo fills viewport comfortably without exploding at 1:1
    const fitScale = Math.min((this.canvas.width * 0.85) / iw, (this.canvas.height * 0.85) / ih);
    this.scale = fitScale > 0 ? fitScale : 1;
    this.minScale = Math.max(this.scale * 0.25, 0.05);
    this.maxScale = Math.max(this.scale * 5, 3.5);
    this.rotation = 0;
    this.posX = this.canvas.width / 2;
    this.posY = this.canvas.height / 2;

    const slider = document.getElementById('cropZoomSlider');
    if (slider) {
      slider.min = this.minScale.toFixed(3);
      slider.max = this.maxScale.toFixed(3);
      slider.step = ((this.maxScale - this.minScale) / 100).toFixed(4);
      slider.value = this.scale.toFixed(3);
    }
    this.render();
  }

  setAspect(mode, ratio) {
    this.aspectMode = mode;
    this.aspectRatio = ratio;

    document.querySelectorAll('.crop-aspect-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-aspect') === mode);
    });

    this.updateCropGuide();
    this.render();
  }

  updateCropGuide() {
    const guide = document.getElementById('cropOverlayGuide');
    if (!guide || !this.canvas) return;

    if (this.aspectMode === 'free' || !this.aspectRatio) {
      guide.style.width = '90%';
      guide.style.height = '85%';
      return;
    }

    const maxW = this.canvas.width * 0.88;
    const maxH = this.canvas.height * 0.85;

    let targetW = maxW;
    let targetH = targetW / this.aspectRatio;

    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * this.aspectRatio;
    }

    guide.style.width = `${targetW}px`;
    guide.style.height = `${targetH}px`;
  }

  rotate(deg) {
    this.rotation = (this.rotation + deg + 360) % 360;
    this.render();
  }

  onZoomChange(val) {
    this.scale = parseFloat(val) || 1;
    this.render();
  }

  stepZoom(delta) {
    const stepAmount = (this.maxScale - this.minScale) * 0.06;
    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + (delta > 0 ? stepAmount : -stepAmount)));
    const slider = document.getElementById('cropZoomSlider');
    if (slider) slider.value = this.scale.toFixed(3);
    this.render();
  }

  render() {
    if (!this.ctx || !this.canvas || !this.image.src) return;

    const cw = this.canvas.width;
    const ch = this.canvas.height;

    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.save();

    // Center of canvas
    this.ctx.translate(this.posX, this.posY);
    this.ctx.rotate((this.rotation * Math.PI) / 180);
    this.ctx.scale(this.scale, this.scale);

    // Draw centered
    const iw = this.image.width;
    const ih = this.image.height;
    this.ctx.drawImage(this.image, -iw / 2, -ih / 2);

    this.ctx.restore();
  }

  applyCrop() {
    const guide = document.getElementById('cropOverlayGuide');
    if (!guide || !this.canvas || !this.image) return;

    const guideRect = guide.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    // Viewport scale between display CSS pixels and internal canvas resolution
    const scaleX = this.canvas.width / canvasRect.width;
    const scaleY = this.canvas.height / canvasRect.height;

    const cropX = (guideRect.left - canvasRect.left) * scaleX;
    const cropY = (guideRect.top - canvasRect.top) * scaleY;
    const cropW = guideRect.width * scaleX;
    const cropH = guideRect.height * scaleY;

    // High-Resolution Target Dimensions (Crystal Sharp & Retina Grade)
    let outW = 1200;
    let outH = 1600;

    if (this.aspectMode === '3:4') {
      outW = 1200;
      outH = 1600;
    } else if (this.aspectMode === '4:5') {
      outW = 1200;
      outH = 1500;
    } else if (this.aspectMode === '16:9') {
      outW = 1600;
      outH = 900;
    } else if (this.aspectMode === '4:3') {
      outW = 1600;
      outH = 1200;
    } else if (this.aspectMode === '1:1') {
      outW = 1200;
      outH = 1200;
    } else {
      // Freeform: proportional up to 1600px
      const maxDim = 1600;
      if (cropW >= cropH) {
        outW = maxDim;
        outH = Math.round(maxDim * (cropH / cropW));
      } else {
        outH = maxDim;
        outW = Math.round(maxDim * (cropW / cropH));
      }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext('2d');

    // Premium image smoothing
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';

    const mult = outW / cropW;

    outCtx.save();
    // Translate to center of output canvas
    outCtx.translate(outW / 2, outH / 2);
    outCtx.scale(mult, mult);

    // Center relative to crop guide box
    const guideCenterX = cropX + cropW / 2;
    const guideCenterY = cropY + cropH / 2;
    outCtx.translate(this.posX - guideCenterX, this.posY - guideCenterY);
    outCtx.rotate((this.rotation * Math.PI) / 180);
    outCtx.scale(this.scale, this.scale);

    // Draw the RAW NATIVE FULL-RESOLUTION image
    const iw = this.image.naturalWidth || this.image.width;
    const ih = this.image.naturalHeight || this.image.height;
    outCtx.drawImage(this.image, -iw / 2, -ih / 2);

    outCtx.restore();

    // Export ultra-clear JPEG with optimal balance of clarity and storage efficiency (~250KB)
    const croppedBase64 = outCanvas.toDataURL('image/jpeg', 0.92);
    this.saveOutput(croppedBase64);
  }

  useOriginal() {
    if (!this.image || !this.image.src) return;

    const iw = this.image.naturalWidth || this.image.width;
    const ih = this.image.naturalHeight || this.image.height;

    // Preserve high resolution while keeping storage safe (max 1800px)
    const maxDim = 1800;
    let targetW = iw;
    let targetH = ih;

    if (iw > maxDim || ih > maxDim) {
      if (iw >= ih) {
        targetW = maxDim;
        targetH = Math.round((ih * maxDim) / iw);
      } else {
        targetH = maxDim;
        targetW = Math.round((iw * maxDim) / ih);
      }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = targetW;
    outCanvas.height = targetH;
    const outCtx = outCanvas.getContext('2d');
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';
    outCtx.drawImage(this.image, 0, 0, targetW, targetH);

    const fullQualityBase64 = outCanvas.toDataURL('image/jpeg', 0.94);
    this.saveOutput(fullQualityBase64);
  }

  saveOutput(base64Data) {
    if (this.previewElId) {
      const preview = document.getElementById(this.previewElId);
      if (preview) {
        preview.src = base64Data;
        preview.style.display = 'block';
      }
    }

    if (this.hiddenInputName) {
      const input = document.querySelector(`input[name="${this.hiddenInputName}"]`);
      if (input) input.value = base64Data;
    }

    this.close();
    if (typeof showToast === 'function') {
      showToast('High-resolution image framed & saved successfully!', 'success');
    }
  }
}

// Global Cropper Instance
window.adminCropper = new AdminImageCropper();

// Global Image Upload Handler hooked with Cropper
window.handleImageUpload = function(inputEl, previewImgId, hiddenInputName, preferredAspect = '16:9') {
  const file = inputEl.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    showToast('Image file is too large! Please select an image under 8MB.', 'warning');
    return;
  }

  // Launch the interactive cropper
  window.adminCropper.open(file, previewImgId, hiddenInputName, preferredAspect);
};
