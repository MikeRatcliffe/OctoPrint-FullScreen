/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Paul de Vries
 * License: AGPLv3
 */
let onceOpenInlineFullscreen = false;
if (window.location.hash.includes("-fullscreen-open")) {
  window.location.hash = window.location.hash
    .replace("-fullscreen-open", "")
    .substr(1);
  onceOpenInlineFullscreen = true;
}

document.addEventListener("DOMContentLoaded", () => {
  function FullscreenViewModel(parameters) {
    const body = document.body;
    let fullscreenContainer;
    let container;

    this.tempModel = parameters[0];
    this.printer = parameters[1];
    this.printer.fsp = {};

    this.printer.fsp.printLayerProgress = ko.observable("");
    this.printer.fsp.hasLayerProgress = ko.observable(false);

    this.printer.fsp.isFullscreen = ko.observable(false);
    this.printer.fsp.fullscreen = () => {
      toggleFullScreen(fullscreenContainer);
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
            toggleClass(body, "inlineFullscreen");
            toggleClass(container, "inline fullscreen");

            if (body.classList.contains("inlineFullscreen")) {
              history.pushState(
                "",
                null,
                `${window.location.hash}-fullscreen-open`
              );
            } else if (window.location.hash.includes("-fullscreen-open")) {
              history.pushState(
                "",
                null,
                window.location.hash.replace("-fullscreen-open", "")
              );
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

      if (onceOpenInlineFullscreen) {
        setTimeout(() => {
          touchtime = new Date().getTime();
          webcam.dispatchEvent(new Event("click"));
          onceOpenInlineFullscreen = false;
        }, 100);
      }

      container.after(info);

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
          this.printer.fsp.printLayerProgress(
            `${data.currentLayer} / ${data.totalLayer}`
          );
        }
      }
    };

    this.formatBarTemperatureFullscreen = (toolName, actual, target) => {
      let output = `${toolName}: ${actual.toFixed(1)}&deg;C`;

      if (target) {
        const sign = target >= actual ? " \u21D7 " : " \u21D8 ";
        output += `${sign}${target.toFixed(1)}&deg;C`;
      }

      return output;
    };

    function toggleClass(el, classNames) {
      classNames = classNames.split(" ");

      for (const className of classNames) {
        if (el.classList.contains(className)) {
          el.classList.remove(className);
        } else {
          el.classList.add(className);
        }
      }
    }

    function toggleFullScreen(el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch((err) => {
          alert(
            `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
          );
        });
      } else {
        document.exitFullscreen();
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
