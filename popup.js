document.addEventListener('DOMContentLoaded', function() {
   var autolinkButton = document.getElementById('autolink');
   autolinkButton.addEventListener('click', function() {
      // var bkg = chrome.extension.getBackgroundPage();
      console.log("on click");
      // TODO: verify that we're in edit mode. E.g. check whether action=edit in the URL.
      textbox = document.getElementById('wpTextbox1');
      var text = textbox.value;
      console.log("text len ", len(text), text.substring(0, 10));
      chrome.tabs.getSelected(null, function(tab) {
        console.log("tab url: " + tab.url);
      });
   }, false);
}, false);

// To do: look for textarea #wpTextbox1 to verify that we're in edit mode.

