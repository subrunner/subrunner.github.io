console.log("LEAP ERWEITERUNGEN: Custom Widget loaded. - Version 5");

(function () {


  const CATEGORY = "hcl.leap.sample.widgets";
  const WIDGET_ID = CATEGORY + "._exampleWidget";

  const myWidgetDefinition = {
    id: WIDGET_ID, // uniquely identifies this widget
    version: '2.0.0', // the widget's version
    apiVersion: '1.0.0', // the version of this API
    label: 'Leeres Template Testwidget', // Display label for the widget in the pallette. Alternative: label:{'default':'Yes/No','de':'Ja/Nein'}
    description: 'Macht nichts', // can be internationalized just like label
    datatype: {
      type: 'string', // must be one of 'string', 'date', 'number', 'boolean', 'time', 'timestamp'
      defaultValue: 'Yes', // OPTIONAL - default when user hasn't set anything
    },
    // for placement in the palette
    category: {
      id: CATEGORY,
      label: 'Leap Samples'
    },
    iconClassName: 'myYesNoIcon', // styling of this class expected in custom .css
    builtInProperties: [ // use existing properties: 'title', 'required', etc
      {
        id: "title"
      },
      {
        id: "id",
      },
      {
        id: "required",
      },
      {
        id: "seenInOverview",
        defaultValue: true
      }
    ],
    properties: [ // custom properties, of prescribed types (see datatypes)
      {
        id: "debugFlag",
        propType: "boolean",
        label: {
          "default": "Enable Debug",
          "de": "Debugging aktivieren"
        },
        defaultValue: {
          "default": false
        }
      },
    ],

    /**
     * called by Leap to initialize widget in the DOM with initial properties, and set-up event handling
     * @param {*} context //context.mode === 'run' || context.mode === 'preview'
     * @param {HTMLElement} domNode Root node where the HTML will be inserted
     * @param {Record<string, any>} initialProps Properties that were defined for the widget (mix of builtInProperties and properties)
     * @param {*} eventManager Use this to trigger the JS events that can be accessed via LEAP
     * @returns 
     */
    instantiate: function (context, domNode, initialProps, eventManager) {
      console.log(WIDGET_ID, "instantiate entering", context, domNode, initialProps);
      return {
        // (optional) for display in various parts of the UI
        getDisplayTitle: function () {

        },

        // (required) for Leap to get widget's data value
        getValue: function () {
          return "";
        },

        // (required) for Leap to set widget's data value
        setValue: function (val) {

        },

        // (optional) for additional validation of value
        validateValue: function (val) {
          // return true, false, or custom error message
        },

        // (required) called when properties change in the authoring environment, or via JavaScript API
        setProperty: function (propName, propValue) {

        },

        // (optional) method to enable/disable widget
        setDisabled: function (isDisabled) {

        },

        // (optional) determines what the author can do with the widget via custom JavaScript
        getJSAPIFacade: function () {
          return {

          };
        }
      };
    }
  };
  console.log(WIDGET_ID, "Registering widget", myWidgetDefinition);
  nitro.registerWidget(myWidgetDefinition);
})();

if (typeof acme === 'undefined') {
  acme = {
    makeHTMLSafe: (content) => content?.replace("<", "&lt;").replace(">", "&gt;")
  }; // use an isolated namespace
}

