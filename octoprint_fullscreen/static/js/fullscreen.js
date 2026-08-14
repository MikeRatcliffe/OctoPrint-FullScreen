/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Mike Ratcliffe, Paul de Vries
 * License: AGPLv3
 */

$(function () {
  const touchtimeThreshold = 800;
  const onceOpenInlineFullscreenDelay = 100;

  let onceOpenInlineFullscreen = false;
  if (window.location.hash.indexOf('-fullscreen-open') !== -1) {
    window.location.hash = window.location.hash.replace('-fullscreen-open', '').substr(1);
    onceOpenInlineFullscreen = true;
  }

  function FullscreenViewModel(parameters) {
    const self = this;
    const helpers = new OfsHelpers(self);
    const $body = $('body');
    let $container;
    let $fullscreenContainer;

    self.tempModel = parameters[0];
    self.printer = parameters[1];
    self.settings = parameters[3];
    self.printer.fsp = {};

    self.printer.fsp.printLayerProgress = ko.observable('');
    self.printer.fsp.hasLayerProgress = ko.observable(false);

    self.printer.fsp.isFullscreen = ko.observable(false);
    self.printer.fsp.fullscreen = function () {
      if ($body.hasClass('inlineFullscreen')) {
        if (self.printer.fsp.isFullscreen()) {
          helpers.setWindowState(helpers.windowStateEnum.maximised);
        } else {
          helpers.setWindowState(helpers.windowStateEnum.fullscreen);
        }
      }

      $fullscreenContainer.toggleFullScreen();
    };

    self.onStartupComplete = function () {
      const $webcam = $('#webcam_image');
      const $info = $('#fullscreen-bar');

      const containerPlaceholder = document.querySelector(
        '#webcam,#webcam_container,#classicwebcam_container',
      );
      if (!containerPlaceholder) {
        return;
      }

      const containerPlaceholderSelector = `#${containerPlaceholder.id}`;
      if ($('.webcam_fixed_ratio').length > 0) {
        $container = $(`${containerPlaceholderSelector} .webcam_fixed_ratio`);
        $fullscreenContainer = $(`${containerPlaceholderSelector} #webcam_rotator`);
      } else {
        $container = $(`${containerPlaceholderSelector} #webcam_rotator`);
        $fullscreenContainer = $(`${containerPlaceholderSelector} #classicwebcam_container`);
      }

      let touchtime = 0;
      $webcam.on('click', function () {
        if (touchtime === 0) {
          touchtime = new Date().getTime();
        } else {
          if (new Date().getTime() - touchtime < touchtimeThreshold) {
            $body.toggleClass('inlineFullscreen');
            $container.toggleClass('inline fullscreen');

            if ($body.hasClass('inlineFullscreen')) {
              helpers.setWindowState(helpers.windowStateEnum.maximised);
              history.pushState('', null, `${window.location.hash}-fullscreen-open`);
            } else {
              helpers.setWindowState(helpers.windowStateEnum.regular);
              if (window.location.hash.indexOf('-fullscreen-open') !== -1) {
                history.pushState('', null, window.location.hash.replace('-fullscreen-open', ''));
              }
            }

            if (self.printer.fsp.isFullscreen()) {
              $fullscreenContainer.toggleFullScreen();
            }

            helpers.applyStyles();
            helpers.updateProgressBarPosition();

            touchtime = 0;
          } else {
            touchtime = new Date().getTime();
          }
        }
      });

      if (onceOpenInlineFullscreen) {
        setTimeout(function () {
          touchtime = new Date().getTime();
          $webcam.trigger('click');
          onceOpenInlineFullscreen = false;
        }, onceOpenInlineFullscreenDelay);
      }

      $info.insertAfter($container);
      $('.print-control #job_pause')
        .clone()
        .appendTo('#fullscreen-bar .user-buttons')
        .attr('id', 'job_pause_clone');

      ko.applyBindings(self.printer, $('#fullscreen-bar #fullscreen-print-info').get(0));
      ko.applyBindings(self.printer, $('#fullscreen-bar #fullscreen-buttons').get(0));
      ko.applyBindings(self.printer, $('#fullscreen-bar #fullscreen-progress-bar').get(0));

      helpers.initProgressBarPositionUpdater();
      helpers.makeOverlayDraggable();
    };

    self.onBeforeBinding = function () {
      helpers.initSettingsSubscriptions();
    };

    self.onDataUpdaterPluginMessage = function (plugin, data) {
      if (plugin.indexOf('DisplayLayerProgress') !== -1) {
        if (!self.printer.fsp.hasLayerProgress()) {
          self.printer.fsp.hasLayerProgress(true);
        }

        if (data.currentLayer && data.totalLayer) {
          self.printer.fsp.printLayerProgress(`${data.currentLayer} / ${data.totalLayer}`);
        }
      }
    };

    self.formatBarTemperatureFullscreen = function (toolName, actual, target) {
      let output = `${toolName}: ${_.sprintf('%.1f&deg;C', actual)}`;

      if (target) {
        const sign = target >= actual ? ' \u21D7 ' : ' \u21D8 ';
        output += `${sign}${_.sprintf('%.1f&deg;C', target)}`;
      }

      return output;
    };

    $(document).bind('fullscreenchange', function () {
      self.printer.fsp.isFullscreen($(document).fullScreen());
    });

    self.onAllBound = function () {
      helpers.createPickr();
    };

    self.onAfterBinding = function () {
      helpers.applyStyles();
    };
  }

  OCTOPRINT_VIEWMODELS.push({
    construct: FullscreenViewModel,
    dependencies: [
      'temperatureViewModel',
      'printerStateViewModel',
      'controlViewModel',
      'settingsViewModel',
    ],
    optional: [],
    elements: ['#fullscreen-tool-info'],
  });
});
