// 10.07.2025

(function () {
  const CATEGORY = "hcl.leap.sample.widgets";
  const WIDGET_ID = CATEGORY + ".exampleStowasser";

  const myWidgetDefinition = {
    id: WIDGET_ID, // uniquely identifies this widget
    version: '1.0.0', // the widget's version
    apiVersion: '1.0.0', // the version of this API
    label: 'Textbox - Stowasser', // Display label for the widget in the pallette. Alternative: label:{'default':'Yes/No','de':'Ja/Nein'}
    description: 'Displays a textbox', // can be internationalized just like label
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
      domNode.innerHTML = 
        `
        <label for="textbox">Enter text:</label>
        <input type="text" id="textbox" name="textbox" placeholder="Type here...">
        `
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