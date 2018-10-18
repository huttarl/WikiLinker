chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
   switch (msg) {
      case "toggleLinkSelectedWord":
         toggleLinkWord();
         break;

      case "autolink":
         console.log('Got message in content.js');
         textbox = document.getElementById('wpTextbox1');
         var lines = textbox.value.split('\n');
         newLines = autolinkLines(lines);
         textbox.value = newLines.join('\n');
         sendResponse("Done");
         break;
   } 
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

function toggleLinkWord() {
   var textbox = document.getElementById('wpTextbox1');
   var text = textbox.value;
   var start = textbox.selectionStart, end = textbox.selectionEnd;
   if (start == end) {
      // No text is selected, so figure out word bounds.
      // TODO...
      return;
   }

   // Some text is selected.
   // Back up over preceding brackets:
   for (; start > 0 && text[start - 1] == '['; start--)
      ;

   if (text[start] == '[') {
      // Unlink selection
      end = text.indexOf(']', start);
      // TODO: don't assume there are exactly 2 '['s?
      // or that selection ends just before "]]".
      text = text.substring(0, start) + text.substring(start + 2, end) +
         text.substring(end + 2);
      textbox.value = text;
      textbox.selectionStart = textbox.selectionEnd = end - 2;
      return;
   } else {
      // Link selection
      text = text.substring(0, start) + '[[' + text.substring(start, end) +
         ']]' + text.substring(end);
   }

}

