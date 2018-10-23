# WikiLinker
A Chrome extension to automatically add links to words in wiki entries. (Initially, this is being developed for Wiktionary, but it should be easy to adapt for similar wikis.)

The idea of this extension is to provide automated help to the task of "linkifying" words in Wiktionary entries.

When you are editing a wiktionary entry, this extension provides an "Autolink" button that will surround individual words with [[link markup]]. Settings can be used to customize which words will be autolinked:

- A "minimum length" setting excludes shorter words from being autolinked.
- A list of "trivial words" allows the user to exclude those words.
- Maybe at some point: A "minimum common prefix" and "maximum common suffix" setting 

In addition, the keyboard shortcut 'Alt+H' toggles linkage of the word containing the cursor. If multiple words are selected, all of them will be linked together as one, e.g. [[TV Series]].

The autolinker will not affect words that are already part of a wiki link, nor words that are part of a heading.
