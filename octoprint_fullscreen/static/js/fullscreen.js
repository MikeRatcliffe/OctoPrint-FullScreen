/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Paul de Vries
 * License: AGPLv3
 */
let isOnceOpenInlineFullscreen = false;
const hash = window.location.hash;
if (hash.includes("-fullscreen-open")) {
  window.location.hash = hash.replace("-fullscreen-open", "").substr(1);
  isOnceOpenInlineFullscreen = true;
}

document.addEventListener("DOMContentLoaded", () => {
  function FullscreenViewModel(parameters) {
    let fullscreenContainer = null;
    let container = null;

    this.tempModel = parameters[0];
    this.printer = parameters[1];
    this.printer.fsp = {
      printLayerProgress: ko.observable(""),
      hasLayerProgress: ko.observable(false),
      isFullscreen: ko.observable(false),
      fullscreen: () => {
        toggleFullScreen(fullscreenContainer);
      },
    };

    this.onStartupComplete = () => {
      const webcam = document.querySelector("#webcam_image");
      const info = document.querySelector("#fullscreen-bar");
      const containerPlaceholder = document.querySelector(
        "#webcam,#webcam_container,#classicwebcam_container"
      );

      if (!containerPlaceholder) {
        return;
      }

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

      let touchtime = 0;
      webcam.addEventListener("click", () => {
        if (touchtime === 0) {
          touchtime = new Date().getTime();
        } else {
          if (new Date().getTime() - touchtime < 800) {
            toggleClass(document.body, "inlineFullscreen");
            toggleClass(container, "inline fullscreen");

            const hash = window.location.hash;
            if (document.body.classList.contains("inlineFullscreen")) {
              history.pushState("", null, `${hash}-fullscreen-open`);
            } else if (hash.includes("-fullscreen-open")) {
              history.pushState("", null, hash.replace("-fullscreen-open", ""));
            }

            if (this.printer.fsp.isFullscreen()) {
              toggleFullScreen(fullscreenContainer);
            }
            touchtime = 0;
          } else {
            touchtime = new Date().getTime();
          }
        }
      });

      if (isOnceOpenInlineFullscreen) {
        setTimeout(() => {
          touchtime = new Date().getTime();
          webcam.dispatchEvent(new Event("click"));
          isOnceOpenInlineFullscreen = false;
        }, 100);
      }

      container.insertAdjacentElement("afterend", info);

      const buttonContainer = document.querySelector(
        "#fullscreen-bar .user-buttons"
      );
      const pauseButton = document.querySelector(".print-control #job_pause");
      const pauseButtonClone = pauseButton.cloneNode(true);

      pauseButtonClone.setAttribute("id", "job_pause_clone");
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

    this.onDataUpdaterPluginMessage = (plugin, data) => {
      if (plugin.includes("DisplayLayerProgress")) {
        if (!this.printer.fsp.hasLayerProgress()) {
          this.printer.fsp.hasLayerProgress(true);
        }

        if (data.currentLayer && data.totalLayer) {
          const progressMessage = `${data.currentLayer} / ${data.totalLayer}`;
          this.printer.fsp.printLayerProgress(progressMessage);
        }
      }
    };

    this.formatBarTemperatureFullscreen = (toolName, actual, target) => {
      let output = `${toolName}: ${actual.toFixed(1)}°C`;

      if (target) {
        const arrow = target >= actual ? " \u21D7 " : " \u21D8 ";
        output += `${arrow}${target.toFixed(1)}°C`;
      }

      return output;
    };

    function toggleClass(element, classList) {
      classList.split(" ").forEach((className) => {
        element.classList.toggle(className);
      });
    }

    function toggleFullScreen(element) {
      const isFullscreen = document.fullscreenElement;
      const requestFullscreen = () => element.requestFullscreen();
      const exitFullscreen = () => document.exitFullscreen();

      if (isFullscreen) {
        exitFullscreen();
      } else {
        requestFullscreen().catch((error) => {
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
