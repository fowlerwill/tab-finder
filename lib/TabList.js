/**
 * The list of tabs and how we interact with them.
 */
class TabList {

  /**
   * Constructor for a tablist.
   * @param {Array<tabs.Tab>} list 
   * @param {string} query 
   */
  constructor(list = [], query = '') {
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
      if (tab.title !== undefined && (tab.title.toLowerCase().match(new RegExp('.*' + this.query + '.*')) 
          || tab.url.toLowerCase().match(new RegExp('.*' + this.query + '.*')))) {
        filteredList.push(tab);
      }
    }

    return filteredList;
  }
}
