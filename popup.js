document.addEventListener('DOMContentLoaded', function() {
   var autolinkButton = document.getElementById('autolink');
   autolinkButton.addEventListener('click', function() {
      var bkg = chrome.extension.getBackgroundPage();
      bkg.console.log("on click");
      // // TODO: get access to page DOM. Do this by sending a message to content action?
      // textbox = document.getElementById('wpTextbox1');
      // var text = textbox.value;
      // bkg.console.log("text len ", len(text), text.substring(0, 10));
      chrome.tabs.getSelected(null, function(tab) {
         bkg.console.log("tab url: " + tab.url);
         // execute the script that gets injected into page of the current tag
         chrome.tabs.executeScript(null, {file: "content.js"}, function () {
            // send a message to content script
            chrome.tabs.sendMessage(tab.id, "Background page started.", function (response) {
               // got response
               bkg.console.log("got response");
            });
         });
      });
   }, false);
}, false);

// To do: look for textarea #wpTextbox1 to verify that we're in edit mode.

