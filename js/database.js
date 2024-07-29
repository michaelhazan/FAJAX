/*
 * User DB - localstorage: dbUsers-(username)
 * Toodoo DB - localstorage: dbData-(userid-itemid)
 * Toodoo DB Index - localstorage: dbData-(userid)-Index
 */
class ItemsDatabase {
	/**
	 * Get {@link TodoItem} list from userid, specify itemid for a single item
	 * @param {User.userid} userid
	 * @param {Number} itemid
	 * @returns {TodoItem[]}
	 */
	get(userid, itemid = null) {
		let indexes = this.#getIndexes(userid);
		if (indexes.length == 0) return [];
		if (itemid != null) return [this.#getItem(userid, itemid)];
		let ret = [];
		indexes.forEach((index) => {
			ret.push({ itemid: index, item: this.#getItem(userid, index) });
		});
		return ret;
	}
	/**
	 * Used to find every {@link TodoItem} where the text property contains specified string.
	 * @param {User.userid} userid
	 * @param {string} str
	 * @returns
	 */
	find(userid, str) {
		let indexes = this.#getIndexes(userid);
		let ret = [];
		indexes.forEach((index) => {
			let /**@type {TodoItem} */ item = JSON.parse(localStorage.getItem(this.#getItemString(userid, index)));
			if (item.text.indexOf(str) > -1) {
				ret.push({ itemid: index, item: item });
			}
		});
		return ret;
	}
	post(userid, item) {
		let indexes = this.#getIndexes(userid);
		let index = 0;
		if (indexes.length > 0) index = indexes[indexes.length - 1] + 1;
		this.#addToIndexes(userid, index);
		this.#setItem(userid, index, item);
		return true;
	}
	put(userid, itemid, item) {
		this.#setItem(userid, itemid, item);
	}
	delete(userid, itemid) {
		let /**@type {Array} */ indexes = this.#getIndexes(userid);
		let indexToRemove = indexes.indexOf(Number.parseInt(itemid));
		if (indexToRemove == -1) throw `Item Index was not found!`;
		indexes.splice(indexToRemove, 1);
		localStorage.setItem(this.#getIndexString(userid), JSON.stringify(indexes));
		localStorage.removeItem(this.#getItemString(userid, itemid));
	}
	/**
	 *
	 * @param {User.userid} userid
	 * @returns {Array.<Number>}
	 */
	#getIndexes(userid) {
		let /** @type {Array.<Number>} */ indexes = JSON.parse(localStorage.getItem(this.#getIndexString(userid)));
		if (!indexes) return [];
		return indexes;
	}
	#addToIndexes(userid, index) {
		let str = this.#getIndexString(userid);
		let /** @type {Array.<Number>} */ indexes = JSON.parse(localStorage.getItem(str));
		if (!indexes) indexes = [];
		indexes.push(index);
		localStorage.setItem(str, JSON.stringify(indexes));
	}
	#getIndexString(userid) {
		return `dbData-${userid}-Index`;
	}
	/**
	 *
	 * @param {User.userid} userid
	 * @param {Number} itemid
	 * @returns {TodoItem}
	 */
	#getItem(userid, itemid) {
		return JSON.parse(localStorage.getItem(this.#getItemString(userid, itemid)));
	}
	/**
	 *username
username
	 * @param {User.userid} userid
	 * @param {Number} itemid
	 * @param {if (!userString) return false;TodoItem} item
	 */
	#setItem(userid, itemid, item) {
		localStorage.setItem(this.#getItemString(userid, itemid), JSON.stringify(item));
	}
	#getItemString(userid, itemid) {
		return `dbData-${userid}-${itemid}`;
	}
}
class UsersDatabase {
	#addedUsernames;
	constructor() {
		this.#addedUsernames = [];
	}
	/**
	 * Get User by username
	 * @param {User.userid} userid
	 */
	get(username = null) {
		if (username) return JSON.parse(localStorage.getItem(this.#getUserString(username)));
		return this.#addedUsernames.length;
	}
	/**
	 * Find User by userid.
	 * @param {User.userid} userid
	 */
	find(userid) {
		this.#addedUsernames.forEach((user) => {
			if (user.id == userid) return user;
		});
	}
	/**
	 *
	 * @param {User} user
	 */
	post(user) {
		if (this.#addedUsernames.includes(this.#getUserString(user.username))) return false;
		localStorage.setItem(this.#getUserString(user.username), JSON.stringify(user));
		this.#addedUsernames.push(user.username);
	}
	put(userid, user) {
		let userString = this.#getUserStringbyID(userid);
		if (!userString) return false;
		localStorage.setItem(userString, JSON.stringify(user));
	}
	delete(userid) {
		let userString = this.#getUserStringbyID(userid);
		if (!userString) return false;
		let user = this.#getUser(userString);
		this.#addedUsernames.splice(user.username, 1);
		localStorage.removeItem(userString);
	}
	#getUserString(username) {
		return `dbUsers-${username}`;
	}
	#getUserStringbyID(userid) {
		this.#addedUsernames.forEach((username) => {
			let userString = `dbUsers-${username}`;
			if (this.#getUser(userString).userid == userid) return JSON.stringify(userString);
		});
	}
	#getUser(userString) {
		return JSON.parse(localStorage.getItem(JSON.stringify(userString)));
	}
}
