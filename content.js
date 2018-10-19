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

let wordRegexp = /^[-\p{L}]+$/u, letterRegexp = /[-\p{L}]/u;

function autolinkLines(lines) {
   console.log("text lines", lines.length, lines[0].substring(0, 10));
   var newLines = [];
   var numLines = lines.length;
   // The following requires Unicode property escapes. See
   // https://stackoverflow.com/a/48902765/423105
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

const lastLineEndingOrLinkBoundaryRegexp = /^.*(\]\]|\[\[|\n)(.*?)$/,
   nonWordCharacterRegexp = /[^-\p{L}]/u,
   lastNonWordCharacterRegexp = /^.*([^-\p{L}])(.*?)$/u;

function toggleLinkWord() {
   const textbox = document.getElementById('wpTextbox1');
   var text = textbox.value;
   let start = textbox.selectionStart;
   let end = textbox.selectionEnd || start;
   const noSelection = (start == end);
   let isInALink;

   if (noSelection) {
      // No text is selected.
      // Is caret in (or at the beginning of) a link already?
      let matches = text.substring(0, start + 2).match(lastLineEndingOrLinkBoundaryRegexp);
      isInALink = (matches && matches[1] == '[[');
      // If so, set caret to beginning of the link.
      console.log('isInALink', isInALink);
      if (isInALink) {
         start = start - matches[2].length - assumeTwo;
         textbox.setSelectionRange(start, end);
         // Fall through to case where text is already selected.
      } else {
         // Otherwise, find word bounds and select.
         // Are we in a word now?
         if (text.charAt(start).match(letterRegexp)) {
            // Find preceding non-word character.
            let m = text.substring(0, start).search(lastNonWordCharacterRegexp);
            start -= m ? m[2].length : 0;
            // Find following non-word character.
            let i = text.substring(start).search(nonWordCharacterRegexp);
            if (i > -1) {
               end = start + i;
            }
         } else {
            // Not in a word? Do nothing.
            return;
         }
      }
   }

   // Some text is selected.
   // Back up over any preceding brackets:
   var numLeft, numRight;
   for (numLeft = 0; start > 0 && text[start - 1] == '['; start--, numLeft++)
      ;

   for (numRight = 0; end > 0 && text[end - 1] == ']'; end--, numRight++)
      ;

   textbox.focus();

   // document.execCommand('insertText', false, String.fromCharCode(8253));

   const assumeTwo = 2; // Assume two left and right brackets exist in the text.

   if (isInALink || text[start] == '[') {
      // Unlink the selected text.
      const s2 = start + assumeTwo;
      end = text.indexOf(']', s2);
      const textToUnlink = text.substring(s2, s2 + end);
      textbox.setSelectionRange(start, s2 + end + assumeTwo); // Select link including [[ ]].
      document.execCommand('insert', false, textToUnlink); // Replace without [[ ]].
   } else {
      // Link the selected text.
      const selectedText = text.substring(start, end);
      document.execCommand('insertText', false, '[[' + selectedText + ']]');
      remainder = text.substring(end);
      text = text.substring(0, start) + '[[' + text.substring(start, end) +
         ']]' + remainder;
      end += 4;
   }

   // textbox.value = text;

   // // Auto-advance the caret:
   // start = end;
   // end = remainder.search(/[-\p{L}]/);
   // if (end > -1) {
   //    start += end;
   // }
   // textbox.setSelectionRange(start, start);
   textbox.focus();
   return;
}

