(function () {


  const CATEGORY = "hcl.leap.sample.widgets";
  const WIDGET_ID = CATEGORY + ".multifield";

  const myWidgetDefinition = {
    id: WIDGET_ID, // uniquely identifies this widget
    version: '1.0.0', // the widget's version
    apiVersion: '1.0.2', // the version of this API
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

      const a = () => {console.log("test")}
      const getJsonValue = (val)=> {
        let obj = {};
        if (typeof val == "string") {
          try {
            obj = JSON.parse(val);
          } catch (e) {
            console.error(WIDGET_ID, "getJsonValue", "unexpected value ", val);
          }
        } else if (typeof val == "object") {
          obj = val;
        }
        return obj;
      };

      let emailRegex = null;

      const ret = {
        
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
          let obj = getJsonValue(val);
          elValueEmail.value = obj.email || ""
          elValueName.value = obj.name || ""
        },



        // (optional) for additional validation of value
        validateValue: function (val) {
          console.log(WIDGET_ID, "validateValue entering", val);
          let obj = getJsonValue(val);
          // return true, false, or custom error message
          if (!obj.name) return "Bitte setzten Sie einen Namen";
          if (!obj.email) return "Bitte Email eingeben";
          if (emailRegex) {
            let validation = obj.email.match(emailRegex);
            console.log(WIDGET_ID, "validateValue", obj, validation);
            if (!validation?.length) return "Bitte gültige Email eingeben";
          } else {
            console.log(WIDGET_ID, "validateValue", "Kein regexp gesetzt");
          }
          
        },

        // (required) called when properties change in the authoring environment, or via JavaScript API
        setProperty: function (propName, propValue) {
          switch (propName) {
            case 'emailValidierung': emailRegex = new RegExp(propValue); break;
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
