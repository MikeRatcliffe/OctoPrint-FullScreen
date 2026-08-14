/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Mike Ratcliffe, Paul de Vries
 * License: AGPLv3
 */
let onceOpenInlineFullscreen = false;
if (window.location.hash.indexOf('-fullscreen-open') !== -1) {
  window.location.hash = window.location.hash.replace('-fullscreen-open', '').substr(1);
  onceOpenInlineFullscreen = true;
}

$(function () {
  function FullscreenViewModel(parameters) {
    const self = this;
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
        $container = $(containerPlaceholderSelector + ' .webcam_fixed_ratio');
        $fullscreenContainer = $(containerPlaceholderSelector + ' #webcam_rotator');
      } else {
        $container = $(containerPlaceholderSelector + ' #webcam_rotator');
        $fullscreenContainer = $(containerPlaceholderSelector + ' #classicwebcam_container');
      }

      let touchtime = 0;
      $webcam.on('click', function () {
        if (touchtime === 0) {
          touchtime = new Date().getTime();
        } else {
          if (new Date().getTime() - touchtime < 800) {
            $body.toggleClass('inlineFullscreen');
            $container.toggleClass('inline fullscreen');

            if ($body.hasClass('inlineFullscreen')) {
              history.pushState('', null, window.location.hash + '-fullscreen-open');
            } else {
              if (window.location.hash.indexOf('-fullscreen-open') !== -1) {
                history.pushState('', null, window.location.hash.replace('-fullscreen-open', ''));
              }
            }

            if (self.printer.fsp.isFullscreen()) {
              $fullscreenContainer.toggleFullScreen();
            }
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
        }, 100);
      }

      $info.insertAfter($container);
      $('.print-control #job_pause')
        .clone()
        .appendTo('#fullscreen-bar .user-buttons')
        .attr('id', 'job_pause_clone');

      ko.applyBindings(self.printer, $('#fullscreen-bar #fullscreen-print-info').get(0));
      ko.applyBindings(self.printer, $('#fullscreen-bar #fullscreen-buttons').get(0));
      ko.applyBindings(self.printer, $('#fullscreen-bar #fullscreen-progress-bar').get(0));
    };

    self.onBeforeBinding = function () {
      self.fontSize = self.settings.settings.plugins.octoprint_fullscreen.font_size;
      self.backgroundColor = self.settings.settings.plugins.octoprint_fullscreen.background_color;
      self.offsetBottom = self.settings.settings.plugins.octoprint_fullscreen.offset_bottom;
      self.offsetRight = self.settings.settings.plugins.octoprint_fullscreen.offset_right;

      self.fontSize.subscribe(function () {
        self.applyStyles();
      });
      self.backgroundColor.subscribe(function () {
        self.applyStyles();
      });
      self.offsetBottom.subscribe(function () {
        self.applyStyles();
      });
      self.offsetRight.subscribe(function () {
        self.applyStyles();
      });

      self.applyStyles();
    };

    self.applyStyles = function () {
      const $view = $('#fullscreen-bar');
      $view.css({
        'font-size': self.fontSize() + 'px',
        'background-color': self.backgroundColor(),
        bottom: self.offsetBottom() + 'px',
        right: self.offsetRight() + 'px',
      });
    };

    self.onDataUpdaterPluginMessage = function (plugin, data) {
      if (plugin.indexOf('DisplayLayerProgress') !== -1) {
        if (!self.printer.fsp.hasLayerProgress()) {
          self.printer.fsp.hasLayerProgress(true);
        }

        if (data.currentLayer && data.totalLayer) {
          self.printer.fsp.printLayerProgress(data.currentLayer + ' / ' + data.totalLayer);
        }
      }
    };

    self.formatBarTemperatureFullscreen = function (toolName, actual, target) {
      let output = toolName + ': ' + _.sprintf('%.1f&deg;C', actual);

      if (target) {
        const sign = target >= actual ? ' \u21D7 ' : ' \u21D8 ';
        output += sign + _.sprintf('%.1f&deg;C', target);
      }

      return output;
    };

    $(document).bind('fullscreenchange', function () {
      self.printer.fsp.isFullscreen($(document).fullScreen());
    });

    self.onAllBound = function () {
      // eslint-disable-next-line no-undef
      const pickr = Pickr.create({
        el: '#octoprint_fullscreen_picker',
        id: 'octoprint_fullscreen_pickr',
        theme: 'nano',
        default: self.settings.settings.plugins.octoprint_fullscreen.background_color(),

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
          // Main components
          preview: true,
          opacity: true,
          hue: true,

          // Input / Output Options
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
        self.settings.settings.plugins.octoprint_fullscreen.background_color(rgbaString);
      });

      pickr.on('save', () => {
        pickr.hide();
      });
    };

    self.onAfterBinding = function () {
      self.applyStyles();
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
