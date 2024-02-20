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
  function FullscreenViewModel([tempModel, printer]) {
    let fullscreenContainer = null;
    let container = null;
    let touchtime = 0;

    this.tempModel = tempModel;
    this.printer = printer;
    this.printer.fsp = {
      printLayerProgress: ko.observable(""),
      hasLayerProgress: ko.observable(false),
      isFullscreen: ko.observable(false),
      fullscreen: () => {
        toggleFullScreen(fullscreenContainer);
      },
    };

    /**
     * Handle actions on Octoprint's startup completion.
     */
    this.onStartupComplete = () => {
      const containerPlaceholder = document.querySelector(
        "#webcam,#webcam_container,#classicwebcam_container"
      );

      if (!containerPlaceholder) {
        return;
      }

      const webcam = document.querySelector("#webcam_image");
      const info = document.querySelector("#fullscreen-bar");
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

      container.insertAdjacentElement("afterend", info);

      const buttonContainer = document.querySelector(
        "#fullscreen-bar .user-buttons"
      );
      const pauseButton = document.querySelector(".print-control #job_pause");
      const pauseButtonClone = pauseButton.cloneNode(true);

      pauseButtonClone.id = "job_pause_clone";
      buttonContainer.appendChild(pauseButtonClone);

      ko.applyBindings(
        this.printer,
        document.querySelector("#fullscreen-bar #fullscreen-print-info")
      );
      ko.applyBindings(
        this.printer,
        document.querySelector("#fullscreen-bar #fullscreen-buttons")
      );
      ko.applyBindings(
        this.printer,
        document.querySelector("#fullscreen-bar #fullscreen-progress-bar")
      );
    };

    /**
     * Handles the plugin message for updating data.
     *
     * @param {string} plugin
     *        The identifier of the calling plugin
     * @param {string|object} message
     *        The data being sent by the plugin
     */
    this.onDataUpdaterPluginMessage = (plugin, message) => {
      if (plugin.includes("DisplayLayerProgress")) {
        if (!this.printer.fsp.hasLayerProgress()) {
          this.printer.fsp.hasLayerProgress(true);
        }

        if (message.currentLayer && message.totalLayer) {
          const progressMessage = `${message.currentLayer} / ${message.totalLayer}`;
          this.printer.fsp.printLayerProgress(progressMessage);
        }
      }
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

        if (this.printer.fsp.isFullscreen()) {
          toggleFullScreen(fullscreenContainer);
        }
        touchtime = 0;
      } else {
        touchtime = now;
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
          const message = `Error attempting to enable fullscreen mode: ${error.message} (${error.name})`;
          alert(message);
        });
      }
    }

    document.addEventListener("fullscreenchange", () => {
      this.printer.fsp.isFullscreen(!!document.fullscreenElement);
    });
  }

  OCTOPRINT_VIEWMODELS.push({
    construct: FullscreenViewModel,
    dependencies: [
      "temperatureViewModel",
      "printerStateViewModel",
      "controlViewModel",
    ],
    optional: [],
    elements: ["#fullscreen-tool-info"],
  });
});
