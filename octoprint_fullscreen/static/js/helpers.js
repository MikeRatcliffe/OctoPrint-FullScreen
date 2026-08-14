/**
 * Helper class for OctoPrint Fullscreen plugin.
 * Provides utilities for managing fullscreen view positioning, styling, and color picker functionality.
 */
// eslint-disable-next-line no-unused-vars
class OfsHelpers {
  /** @type {windowStateEnum} Current window state */
  #windowState = null;

  /** @type {object} Reference to the fullscreen view model */
  viewModel = null;

  /** @type {number} Delay before updating progress bar position after page load */
  progressBarUpdateDelay = 1500;

  /** @type {object} Window state enum */
  windowStateEnum = {
    "fullscreen": "fullscreen",
    "maximised": "maximised",
    "regular": "regular"
  }

  /**
   * Creates an instance of OfsHelpers.
   *
   * @param {object} fsViewModel - The fullscreen view model instance
   */
  constructor(fsViewModel) {
    this.viewModel = fsViewModel;
    this.#windowState = this.windowStateEnum.regular;
  }

  /**
   * Get the current window state
   * @returns {string} Current window state
   */
  getWindowState() {
    return this.#windowState;
  }

  /**
   * Set the current window state
   * @param {string} state - New window state
   */
  setWindowState(state) {
    if (state !== this.windowStateEnum.fullscreen && state !== this.windowStateEnum.maximised && state !== this.windowStateEnum.regular) {
      console.warn('OfsHelpers.setWindowState: Invalid window state');
      return;
    }
    this.#windowState = state;
  }

  /**
   * Initialize settings subscriptions from the view model.
   * Sets up observable properties for font size, background color, and offset settings,
   * and subscribes to their changes to apply styles whenever they are modified.
   */
  initSettingsSubscriptions() {
    this.viewModel.fontSize =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.font_size;
    this.viewModel.backgroundColor =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.background_color;
    this.viewModel.offsetLeftMaximised =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.offset_left_maximised;
    this.viewModel.offsetTopMaximised =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.offset_top_maximised;
    this.viewModel.offsetLeftFullscreen =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.offset_left_fullscreen;
    this.viewModel.offsetTopFullscreen =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.offset_top_fullscreen;

    this.viewModel.fontSize.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.backgroundColor.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.offsetLeftMaximised.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.offsetTopMaximised.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.offsetLeftFullscreen.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.offsetTopFullscreen.subscribe(() => {
      this.applyStyles();
    });

    this.applyStyles();
  }

  /**
   * Apply computed styles to the fullscreen bar element.
   * Updates CSS properties for font size, background color, and position offsets
   * based on current values from the view model.
   */
  applyStyles() {
    const $view = $('#fullscreen-bar');
    if ($view.length === 0) {
      return;
    }

    const maxTop = window.innerHeight - $view.outerHeight();
    const maxLeft = window.innerWidth - $view.outerWidth();

    let { offsetTop, offsetLeft } = this.getOverlayOffsets();

    offsetTop = Math.min(offsetTop, maxTop);
    offsetLeft = Math.min(offsetLeft, maxLeft);

    offsetTop = Math.max(offsetTop, 0);
    offsetLeft = Math.max(offsetLeft, 0);

    $view.css({
      'font-size': `${this.viewModel.fontSize()}px`,
      'background-color': this.viewModel.backgroundColor(),
      top: `${offsetTop}px`,
      left: `${offsetLeft}px`,
    });
  }

  /**
   * Get the current overlay offsets based on the window state.
   * @returns {Object} An object containing the current offsetLeft and offsetTop values.
   */
  getOverlayOffsets() {
    let offsetLeft;
    let offsetTop;

    switch (this.getWindowState()) {
      case this.windowStateEnum.maximised:
        offsetLeft = this.viewModel.offsetLeftMaximised();
        offsetTop = this.viewModel.offsetTopMaximised();
        break;
      case this.windowStateEnum.fullscreen:
        offsetLeft = this.viewModel.offsetLeftFullscreen();
        offsetTop = this.viewModel.offsetTopFullscreen();
        break;
      default:
        offsetLeft = 0;
        offsetTop = 0;
    }

    // Set default values on first run
    if (offsetTop === -1 || offsetLeft === -1) {
      const overlay = document.querySelector("#fullscreen-bar");

      if (overlay) {
        const rect = overlay.getBoundingClientRect();
        offsetTop = window.innerHeight - rect.height - 10;
        offsetLeft = window.innerWidth - rect.width - 10;
      }

      this.setOverlayOffsets(offsetLeft, offsetTop);
      this.viewModel.settings.saveData();
    }

    return {
      offsetLeft,
      offsetTop
    };
  }

  /**
   * Set the overlay offsets based on the current window state.
   * @param {number} offsetLeft - The left offset value to set.
   * @param {number} offsetTop - The top offset value to set.
   */
  setOverlayOffsets(offsetLeft, offsetTop) {
    switch (this.getWindowState()) {
      case this.windowStateEnum.maximised:
        this.viewModel.offsetLeftMaximised(offsetLeft);
        this.viewModel.offsetTopMaximised(offsetTop);
        break;
      case this.windowStateEnum.fullscreen:
        this.viewModel.offsetLeftFullscreen(offsetLeft);
        this.viewModel.offsetTopFullscreen(offsetTop);
        break;
    }
  }

