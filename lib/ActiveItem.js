/**
 * Control the active item in the tab list.
 */
class ActiveItem {
  
  /**
   * Create a new ActiveItem.
   */
  constructor() {
    this.index = 0;
    this.ACTIVE_CLASS = 'active';
    this.TAB_ITEM_CLASS = 'tabs__item';
  }

  /**
   * Get the list of tabs currently in the list.
   * @returns {Array}
   */
  tabs() {
    return document.getElementsByClassName(this.TAB_ITEM_CLASS);
  }

  /**
   * Removes active class from tabs in list.
   */
  removeActive() {
    for (let tab of this.tabs()) {
      tab.classList.remove(this.ACTIVE_CLASS);
    }
  }

  /**
   * Sets the active tab to the current index.
   */
  setActive() {
    if (this.tabs().item(this.index)) {
      this.tabs().item(this.index).classList.add(this.ACTIVE_CLASS);
    }
  }

  /**
   * Gets the active tab item
   * @returns {HTMLElement}
   */
  getActive() {
    if (this.tabs().item(this.index)) {
      return this.tabs().item(this.index);
    }
  }

  /**
   * Resets the ActiveItem list.
   */
  reset() {
    this.index = 0;
    this.removeActive();
    this.setActive();
  }

  /**
   * Increments the list visually (i.e. goes down)
   */
  increment() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.tabs().length - 1;
    }
    this.removeActive();
    this.setActive()
  }

  /**
   * Decrements the list (goes up.)
   */
  decrement() {
    this.index += 1;
    this.index = this.index % this.tabs().length;
    this.removeActive();
    this.setActive()
  }
}