alert("Custom Widget loaded. - Version 2");
if (typeof acme === 'undefined') {
    acme = {
	    makeHTMLSafe: (content)=> content?.replace("<","&lt;").replace(">", "&gt;")
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

            setDisabled: function(isDisabled)
            {
				// TODO - to be implemented
            },

            getOptions: function(){
                var propOptions = [
                    { title: "Yes", value : "yes"},
                    { title : "No", value : "no"},
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
	    alert("Page widget was instantiated");
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

// do our own stuff
function waitFor(selector, maxWaitTime, successCallback){
	let ret = document.quereySelector(selector);
	if (ret){
		successCallback(ret);
		return;
	}
	if (maxWaitTime === 0){
		console.log("Did not find element...");
		return;
	}

	setTimeout(() => {
		waitFor(selector, maxWaitTime - 500, successCallback);
	}, 500);
}
waitFor("#F_Form1-P_NewPage1-F_name-widget", 5000, (elInput) => {
	elInput.addEventListener('click',() => alert("Input clicked"));
});
