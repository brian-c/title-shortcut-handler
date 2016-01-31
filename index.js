(function() {
  function TitleShortcutListener(root, config) {
    if (root !== undefined) {
      this.root = root;
    } else {
      this.root = document;
    }
    Object.assign(this, config);
    this._press = null;

    this.root.addEventListener('keydown', this, false);
    this.root.addEventListener('keypress', this, false);
  }

  Object.assign(TitleShortcutListener.prototype, {
    modifiers: [
      'META',
      'CTRL',
      'ALT',
      'SHIFT'
    ],

    keySeparator: '-',

    nonPrintingCharacters: {
      8: 'BACKSPACE',
      13: 'ENTER',
      27: 'ESC',
      32: 'SPACE',
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN',
      46: 'DELETE'
    },

    typeableElements: [
      'INPUT',
      'TEXTAREA'
    ],

    clickableInputTypes: [
      'radio',
      'checkbox',
      'button',
      'submit',
      'reset'
    ],

    isTextInput: function(element) {
      var isTypeable = !!~this.typeableElements.indexOf(element.tagName);
      var isClickable = !!~this.clickableInputTypes.indexOf(element.type);
      return isTypeable && !isClickable;
    },

    handleEvent: function(event) {
      if (this.isTextInput(event.target)) {
        return;
      }
      // Store any `keypress` event, then call the handler for both.
      if (event.type === 'keydown') {
        setTimeout(function(originalArguments) {
          this.handleKeyDownAndPress.call(this, event, this._press);
          this._press = null;
        }.bind(this, arguments));
      } else if (event.type === 'keypress') {
        this._press = event;
      }
    },

    handleKeyDownAndPress: function(down, press) {
      var modifiers = this.modifiers.filter(function(modifier) {
        return down[modifier.toLowerCase() + 'Key'];
      });

      var downChar = this.nonPrintingCharacters[down.which];
      if (downChar === undefined) {
        downChar = String.fromCharCode(down.which).toUpperCase();
      }
      var downKeys = modifiers.concat(downChar);
      var downShortcut = downKeys.join(this.keySeparator);

      var nonprintingChar = JSON.stringify(downChar).indexOf('\\') !== -1;
      var weirdCharacter = down.which > 90; // After "Z", nothing lines up.

      var handled;
      if (!nonprintingChar && !weirdCharacter) {
        handled = this.handleShortcut(downShortcut);
      }

      if (handled) {
        down.preventDefault();
      }

      if (press === null) {
        return;
      }

      var pressChar = String.fromCharCode(press.which)
        .replace(/\s+/, '')
        .toUpperCase();
      var pressKeys = modifiers.concat(pressChar);
      var pressShortcut = pressKeys.join(this.keySeparator);
      if (pressChar !== '' && pressChar !== downChar) {
        this.handleShortcut(pressChar);
        if (modifiers.length !== 0) {
          this.handleShortcut(pressShortcut);
        }
      }
    },

    buildSelector: function(shortcut) {
      return [
        '[title$="[' + shortcut + ']"]',
        '[data-shortcut="' + shortcut + '"]'
      ].join(',');
    },

    isVisible: function (element) {
      return element.offsetWidth > 0 && element.offsetHeight > 0;
    },

    isEnabled: function (element) {
      return !element.disabled;
    },

    handleShortcut: function(shortcut) {
      var selector = this.buildSelector(shortcut);

      var matches = this.root.querySelectorAll(selector);
      matches = Array.prototype.slice.call(matches)
        .filter(this.isVisible)
        .filter(this.isEnabled);

      if (this.log) {
        console.log('Handling shortcut', JSON.stringify(shortcut), matches);
      }

      if (matches.length === 1) {
        this.triggerTarget(matches[0]);
      } else if (matches.length !== 0) {
        throw new Error('Too many matches for shortcut ' + JSON.stringify(shortcut));
      }
    },

    triggerTarget: function(target) {
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
    },

    destroy: function() {
      this.root.removeEventListener('keydown', this);
      this.root.removeEventListener('keypress', this);
      this.root = null;
    }
  });

  window.TitleShortcutListener = TitleShortcutListener;
  if (typeof module !== 'undefined') {
    module.exports = TitleShortcutListener;
  }
}());
