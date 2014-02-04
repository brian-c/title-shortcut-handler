;(function() {
  function TitleShortcutWatcher(root, options) {
    if ('currentTarget' in root) {
      // Shortcut: addEventLister('keydown', TitleShortcutWatcher, false);
      var keyEvent = root;
      TitleShortcutWatcher.prototype.handleEvent(keyEvent);
      return;
    }

    this.root = root;
    for (var option in options) {
      this[option] = options[option];
    }

    if (this.root) {
      root.addEventListener(this.eventName, this, false);
    }
  }

  TitleShortcutWatcher.prototype.eventName = 'keydown';

  TitleShortcutWatcher.prototype.keys = {
    meta: 'META', ctrl: 'CTRL', alt: 'ALT', shift: 'SHIFT',
    13: 'ENTER', 27: 'ESC', 32: 'SPACE',
    8: 'BACKSPACE', 46: 'DELETE',
    192: '`', 187: '=', 189: '-',
    219: '[', 221: ']', 220: '\\',
    186: ';', 222: '\'',
    188: ',', 190: '.', 191: '/'
  };

  // A-Z
  for (var c = 65; c <= 90; c++) {
    TitleShortcutWatcher.prototype.keys[c] = String.fromCharCode(c);
  }

  // 0-9
  for (var n = 48; n <= 57; n++) {
    TitleShortcutWatcher.prototype.keys[n] = String.fromCharCode(n);
  }

  TitleShortcutWatcher.prototype.separator = '-';

  TitleShortcutWatcher.prototype.typeableElements = [
    'INPUT',
    'TEXTAREA'
  ];

  TitleShortcutWatcher.prototype.clickableInputTypes = [
    'radio',
    'checkbox',
    'button',
    'submit',
    'reset'
  ];

  TitleShortcutWatcher.prototype.isTextInput = function(element) {
    var isTypeable = !!~this.typeableElements.indexOf(element.tagName);
    var isClickable = !!~this.clickableInputTypes.indexOf(element.type);
    return isTypeable && !isClickable;
  };

  TitleShortcutWatcher.prototype.getQuery = function(shortcut) {
    return '[title$="[' + shortcut.toUpperCase() + ']"]';
  };

  TitleShortcutWatcher.prototype.isVisible = function (element) {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };

  TitleShortcutWatcher.prototype.isEnabled = function (element) {
    return !(element.disabled);
  };

  TitleShortcutWatcher.prototype.handleEvent = function(e) {
    if (this.isTextInput(e.target)) return;

    key = this.keys[e.which];
    if (!key) return;

    if (e.metaKey) key = this.keys.meta + this.separator + key;
    if (e.ctrlKey) key = this.keys.ctrl + this.separator + key;
    if (e.altKey) key = this.keys.alt + this.separator + key;
    if (e.shiftKey) key = this.keys.shift + this.separator + key;

    var matches = e.currentTarget.querySelectorAll(this.getQuery(key));
    matches = Array.prototype.slice.call(matches);
    matches = matches.filter(this.isVisible);
    matches = matches.filter(this.isEnabled);

    if (matches.length === 1) {
      e.preventDefault();
      this.callShortcut(matches[0]);
    }
  };

  TitleShortcutWatcher.prototype.callShortcut = function(target) {
    target.focus();

    if (target.tagName === 'A') {
      if (target.target === '_blank') {
        open(target.href);
      } else {
        location.href = target.href;
      }
    } else {
      target.click();
    }
  };

  TitleShortcutWatcher.prototype.remove = function() {
    if (this.root) {
      this.root.removeEventListener(this.eventName, this, false);
    }
  };

  window.TitleShortcutWatcher = TitleShortcutWatcher;
  if (typeof module !== 'undefined') {
    module.exports = TitleShortcutWatcher;
  }
}());
