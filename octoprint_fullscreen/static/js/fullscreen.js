/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Paul de Vries & Mike Ratcliffe
 * License: AGPLv3
 */

// Open fullscreen on page load as appropriate
let isOnceOpenInlineFullscreen = false;
const hash = window.location.hash;
if (hash.includes("-fullscreen-open")) {
  window.location.hash = hash.replace("-fullscreen-open", "").substr(1);
  isOnceOpenInlineFullscreen = true;
}

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Constructor function for FullscreenViewModel.
   *
   * @param {Array} tempModel
   *        temperatureViewModel
   * @param {Object} printer
   *        printerStateViewModel
   */
  function FullscreenViewModel([tempModel, printerModel]) {
    let fullscreenContainer = null;
    let container = null;
    let touchtime = 0;

    this.colorPickers = new Map();

    this.tempModel = tempModel;
    this.printerModel = printerModel;
    this.printerModel.fsp = {
      printLayerProgress: ko.observable(""),
      hasLayerProgress: ko.observable(false),
      isFullscreen: ko.observable(false),
      fullscreen: () => {
        toggleFullScreen(fullscreenContainer);
      },
    };

    // We will populate settings later
    this.settings = null;

    /**
     * Handle actions on Octoprint's startup completion.
     */
    this.onStartupComplete = () => {
      this.settings =
        this.printerModel.settings.settings.plugins.octoprint_fullscreen;

      const containerPlaceholder = document.querySelector(
        "#webcam,#webcam_container,#classicwebcam_container"
      );

      if (!containerPlaceholder) {
        return;
      }

      const webcam = document.querySelector("#webcam_image");
      const bar = document.querySelector("#fullscreen-bar");
      const webcamFixedRatio = document.querySelector(".webcam_fixed_ratio");

      if (webcamFixedRatio) {
        container = webcamFixedRatio;
        fullscreenContainer = document.querySelector("#webcam_rotator");
      } else {
        container = document.querySelector("#webcam_rotator");
        fullscreenContainer = document.querySelector(
          "#classicwebcam_container"
        );
      }

      webcam.addEventListener("click", onWebcamClick);

      if (isOnceOpenInlineFullscreen) {
        setTimeout(() => {
          touchtime = Date.now();
          webcam.click();
          isOnceOpenInlineFullscreen = false;
        }, 100);
      }

      container.insertAdjacentElement("afterend", bar);

      const buttonContainer = document.querySelector(
        "#fullscreen-bar .user-buttons"
      );
      const pauseButton = document.querySelector(".print-control #job_pause");
      const pauseButtonClone = pauseButton.cloneNode(true);

      pauseButtonClone.id = "job_pause_clone";
      buttonContainer.appendChild(pauseButtonClone);

      this.updateStyles();
      this.initSwatches();

      ko.applyBindings(
        this.printerModel,
        document.querySelector("#fullscreen-bar #fullscreen-print-info")
      );
      ko.applyBindings(
        this.printerModel,
        document.querySelector("#fullscreen-bar #fullscreen-buttons")
      );
      ko.applyBindings(
        this.printerModel,
        document.querySelector("#fullscreen-bar #fullscreen-progress-bar")
      );
    };

    /**
     * Handle messages from plugins.
     *
     * @param {string} plugin
     *        The identifier of the calling plugin
     * @param {string|object} message
     *        The data being sent by the plugin
     */
    this.onDataUpdaterPluginMessage = (plugin, message) => {
      if (plugin.includes("DisplayLayerProgress")) {
        if (!this.printerModel.fsp.hasLayerProgress()) {
          this.printerModel.fsp.hasLayerProgress(true);
        }

        if (message.currentLayer && message.totalLayer) {
          const progressMessage = `${message.currentLayer} / ${message.totalLayer}`;
          this.printerModel.fsp.printLayerProgress(progressMessage);
        }
      }
    };

    /**
     * Update settings when they are saved.
     */
    this.onSettingsBeforeSave = () => {
      // Save color picker values to settings
      for (const [name, colorPicker] of this.colorPickers) {
        this.settings[name](colorPicker.color.rgbaString);
      }
    };

    /**
     * Tidy up settings
     */
    this.onSettingsHidden = () => {
      this.updateStyles();
      this.refreshColorPickers();
    };

    /**
     * Format the temperature display.
     *
     * @param {string} toolName
     *        The name of the tool
     * @param {number} actual
     *        The actual temperature in degrees Celsius
     * @param {number} target (optional)
     *        The target temperature in degrees Celsius
     * @return {string}
     *        The formatted temperature with optional target temperature
     */
    this.formatTemperatureFullscreen = (toolName, actual, target) => {
      const formattedActual = `${actual.toFixed(1)}°C`;
      let formattedTarget = "";

      if (target) {
        if (target >= actual) {
          formattedTarget = ` \u21D7 ${target.toFixed(1)}°C`;
        } else {
          formattedTarget = ` \u21D8 ${target.toFixed(1)}°C`;
        }
      }

      return `${toolName}: ${formattedActual}${formattedTarget}`;
    };

    /**
     * Webcam click event handler.
     */
    const onWebcamClick = () => {
      const now = Date.now();

      if (now - touchtime < 800 && touchtime !== 0) {
        toggleClass(document.body, "inlineFullscreen");
        toggleClass(container, "inline fullscreen");

        const hash = window.location.hash;
        const isInlineFullscreen =
          document.body.classList.contains("inlineFullscreen");
        if (isInlineFullscreen) {
          history.pushState("", null, `${hash}-fullscreen-open`);
        } else if (hash.includes("-fullscreen-open")) {
          history.pushState("", null, hash.replace("-fullscreen-open", ""));
        }

        if (this.printerModel.fsp.isFullscreen()) {
          toggleFullScreen(fullscreenContainer);
        }
        touchtime = 0;
      } else {
        touchtime = now;
      }
    };

    /**
     * Updates styles. We can't use knockout to do this due to double bindings.
     */
    this.updateStyles = () => {
      const bar = document.querySelector("#fullscreen-bar");
      const fullscreenToggleBtn = document.querySelector(
        "#fullscreen-bar #fullscreen-toggle"
      );
      const pauseBtn = document.querySelector("#job_pause_clone");

      // Font size
      bar.style.fontSize = this.settings.font_size();
      fullscreenToggleBtn.style.fontSize = this.settings.font_size();
      pauseBtn.style.fontSize = this.settings.font_size();

      // Info box position
      for (const position of this.settings.positions()) {
        bar.classList.remove(position.value());
      }
      bar.classList.add(this.settings.position());

      // Colors
      bar.style.color = this.settings.color_fg();
      bar.style.backgroundColor = this.settings.color_bg();
      bar.style.borderWidth = "1px";
      bar.style.borderStyle = "solid";
      bar.style.borderColor = this.settings.color_border();

      // TODO:
      // Border colour
      // Bar or box
    };

    /**
     * Initialize color swatches
     */
    this.initSwatches = () => {
      for (const { fieldName, swatchId, textId, saveColorFunc, alpha } of [
        {
          fieldName: "color_fg",
          swatchId: "#octoprint-fullscreen-swatchfg",
          textId: "#octoprint-fullscreen-swatchfgtext",
          saveColorFunc: this.settings.color_fg,
          alpha: false,
        },
        {
          fieldName: "color_bg",
          swatchId: "#octoprint-fullscreen-swatchbg",
          textId: "#octoprint-fullscreen-swatchbgtext",
          saveColorFunc: this.settings.color_bg,
          alpha: true,
        },
        {
          fieldName: "color_border",
          swatchId: "#octoprint-fullscreen-swatchborder",
          textId: "#octoprint-fullscreen-swatchbordertext",
          saveColorFunc: this.settings.color_border,
          alpha: true,
        },
      ]) {
        const picker = document.querySelector(swatchId);
        const pickerText = document.querySelector(textId);

        // eslint-disable-next-line no-undef
        const vanillaPicker = new octoprintFullscreenVanillaPicker({
          fieldName,
          parent: picker,
          parentText: pickerText,
          color: saveColorFunc(),
          editorFormat: "rgb",
          saveColorFunc,
          cancelButton: true,
          alpha,
        });

        /**
         * Populate swatch and swatch text
         */
        vanillaPicker.updateSwatch = function () {
          // Inside this handler `this` is in the context of the swatch
          this.settings.parent.style.backgroundColor = this.color.rgbaString;
          this.settings.parentText.value = `${this.color.hex} ${this.color.rgbaString}`;
        };

        // Store `this.refreshColorPickers()` because `closeHandler()` has no
        // access to `this`.
        const refreshColorPickers = this.refreshColorPickers;

        // Add custom "onClose" functionality:
        vanillaPicker._closeHandler = vanillaPicker.closeHandler;
        vanillaPicker.closeHandler = function (e) {
          // Inside this handler `this` is in the context of the swatch
          if (
            e.target.dataset.testId === "settings-save" ||
            e.type === "focusin" ||
            (e.type === "mousedown" && e.target !== this._domOkay)
          ) {
            return;
          }

          // Call original close handler
          this._closeHandler(e);

          if (e.target === this._domOkay) {
            // Apply color to swatch
            this.updateSwatch();
          } else {
            // Go back to original color
            refreshColorPickers();
          }
        };

        // Populate swatch and swatch text
        vanillaPicker.updateSwatch();

        // Store the swatch
        this.colorPickers.set(fieldName, vanillaPicker);
      }
    };

    /**
     * If a settings dialog is cancelled we need to change all color swatches to
     * match the colors in settings.
     */
    this.refreshColorPickers = () => {
      // Restore color swatch and picker values from settings
      for (const [name, colorPicker] of this.colorPickers) {
        colorPicker.setColor(this.settings[name]());
        colorPicker.updateSwatch();
      }
    };

    /**
     * Toggles the specified classes on the given element's class list.
     *
     * @param {Object} element
     *        The element to toggle classes on
     * @param {string} classList
     *        A space-separated list of classes to toggle
     */
    function toggleClass(element, classList) {
      classList.split(" ").forEach((className) => {
        element.classList.toggle(className);
      });
    }

    /**
     * Toggles full screen mode for the given element.
     *
     * @param {Element} element
     *        The element to toggle full screen for
     * @return {Promise<void>}
     *        A promise that resolves when full screen mode is toggled
     */
    function toggleFullScreen(element) {
      const isFullscreen = document.fullscreenElement;

      if (isFullscreen) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen().catch((error) => {
          const { msg, name } = error;
          const message = `Error attempting to enable fullscreen mode: ${msg} (${name})`;
          alert(message);
        });
      }
    }

    document.addEventListener("fullscreenchange", () => {
      this.printerModel.fsp.isFullscreen(!!document.fullscreenElement);
    });
  }

  OCTOPRINT_VIEWMODELS.push({
    construct: FullscreenViewModel,
    dependencies: ["temperatureViewModel", "printerStateViewModel"],
    optional: [],
    elements: ["#fullscreen-tool-info"],
  });
});