acme.yesNoWidget = {
  id: "acme.YesNo",
  version: "1.0.0",
  apiVersion: "1.0.0",
  label: {
    "default": "ACME Yes/No",
    "nl": "ACME Ja/Nee",
  },
  description: {
    "default": "ACME yes/no widget",
    "nl": "ACME Ja/Nee widget"
  },
  datatype: {
    type: "string"
  },
  category: {
    id: "acme.choiceWidgets",
    label: {
      "default": "ACME Choice",
      "nl": "ACME Keuze"
    }
  },
  formPalette: true,
  appPagePalette: true,
  iconClassName: "acmeYesNoIcon",
  builtInProperties: [
    {
      id: "title"
    },
    {
      id: "required",
    },
    {
      id: "seenInOverview",
      defaultValue: true
    }
  ],
  properties: [
    {
      id: "explanationText",
      propType: "string",
      label: {
        "default": "Explanation Text",
        "nl": "Uitleg tekst"
      },
      defaultValue: {
        "default": "Some default explanation text",
        "nl": "Een standaard uitlegtekst"
      }
    }
  ],

  // initialize widget in the DOM, with initial properties and event callbacks
  instantiate: function (context, domNode, initialProps, eventManager) {

    const widgetInstance = {
      _mode: null,
      _radioGroupNode: null, // <fieldset>
      _legendNode: null, // <legend>

      // internal custom mechanics for changing widget props
      _setProp: function ({
        propName,
        propValue
      }) {
        switch (propName) {
          case "title":
            this._legendNode.innerHTML = acme.makeHTMLSafe(propValue);
            break;
          case "explanationText":
            this._radioGroupNode.setAttribute('title', propValue);
            break;
          default:
            // ignore
            break;
        }
      },

      // internal method for creating and initializing the widget
      _init: function (context, domNode, initialProps, eventManager) {
        this._mode = context.mode;
        const yesText = acme.makeHTMLSafe(context.lang === 'nl' ? 'Ja' : 'Yes');
        const noText = acme.makeHTMLSafe(context.lang === 'nl' ? 'Nee' : 'No');
        //const isDisabled = this._mode === 'design';
        const isDisabled = false;
        const groupName = acme.makeHTMLSafe(context.id);

        const widgetHTML = '' +
          `<fieldset ${isDisabled ? 'disabled' : ''}>\n` +
          '  <legend></legend>\n' +
          `  <input data-yes="true" type="radio" value="yes" name="${groupName}"> ${yesText}\n` +
          `  <input data-no="true" type="radio" value="no" name="${groupName}"> ${noText}\n` +
          '</fieldset>';
        domNode.innerHTML = widgetHTML;

        this._radioGroupNode = domNode.firstChild;
        this._legendNode = this._radioGroupNode.querySelector(':scope legend');
        this._yesInput = this._radioGroupNode.querySelector(':scope input[data-yes="true"]');
        this._noInput = this._radioGroupNode.querySelector(':scope input[data-no="true"]');

        // set initial prop values
        Object.keys(initialProps).forEach((propName) => {
          this._setProp({
            propName: propName,
            propValue: initialProps[propName]
          });
        });

        // propagate events
        this._radioGroupNode.addEventListener("change", () => {
          // will trigger call to getValue()
          eventManager.sendEvent('onChange');
        });
      },

      // for display in various parts of the UI
      getDisplayTitle: function () {
        return this._legendNode.innerHTML;
      },

      // must be supplied for Leap to get widget's data value
      getValue: function () {
        if (this._yesInput.checked) {
          return this._yesInput.value;
        } else if (this._noInput.checked) {
          return this._noInput.value;
        } else {
          return null;
        }
      },

      // must be supplied for Leap to set widget's data value
      setValue: function (val) {
        if (val === 'yes') {
          this._yesInput.checked = true;
        } else if (val === 'no') {
          this._noInput.checked = true;
        } else {
          //not valid, ignore
        }
      },

      // called when properties change in the authoring environment, or via JavaScript API
      setProperty: function (propName, propValue) {
        this._setProp({
          propName,
          propValue
        });
      },

      setDisabled: function (isDisabled) {
        // TODO - to be implemented
      },

      getOptions: function () {
        var propOptions = [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ];
        return propOptions;
      },

      // determines what the author can do with the widget via custom JavaScript
      getJSAPIFacade: function () {
        const facade = {
          __self: this, // double-underscore keeps this private
          setTitle: function (title) {
            this.__self._setProp({
              propName: 'title',
              propValue: title
            });
          }
        }
        return facade;
      }
    };
    widgetInstance._init(context, domNode, initialProps, eventManager);
    return widgetInstance;
  }
}
acme.pageNavHeaderWidget = {

  id: "acme.PageNav",
  version: "1.0.0",
  apiVersion: "1.0.0",
  label: {
    "default": "ACME Page Nav Header",
    "nl": "Koptekst paginanavigatie",
  },
  description: {
    "default": "ACME Page Nav widget",
    "nl": "Koptekst paginanavigatie widget"
  },
  category: {
    id: "acme-display-widgets",
    label: {
      "default": "ACME Display",
      "nl": "ACME Scherm"
    }
  },
  formPalette: true,
  appPagePalette: false,
  iconClassName: "acmePageNavHeaderIcon",
  builtInProperties: [],
  properties: [],

  // initialize widget in the DOM, with initial properties and event callbacks
  instantiate: function (context, domNode) {
    console.log(context, domNode);
    const widgetInst = {
      _init: function () {
        if (context.mode === 'run' || context.mode === 'preview') {
          // TODO - avoid this timeout (necessary because things aren't quite ready yet)
          setTimeout(() => {
            const rootNode = document.createElement('div');
            rootNode.className = 'acmePageNavHeader';
            domNode.appendChild(rootNode);
            const currentPage = context.page;
            // use the JavaScript API to render a list of page buttons
            context.form.getPageIds().forEach((pageId, index) => {
              const page = context.form.getPage(pageId);
              const btn = document.createElement('button');
              btn.innerHTML = acme.makeHTMLSafe(page.getTitle() || `Page ${index + 1}`);
              if (page === currentPage) {
                btn.setAttribute('disabled', 'true');
              } else {
                btn.addEventListener('click', () => {
                  // use the JavaScript API to select a page
                  context.form.selectPage(pageId);
                });
              }
              rootNode.appendChild(btn);
            });
          }, 0);
        } else {
          domNode.innerHTML = '<div>ACME Page Nav Header (Preview to see)</div>';
        }
      },

      setProperty: function (propName, propValue) {
        // nothing to set
      },
    };
    widgetInst._init();
    return widgetInst;
  }
};

