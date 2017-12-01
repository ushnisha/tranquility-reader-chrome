'use strict';

var browser = browser || chrome;

function browserAction() {
    runTranquility("Run");
}

function runTranquility(mode) {
    console.log("Entered runTranquility at: " + new Date());
    console.log("Run Mode: " + mode);
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let active_tab = tabs[0];
        console.log(active_tab.id);
        insertContentScriptsAndCSSAndAction(active_tab.id, mode);
     });
}

function runTranquilityOnSelection() {
    let mode = "RunOnSelection";
    console.log("Entered runTranquility at: " + new Date());
    console.log("Run Mode: " + mode);
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let active_tab = tabs[0];

        console.log(active_tab.id);

        // Send message to tab to find out if Tranquility has already run on that tab
 
       let onSendMessage = function(response) {
           if (browser.runtime.lastError) {
               console.log(browser.runtime.lastError);
               // Tranquility has not already run; so insert content scripts and run Tranquility
               insertContentScriptsAndCSSAndAction(active_tab.id, mode);
           }
           else {
               // Tranquility must have run; only then we have a possible response from content script
               console.log("Response From Content Script: " + response.response);
               runAction(active_tab.id, mode);
           }
       }

       let sendMessage = browser.tabs.sendMessage(active_tab.id, {tranquility_action: "Status"}, onSendMessage);
    });
}

function addTranquilityAnnotation() {
    console.log("Sending message to content script to add an annotation...");
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {tranquility_action: "AddAnnotation"});
    }); 
}


function modifyTabURL(thisURL) {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let updating = browser.tabs.update(tabs[0].id, { url: thisURL });
    });    
}

function runAction(tabId, action) {
    // Send message to run tranquility (or other appropriate action that the content scripts
    // will handle
    let onSendMessage = function(response) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            console.log("Response From Content Script: " + response.response);
        }
    }

    let sendMessage = browser.tabs.sendMessage(tabId, {tranquility_action: action}, onSendMessage);
}

function insertContentScriptsAndCSSAndAction(tabId, action) {
    
    console.log("Inserting Scrips and CSS into tabId: " + tabId);
    let success = true;

    browser.tabs.insertCSS(tabId, { matchAboutBlank: true, file: "/css/tranquility.css", runAt: "document_end"}, function() {
        browser.tabs.executeScript(tabId, { matchAboutBlank: true, file: "/content_scripts/tranquilize.js", runAt: "document_end"}, function () {
            browser.tabs.executeScript(tabId, { matchAboutBlank: true, file: "/content_scripts/apply_tranquility_preferences.js", runAt: "document_end"}, function() {
                browser.tabs.executeScript(tabId, { matchAboutBlank: true, file: "/content_scripts/tranquility_annotations.js", runAt: "document_end"}, function (){
                    browser.tabs.executeScript(tabId, { matchAboutBlank: true, file: "/content_scripts/tranquility_offline_content.js", runAt: "document_end"}, function() {
                        browser.tabs.executeScript(tabId, { matchAboutBlank: true, file: "/content_scripts/tranquility_event_handlers.js", runAt: "document_end"}, function () {
                            if (action == "PopulateOfflinePages") {
                                db_getOfflinePagesList();
                            }
                            else if (action == "ExportOfflinePages") {
                                console.log("Calling function to gather all offline content");
                                db_getAllOfflineContent();
                            }
                            else {
                                // Remove zoom since we want to use the Tranquility font sizes only
                                // Unfortunately, this will mean that page zoom settings are lost for
                                // future normal loads of the page.  I am unable to figure out a way to
                                // restore the original zoom in a straightforward manner given that
                                // we support a tranquil browsing mode.
                                //
                                //setZoom(1);

                                runAction(tabId, action);
                            }
                        });
                    });
                });
            });
        });
    });

}

function allTabsUpdateTranquilityPreferences() {

    let onQuerying = function(tabs) {

        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            for (let tab of tabs) {
                updateTab(tab.id);
            }
        }
    }

    let querying = browser.tabs.query({}, onQuerying);
}

function updateTab(tabId) {
    let onSendMessage = function(response) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            console.log("Response From Content Script: " + response.response);
        }
    }

    let sendMessage = browser.tabs.sendMessage(tabId,
                                               {tranquility_action: "UpdateTranquilityPreferences"},
                                               onSendMessage);
}

function displayTranquilityOfflinePages() {
        
    let onUpdate = function(tab) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            console.log("Call to insert Content for display offline pages");
            insertContentScriptsAndCSSAndAction(tab.id, "PopulateOfflinePages");
        }
    };
        
    let updating = browser.tabs.create(
        {
            active: true, 
            url: "http://www.google.com"
        }, onUpdate);    
}


function exportTranquilityOfflinePages() {
    
    let onUpdate = function(tab) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            console.log("Call to insert Content for export");
            insertContentScriptsAndCSSAndAction(tab.id, "ExportOfflinePages");
        }
    };
    
    let updating = browser.tabs.create(
        {
            active: true, 
            url: "http://www.google.com"
        }, onUpdate);
            
}


function importTranquilityOfflinePages() {
        
    let onUpdate = function(tab) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            insertContentScriptsAndCSSAndAction(tab.id, "ImportOfflinePages");
        }
    };
    
    let updating = browser.tabs.create(
        {
            active: true, 
            url: "http://www.google.com"
        }, onUpdate);
    
}


function loadLinkAndRunTranquility(thisURL, mode) {
    console.log("Entered load and Run:" + thisURL);

    let onCreated = function (tab) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            runTranquility(mode);
        }
    }
        
    
    console.log("Invoking Browser update call for load and Run:" + thisURL);
    let updating = browser.tabs.create({active: true, url: thisURL}, onCreated);

}

function setZoom(zoom) {
    
    let onSetZoom = function () {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
    }

    let setting = browser.tabs.setZoom(zoom, onSetZoom);
}


// On installation check to see if an option is gettable; if not, set that option
function handleInstalled(details) {

    console.log("Tranquility installed!");
    console.log(details);

    let options_list = tranquility_presets["Default (Light)"];

    let option_keys = Object.keys(options_list);

    for (let opt=0; opt < option_keys.length; opt++) {
        let opt_name = option_keys[opt];
        let opt_value = options_list[opt_name];
        initializeOption(opt_name, opt_value);
    }

    // Finally, create a new option to store the presets
    // to allow users to add their own custom presets
    initializeOption("tranquility_presets",
             JSON.stringify(tranquility_presets));

}

function initializeOption(opt_name, opt_value) {
    
    console.log(opt_name + ": " + opt_value);
    
    let onGettingSuccess = function(result) {            
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            if (Object.keys(result).length == 0) {
                let onSetting = function() {
                    if (browser.runtime.lastError) {
                        console.log(browser.runtime.lastError);
                    }
                }                            
                let setting = browser.storage.local.set({ [opt_name] : opt_value }, onSetting);
            }        
        }
    }
    
    // Try to get an option; if it has not been set ever, 
    // then try setting the option in the onGettingSuccess function
    let getting = browser.storage.local.get(opt_name, onGettingSuccess);
}


browser.browserAction.onClicked.addListener(browserAction);
browser.runtime.onInstalled.addListener(handleInstalled);
