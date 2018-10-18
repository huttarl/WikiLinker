chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
   console.log('Got message in content.js');
   textbox = document.getElementById('wpTextbox1');
   var lines = textbox.value.split('\n');
   newLines = autolinkLines(lines);
   textbox.value = newLines.join('\n');
   sendResponse("Done");
});

function autolinkLines(lines) {
   console.log("text lines", lines.length, text[0].substring(0, 10));
   var newLines = [];
   var numLines = lines.length;
   var wordRegexp = /^[-\w]+$/;
   var minimumLength = 3; // TODO: get this from extension setting.
   
   for (var i=0; i < numLines; i++) {
      line = lines[i];

      if (line[0] == '=') {
         // Leave header lines unchanged
         newLines[i] = line;
         continue;
      }

      words = line.split(/\s+/).map(function(word) {
         // Check whether word is really a word (excludes words already linked
         // because "[]" are not allowed.)
         if (word.length > minimumLength && word.match(wordRegexp)) {
            return '[[' + word + ']]';
         } else {
            return word;
         }
      });

      newLines[i] = words.join(' ');
   }
   return newLines;
}
