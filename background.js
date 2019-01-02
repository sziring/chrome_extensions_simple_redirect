// var fwAppendQueryFunc = function blockingUrls(details) {
//     //var urlSplitter = document.URL.split("?")[1]
//     var urlInQuestion = details.url;
//     var searchParams = new URLSearchParams(urlInQuestion);
//     searchParams.set("caid", "longformscreenshots");
//     searchParams.set("csid", "longformscreenshots");
//     var newurl = decodeURIComponent(searchParams.toString());


//     return { redirectUrl: newurl }; { cancel: true };
// }

var destinationUrlVar = 'https://www.example.com';
var originalUrlVar = 'https://www.example.com';

// function fwOverride(value) {
//     if (value == true) {
//         chrome.webRequest.onBeforeRequest.addListener(
//             fwAppendQueryFunc, { urls: [destinationUrlVar + '/*'] },

//             ["blocking"]);
//     }
//     if (value == false) {
//         chrome.webRequest.onBeforeRequest.removeListener(fwAppendQueryFunc);
//     }
// }
var destinationStorage = function() {
    return { redirectUrl: destinationUrlVar }; { cancel: true };
}

function destinationOverride(value) {
    if (value == true) {
        chrome.webRequest.onBeforeRequest.addListener(
            destinationStorage, { urls: [originalUrlVar + "/*"] },

            ["blocking"]);
        console.log('destinationOverride');
    }
    if (value == false) {
        //remove the redirect
        chrome.webRequest.onBeforeRequest.removeListener(destinationStorage);
    }
}