  makeOverlayDraggable() {
    const overlay = document.querySelector("#fullscreen-bar");

    if (!overlay) {
      return;
    }

    const startDrag = (e) => {
      e.preventDefault();

      overlay.style.cursor = "grabbing";

      const isTouch = e.type === 'touchstart';
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      const overlayRect = overlay.getBoundingClientRect();

      // Calculate the offset of the mouse relative to the overlay's top-left corner
      const shiftX = clientX - overlayRect.left;
      const shiftY = clientY - overlayRect.top;

      const moveAt = (currentClientX, currentClientY) => {
        // Calculate new position relative to the viewport
        const newLeft = currentClientX - shiftX;
        const newTop = currentClientY - shiftY;

        // Use fixed positioning to work with viewport coordinates
        overlay.style.position = 'fixed';
        overlay.style.left = `${newLeft}px`;
        overlay.style.top = `${newTop}px`;
      }

      const onMove = (moveEvent) => {
        const moveX = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const moveY = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientY : moveEvent.clientY;
        moveAt(moveX, moveY);
      }

      const endDrag = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);

        overlay.style.cursor = "grab";

        // Extract finalized coordinate layouts (now in pixels)
        const finalLeft = parseFloat(overlay.style.left);
        const finalTop = parseFloat(overlay.style.top);

        // Persist the changes back to your backend setting profiles
        this.setOverlayOffsets(finalLeft, finalTop);
        this.viewModel.settings.saveData();
      }

      // Bind global movement tracking listeners
      if (isTouch) {
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', endDrag);
      } else {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', endDrag);
      }
    }

    // Attach listeners to trigger dragging sequence on either hardware platform
    overlay.addEventListener('mousedown', startDrag);
    overlay.addEventListener('touchstart', startDrag, { passive: false });
  }

  /**
   * Initialize and configure the Pickr color picker.
   * Creates a color picker instance with predefined color swatches and binds change/save events
   * to update the background color setting in the fullscreen bar.
   */
  createPickr() {
    const pickerElement = document.querySelector('#octoprint_fullscreen_picker');
    if (!pickerElement) {
      console.warn('OfsHelpers: Pickr picker element not found');
      return;
    }

    // eslint-disable-next-line no-undef
    const pickr = ofsPickr.create({
      el: '#octoprint_fullscreen_picker',
      id: 'octoprint_fullscreen_pickr',
      theme: 'nano',
      default: this.viewModel.settings.settings.plugins.octoprint_fullscreen.background_color(),

      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)',
      ],

      components: {
        preview: true,
        opacity: true,
        hue: true,

        interaction: {
          hex: true,
          rgba: true,
          cmyk: true,
          input: true,
          save: true,
        },
      },
    });

    pickr.on('change', color => {
      const rgbaString = color.toRGBA().toString(0);
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.background_color(rgbaString);
    });

    pickr.on('save', () => {
      pickr.hide();
    });
  }

  /**
   * Initialize the progress bar position updater.
   * Sets up an initial position update after 1.5 seconds and subscribes to window resize events.
   */
  initProgressBarPositionUpdater() {
    setTimeout(() => {
      this.updateProgressBarPosition();
    }, this.progressBarUpdateDelay);

    $(window).on('resize', () => {
      this.updateProgressBarPosition();
      this.applyStyles();
    });
  }

  /**
   * Update the progress bar position to align with the bottom of the webcam image.
   * Calculates the image's contained size and positions the progress bar accordingly.
   */
  updateProgressBarPosition() {
    const image = document.querySelector('#webcam_img_container #webcam_image');
    if (!image) {
      console.warn('OfsHelpers: Webcam image element not found');
      return;
    }

    const imageDimensions = this.getContainedImageSize(image);
    if (!imageDimensions) {
      return;
    }

    const { bottom } = imageDimensions;

    const progressBar = document.querySelector('#fullscreen-bar #fullscreen-progress-bar');
    if (!progressBar) {
      console.warn('OfsHelpers: Progress bar element not found');
      return;
    }

    progressBar.style.top = `${bottom - progressBar.clientHeight}px`;
  }

  /**
   * Get image position and dimensions when it is contained within a container,
   * maintaining its aspect ratio.
   *
   * @param {HTMLImageElement} imgElement - The image element to measure
   * @returns {Object|null} Object with top, right, bottom, left, width, and height properties, or null if element is invalid
   */
  getContainedImageSize(imgElement) {
    if (!imgElement) {
      console.warn('OfsHelpers.getContainedImageSize: imgElement is required');
      return null;
    }

    const rect = imgElement.getBoundingClientRect();

    const naturalWidth = imgElement.naturalWidth;
    const naturalHeight = imgElement.naturalHeight;

    if (!naturalWidth || !naturalHeight) {
      console.warn(
        'OfsHelpers.getContainedImageSize: Image has no natural dimensions. Image may not be loaded.',
      );
      return null;
    }

    const imageRatio = naturalWidth / naturalHeight;
    const containerRatio = rect.width / rect.height;

    let renderedWidth;
    let renderedHeight;

    if (imageRatio > containerRatio) {
      // Image is wider than the container aspect ratio (constrained by width)
      renderedWidth = rect.width;
      renderedHeight = rect.width / imageRatio;
    } else {
      // Image is taller than the container aspect ratio (constrained by height)
      renderedHeight = rect.height;
      renderedWidth = rect.height * imageRatio;
    }

    const offsetX = (rect.width - renderedWidth) / 2;
    const offsetY = (rect.height - renderedHeight) / 2;

    return {
      top: rect.top + offsetY,
      right: rect.left + offsetX + renderedWidth,
      bottom: rect.top + offsetY + renderedHeight,
      left: rect.left + offsetX,
      width: renderedWidth,
      height: renderedHeight,
    };
  }
}