// register the widgets
nitro.registerWidget(acme.pageNavHeaderWidget);
nitro.registerWidget(acme.yesNoWidget);
console.log("Registered widget. ", nitro);




if (typeof leapSample === 'undefined') {
  leapSample = {}; // use an isolated namespace
};


leapSample.colorPickerWidget = {
  id: "leapSample.leap.sample.colorPicker",
  version: "1.0.0",
  apiVersion: "1.0.0",
  label: {
    "default": "Color Picker Widget",
    "it": "Esempio Color Picker",
  },
  description: {
    "default": "Provides a way to select a color",
    "it": "Il nuovo Color Picker",
    "fr": "Le nouveau widget pour faire le Color Picker"
  },
  datatype: {
    type: 'string',
    defautValue: '#000000'
  },
  category: {
    id: 'hcl.leap.sample.widgets',
    label: 'Leap Samples',
  },
  formPalette: true,
  appPagePalette: true,
  iconClassName: "colorPickerIcon",
  builtInProperties: [{
    id: "title"
  },
  {
    id: "id",
  },
  {
    id: "required",
  },
  {
    id: "seenInOverview",
    defaultValue: true
  }
  ],
  properties: [
    {
      id: "debugFlag",
      propType: "boolean",
      label: {
        "default": "Enable Debug",
        "it": "Abilita debug"
      },
      defaultValue: {
        "default": false
      }
    },
    {
      id: "theWidth",
      propType: "string",
      label: {
        "default": "Width (px or %)",
        "it": "Larghezza (px o %)"
      },
      defaultValue: ""
    },
    {
      id: "theHeight",
      propType: "string",
      label: {
        "default": "Height (px)",
        "it": "Altezza (px)"
      },
      defaultValue: ""
    },
    {
      id: "explanationText",
      propType: "string",
      label: {
        "default": "OnHover Description",
        "it": "Descrizione OnHover"
      },
      defaultValue: "OnHover Text"
    }
  ],

  // initialize widget in the DOM, with initial properties and event callbacks
  instantiate: function (context, domNode, initialProps, eventManager) {
    const rgbRegex = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i
    const hexRegex = /^[#]*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
    let widgetInstance = {
      _mode: null,
      _valueNode: null,
      _flexNode: null,
      _fieldsetNode: null,
      _legendNode: null,
      _debugFlag: true,
      _theId: context.id,
      /**
       * IMPORTANT: Avoids script injection
       */
      _sanitizeHTML: function (str) {
        let s = '' + str;
        s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        return s;
      },
      _debugMsg: function (ctx, msg) {
        if (ctx._debugFlag) console.log(ctx._theId + msg);
      },
      //
      //  Hexadecimal, RGB, Saturation, Literals
      //
      // Check Functions
      _checkHex: function (hex) {
        return hexRegex.test(hex);
      },

      _checkRgb: function (rgb) {
        return rgbRegex.test(rgb);
      },

      // Parse Function
      _modifyHex: function (hex) {
        let newHex = hex;
        if (newHex.length === 4) {
          newHex = newHex.replace('#', '');
        }
        if (newHex.length === 3) {
          newHex = newHex[0] + newHex[0] + newHex[1] + newHex[1] + newHex[2] + newHex[2];
        }
        this._debugMsg(this, '._modifyHex : converting ' + hex + ' to ' + newHex);
        return newHex;
      },

      // Helper Functions
      _addPound: function (x) {
        return '#' + x;
      },
      //
      // Converting Functions
      //
      _hexToRgb: function (hex) {
        let x = [];
        if (!this._checkHex(hex)) {
          this._debugMsg(this, '._hexToRgB: ' + hex + ' is not valid. Returning DEFAULT');
          return 'rgb(0,0,0)';
        }

        let newHex = hex.replace('#', '');
        if (newHex.length !== 6) {
          newHex = this._modifyHex(newHex);
        }
        x.push(parseInt(newHex.slice(0, 2), 16));
        x.push(parseInt(newHex.slice(2, 4), 16));
        x.push(parseInt(newHex.slice(4, 6), 16));
        let theResult = "rgb(" + x.toString() + ")"
        this._debugMsg(this, '._hexToRgB: ' + hex + ' converted tp ' + theResult);
        return theResult;
      },
      _rgbToHex: function (rgb) {
        let rgbArray = rgbRegex.exec(rgb);
        if (rgbArray) {
          let result = '#' + parseInt(rgbArray[2]).toString(16).padStart(2, '0') +
            parseInt(rgbArray[3]).toString(16).padStart(2, '0') +
            parseInt(rgbArray[4]).toString(16).padStart(2, '0');
          if (rgbArray[6]) {
            //
            //  Intensity
            //
            result += Math.round(rgbArray[6] * 255).toString(16).padStart(2, '0');
          }
          this._debugMsg(this, '._rgbToHex: i' + rgb + '  converted to ' + result.toUpperCase());
          return result.toUpperCase();
        } else {
          this._debugMsg(this, '._rgbToHex: invalid rgb definition : ' + rgb + ' . returning DEFAULT');
          return '#000000';
        }
      },
      _wordToHex: {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aqua: "#00FFFF",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#000000",
        blanchedalmond: "#FFEBCD",
        blue: "#0000FF",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgrey: "#A9A9A9",
        darkgreen: "#006400",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        fuchsia: "#FF00FF",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgray: "#D3D3D3",
        lightgrey: "#D3D3D3",
        lightgreen: "#90EE90",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        lime: "#00FF00",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        maroon: "#800000",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370DB",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        navy: "#000080",
        oldlace: "#FDF5E6",
        olive: "#808000",
        olivedrab: "#6B8E23",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#DB7093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#FFC0CB",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#FF0000",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        silver: "#C0C0C0",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        teal: "#008080",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        white: "#FFFFFF",
        whitesmoke: "#F5F5F5",
        yellow: "#FFFF00",
        yellowgreen: "#9ACD32"
      },
      _hexToWord: function () {
        let inverse = Object.entries(this._wordToHex).map(([k, v]) => [v, k]);
        let out = Object.fromEntries(inverse);
        return out;
      },
      _toHex: function (color) {
        this._debugMsg(this, '._toHex: checking HEX for color : ' + color);
        let result = this._wordToHex[color.toLowerCase()];
        if (result) {
          this._debugMsg(this, '._toHex: returning HEX  : ' + result);
          return result;
        } else {
          this._debugMsg(this, '._toHex: No correspondance. Returning undefined');
          return 'UNDEFINED';
        }
      },
      _fromHex: function (hex) {
        this._debugMsg(this, '._fromHex: checking Color for HEX : ' + hex);
        let theArray = this._hexToWord();
        let result = theArray[hex.toUpperCase()];
        if (result) {
          this._debugMsg(this, '._fromHex: returning Color : ' + result);
          return result;
        } else {
          this._debugMsg(this, '._fromHex: No correspondance. Returning undefined');
          return 'UNDEFINED';
        }
      },
      //
      // internal method for creating and initializing the widget
      //
      _init: function (context, domNode, initialProps, eventManager) {
        if (initialProps.debugFlag && (initialProps.debugFlag === true)) console.log(JSON.stringify(initialProps, ' ', 4));
        this._mode = context.mode;
        const isDisabled = this._mode === 'design';
        const groupName = this._sanitizeHTML(context.id);

        const widgetHTML = '' +
          '<fieldset>\n' +
          '   <legend></legend>\n' +
          '   <div class="flex-wrapper">\n' +
          '       <input type="color" id="colorPicker_' + Date.now() + '"></input>\n' +
          '   </div>\n' +
          '</fieldset>';

        domNode.innerHTML = widgetHTML;
        this._fieldsetNode = domNode.firstChild;
        this._legendNode = this._fieldsetNode.querySelector('legend');
        this._flexNode = this._fieldsetNode.querySelector('.flex-wrapper');
        this._valueNode = this._flexNode.querySelector('input');
        // set initial prop values
        Object.keys(initialProps).forEach((propName) => {
          this._setProp({ propName: propName, propValue: initialProps[propName] });
        });

        // propagate events
        this._valueNode.addEventListener("input", () => {
          // will trigger call to getValue()
          this._debugMsg(this, '.changeListener: CHANGE EVENT');
          eventManager.sendEvent('onChange');
        });
        /*
        this._fieldsetNode.addEventListener("click", () => {
            //this._debugMsg(this, '.clickListener: CLICK EVENT');
            //eventManager.sendEvent('onClick');
        });
        this._fieldsetNode.addEventListener("focus", () => {
            //this._debugMsg(this, '.focusListener: FOCUS EVENT');
            //eventManager.sendEvent('onFocus');
        });
        this._fieldsetNode.addEventListener("blur", () => {
            //this._debugMsg(this, '.blurListener: BLUR EVENT');
            //eventManager.sendEvent('onBlur');
        });
        this._fieldsetNode.addEventListener("focus", () => {
            //this._debugMsg(this, '.focusListener: FOCUS EVENT');
            //eventManager.sendEvent('onFocus');
        });
        this._valueNode.addEventListener("mouseover", () => {
            //this._debugMsg(this, '.mouseOverListener: MOUSEOVER EVENT');
            //alert('INPUT ' + this._valueNode.value);
           //eventManager.sendEvent('onMouseOver');
        });
        this._fieldsetNode.addEventListener("mouseout", () => {
            //this._debugMsg(this, '.mouseOutListener: MOUSEOUT EVENT');
            //eventManager.sendEvent('onMouseOut');
        });
        */
      },
      // internal custom mechanics for changing widget props
      _setProp: function ({ propName, propValue }) {
        this._debugMsg(this, '._setProp: Setting ' + propName + ' to ' + propValue);
        switch (propName) {
          case "title":
            this._legendNode.innerHTML = this._sanitizeHTML(propValue);
            break;
          case "explanationText":
            this._fieldsetNode.setAttribute('title', propValue);
            break;
          case "theWidth":
            this._valueNode.style["width"] = this._sanitizeHTML(propValue);
            break;
          case "theHeight":
            this._valueNode.style["height"] = this._sanitizeHTML(propValue);
            break;
          case "debugFlag":
            this._debugFlag = propValue;
            break;
          default:
            // ignore
            break;
        }
      },
      //
      // for display in various parts of the UI
      //
      getDisplayTitle: function () {
        this._debugMsg(this, '.getDisplayTitle : ' + this._legendNode.innerHTML);
        return this._legendNode.innerHTML;
      },
      //
      // must be supplied for Leap to get widget's data value
      //
      getValue: function () {
        this._debugMsg(this, '.getValue : ' + this._valueNode.value);
        return this._valueNode.value;
      },
      //
      // must be supplied for Leap to set widget's data value
      //
      setValue: function (val) {
        this._debugMsg(this, '.setValue : ' + val);
        //
        //  checking if value is HEXA
        //
        if (this._checkHex(val)) {
          //
          //  Hexadecimal
          //
          this._valueNode.value = val.replaceAll(' ', '');
        } else {
          //
          //  Problem
          //
          this._debugMsg(this, '.setValue : Value not an HEXADecimal. Setting to DEFAULT');
          this._valueNode.value = "#000000";
        }
      },
      //
      // called when properties change in the authoring environment, or via JavaScript API
      //
      setProperty: function (propName, propValue) {
        this._debugMsg(this, '.setProperty ' + propName + ' to ' + propValue);
        this._setProp({ propName, propValue });
      },
      //
      // determines what the author can do with the widget via custom JavaScript
      //
      getJSAPIFacade: function () {
        this._debugMsg(this, '.getJSAPIFacade: defining FACADE');
        const facade = {
          __self: this, // double-underscore keeps this private
          setTitle: function (theTitle) {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: setTitle : ' + theTitle);
            this.__self._setProp({ propName: 'title', propValue: theTitle });
          },
          getValueRGB: function () {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: getValueRGB for ' + this.__self.getValue());
            return this.__self._hexToRgb(this.__self.getValue());
          },
          getValueText: function () {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: getValueText for ' + this.__self.getValue());
            return this.__self._fromHex(this.__self.getValue());
          },
          setWidth: function (theWidth) {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: setWidth to ' + theWidth);
            this.__self._setProp({ propName: 'theWidth', propValue: theWidth });
          },
          getWidth: function () {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: getWidth to ' + this.__self._valueNode.style["width"]);
            return this.__self._valueNode.style["width"];
          },
          setHeight: function (theHeight) {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: setHeight to ' + theHeight);
            this.__self._setProp({ propName: 'theHeight', propValue: theHeight });
          },
          getHeight: function () {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: getHeight to ' + this.__self._valueNode.style["height"]);
            return this.__self._valueNode.style["height"];
          },
          setDebugFlag: function (debugFlag) {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: setDebugFlag to ' + debugFlag);
            this.__self._setProp({ propName: 'debugFlag', propValue: debugFlag });
          },
          getDebugFlag: function () {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: getDebugFlag for ' + this.__self._debugFlag);
            return this.__self._debugFlag;
          },
          convertToHex: function (val) {
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: convertToHex : ' + val);
            let theResult = null;
            //
            //  checking if value is HEXA
            //
            if (this.__self._checkHex(val)) {
              //
              //  Hexadecimal
              //
              theResult = val.replaceAll(' ', '');
            } else {
              //
              //  Check if RGB
              //
              if (this.__self._checkRgb(val)) {
                //
                //  RGBA value
                //
                theResult = this.__self._rgbToHex(val);
              } else {
                //
                //  Check if HSL
                //
                if (false) {
                  //
                  //  HSLA
                  //
                } else {
                  //
                  //  literal
                  //
                  theResult = this.__self._toHex(val);
                }
              }
            }
            this.__self._debugMsg(this.__self, '.getJSAPIFacade: convertToHex to result  ' + theResult);
            return theResult;
          }
        }
        return facade;
      },
      //
      //  Magaing Disabling the Widget
      //
      setDisabled: function (isDisabled) {
        // always disable in the authoring environment
        this._debugMsg(this, '.setDisabled : ' + isDisabled);
        const disabled = context.mode === 'design' || isDisabled;
        this._fieldsetNode.classList.toggle('disabled', disabled);
        this._valueNode.disabled = true;
      }
    };
    widgetInstance._init(context, domNode, initialProps, eventManager);
    if (context.mode === 'design') {
      //widgetInstance.setDisabled(true);
    }

    return widgetInstance;
  }
};


leapSample.customStyledTextbox = {
  id: 'leapSample.customStyledTextbox', // uniquely identifies this widget
  version: '1.0.0', // the widget's version
  apiVersion: '1.0.0', // the version of this API
  label: 'Styled Textbox', // Display label for the widget in the pallette. Alternative: label:{'default':'Yes/No','de':'Ja/Nein'}
  description: {
    'default': 'Allows user to choose "Yes" or "No"',
    'de': 'Textbox nach meinen Styling-Vorgaben'
  },
  datatype: {
    type: 'string', // must be one of 'string', 'date', 'number', 'boolean', 'time', 'timestamp'

  },
  // for placement in the palette
  category: {
    id: 'hcl.leap.sample.widgets',
    label: 'Leap Samples'
  },
  iconClassName: 'customTextbox', // styling of this class expected in custom .css
  builtInProperties: [ // use existing properties: 'title', 'required', etc
    {
      id: "title"
    },
    {
      id: "id",
    },
    {
      id: "required",
    },
    {
      id: "seenInOverview",
      defaultValue: true
    }
  ],
  properties: [ // custom properties, of prescribed types (see datatypes)
    {
      id: "debugFlag",
      propType: "boolean",
      label: {
        "default": "Enable Debug",
        "de": "Debugging aktivieren"
      },
      defaultValue: {
        "default": false
      }
    }, {
      id: "fontSize",
      propType: "number",
      label: "Schriftgröße",
      defaultValue: {
        "default": 12
      }
    }
  ],

  /**
   * called by Leap to initialize widget in the DOM with initial properties, and set-up event handling
   * @param {*} context 
   * @param {HTMLElement} domNode Root node where the HTML will be inserted
   * @param {Record<string, any>} initialProps Properties that were defined for the widget (mix of builtInProperties and properties)
   * @param {*} eventManager Use this to trigger the JS events that can be accessed via LEAP
   * @returns 
   */
  instantiate: function (context, domNode, initialProps, eventManager) {
    const TAG_NAME = "leapSample.customStyledTextbox";

    try {
      console.log(TAG_NAME, "Instantiating widget 1", context, domNode);
      const widgetHTML = `
      <fieldset id="top">
        <legend></legend>
          <div class="flex-wrapper">
             <input type="text" id="myCustomTextbox_${Date.now()}"></input>
         </div>
      </fieldset>
      `;

      domNode.innerHTML = widgetHTML;
      
      const _fieldsetNode = domNode.firstElementChild;
      console.log("Dom node now", domNode, _fieldsetNode);
      const elTitle = _fieldsetNode.querySelector('legend');
      const _flexNode = _fieldsetNode.querySelector('.flex-wrapper');
      const elValue = _flexNode.querySelector('input');

      // propagate events
      elValue.addEventListener("input", () => {
        // will trigger call to getValue()
        eventManager.sendEvent('onChange');
      });

      const ret = {
        // (optional) for display in various parts of the UI
        getDisplayTitle: function () {
          return initialProps.title;
        },

        // (required) for Leap to get widget's data value
        getValue: function () {
          return elValue.value;
        },

        // (required) for Leap to set widget's data value
        setValue: function (val) {
          elValue.value = val;
        },

        // (optional) for additional validation of value
        validateValue: function (val) {
          // return true, false, or custom error message
          if (!val) return "Bitte setzen Sie einen Wert.";
          return true;
        },

        // (required) called when properties change in the authoring environment, or via JavaScript API
        setProperty: function (propName, propValue) {
          switch (propName) {
            case 'title': elTitle.innerHTML = propValue; break;
            case 'fontSize': elValue.style.fontSize = propValue + "px";
            default: console.log(TAG_NAME, "SEtting property " + propName + " to value " + propValue);
          }
        },

        // (optional) method to enable/disable widget
        setDisabled: function (isDisabled) {
          elValue.disabled = isDisabled
        },

        // (optional) determines what the author can do with the widget via custom JavaScript
        getJSAPIFacade: function () {
          return {

          };
        }
      };

      // set initial prop values
      Object.keys(initialProps).forEach((propName) => {
        ret.setProperty(propName, initialProps[propName]);
      });
      return ret;
    } catch (e) {
      console.error(TAG_NAME, "Could not instantiate widget!", e);
      throw e;
    }
  }
}
nitro.registerWidget(leapSample.colorPickerWidget);
nitro.registerWidget(leapSample.customStyledTextbox);

(function () {


  const CATEGORY = "hcl.leap.sample.widgets";
  const WIDGET_ID = CATEGORY + ".multifield";

  const myWidgetDefinition = {
    id: WIDGET_ID, // uniquely identifies this widget
    version: '1.0.0', // the widget's version
    apiVersion: '1.0.0', // the version of this API
    label: 'Kontaktdaten', // Display label for the widget in the pallette. Alternative: label:{'default':'Yes/No','de':'Ja/Nein'}
    description: 'Standardmäßiges Kontaktdatenformular', // can be internationalized just like label
    datatype: {
      type: 'string', // must be one of 'string', 'date', 'number', 'boolean', 'time', 'timestamp'
      defaultValue: '{}', // OPTIONAL - default when user hasn't set anything
    },
    // for placement in the palette
    category: {
      id: CATEGORY,
      label: 'Leap Samples'
    },
    iconClassName: 'kontaktIcon', // styling of this class expected in custom .css
    builtInProperties: [ // use existing properties: 'title', 'required', etc
      {
        id: "title"
      },
      {
        id: "id",
      },
      {
        id: "required",
      },
      {
        id: "seenInOverview",
        defaultValue: true
      }
    ],
    properties: [ // custom properties, of prescribed types (see datatypes)
      {
        id: "emailValidierung",
        propType: "string",
        label: {
          "default": "Regex für Email validierung",
        },
        defaultValue: {
          "default": ".*@.*"
        }
      },
    ],

    /**
     * called by Leap to initialize widget in the DOM with initial properties, and set-up event handling
     * @param {*} context //context.mode === 'run' || context.mode === 'preview'
     * @param {HTMLElement} domNode Root node where the HTML will be inserted
     * @param {Record<string, any>} initialProps Properties that were defined for the widget (mix of builtInProperties and properties)
     * @param {*} eventManager Use this to trigger the JS events that can be accessed via LEAP
     * @returns 
     */
    instantiate: function (context, domNode, initialProps, eventManager) {
      console.log(WIDGET_ID, "instantiate entering", context, domNode, initialProps);


      // console.log(WIDGET_ID, "Instantiating widget 1", context, domNode);
      const widgetHTML = `
      <div>
        <fieldset class="name">

          <legend>Name</legend>
            <div class="flex-wrapper">
              <input type="text"  ></input>
          </div>
        </fieldset>
        <fieldset class="email">

          <legend>Email</legend>
            <div class="flex-wrapper">
              <input type="text" ></input>
          </div>
        </fieldset>
      </div>
      `;

      domNode.innerHTML = widgetHTML;

      const _elFieldsets = domNode.querySelectorAll('fieldset');
      const _elFieldsetName = _elFieldsets.item(0);
      const _elFieldsetEmail = _elFieldsets.item(1);

      const elValueName = _elFieldsetName.querySelector('input');
      const elValueEmail = _elFieldsetEmail.querySelector('input');

      // propagate events
      elValueName.addEventListener("input", () => {
        // will trigger call to getValue()
        eventManager.sendEvent('onChange');
      });

      elValueEmail.addEventListener("input", () => {
        // will trigger call to getValue()
        eventManager.sendEvent('onChange');
      });

      const ret = {
        emailRegex: null,

        // (optional) for display in various parts of the UI
        getDisplayTitle: function () {
          return initialProps.title;
        },

        // (required) for Leap to get widget's data value
        getValue: function () {
          const ret = {
            name: elValueName.value,
            email: elValueEmail.value
          }
          return JSON.stringify(ret);
        },

        // (required) for Leap to set widget's data value
        setValue: function (val) {
          let obj = {};
          if (val) {
            try {
              obj = JSON.parse(val);
            } catch (e) {
              console.error(WIDGET_ID, "setValue", "unexpected value ", val);
            }
          }
          elValueEmail.value = obj.email || ""
          elValueName.value = obj.name || ""
        },

        // (optional) for additional validation of value
        validateValue: function (val) {
          // return true, false, or custom error message
          if (!val.name) return "Bitte setzten Sie einen Namen";
          if (!val.email) return "Bitte Email eingeben";
          if (this.emailRegex) {
            let validation = val.email.match(this.emailRegex);
            console.log(WIDGET_ID, "validateValue", val, validation);
            if (!validation.length) return "Bitte gültige Email eingeben";
          } else {
            console.log(WIDGET_ID, "validateValue", "Kein regexp gesetzt");
          }
          return true;
        },

        // (required) called when properties change in the authoring environment, or via JavaScript API
        setProperty: function (propName, propValue) {
          switch (propName) {
            case 'emailValidierung': this.emailRegex = new RegExp(propValue); break;
            default: console.log(WIDGET_ID, "SEtting property " + propName + " to value " + propValue);
          }
        },

        // (optional) method to enable/disable widget
        setDisabled: function (isDisabled) {
          elValueName.disabled = isDisabled
          elValueEmail.disabled = isDisabled
        },

        // (optional) determines what the author can do with the widget via custom JavaScript
        getJSAPIFacade: function () {
          return {

          };
        }
      };

      // set initial prop values
      Object.keys(initialProps).forEach((propName) => {
        ret.setProperty(propName, initialProps[propName]);
      });
      return ret;
    }
  };
  console.log(WIDGET_ID, "Registering widget", myWidgetDefinition);
  nitro.registerWidget(myWidgetDefinition);
})();
