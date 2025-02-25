document.addEventListener("DOMContentLoaded", () => {
  function OctoprintFullscreenSettingsViewModel([
    settingsView,
    octoprintFullscreenView,
    OctoprintFullscreenDropdownView,
  ]) {
    this.settingsView = settingsView;
    this.octoprintFullscreenView = octoprintFullscreenView;
    this.octoprintFullscreenDropdownView = OctoprintFullscreenDropdownView;
    this.colorPickers = new Map();
    this.dropdowns = [];

    // We will populate settings in onStartupComplete().
    this.settings = null;

    /**
     * Handle actions on Octoprint's startup completion.
     */
    this.onStartupComplete = () => {
      this.settings = settingsView.settings.plugins.octoprint_fullscreen;

      const resetButton = document.querySelector("#octoprint-fullscreen-reset");
      resetButton.addEventListener("click", this.onResetClick);

      this.initSwatches();
      this.initFontDropdown();
    };

    this.onResetClick = () => {
      // If you change these default values be sure to also change the
      // corresponding values in __init__.py
      this.settings.font_size("14px");
      this.settings.font_family("sans-serif");
      this.settings.position("bottomright");
      this.settings.button_color_fg("rgba(51, 51, 51, 1)");
      this.settings.button_color_bg_top("rgba(255, 255, 255, 1)");
      this.settings.button_color_bg_bottom("rgba(230, 230, 230, 1)");
      this.settings.color_fg("rgba(255, 255, 255, 1)");
      this.settings.color_bg("rgba(0, 0, 0, 0.25)");
      this.settings.color_border("rgba(68, 68, 68, 1)");
      this.settings.has_border(true);

      for (const dropdown of this.dropdowns) {
        const setting = dropdown.settings.setting();
        dropdown.setValue(setting);
      }

      this.refreshColorPickers();
      this.octoprintFullscreenView.updateStyles();
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
        {
          fieldName: "button_color_fg",
          swatchId: "#octoprint-fullscreen-button-foreground",
          textId: "#octoprint-fullscreen-button-foregroundtext",
          saveColorFunc: this.settings.button_color_fg,
          alpha: false,
        },
        {
          fieldName: "button_color_bg_top",
          swatchId: "#octoprint-fullscreen-button-background-top",
          textId: "#octoprint-fullscreen-button-background-toptext",
          saveColorFunc: this.settings.button_color_bg_top,
          alpha: false,
        },
        {
          fieldName: "button_color_bg_bottom",
          swatchId: "#octoprint-fullscreen-button-background-bottom",
          textId: "#octoprint-fullscreen-button-background-bottomtext",
          saveColorFunc: this.settings.button_color_bg_bottom,
          alpha: false,
        },
      ]) {
        const picker = document.querySelector(swatchId);
        const pickerText = document.querySelector(textId);

        const colorPicker = new octoprintFullscreenVanillaPicker({
          fieldName,
          parent: picker,
          parentText: pickerText,
          color: saveColorFunc(),
          editorFormat: "rgb",
          saveColorFunc,
          cancelButton: true,
          alpha,
        });

        colorPicker.onBeforeOpen = () => {
          // Hide all color pickers
          for (const [, colorPicker] of this.colorPickers) {
            colorPicker.closeHandler();
          }
        };

        /**
         * Populate swatch and swatch text
         */
        colorPicker.updateSwatch = function () {
          // Inside this handler `this` is in the context of the swatch
          this.settings.parent.style.backgroundColor = this.color.rgbaString;
          this.settings.parentText.value = `${this.color.hex} ${this.color.rgbaString}`;
        };

        // Store `this.refreshColorPickers()` because `closeHandler()` has no
        // access to `this`.
        const refreshColorPickers = this.refreshColorPickers;

        // Add custom "onClose" functionality:
        colorPicker._closeHandler = colorPicker.closeHandler;
        colorPicker.closeHandler = function (e) {
          if (!e) {
            this._closeHandler();
            return;
          }

          // Inside this handler `this` is in the context of the swatch
          if (
            e.target.dataset.testId === "settings-save" ||
            e.type === "focusin" ||
            (e.type === "mousedown" &&
              e.target !== this._domOkay &&
              this.domElement.contains(e.target))
          ) {
            return;
          }

          // Call original close handler
          this._closeHandler(e);

          if (e.target === this._domOkay) {
            // Apply color to swatch
            this.updateSwatch();
          } else if (e.target === this._domCancel) {
            // Go back to original color
            refreshColorPickers();
          }
        };

        // Populate swatch and swatch text
        colorPicker.updateSwatch();

        // Store the swatch
        this.colorPickers.set(fieldName, colorPicker);
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
     * Update settings when they are saved.
     */
    this.onSettingsBeforeSave = () => {
      // Save values of all dropdowns to settings
      for (const dropdown of this.dropdowns) {
        dropdown.settings.setting(dropdown.getValue());
      }

      // Save color picker values to settings
      for (const [name, colorPicker] of this.colorPickers) {
        this.settings[name](colorPicker.color.rgbaString);
      }
    };

    /**
     * Tidy up settings
     */
    this.onSettingsHidden = () => {
      this.refreshColorPickers();

      for (const dropdown of this.dropdowns) {
        const setting = dropdown.settings.setting();
        dropdown.setValue(setting);
      }
    };

    this.initFontDropdown = () => {
      const options = [
        "serif",
        "sans-serif",
        "monospace",
        "cursive",
        "fantasy",
        "system-ui",
        "ui-serif",
        "ui-sans-serif",
        "ui-monospace",
        "ui-rounded",
        "fangsong",
      ].map((text) => {
        return {
          text,
          value: text,
          className: text,
        };
      });

      const dropdown = this.octoprintFullscreenDropdownView.createDropdown({
        selector: "#octoprint-fullscreen-font-select",
        action: "applyClass",
        setting: this.settings.font_family,
        options,
      });
      this.dropdowns.push(dropdown);
    };
  }

  OCTOPRINT_VIEWMODELS.push({
    construct: OctoprintFullscreenSettingsViewModel,
    dependencies: [
      "settingsViewModel",
      "fullscreenViewModel",
      "octoprintFullscreenDropdownViewModel",
    ],
    elements: [],
  });
});
