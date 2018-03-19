/**
 * The list of tabs and how we interact with them.
 */
class TabList {

  /**
   * The default constructor.
   * 
   * @param {Array} list 
   * @param {string} query 
   */
  constructor(list, query) {
    this.list = list;
    this.query = query;
  }

  /**
   * Sets a list of tabs that 
   * 
   * @param {Array<tabs.Tab>} tabs 
   */
  setList(tabs) {
    this.list = tabs.sort((a, b) => {
      return b.lastAccessed - a.lastAccessed;
    });
  }

  /**
   * Update the query for filtering.
   * @param {string} query 
   */
  updateFilter(query) {
    this.query = query.toLowerCase();
  }

  /**
   * Gets a filtered list of tabs.
   * @param {string} query 
   * @returns {Array}
   */
  getFilteredList() {
    let filteredList = [];
    
    if (!this.query) {
      return this.list;
    }

    for (let tab of this.list) {
      if (tab.title.toLowerCase().match(new RegExp('.*' + this.query + '.*'))) {
        filteredList.push(tab);
      }
    }

    return filteredList;
  }
}

// The tablist that will contain all our tabs.
const tabList = new TabList([], '');

class ActiveItem {

  /**
   * Create a new ActiveItem.
   */
  constructor() {
    this.index = 0;
  }

  tabs() {
    return document.getElementsByClassName('tabs__item');
  }

  removeActive() {
    for (let tab of this.tabs()) {
      tab.classList.remove('active');
    }
  }

  setActive() {
    if (this.tabs().item(this.index)) {
      this.tabs().item(this.index).classList.add('active');
    }
  }

  getActive() {
    console.log('Active index: ', this.index);
    console.log('Available tabs: ', this.tabs());
    console.log('Active link: ', this.tabs().item(this.index).firstChild.textContent);
    if (this.tabs().item(this.index)) {
      return this.tabs().item(this.index);
    }
  }

  reset() {
    this.index = 0;
    this.removeActive();
    this.setActive();
  }

  increment() {
    console.log('incrementing from ', this.index);
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.tabs().length - 1;
    }
    console.log('incrementing to ', this.index);
    this.removeActive();
    this.setActive()
  }

  decrement() {
    console.log('decrementing from ', this.index);
    this.index += 1;
    this.index = this.index % this.tabs().length;
    console.log('decrementing to ', this.index);
    this.removeActive();
    this.setActive()
  }
}

const activeItem = new ActiveItem();

// Attaching behaviour to search and tabs after the popup has loaded.
document.addEventListener('DOMContentLoaded', () => {
  console.log('one');
  activeItem.reset();

  // Search element behaviour.
  const searchElement = document.getElementById('search-input');
  searchElement.focus();
  searchElement.addEventListener('keydown', (keydownEvent) => {
    tabList.updateFilter(searchElement.value);
    renderTabList();
    if (keydownEvent.which !== 38 && keydownEvent.which !== 40 && keydownEvent.which !== 13) {
      console.log('two');
      activeItem.reset();
    }
  })

  // Collect the active tabs.
  browser.tabs.query({currentWindow: true})
    .then((tabs) => {
      tabList.setList(tabs);
      renderTabList();
      console.log('three');
      activeItem.reset();
    });
});

// Tab Element list behaviour.
window.addEventListener('keydown', (e) => {
  let keyPressed = e.which;

  if (keyPressed === 38) {
    // Going up.
    activeItem.increment();
  }
  else if(keyPressed === 40) {
    // Going down.
    activeItem.decrement();
  }
  else if (keyPressed === 13) {
    // Navigating to tab.
    activeItem.getActive().firstChild.click();
  }
  else {
    // Don't care about any other ones.
    return;
  }

  e.preventDefault();
  return;
});

/**
 * Builds an HTMLElement tab link.
 * @param {tabs.Tab} tab 
 * @returns {HTMLElement}
 */
function tabLinkFactory(tab) {
  let tabLink = document.createElement('a');
  tabLink.textContent = tab.title || tab.id;
  tabLink.setAttribute('href', tab.id);

  // Attach a navigation action to click events.
  tabLink.addEventListener('click', (e) => {
    console.log('clicked');
    browser.tabs.update(Number(e.target.getAttribute('href')), {
        active: true
      })
      .then(() => {
        window.close();
      })
    
    e.preventDefault();
  });

  return tabLink;
}

/**
 * Render the tab list.
 */
function renderTabList() {
  let tabElementsList = document.getElementById('tabs__list');
  
  // Remove all existing tabs
  while (tabElementsList.hasChildNodes()) {
    tabElementsList.removeChild(tabElementsList.lastChild);
  }

  tabs = tabList.getFilteredList();
  
  for (let tab of tabs) {
    // Ignore the tab they're currently on.
    if (tab.active) {
      continue;
    }

    let tabItem = document.createElement('li');     
    tabItem.appendChild(tabLinkFactory(tab));
    tabItem.classList.add('tabs__item');
    tabElementsList.appendChild(tabItem);
  }
}
