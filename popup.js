// Copyright (c) 2018 Steve Ziring. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//get

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, (tabs) => {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url);
    });
}

function getLocalStorage(key, callback) {
    chrome.storage.local.get(key, (items) => {
        callback(chrome.runtime.lastError ? null : items[key]);
    });
}

function setLocalStorage(key, value) {
    var items = {};
    items[key] = value;
    chrome.storage.local.set(items);
}
var otherWindows = chrome.extension.getBackgroundPage();


function generalSettings(value) {
    text = 'Disabled';
    icon = 'off';
    if (value == true) {
        text = 'Enabled';
        icon = 'on';
    }
    document.getElementById("sliderStatus").textContent = text;
    //otherWindows.fwOverride(value);
    chrome.browserAction.setIcon({ path: icon + ".png" });
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {

        var masterSwitch = document.getElementById("enableOverrideSwitch");
        var key = 'masterSwitch';
        getLocalStorage(key, (savedValue) => {
            if (savedValue) {
                masterSwitch.checked = savedValue;
            }
            if (savedValue == true) {
                generalSettings(savedValue);

                var destinationUrl = getLocalStorage('destinationUrlKey', (savedDestinationValue) => {
                    if (savedDestinationValue) {
                        otherWindows.destinationUrlVar = savedDestinationValue;

                        //if there is a value for savedDestinationValue in Local storage pass True to the background file's function destinationOverride
                        otherWindows.destinationOverride(savedValue);

                    }
                });

                 var originalUrl = getLocalStorage('originalUrlKey', (savedOriginalValue) => {
                    if (savedOriginalValue) {
                        //send a variable to the background page named originalnUrl
                        otherWindows.originalUrlVar = savedOriginalValue;
                        //if there is a value for savedDestinationValue in Local storage pass True to the background file's function destinationOverride
                       // otherWindows.destinationOverride(savedValue);

                    }
                });


            }
            if (savedValue == false) {
                generalSettings(savedValue);

            }

        })
        //if it changed do something
        masterSwitch.addEventListener('change', () => {

            var currentStatus = masterSwitch.checked;
            if (currentStatus == true) {
                generalSettings(currentStatus);


                var destinationUrl = getLocalStorage('destinationUrlKey', (savedDestinationValue) => {
                    if (savedDestinationValue) {
                        //send a variable to the background page named destinationUrl
                        otherWindows.destinationUrlVar = savedDestinationValue;
                        otherWindows.destinationOverride(currentStatus);


                    }
                });

                var originalUrl = getLocalStorage('originalUrlKey', (savedOriginalValue) => {
                    if (savedOriginalValue) {
                        //send a variable to the background page named originalnUrl
                        otherWindows.originalUrlVar = savedOriginalValue;
                        //if there is a value for savedDestinationValue in Local storage pass True to the background file's function destinationOverride
                       // otherWindows.destinationOverride(savedValue);

                    }
                });
            }
            if (currentStatus == false) {
                generalSettings(currentStatus);

                otherWindows.destinationOverride(currentStatus);

            }
            // var key = 'masterSwitch';
            setLocalStorage(key, currentStatus);

        });


        var destinationInputVar = document.getElementById('destinationInput');

        // Load the saved destination value  and modify the destinationInput
        // value on the popup.html page, if needed.
        getLocalStorage('destinationUrlKey', (savedDestinationValue) => {
            if (savedDestinationValue) {
                //send a variable to the background page named destinationUrl
                otherWindows.destinationUrlVar = savedDestinationValue;
                destinationInputVar.value = savedDestinationValue;
            }
        });


        var originalInputVar = document.getElementById('originalInput');

        // Load the saved original value  and modify the OriginalInput
        // value on the popup.html page, if needed.
        getLocalStorage('originalUrlKey', (savedOriginalValue) => {
            if (savedOriginalValue) {
                otherWindows.originalUrlVar = savedOriginalValue;
                originalInputVar.value = savedOriginalValue;
            }
        });

        // Ensure the destination value has changed and saved when the destinationInput element changes
        // selection changes.

        destinationInputVar.addEventListener('change', () => {
            setLocalStorage('destinationUrlKey', destinationInputVar.value);
        });

        originalInputVar.addEventListener('change', () => {
            setLocalStorage('originalUrlKey', originalInputVar.value);
        });

        //xyz
    });
});