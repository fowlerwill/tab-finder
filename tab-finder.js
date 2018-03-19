/**
 * Tab finder
 * 
 * The tab finder js that controlls the logic for finding and switching tabs.
 * @author Will Fowler
 */

// The tablist that will contain all our tabs.
const tabList = new TabList();

// The active item controller.
const activeItem = new ActiveItem();

// Attaching behaviour to search and tabs after the popup has loaded.
document.addEventListener('DOMContentLoaded', () => {
  activeItem.reset();

  // Search element behaviour.
  const searchElement = document.getElementById('search-input');
  searchElement.focus();
  searchElement.addEventListener('keydown', (keydownEvent) => {
    tabList.updateFilter(searchElement.value);
    renderTabList();
    if (keydownEvent.which !== 38 && keydownEvent.which !== 40 && keydownEvent.which !== 13) {
      activeItem.reset();
    }
  })

  // Collect the active tabs.
  browser.tabs.query({currentWindow: true})
    .then((tabs) => {
      tabList.setList(tabs);
      renderTabList();
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
