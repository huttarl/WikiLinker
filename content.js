chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
   switch (msg) {
      case "toggleLinkSelectedWord":
         toggleLinkWord();
         sendResponse("Done");
         break;

      case "autolink":
         // console.log('Got message in content.js');
         textbox = document.getElementById('wpTextbox1');
         var lines = textbox.value.split('\n');
         changedLines = autolinkLines(lines);
         textbox.focus();
         textbox.select();
         document.execCommand('insertText', false, changedLines.join('\n'));
         sendResponse("Done");
         break;
   } 
});

var wordRE = /^[-\p{L}]+$/u, letterRE = /[-\p{L}]/u;

function autolinkLines(lines) {
   // console.log("text lines", lines.length, lines[0].substring(0, 10));
   var changedLines = [];
   var numLines = lines.length;
   // The following requires Unicode property escapes. See
   // https://stackoverflow.com/a/48902765/423105
   var minimumLength = 3; // TODO: get this from extension setting.

   for (var i=0; i < numLines; i++) {
      line = lines[i];

      if (line[0] == '=') {
         // Leave header lines unchanged
         changedLines[i] = line;
         continue;
      }

      words = line.split(/\s+/).map(function(word) {
         // Check whether word is really a word (excludes words already linked
         // because "[]" are not allowed.)
         // TODO: fix the case where multiple words are already within a [[ ]].
         if (word.length > minimumLength && word.match(wordRE)) {
            return '[[' + word + ']]';
         } else {
            return word;
         }
      });

      changedLines[i] = words.join(' ');
   }
   return changedLines;
}

var lastLineEndingOrLinkBoundaryRE = /^.*(\]\]|\[\[|\n)(.*?)$/,
   nonWordCharacterRE = /[^-\p{L}]/u,
   finalWordCharactersRE = /[-\p{L}]+$/u,
   lastNonWordCharacterRE = /^.*([^-\p{L}])([-\p{L}]*)$/u;

function toggleLinkWord() {
   const textbox = document.getElementById('wpTextbox1');
   var text = textbox.value;
   let start = textbox.selectionStart;
   let end = textbox.selectionEnd || start;
   const noSelection = (start == end);
   let isInALink;

   // console.log('start, end:', start, end);

   if (noSelection) {
      // console.log('noSelection');
      // No text is selected.
      // Is caret in (or at the beginning of) a link already?
      let matches = text.substring(0, start + 2).match(lastLineEndingOrLinkBoundaryRE);
      // console.log('matches', matches); // temporary debugging
      isInALink = (matches && matches[1] == '[[');
      // If so, set caret to beginning of the link.
      // console.log('isInALink', isInALink);
      if (isInALink) {
         start = start - matches[2].length - assumeTwo;
         // console.log('start, end:', start, end);
         textbox.setSelectionRange(start, end);
         // Fall through to case where text is already selected.
      } else {
         // Otherwise, find word bounds and select.
         // Are we in a word now?
         if (text.charAt(start).match(letterRE)) {
            // Find preceding non-word character.
            let m = text.substring(0, start).match(finalWordCharactersRE);
            // console.log('lastNonWordChar:', '"' + text.substring(0, start) + '"', lastNonWordCharacterRE, m);
            // console.log('m', m); // temporary debugging
            start -= (m ? m[0].length : 0);
            // Find following non-word character.
            let i = text.substring(end).search(nonWordCharacterRE);
            if (i > -1) {
               end = end + i;
            }
            // console.log('In a word. start, end:', start, end);
         } else {
            // Not in a word? Do nothing.
            // console.log('Not in a word.');
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

   // console.log('After backing up: start, end:', start, end);

   textbox.focus();

   // document.execCommand('insertText', false, String.fromCharCode(8253));

   const assumeTwo = 2; // Assume two left and right brackets exist in the text.

   if (isInALink || text[start] == '[') {
      // Unlink the selected text.
      const s2 = start + assumeTwo;
      end = text.indexOf(']', s2);
      const textToUnlink = text.substring(s2, s2 + end);
      // console.log('Unlinking. start, end:', start, end);
      textbox.setSelectionRange(start, s2 + end + assumeTwo); // Select link including [[ ]].
      document.execCommand('insert', false, textToUnlink); // Replace without [[ ]].
   } else {
      // Link the selected text.
      // console.log('Linking. start, end:', start, end);
      const selectedText = text.substring(start, end);
      // We can get here by multiple paths; the "selected text" might not have been selected yet.
      textbox.setSelectionRange(start, end);
      document.execCommand('insertText', false, '[[' + selectedText + ']]');
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

