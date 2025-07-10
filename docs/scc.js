(function () {


  const CATEGORY = "hcl.leap.sample.widgets";
  const WIDGET_ID = CATEGORY + ".SccWidget";

  const myWidgetDefinition = {
    id: WIDGET_ID, // uniquely identifies this widget
    version: '3.0.0', // the widget's version
    apiVersion: '2.0.0', // the version of this API
    label: 'Textbox_scc', // Display label for the widget in the pallette. Alternative: label:{'default':'Yes/No','de':'Ja/Nein'}
    description: 'Textbox', // can be internationalized just like label
    datatype: {
      type: 'string', // must be one of 'string', 'date', 'number', 'boolean', 'time', 'timestamp'
      //defaultValue: '', // OPTIONAL - default when user hasn't set anything
    },
    // for placement in the palette
    category: {
      id: CATEGORY,
      label: 'Leap Samples'
    },
    iconClassName: 'sccTextbox', // styling of this class expected in custom .css
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
     * @param {*} context //context.mode === 'run' || context.mode === 'preview'
     * @param {HTMLElement} domNode Root node where the HTML will be inserted
     * @param {Record<string, any>} initialProps Properties that were defined for the widget (mix of builtInProperties and properties)
     * @param {*} eventManager Use this to trigger the JS events that can be accessed via LEAP
     * @returns 
     */
    instantiate: function (context, domNode, initialProps, eventManager) {
      console.log(WIDGET_ID, "instantiate entering", context, domNode, initialProps);
      try {
      console.log(TAG_NAME, "Instantiating widget", context, domNode);
      const widgetHTML = `
      <fieldset>
        <legend></legend>
          <div class="flex-wrapper">
             <input type="text" id="myCustomTextbox_${Date.now()}"></input>
         </div>
      </fieldset>
      `;

      domNode.innerHTML = widgetHTML;
      const _fieldsetNode = domNode.firstChild;
      const elTitle = _fieldsetNode.querySelector('legend');
      const _flexNode = _fieldsetNode.querySelector('.flex-wrapper');
      const elValue = _flexNode.querySelector('input');

      // set initial prop values
      Object.keys(initialProps).forEach((propName) => {
        ret.setProperty(propName, initialProps[propName]);
      });

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
      return ret;
    } catch (e) {
      console.error(TAG_NAME, "Could not instantiate widget!", e);
      throw e;
    }
  };
  console.log(WIDGET_ID, "Registering widget", myWidgetDefinition);
  nitro.registerWidget(myWidgetDefinition);
})();
