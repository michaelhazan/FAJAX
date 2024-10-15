/*
 * User DB - localstorage: dbUsers-(username)
 * Toodoo DB - localstorage: dbData-(userId-itemid)
 * Toodoo DB Index - localstorage: dbData-(userId)-Index
 */
class ItemsDatabase {
  /**
   * Get {@link TodoItem} list from userId, specify itemid for a single item
   * @param {User.userId} userId
   * @param {Number} itemid
   * @returns {TodoItem[]}
   */
  get(userId, itemid = null) {
    let indexes = this.#getIndexes(userId);
    if (indexes.length == 0) return [];
    if (itemid != null) return [this.#getItem(userId, itemid)];
    let ret = [];
    indexes.forEach((index) => {
      ret.push({ itemid: index, item: this.#getItem(userId, index) });
    });
    return ret;
  }
  /**
   * Used to find every {@link TodoItem} where the text property contains specified string.
   * @param {User.userId} userId
   * @param {string} str
   * @returns
   */
  find(userId, str) {
    let indexes = this.#getIndexes(userId);
    let ret = [];
    indexes.forEach((index) => {
      let /**@type {TodoItem} */ item = JSON.parse(
          localStorage.getItem(this.#getItemString(userId, index))
        );
      if (item.text.indexOf(str) > -1) {
        ret.push({ itemid: index, item: item });
      }
    });
    return ret;
  }
  post(userId, item) {
    let indexes = this.#getIndexes(userId);
    let index = 0;
    if (indexes.length > 0) index = indexes[indexes.length - 1] + 1;
    this.#addToIndexes(userId, index);
    this.#setItem(userId, index, item);
    return true;
  }
  put(userId, itemid, item) {
    this.#setItem(userId, itemid, item);
  }
  delete(userId, itemid) {
    let /**@type {Array} */ indexes = this.#getIndexes(userId);
    let indexToRemove = indexes.indexOf(Number.parseInt(itemid));
    if (indexToRemove == -1) throw `Item Index was not found!`;
    indexes.splice(indexToRemove, 1);
    localStorage.setItem(this.#getIndexString(userId), JSON.stringify(indexes));
    localStorage.removeItem(this.#getItemString(userId, itemid));
  }
  /**
   *
   * @param {User.userId} userId
   * @returns {Array.<Number>}
   */
  #getIndexes(userId) {
    let /** @type {Array.<Number>} */ indexes = JSON.parse(
        localStorage.getItem(this.#getIndexString(userId))
      );
    if (!indexes) return [];
    return indexes;
  }
  #addToIndexes(userId, index) {
    let str = this.#getIndexString(userId);
    let /** @type {Array.<Number>} */ indexes = JSON.parse(
        localStorage.getItem(str)
      );
    if (!indexes) indexes = [];
    indexes.push(index);
    localStorage.setItem(str, JSON.stringify(indexes));
  }
  #getIndexString(userId) {
    return `dbData-${userId}-Index`;
  }
  /**
   *
   * @param {User.userId} userId
   * @param {Number} itemid
   * @returns {TodoItem}
   */
  #getItem(userId, itemid) {
    return JSON.parse(
      localStorage.getItem(this.#getItemString(userId, itemid))
    );
  }
  /**
	 *username
username
	 * @param {User.userId} userId
	 * @param {Number} itemid
	 * @param {if (!userString) return false;TodoItem} item
	 */
  #setItem(userId, itemid, item) {
    localStorage.setItem(
      this.#getItemString(userId, itemid),
      JSON.stringify(item)
    );
  }
  #getItemString(userId, itemid) {
    return `dbData-${userId}-${itemid}`;
  }
}
class UsersDatabase {
  #addedUsernames;
  constructor() {
    this.#addedUsernames = [];
  }
  /**
   * Get User by username
   * @param {User.userId} userId
   */
  get(username = null) {
    if (username)
      return JSON.parse(localStorage.getItem(this.#getUserString(username)));
    return this.#addedUsernames.length;
  }
  /**
   * Find User by userId.
   * @param {User.userId} userId
   */
  find(userId) {
    this.#addedUsernames.forEach((user) => {
      if (user.id == userId) return user;
    });
  }
  /**
   *
   * @param {User} user
   */
  post(user) {
    if (this.#addedUsernames.includes(this.#getUserString(user.username)))
      return false;
    localStorage.setItem(
      this.#getUserString(user.username),
      JSON.stringify(user)
    );
    this.#addedUsernames.push(user.username);
  }
  put(userId, user) {
    let userString = this.#getUserStringbyID(userId);
    if (!userString) return false;
    localStorage.setItem(userString, JSON.stringify(user));
  }
  delete(userId) {
    let userString = this.#getUserStringbyID(userId);
    if (!userString) return false;
    let user = this.#getUser(userString);
    this.#addedUsernames.splice(user.username, 1);
    localStorage.removeItem(userString);
  }
  #getUserString(username) {
    return `dbUsers-${username}`;
  }
  #getUserStringbyID(userId) {
    this.#addedUsernames.forEach((username) => {
      let userString = `dbUsers-${username}`;
      if (this.#getUser(userString).userId == userId)
        return JSON.stringify(userString);
    });
  }
  #getUser(userString) {
    return JSON.parse(localStorage.getItem(JSON.stringify(userString)));
  }
}
