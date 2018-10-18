chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
   console.log('Got message in content.js');
   textbox = document.getElementById('wpTextbox1');
   var lines = textbox.value.split('\n');
   newLines = autolinkLines(lines);
   textbox.value = newLines.join('\n');
   sendResponse("Done");
});

function autolinkLines(lines) {
   console.log("text lines", lines.length, lines[0].substring(0, 10));
   var newLines = [];
   var numLines = lines.length;
   // The following requires Unicode property escapes. See
   // https://stackoverflow.com/a/48902765/423105
   var wordRegexp = /^[-\p{L}]+$/u;
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
         // TODO: fix the case where multiple words are already within a [[ ]].
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
