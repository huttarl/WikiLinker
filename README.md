# WiktionaryLinker
Chrome extension to automatically add links to words in wiktionary entries.

The idea of this extension is to provide automated help to the task of "linkifying" words in Wiktionary entries. (Possibly Wikipedia entries too... we'll see.)

When you are editing a wiktionary entry, this extension provides an "Autolink" button that will surround individual words with [[link markup]]. Settings can be used to customize which words will be autolinked:

- A "minimum length" setting excludes shorter words from being autolinked.
- A list of "trivial words" allows the user to exclude those words.
- Maybe at some point: A "minimum common prefix" and "maximum common suffix" setting 

In addition, the keyboard shortcut 'TBD' toggles linkage of the word containing the cursor.

The autolinker will not affect words that are already part of a wiki link.

TBD:
- Will the autolinker only link to existing entries? (That could be a setting.) If so, the extension will need to use the wiki APIs to query lists of headwords starting with a certain prefix.
- What will the default keyboard shortcut be?
- We'll probably need to add a way to change the shortcut key.

