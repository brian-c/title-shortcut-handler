Just listen to `keydown`s:

```js
TitleShortcutHandler = require('title-shortcut-handler');
addEventListener('keydown', TitleShortcutHandler, false);
```

Or configure it, if you want:

```js
TitleShortcutHandler = require('title-shortcut-handler');
new TitleShortcutHandler(document.getElementById('whatever'), {
  getQuery: function(shortcut) {
    return '[title$="((' + shortcut + '))"]';
  }
});
```
