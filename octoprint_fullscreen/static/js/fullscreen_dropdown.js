/*
 * View model for OctoPrint-Fullscreen dropdowns
 *
 * Mike Ratcliffe
 * License: AGPLv3
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Constructor function for OctoprintFullscreenDropdownViewModel.
   *
   * @param {Array} tempModel
   *        temperatureViewModel
   * @param {Object} printer
   *        printerStateViewModel
   */
  function OctoprintFullscreenDropdownViewModel(settings) {
    this.settings = settings;

    this._selectWrapper = null;
    this._select = null;
    this._trigger = null;
    this._label = null;
    this._arrow = null;
    this._optionContainer = null;
    this._options = [];

    /**
     * Factory method that creates new dropdowns with the given settings.
     *
     * @param {Object} settings
     *        The settings for the dropdown
     * @param {String} settings.selector
     *        The selector of the element in which to create the dropdown, e.g.
     *        "#octoprint-fullscreen-font-select"
     * @param {String} settings.action
     *        The action to perform on when options are selected. Currently only
     *        "applyClass" can be used, which causes the dropdown to apply the
     *        selected option's className to the applied to the label
     * @param {octoprintSetting} settings.setting
     *        The setting to update when an option is selected
     *        e.g. this.settings.font_family
     * @param {Object[]} settings.options
     *        The options to display
     * @param {String} settings.options[].text
     *        The text of the option
     * @param {String} settings.options[].value
     *        The value to option
     * @param {String} settings.options[].className
     *        The CSS class to apply to the option. If settings.option is set to
     *        "applyClass", then this class will be applied to the dropdown
     *        label
     *
     * @return {OctoprintFullscreenDropdownViewModel} the newly created dropdown
     */
    this.createDropdown = (settings) => {
      const newDropdown = new OctoprintFullscreenDropdownViewModel(settings);
      newDropdown.settings = settings;

      newDropdown.createDomNodes();
      newDropdown.populateOptions();
      newDropdown.addSelectClickHandler();
      newDropdown.addOptionsClickHandler();
      newDropdown.addSelectKeyHandler();

      return newDropdown;
    };

    /**
     * Creates DOM nodes for the select wrapper to be added to the node
     * specified in settings.selector
     */
    this.createDomNodes = () => {
      this._selectWrapper = document.querySelector(this.settings.selector);
      this._selectWrapper.className = "select-wrapper";

      this._select = document.createElement("div");
      this._select.className = "select";
      this._select.setAttribute("tabindex", "0");
      this._selectWrapper.appendChild(this._select);

      this._trigger = document.createElement("div");
      this._trigger.className = "trigger";
      this._select.appendChild(this._trigger);

      this._label = document.createElement("span");
      this._trigger.appendChild(this._label);

      this._arrow = document.createElement("div");
      this._arrow.className = "arrow";
      this._trigger.appendChild(this._arrow);

      this._optionContainer = document.createElement("div");
      this._optionContainer.className = "options";
      this._select.appendChild(this._optionContainer);
    };

    /**
     * Get the value of the dropdown.
     *
     * @return {string} The text content of the dropdown
     */
    this.getValue = () => {
      return this._optionContainer
        .querySelector(".options > span[selected]")
        .getAttribute("data-value");
    };

    /**
     * Set the value of the dropdown.
     *
     * @param {string} value The value to set
     */
    this.setValue = (value) => {
      const option = this._optionContainer.querySelector(
        `.options > span[data-value="${value}"]`
      );
      this.optionsClick({
        target: option,
      });
    };

    /**
     * Populates the dropdown options based on settings.options.
     */
    this.populateOptions = () => {
      for (const optionData of this.settings.options) {
        const { className, text, value } = optionData;
        const option = document.createElement("span");

        option.className = className;
        option.setAttribute("data-value", value);

        if (this.settings.setting() === value) {
          if (this.settings.action === "applyClass") {
            this._label.classList.add(className);
          }
          option.setAttribute("selected", "");
          this._label.textContent = text;
        }

        option.textContent = text;

        this._optionContainer.appendChild(option);
        this._options.push(option);
      }
    };

    /**
     * Add click handler to the select element
     */
    this.addSelectClickHandler = () => {
      this._select.addEventListener(
        "click",
        () => {
          this._select.classList.toggle("open");
        },
        true
      );
    };

    /**
     * Add click handler to the options
     */
    this.addOptionsClickHandler = () => {
      this._optionContainer.addEventListener("click", this.optionsClick);
    };

    /**
     * Handle click on an option
     *
     * @param {Event} event
     */
    this.optionsClick = (event) => {
      // Remove selected attribute from all options
      this._optionContainer
        .querySelector(".options > span[selected]")
        .removeAttribute("selected");

      // Add selected attribute to option
      const option = event.target;
      option.setAttribute("selected", "");

      // If we are in applyClass mode we need to apply the className to the
      // label
      if (this.settings.action === "applyClass") {
        // Remove relevant classes from label
        for (const _option of this._options) {
          this._label.classList.remove(_option.className);
        }

        // Add class to label
        const dataClass = option.className;
        if (dataClass) {
          this._label.classList.add(dataClass);
        }
      }

      // Set the label text
      this._label.textContent = option.textContent;

      // Hide the select element
      this._select.classList.remove("open");
    };

    /**
     * Add key handler to the select element
     */
    this.addSelectKeyHandler = () => {
      this._select.addEventListener("keydown", (event) => {
        const option = this._optionContainer.querySelector(
          ".options > span[selected]"
        );
        const isOpen = this._select.classList.contains("open");

        /**
         * Open the dropdown.
         */
        const openDropdown = () => {
          this._select.classList.add("open");
        };

        /**
         * Close the dropdown.
         */
        const closeDropdown = (setValue) => {
          this._select.classList.remove("open");

          if (setValue) {
            const value = option.getAttribute("data-value");
            this.setValue(value);
          }
        };

        /**
         * Move to the previous option and update the value if specified.
         *
         * @param {Bolean} setValue
         *        Update the dropdown label to the current value
         */
        const moveToPrevOption = (setValue) => {
          const index = this._options.indexOf(option);

          if (index > 0) {
            option.removeAttribute("selected");

            const newOption = this._options[index - 1];
            newOption.setAttribute("selected", "");

            if (setValue) {
              const value = newOption.getAttribute("data-value");
              this.setValue(value);
            }
          }
        };

        /**
         * Move to the next option and update the value if specified.
         *
         * @param {Bolean} setValue
         *        Update the dropdown label to the current value
         */
        const moveToNextOption = (setValue) => {
          const index = this._options.indexOf(option);

          if (index < this._options.length - 1) {
            option.removeAttribute("selected");

            const newOption = this._options[index + 1];
            newOption.setAttribute("selected", "");

            if (setValue) {
              const value = newOption.getAttribute("data-value");
              this.setValue(value);
            }
          }
        };

        switch (event.key) {
          case "ArrowUp":
            if (!isOpen) {
              openDropdown();
              return;
            }

            moveToPrevOption();
            event.preventDefault();
            break;
          case "ArrowDown":
            if (!isOpen) {
              openDropdown();
              return;
            }

            moveToNextOption();
            event.preventDefault();
            break;
          case "ArrowLeft":
            if (!isOpen) {
              moveToPrevOption(true);
            }
            break;
          case "ArrowRight":
            if (!isOpen) {
              moveToNextOption(true);
            }
            break;
          case "Enter":
          case "Tab":
            closeDropdown(true);
            break;
          case "Escape":
            closeDropdown();
            break;
        }
      });
    };
  }

  OCTOPRINT_VIEWMODELS.push({
    construct: OctoprintFullscreenDropdownViewModel,
    dependencies: [],
    optional: [],
    elements: [],
  });
});
