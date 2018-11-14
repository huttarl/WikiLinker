// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL matches
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              // E.g. https://ku.wiktionary.org/w/index.php?title=serbixwey%C3%AE&action=edit&section=1
              hostSuffix: 'wiktionary.org',
              pathEquals: '/w/index.php',
              queryContains: 'action=edit'
            }
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    // Send message to selected tab
    // // execute the script that gets injected into page of the current tag
    // chrome.tabs.executeScript(null, {file: "content.js"}, function () {
    // send a message to content 
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, command, function (response) {
         // got response
      });
    });
  // });
  });
});

