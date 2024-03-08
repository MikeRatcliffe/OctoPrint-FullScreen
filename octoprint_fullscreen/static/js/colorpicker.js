// eslint-disable-next-line no-unused-vars
const octoprintFullscreenVanillaPicker = (function () {
  const colorNames = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
  };

  function printNum(num, decs = 1) {
    const str =
      decs > 0
        ? num.toFixed(decs).replace(/0+$/, "").replace(/\.$/, "")
        : num.toString();
    return str || "0";
  }

  class Color {
    constructor(r, g, b, a) {
      const that = this;
      function parseString(input) {
        if (input.startsWith("hsl")) {
          // HSL string. Examples: hsl(120, 60%,  50%) or
          // hsla(240, 100%, 50%, .7)

          let [h, s, l, a] = input.match(/([-\d.e]+)/g).map(Number);
          if (a === undefined) {
            a = 1;
          }

          h /= 360;
          s /= 100;
          l /= 100;
          that.hsla = [h, s, l, a];
        } else if (input.startsWith("rgb")) {
          // RGB string. Examples: rgb(51, 170, 51) rgba(51, 170, 51, .7)

          const [r, g, b, a] = input.match(/([-\d.e]+)/g).map(Number);

          that.rgba = [r, g, b, a === undefined ? 1 : a];
        } else {
          // Hex string or color name:
          if (input.startsWith("#")) {
            that.rgba = Color.hexToRgb(input);
          } else {
            that.rgba = Color.nameToRgb(input) || Color.hexToRgb(input);
          }
        }
      }

      if (r === undefined) {
        // No color input - the color can be set later through .hsla/.rgba/.hex
      } else if (Array.isArray(r)) {
        // Single input - RGB(A) array
        this.rgba = r;
      } else if (b === undefined) {
        // Single input - CSS string
        const color = r && "" + r;
        if (color) {
          parseString(color.toLowerCase());
        }
      } else {
        this.rgba = [r, g, b, a === undefined ? 1 : a];
      }
    }

    /* RGBA representation */

    get rgba() {
      if (this._rgba) {
        return this._rgba;
      }
      if (!this._hsla) {
        throw new Error("No color is set");
      }

      return (this._rgba = Color.hslToRgb(this._hsla));
    }

    set rgba(rgb) {
      if (rgb.length === 3) {
        rgb[3] = 1;
      }

      this._rgba = rgb;
      this._hsla = null;
    }

    printRGB(alpha) {
      const rgb = alpha ? this.rgba : this.rgba.slice(0, 3);
      const vals = rgb.map((x, i) => printNum(x, i === 3 ? 3 : 0));

      return alpha ? `rgba(${vals})` : `rgb(${vals})`;
    }
    get rgbString() {
      return this.printRGB();
    }
    get rgbaString() {
      return this.printRGB(true);
    }

    /* HSLA representation */

    get hsla() {
      if (this._hsla) {
        return this._hsla;
      }
      if (!this._rgba) {
        throw new Error("No color is set");
      }

      return (this._hsla = Color.rgbToHsl(this._rgba));
    }
    set hsla(hsl) {
      if (hsl.length === 3) {
        hsl[3] = 1;
      }

      this._hsla = hsl;
      this._rgba = null;
    }

    printHSL(alpha) {
      const mults = [360, 100, 100, 1];
      const suff = ["", "%", "%", ""];

      const hsl = alpha ? this.hsla : this.hsla.slice(0, 3);
      // in printNum(), use enough decimals to represent all RGB colors:
      // https://gist.github.com/mjackson/5311256#gistcomment-2336011
      const vals = hsl.map(
        (x, i) => printNum(x * mults[i], i === 3 ? 3 : 1) + suff[i]
      );

      return alpha ? `hsla(${vals})` : `hsl(${vals})`;
    }
    get hslString() {
      return this.printHSL();
    }
    get hslaString() {
      return this.printHSL(true);
    }

    /* HEX representation */

    get hex() {
      const rgb = this.rgba;
      const hex = rgb.map((x, i) =>
        i < 3 ? x.toString(16) : Math.round(x * 255).toString(16)
      );

      return "#" + hex.map((x) => x.padStart(2, "0")).join("");
    }
    set hex(hex) {
      this.rgba = Color.hexToRgb(hex);
    }

    printHex(alpha) {
      const hex = this.hex;
      return alpha ? hex : hex.substring(0, 7);
    }

    /* Conversion utils */

    /**
     * Splits a HEX string into its RGB(A) components
     */
    static hexToRgb(input) {
      // Normalize all hex codes (3/4/6/8 digits) to 8 digits RGBA
      const hex = (input.startsWith("#") ? input.slice(1) : input)
        .replace(/^(\w{3})$/, "$1F") // 987      -> 987F
        .replace(/^(\w)(\w)(\w)(\w)$/, "$1$1$2$2$3$3$4$4") // 9876 -> 99887766
        .replace(/^(\w{6})$/, "$1FF"); // 987654   -> 987654FF

      if (!hex.match(/^([0-9a-fA-F]{8})$/)) {
        throw new Error("Unknown hex color; " + input);
      }

      const rgba = hex
        .match(/^(\w\w)(\w\w)(\w\w)(\w\w)$/)
        .slice(1) // 98765432 -> 98 76 54 32
        .map((x) => parseInt(x, 16)); // Hex to decimal

      rgba[3] = rgba[3] / 255;
      return rgba;
    }

    /**
     * Gets the RGB value from a CSS color name
     */
    static nameToRgb(input) {
      const hex = colorNames[input];
      return hex === undefined
        ? hex
        : Color.hexToRgb(hex.replace(/-/g, "00").padStart(6, "f"));
    }

    /**
     * https://gist.github.com/mjackson/5311256
     *
     * Converts an RGB color value to HSL. Conversion formula adapted from
     * http://en.wikipedia.org/wiki/HSL_color_space. Assumes r, g, and b are
     * contained in the set [0, 255] and returns h, s, and l in the set [0, 1].
     */
    static rgbToHsl([r, g, b, a]) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h;
      let s;
      const l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return [h, s, l, a];
    }

    /**
     * https://gist.github.com/mjackson/5311256
     *
     * Converts an HSL color value to RGB. Conversion formula adapted from
     * http://en.wikipedia.org/wiki/HSL_color_space. Assumes h, s, and l are
     * contained in the set [0, 1] and returns r, g, and b in the set [0, 255].
     */
    static hslToRgb([h, s, l, a]) {
      let r;
      let g;
      let b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = function (p, q, t) {
          if (t < 0) {
            t += 1;
          }
          if (t > 1) {
            t -= 1;
          }
          if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
          }
          if (t < 1 / 2) {
            return q;
          }
          if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
          }
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      const rgba = [r * 255, g * 255, b * 255].map(Math.round);
      rgba[3] = a;

      return rgba;
    }
  }

  class EventBucket {
    constructor() {
      this._events = [];
    }

    add(target, type, handler) {
      target.addEventListener(type, handler, false);
      this._events.push({
        target,
        type,
        handler,
      });
    }

    remove(target, type, handler) {
      this._events = this._events.filter((e) => {
        let isMatch = true;
        if (target && target !== e.target) {
          isMatch = false;
        }
        if (type && type !== e.type) {
          isMatch = false;
        }
        if (handler && handler !== e.handler) {
          isMatch = false;
        }

        if (isMatch) {
          EventBucket._doRemove(e.target, e.type, e.handler);
        }
        return !isMatch;
      });
    }
    static _doRemove(target, type, handler) {
      target.removeEventListener(type, handler, false);
    }

    destroy() {
      this._events.forEach((e) =>
        EventBucket._doRemove(e.target, e.type, e.handler)
      );
      this._events = [];
    }
  }

  function parseHTML(htmlString) {
    // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.firstElementChild;
  }

  function dragTrack(eventBucket, area, callback) {
    let dragging = false;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(val, max));
    }

    function onMove(e, info, starting) {
      if (starting) {
        dragging = true;
      }
      if (!dragging) {
        return;
      }

      e.preventDefault();

      const bounds = area.getBoundingClientRect();
      const w = bounds.width;
      const h = bounds.height;
      const x = info.clientX;
      const y = info.clientY;

      const relX = clamp(x - bounds.left, 0, w);
      const relY = clamp(y - bounds.top, 0, h);

      callback(relX / w, relY / h);
    }

    function onMouse(e, starting) {
      const button = e.buttons === undefined ? e.which : e.buttons;
      if (button === 1) {
        onMove(e, e, starting);
      } else {
        // `mouseup` outside of window:
        dragging = false;
      }
    }

    function onTouch(e, starting) {
      if (e.touches.length === 1) {
        onMove(e, e.touches[0], starting);
      } else {
        // Don't interfere with pinch-to-zoom etc:
        dragging = false;
      }
    }

    // Notice how we must listen on the whole window to really keep track of
    // mouse movements, while touch movements "stick" to the original target
    // from `touchstart` (which works well for our purposes here):
    //
    //  https://stackoverflow.com/a/51750458/1869660 "Mouse moves = *hover* like
    //  behavior. Touch moves = *drags* like behavior"
    //
    eventBucket.add(area, "mousedown", function (e) {
      onMouse(e, true);
    });
    eventBucket.add(area, "touchstart", function (e) {
      onTouch(e, true);
    });
    eventBucket.add(window, "mousemove", onMouse);
    eventBucket.add(area, "touchmove", onTouch);
    eventBucket.add(window, "mouseup", function () {
      dragging = false;
    });
    eventBucket.add(area, "touchend", function () {
      dragging = false;
    });
    eventBucket.add(area, "touchcancel", function () {
      dragging = false;
    });
  }

  // https://stackoverflow.com/a/51117224/1869660
  const BG_TRANSP = `linear-gradient(45deg, lightgrey 25%, transparent 25%, transparent 75%, lightgrey 75%) 0 0 / 2em 2em, linear-gradient(45deg, lightgrey 25%, white 25%, white 75%, lightgrey 75%) 1em 1em / 2em 2em`;
  const HUES = 360;
  // We need to use keydown instead of keypress to handle Esc from the editor
  // textbox:
  const EVENT_KEY = "keydown"; // 'keypress'
  const EVENT_CLICK_OUTSIDE = "mousedown";
  const EVENT_TAB_MOVE = "focusin";

  function stopEvent(e) {
    // Stop an event from bubbling up to the parent:
    e.preventDefault();
    e.stopPropagation();
  }
  function onKey(bucket, target, keys, handler, stop) {
    bucket.add(target, EVENT_KEY, function (e) {
      if (keys.indexOf(e.key) >= 0) {
        if (stop) {
          stopEvent(e);
        }
        handler(e);
      }
    });
  }

  class Picker {
    // https://stackoverflow.com/questions/24214962/whats-the-proper-way-to-document-callbacks-with-jsdoc
    /**
     * A callback that gets the picker's current color value.
     *
     * @callback Picker~colorCallback
     * @param {Object} color
     * @param {number[]} color.rgba
     *        RGBA color components.
     * @param {number[]} color.hsla
     *        HSLA color components (all values between 0 and 1,
     *        inclusive).
     * @param {string} color.rgbString
     *        RGB CSS value (e.g. `rgb(255,215,0)`).
     * @param {string} color.rgbaString
     *        RGBA CSS value (e.g. `rgba(255,215,0, .5)`).
     * @param {string} color.hslString
     *        HSL CSS value (e.g. `hsl(50.6,100%,50%)`).
     * @param {string} color.hslaString
     *        HSLA CSS value (e.g. `hsla(50.6,100%,50%, .5)`).
     * @param {string} color.hex
     *        8 digit #RRGGBBAA (not supported in all browsers).
     */

    /**
     * Create a color picker.
     *
     * @example
     * var picker = new Picker(myParentElement);
     * picker.onDone = function(color) {
     *     myParentElement.style.backgroundColor = color.rgbaString;
     * };
     *
     * @example
     * var picker = new Picker({
     *     parent: myParentElement,
     *     color: 'gold',
     *     onChange: function(color) {
     *       myParentElement.style.backgroundColor = color.rgbaString;
     *     },
     * });
     *
     * @param {Object} options - @see {@linkcode Picker#setOptions|setOptions()}
     */
    constructor(options) {
      // Default settings
      this.settings = {
        // Allow creating a popup without putting it on screen yet. parent:
        //  document.body,
        popup: "right",
        layout: "default",
        alpha: true,
        editor: true,
        editorFormat: "hex",
        cancelButton: false,
        defaultColor: "#0cf",
      };

      this._events = new EventBucket();

      /**
       * Callback whenever the color changes.
       * @member {Picker~colorCallback}
       */
      this.onChange = null;
      /**
       * Callback when the user clicks "Ok".
       * @member {Picker~colorCallback}
       */
      this.onDone = null;
      /**
       * Callback before the popup opens.
       */
      this.onBeforeOpen = null;
      /**
       * Callback when the popup opens.
       * @member {Picker~colorCallback}
       */
      this.onOpen = null;
      /**
       * Callback when the popup closes.
       * @member {Picker~colorCallback}
       */
      this.onClose = null;

      this.setOptions(options);
    }

    /**
     * Set the picker options.
     *
     * @param {Object} options
     * @param {HTMLElement} options.parent
     *        Which element the picker should be attached to.
     * @param {('top'|'bottom'|'left'|'right'|false)} [options.popup=right]
     *        If the picker is used as a popup, where to place it relative to
     *        the parent. `false` to add the picker as a normal child element of
     *        the parent.
     * @param {string} [options.template]
     *        Custom HTML string from which to build the picker.
     * @param {string} [options.layout=default]
     *        Suffix of a custom "layout_..." CSS class to handle the overall
     *        arrangement of the picker elements.
     * @param {boolean} [options.alpha=true]
     *        Whether to enable adjusting the alpha channel.
     * @param {boolean} [options.editor=true]
     *        Whether to show a text field for color value editing.
     * @param {('hex'|'hsl'|'rgb')} [options.editorFormat=hex]
     *        How to display the selected color in the text field (the text
     *        field still supports *input* in any format).
     * @param {boolean} [options.cancelButton=false]
     *        Whether to have a "Cancel" button which closes the popup.
     * @param {string} [options.color]
     *        Initial color for the picker.
     * @param {function} [options.onChange]
     *        @see {@linkcode Picker#onChange|onChange}
     * @param {function} [options.onDone]
     *        @see {@linkcode Picker#onDone|onDone}
     * @param {function} [options.onBeforeOpen]
     *        @see {@linkcode Picker#onBeforeOpen|onBeforeOpen}
     * @param {function} [options.onOpen]
     *        @see {@linkcode Picker#onOpen|onOpen}
     * @param {function} [options.onClose]
     *        @see {@linkcode Picker#onClose|onClose}
     */
    setOptions(options) {
      if (!options) {
        return;
      }
      const settings = this.settings;

      function transfer(source, target, skipKeys) {
        for (const key in source) {
          if (skipKeys && skipKeys.indexOf(key) >= 0) {
            continue;
          }

          target[key] = source[key];
        }
      }

      if (options instanceof HTMLElement) {
        settings.parent = options;
      } else {
        // New parent?
        if (
          settings.parent &&
          options.parent &&
          settings.parent !== options.parent
        ) {
          this._events.remove(settings.parent);
          this._popupInited = false;
        }

        transfer(options, settings);

        // Event callbacks. Hook these up before setColor() below, because we'll
        // need to fire onChange() if there is a color in the options.
        if (options.onChange) {
          this.onChange = options.onChange;
        }
        if (options.onDone) {
          this.onDone = options.onDone;
        }
        if (options.onOpen) {
          this.onOpen = options.onOpen;
        }
        if (options.onBeforeOpen) {
          this.onBeforeOpen = options.onBeforeOpen;
        }
        if (options.onClose) {
          this.onClose = options.onClose;
        }

        // Note: Look for color in 'options', as a color value in 'settings' may
        // be an old one we don't want to revert to.
        const col = options.color || options.colour;
        if (col) {
          this._setColor(col);
        }
      }

      // Init popup behavior once we have all the parts we need:
      const parent = settings.parent;
      if (parent && settings.popup && !this._popupInited) {
        // Keep openHandler() pluggable, but call it in the right context:
        const openProxy = (e) => this.openHandler(e);

        this._events.add(parent, "click", openProxy);

        // Keyboard navigation: Open on [Space] or [Enter] (but stop the event
        // to avoid typing a " " in the editor textbox). No, don't stop the
        // event, as that would disable normal input behavior (typing a " " or
        // clicking the Ok button with [Enter]). Fix: setTimeout() in
        // openHandler().
        //
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values#Whitespace_keys
        onKey(this._events, parent, [" ", "Spacebar", "Enter"], openProxy);

        this._popupInited = true;
      } else if (options.parent && !settings.popup) {
        this.show();
      }
    }

    /**
     * Default behavior for opening the popup
     */
    openHandler(e) {
      if (this.onBeforeOpen) {
        this.onBeforeOpen();
      }

      if (this.show()) {
        // If the parent is an <a href="#"> element, avoid scrolling to the top:
        e && e.preventDefault();

        // A trick to avoid re-opening the dialog if you click the parent
        // element while the dialog is open:
        this.settings.parent.style.pointerEvents = "none";

        // Recommended popup behavior with keyboard navigation from
        // http://whatsock.com/tsg/Coding%20Arena/Popups/Popup%20(Internal%20Content)/demo.htm
        // Wait a little before focusing the textbox, in case the dialog was
        // just opened with [Space] (would overwrite the color value with a
        // " "):
        const toFocus =
          e && e.type === EVENT_KEY ? this._domEdit : this.domElement;
        setTimeout(() => toFocus.focus(), 100);

        if (this.onOpen) {
          this.onOpen(this.colour);
        }
      }
    }

    /**
     * Default behavior for closing the popup
     */
    closeHandler(e) {
      const event = e && e.type;
      let doHide = false;

      // Close programmatically:
      if (!e) {
        doHide = true;
      } else if (event === EVENT_CLICK_OUTSIDE || event === EVENT_TAB_MOVE) {
        // Close by clicking/tabbing outside the popup: See comments in
        // `_bindEvents()`. Undesirable behavior in Firefox though: When
        // clicking (mousedown) the [Ok] button or the textbox, a `focusout` is
        // raised on `picker_wrapper`, followed by a `focusin` on the parent (if
        // it is focusable). To keep that new event from closing the popup, we
        // add 100ms to our time control:
        const knownTime = (this.__containedEvent || 0) + 100;
        if (e.timeStamp > knownTime) {
          doHide = true;
        }
      } else {
        // Close by mouse/touch or key events: Don't bubble [Ok] clicks or
        // [Enter] keys up to the parent, because that's the trigger to re-open
        // the popup.
        stopEvent(e);

        doHide = true;
      }

      if (doHide && this.hide()) {
        this.settings.parent.style.pointerEvents = "";

        // Recommended popup behavior from
        // http://whatsock.com/tsg/Coding%20Arena/Popups/Popup%20(Internal%20Content)/demo.htm
        // However, we don't re-focus the parent if the user closes the popup by
        // clicking somewhere else on the screen, because they may have scrolled
        // to a different part of the page by then, and focusing would then
        // inadvertently scroll the parent back into view:
        if (event !== EVENT_CLICK_OUTSIDE) {
          this.settings.parent.focus();
        }

        if (this.onClose) {
          this.onClose(this.colour);
        }
      }
    }

    /**
     * Move the popup to a different parent, optionally opening it at the same
     * time.
     *
     * @param {Object}  options - @see
     * {@linkcode Picker#setOptions|setOptions()} (Usually a new `.parent` and
     * `.color`).
     * @param {boolean} open    - Whether to open the popup immediately.
     */
    movePopup(options, open) {
      // Cleanup if the popup is currently open (at least revert the current
      // parent's .pointerEvents);
      this.closeHandler();

      this.setOptions(options);
      if (open) {
        this.openHandler();
      }
    }

    /**
     * Set/initialize the picker's color.
     *
     * @param {string}  color  - Color name, RGBA/HSLA/HEX string, or RGBA
     * array.
     * @param {boolean} silent - If true, won't trigger onChange.
     */
    setColor(color, silent) {
      this._setColor(color, { silent: silent });
    }
    _setColor(color, flags) {
      if (typeof color === "string") {
        color = color.trim();
      }
      if (!color) {
        return;
      }

      flags = flags || {};
      let c;
      try {
        // Will throw on unknown colors:
        c = new Color(color);
      } catch (ex) {
        if (flags.failSilently) {
          return;
        }
        throw ex;
      }

      if (!this.settings.alpha) {
        const hsla = c.hsla;
        hsla[3] = 1;
        c.hsla = hsla;
      }
      this.colour = this.color = c;
      this._setHSLA(null, null, null, null, flags);
    }
    /**
     * Sets the picker's color.
     *
     * @param {string}  colour - Color name, RGBA/HSLA/HEX string, or RGBA
     * array.
     * @param {boolean} silent - If true, won't trigger onChange.
     * @see {@linkcode Picker#setColor|setColor()}
     */
    setColour(colour, silent) {
      this.setColor(colour, silent);
    }

    /**
     * Show/open the picker.
     */
    show() {
      const parent = this.settings.parent;
      if (!parent) {
        return false;
      }

      // Unhide html if it exists
      if (this.domElement) {
        const toggled = this._toggleDOM(true);

        // Things could have changed through setOptions():
        this._setPosition();

        return toggled;
      }

      const html =
        this.settings.template ||
        `<div class="picker_wrapper" tabindex="-1"><div class="picker_arrow"></div><div class="picker_hue picker_slider"><div class="picker_selector"></div></div><div class="picker_sl"><div class="picker_selector"></div></div><div class="picker_alpha picker_slider"><div class="picker_selector"></div></div><div class="picker_editor"><input aria-label="Type a color name or hex value"/></div><div class="picker_sample"></div><div class="picker_done"><button>Ok</button></div><div class="picker_cancel"><button>Cancel</button></div></div>`;
      const wrapper = parseHTML(html);

      this.domElement = wrapper;
      this._domH = wrapper.querySelector(".picker_hue");
      this._domSL = wrapper.querySelector(".picker_sl");
      this._domA = wrapper.querySelector(".picker_alpha");
      this._domEdit = wrapper.querySelector(".picker_editor input");
      this._domSample = wrapper.querySelector(".picker_sample");
      this._domOkay = wrapper.querySelector(".picker_done button");
      this._domCancel = wrapper.querySelector(".picker_cancel button");

      wrapper.classList.add("layout_" + this.settings.layout);
      if (!this.settings.alpha) {
        wrapper.classList.add("no_alpha");
      }
      if (!this.settings.editor) {
        wrapper.classList.add("no_editor");
      }
      if (!this.settings.cancelButton) {
        wrapper.classList.add("no_cancel");
      }
      this._ifPopup(() => wrapper.classList.add("popup"));

      this._setPosition();

      if (this.colour) {
        this._updateUI();
      } else {
        this._setColor(this.settings.defaultColor);
      }
      this._bindEvents();

      return true;
    }

    /**
     * Hide the picker.
     */
    hide() {
      return this._toggleDOM(false);
    }

    /**
     * Release all resources used by this picker instance.
     */
    destroy() {
      this._events.destroy();
      if (this.domElement) {
        this.settings.parent.removeChild(this.domElement);
      }
    }

    /*
     * Handle user input.
     *
     * @private
     */
    _bindEvents() {
      const that = this;
      const dom = this.domElement;
      const events = this._events;

      function addEvent(target, type, handler) {
        events.add(target, type, handler);
      }

      // Prevent clicks while dragging from bubbling up to the parent:
      addEvent(dom, "click", (e) => e.preventDefault());

      /* Draggable color selection */

      // Select hue
      dragTrack(events, this._domH, (x) => that._setHSLA(x));

      // Select saturation/lightness
      dragTrack(events, this._domSL, (x, y) => that._setHSLA(null, x, 1 - y));

      // Select alpha
      if (this.settings.alpha) {
        dragTrack(events, this._domA, (x, y) =>
          that._setHSLA(null, null, null, 1 - y)
        );
      }

      /* Direct color value editing */

      // Always init the editor, for accessibility and screen readers (we'll
      // hide it with CSS if `!settings.editor`)
      const editInput = this._domEdit;
      addEvent(editInput, "input", function () {
        that._setColor(this.value, { fromEditor: true, failSilently: true });
      });
      // Select all text on focus:
      addEvent(editInput, "focus", function () {
        const input = this;
        // If no current selection:
        if (input.selectionStart === input.selectionEnd) {
          input.select();
        }
      });

      /* Close the dialog */

      // onClose:
      this._ifPopup(() => {
        // Keep closeHandler() pluggable, but call it in the right context:
        const popupCloseProxy = (e) => {
          return this.closeHandler(e);
        };

        addEvent(window, EVENT_CLICK_OUTSIDE, popupCloseProxy);
        addEvent(window, EVENT_TAB_MOVE, popupCloseProxy);
        onKey(events, dom, ["Esc", "Escape"], popupCloseProxy);

        // Above, we added events on `window` to close the popup if the user
        // clicks outside or tabs away from the picker. Now, we must make sure
        // that clicks and tabs within the picker don't cause the popup to
        // close. Things we have tried:
        //  * Check `e.target` in `closeHandler()` and see if it's a child
        //    element of the picker.
        //      - That won't work if used in a shadow DOM, where the original
        //        `target` isn't available once the event reaches `window`
        //        (issue #15).
        //  * Stop the events from propagating past the popup element (using
        //    `e.stopPropagation()`).
        //      - ..but stopping mouse events interferes with text selection in
        //        the editor.
        //
        // So, next attempt: Note the `timeStamp` of the contained event, and
        // check it in `closeHandler()`. That should be a unique identifier of
        // the event, and the time seems to be preserved when retargeting shadow
        // DOM events:
        const timeKeeper = (e) => {
          this.__containedEvent = e.timeStamp;
        };
        addEvent(dom, EVENT_CLICK_OUTSIDE, timeKeeper);
        // Note: Now that we have added the 'focusin' event, this trick requires
        // the picker wrapper to be focusable (via `tabindex` - see
        // /src/picker.pug), or else the popup loses focus if you click anywhere
        // on the picker's background.
        addEvent(dom, EVENT_TAB_MOVE, timeKeeper);

        // Cancel button:
        addEvent(this._domCancel, "click", popupCloseProxy);
      });

      // onDone:
      const onDoneProxy = (e) => {
        this._ifPopup(() => this.closeHandler(e));
        if (this.onDone) {
          this.onDone(this.colour);
        }
      };
      addEvent(this._domOkay, "click", onDoneProxy);
      onKey(events, dom, ["Enter"], onDoneProxy);
    }

    /*
     * Position the picker on screen.
     *
     * @private
     */
    _setPosition() {
      const parent = this.settings.parent;
      const elm = this.domElement;

      if (parent !== elm.parentNode) {
        parent.appendChild(elm);
      }

      this._ifPopup((popup) => {
        // Allow for absolute positioning of the picker popup:
        if (getComputedStyle(parent).position === "static") {
          parent.style.position = "relative";
        }

        const cssClass = popup === true ? "popup_right" : "popup_" + popup;

        ["popup_top", "popup_bottom", "popup_left", "popup_right"].forEach(
          (c) => {
            // Because IE doesn't support .classList.toggle()'s second
            // argument...
            if (c === cssClass) {
              elm.classList.add(c);
            } else {
              elm.classList.remove(c);
            }
          }
        );

        // Allow for custom placement via CSS:
        elm.classList.add(cssClass);
      });
    }

    /*
     * "Hub" for all color changes
     *
     * @private
     */
    _setHSLA(h, s, l, a, flags) {
      flags = flags || {};

      const col = this.colour;
      const hsla = col.hsla;

      [h, s, l, a].forEach((x, i) => {
        if (x || x === 0) {
          hsla[i] = x;
        }
      });
      col.hsla = hsla;

      this._updateUI(flags);

      if (this.onChange && !flags.silent) {
        this.onChange(col);
      }
    }

    _updateUI(flags) {
      if (!this.domElement) {
        return;
      }
      flags = flags || {};

      const col = this.colour;
      const hsl = col.hsla;
      const cssHue = `hsl(${hsl[0] * HUES}, 100%, 50%)`;
      const cssHSL = col.hslString;
      const cssHSLA = col.hslaString;

      const uiH = this._domH;
      const uiSL = this._domSL;
      const uiA = this._domA;
      const thumbH = uiH.querySelector(".picker_selector");
      const thumbSL = uiSL.querySelector(".picker_selector");
      const thumbA = uiA.querySelector(".picker_selector");

      function posX(parent, child, relX) {
        child.style.left = relX * 100 + "%";
      }
      function posY(parent, child, relY) {
        child.style.top = relY * 100 + "%";
      }

      /* Hue */

      posX(uiH, thumbH, hsl[0]);

      // Use the fully saturated hue on the SL panel and Hue thumb:
      this._domSL.style.backgroundColor = this._domH.style.color = cssHue;

      /* S/L */

      posX(uiSL, thumbSL, hsl[1]);
      posY(uiSL, thumbSL, 1 - hsl[2]);

      // Use the opaque HSL on the SL thumb:
      uiSL.style.color = cssHSL;

      /* Alpha */

      posY(uiA, thumbA, 1 - hsl[3]);

      const opaque = cssHSL;
      const transp = opaque.replace("hsl", "hsla").replace(")", ", 0)");
      const bg = `linear-gradient(${[opaque, transp]})`;

      // Let the Alpha slider fade from opaque to transparent:
      this._domA.style.background = bg + ", " + BG_TRANSP;

      /* Editable value */

      // Don't update the editor if the user is typing. That creates too much
      // noise because of our auto-expansion of 3/4/6 -> 8 digit hex codes.
      if (!flags.fromEditor) {
        const format = this.settings.editorFormat;
        const alpha = this.settings.alpha;

        let value;
        switch (format) {
          case "rgb":
            value = col.printRGB(alpha);
            break;
          case "hsl":
            value = col.printHSL(alpha);
            break;
          default:
            value = col.printHex(alpha);
        }
        this._domEdit.value = value;
      }

      /* Sample swatch */

      this._domSample.style.color = cssHSLA;
    }

    _ifPopup(actionIf, actionElse) {
      if (this.settings.parent && this.settings.popup) {
        actionIf && actionIf(this.settings.popup);
      } else {
        actionElse && actionElse();
      }
    }

    _toggleDOM(toVisible) {
      const dom = this.domElement;
      if (!dom) {
        return false;
      }

      const displayStyle = toVisible ? "" : "none";
      const toggle = dom.style.display !== displayStyle;

      if (toggle) {
        dom.style.display = displayStyle;
      }
      return toggle;
    }
  }

  return Picker;
})();
