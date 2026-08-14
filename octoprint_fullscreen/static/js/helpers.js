/**
 * Helper class for OctoPrint Fullscreen plugin.
 * Provides utilities for managing fullscreen view positioning, styling, and color picker functionality.
 */
// eslint-disable-next-line no-unused-vars
class OfsHelpers {
  /** @type {object} Reference to the fullscreen view model */
  viewModel = null;

  /** @type {number} Delay before updating progress bar position after page load */
  progressBarUpdateDelay = 1500;

  /**
   * Creates an instance of OfsHelpers.
   *
   * @param {object} fsViewModel - The fullscreen view model instance
   */
  constructor(fsViewModel) {
    this.viewModel = fsViewModel;
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
   * Initialize settings subscriptions from the view model.
   * Sets up observable properties for font size, background color, and offset settings,
   * and subscribes to their changes to apply styles whenever they are modified.
   */
  initSettingsSubscriptions() {
    this.viewModel.fontSize =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.font_size;
    this.viewModel.backgroundColor =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.background_color;
    this.viewModel.offsetBottom =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.offset_bottom;
    this.viewModel.offsetRight =
      this.viewModel.settings.settings.plugins.octoprint_fullscreen.offset_right;

    this.viewModel.fontSize.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.backgroundColor.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.offsetBottom.subscribe(() => {
      this.applyStyles();
    });
    this.viewModel.offsetRight.subscribe(() => {
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
      console.warn('OfsHelpers: Fullscreen bar element not found');
      return;
    }

    $view.css({
      'font-size': `${this.viewModel.fontSize()}px`,
      'background-color': this.viewModel.backgroundColor(),
      bottom: `${this.viewModel.offsetBottom()}px`,
      right: `${this.viewModel.offsetRight()}px`,
    });
  }
}
