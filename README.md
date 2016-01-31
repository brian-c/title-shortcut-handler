Assign keyboard shortcuts to elements.

Clickable things get clicked.

Focusable things get focused.

```html
<!--Add in brackets to the end of the title:-->
<a href="/info" title="Get information [I]">Info</button><br />

<!--Or in its own attribute to keep it hidden:-->
<input type="text" placeholder="Hit 'ESC' to focus." data-shortcut="ESC" /><br />

<!--Use "META-", "CTRL-", "ALT-", and "SHIFT-" modifiers:-->
<button type="button" title="Select this item [ALT-SHIFT-X]">Select</button>
```

```js
// To start listening:
var shortcutHandler = new TitleShortcutHandler();

// And to stop:
shortcutHandler.destroy();
```
