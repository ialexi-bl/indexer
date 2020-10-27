const defaultBindings = {
  save: { type: 'binding', key: 's', ctrl: true },
  markDead: { type: 'binding', key: 'd', ctrl: true },
  eraseField: { type: 'binding', key: 'e', ctrl: true },
  setUnsure: { type: 'binding', key: 'u', ctrl: true },
  undo: { type: 'binding', key: 'z', ctrl: true },
  redo: {
    type: 'binding',
    options: [
      { key: 'z', ctrl: true, shift: true },
      { key: 'y', ctrl: true },
    ],
  },
  // When testing bindings are changed to lower case
  navigateForwards: {
    type: 'binding',
    options: [
      { key: 'tab', alt: 'allowed', ctrl: 'allowed' },
      { key: 'arrowright', alt: 'allowed', ctrl: 'allowed' },
      { key: 'arrowdown', alt: 'allowed', ctrl: 'allowed' },
      { key: 'enter', alt: 'allowed', ctrl: 'allowed' },
    ],
  },
  navigateBackwards: {
    type: 'binding',
    options: [
      { key: 'tab', shift: true, alt: 'allowed', ctrl: 'allowed' },
      { key: 'arrowleft', alt: 'allowed', ctrl: 'allowed' },
      { key: 'arrowup', alt: 'allowed', ctrl: 'allowed' },
    ],
  },

  forceEnable: { type: 'control', ctrl: true },
  // UNUSED
  polishLetter: { type: 'control', ctrl: true /*, location: 2 */ },
}

export default class KeyBinding {
  static storageData = {}
  static bindings = {}

  // UNUSED
  static polishCharacters = {
    o: 'ó',
    s: 'ś',
    l: 'ł',
    z: 'ż',
    x: 'ź',
    c: 'ć',
    n: 'ń',
    a: 'ą',
    e: 'ę',
    O: 'Ó',
    S: 'Ś',
    L: 'Ł',
    Z: 'Ż',
    X: 'Ź',
    C: 'Ć',
    N: 'Ń',
    A: 'Ą',
    E: 'Ę',
  }

  /**
   * Inits key bindings by loading them from memory
   */
  static init() {
    const bindings = (this.storageData = JSON.parse(
      localStorage.getItem('keyBindings') || '{}'
    ))
    for (const name of Object.keys(defaultBindings)) {
      const binding = bindings[name]
      this.bindings[name] =
        typeof binding == 'object' &&
        bindings != null &&
        typeof binding.key == 'string'
          ? binding
          : defaultBindings[name]
    }
  }

  static update(name, e) {
    if (!(name in this.bindings) || this.bindings[name].type !== 'binding')
      throw new Error(`Couldn't find binding "${name}"`)

    const binding = (this.bindings[name] = {
      key: e.key.toLowerCase(),
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
    })
    localStorage.setItem(
      'keyBindings',
      JSON.stringify(
        (this.storageData = { ...this.storageData, [name]: binding })
      )
    )
  }

  static get(name) {
    if (!(name in this.bindings) || this.bindings[name].type !== 'binding')
      throw new Error(`Couldn't find binding "${name}"`)

    const binding = this.bindings[name]
    const check = binding.options || [binding]

    return {
      ...binding,
      test: (e) =>
        check.some(
          (binding) =>
            e.key.toLowerCase() === binding.key &&
            (binding.shift === 'allowed' || !e.shiftKey === !binding.shift) &&
            (binding.ctrl === 'allowed' || !e.ctrlKey === !binding.ctrl) &&
            (binding.alt === 'allowed' || !e.altKey === !binding.alt)
        ),
    }
  }

  static getControl(name) {
    if (!(name in this.bindings) || this.bindings[name].type !== 'control') {
      throw new Error(`Couldn't find control "${name}"`)
    }

    const control = this.bindings[name]
    return {
      ...control,
      test: (e) =>
        !e.shiftKey === !control.shift &&
        !e.ctrlKey === !control.ctrl &&
        !e.altKey === !control.alt &&
        (typeof control.location != 'number' ||
          control.location === e.location),
    }
  }
}
