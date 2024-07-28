/**
 * @typedef RESTAPI
 * @type {string}
 */

/**
 * Message on network
 */
class Message {
	/**@type {RESTAPI} */ type;
	/**@type {boolean} */ processed;
	/**@type {string} */ server;
	/**@type {FXMLHttpRequest} */ client;
	/**@type {string}*/ body;
	/**
	 *
	 * @param {RESTAPI} type
	 * @param {string} server
	 * @param {FXMLHttpRequest} client
	 * @param {boolean} processed
	 */
	constructor(type, server, client, processed = false) {
		this.type = type;
		this.processed = processed;
		this.server = server;
		this.client = client;
		this.body = {};
	}
}
/**
 * @argument username
 */
class User {
	/**@type {string} */ username;
	/**@type {string} */ password;
	/**@type {Number} */ userid;
}

class TodoItem {
	/**@type {string} */ text;
	/**@type {boolean} */ marked;
}
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
			ret.push(this.#getItem(userid, index));
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
		let items = this.get(userid);
		let ret = [];
		items.forEach((item) => {
			if (item.text.indexOf(str) != -1) ret.push(item);
		});
		return ret;
	}
	post(userid, item) {
		let indexes = this.#getIndexes(userid);
		let index = indexes.length;
		this.#addToIndexes(userid, index);
		this.#setItem(userid, index, item);
		return true;
	}
	put(userid, itemid, item) {
		this.#setItem(userid, itemid, item);
	}
	delete(userid, itemid) {
		let indexes = this.#getIndexes(userid);
		let indexToRemove = indexes.indexOf(itemid);
		if (indexToRemove == -1) return false;
		indexes.splice(indexToRemove, 1);
		localStorage.setItem(this.#getIndexString(userid), indexes);
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
		localStorage.setItem(str, indexes);
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
	 *
	 * @param {User.userid} userid
	 * @param {Number} itemid
	 * @param {TodoItem} item
	 */
	#setItem(userid, itemid, item) {
		localStorage.setItem(this.#getItemString(userid, itemid), item);
	}
	#getItemString(userid, itemid) {
		return `dbData-${userid}-${itemid}`;
	}
}
class UsersDatabase {
	addedUsernames;
	constructor() {
		this.addedUsernames = [];
	}
	/**
	 * Get User by username
	 * @param {User.userid} userid
	 */
	get(username) {
		if (username) return JSON.parse(localStorage.getItem(this.#getUserString(username)));
		return false;
	}
	/**
	 * Find User by userid.
	 * @param {User.userid} userid
	 */
	find(userid) {
		this.addedUsernames.forEach((user) => {
			if (user.id == userid) return user;
		});
	}
	/**
	 *
	 * @param {User} user
	 */
	post(user) {
		if (this.addedUsernames.includes(this.#getUserString(user.username))) return false;
		localStorage.setItem(this.#getUserString(user.username), user);
		this.addedUsernames(user.username);
	}
	put(userid, user) {
		let userString = this.#getUserStringbyID(userid);
		if (!userString) return false;
		localStorage.setItem(userString, user);
	}
	delete(userid) {
		let userString = this.#getUserStringbyID(userid);
		if (!userString) return false;
		let user = this.#getUser(userString);
		this.addedUsernames.splice(user.username);
		localStorage.removeItem(userString);
	}
	#getUserString(username) {
		return `dbUsers-${username}`;
	}
	#getUserStringbyID(userid) {
		this.addedUsernames.forEach((username) => {
			let userString = `dbUsers-${username}`;
			if (this.#getUser(userString).userid == userid) return userString;
		});
	}
	#getUser(userString) {
		return JSON.parse(localStorage.getItem(userString));
	}
}
class Server {
	messages;
	functions;
	network;

	constructor(network) {
		this.messages = [];
		this.network = network;
		setInterval(this.processMessages.bind(this), 3000);
	}
	addMessage(message) {
		this.messages.push(message);
	}
	processMessages() {
		this.messages.forEach((message) => {
			try {
				this.processMessage(message);
			} catch (err) {
				console.error(err);
			}
		});
		this.messages = [];
	}
	/**
	 *
	 * @param {Message} message
	 */
	processMessage(message) {
		var messageType = message.type.toUpperCase();
		if (this.functions[messageType]) {
			message.processed = true;
			this.functions[messageType](message);
		} else throw 'Not a valid REST API code.';
	}
	/**
	 *
	 * @param {Message} message
	 */
	sendMessage(message) {
		this.network.send(message);
	}
}
class ItemsServer extends Server {
	#ItemsDB;
	constructor(network) {
		super(network);
		this.#ItemsDB = new ItemsDatabase();
		this.functions = {
			'GET': this.#get,
			'PUT': this.#put,
			'POST': this.#post,
			'DELETE': this.#delete,
		};
	}
	#get() {
		// check if user has valid userid
	}

	#put() {}
	#post() {}
	#delete() {}
}
class UsersServer extends Server {
	#UsersDB;
	constructor(network) {
		super(network);
		this.#UsersDB = new UsersDatabase();
		this.functions = {
			'GET': this.#get,
			'PUT': this.#put,
			'POST': this.#post,
			'DELETE': this.#delete,
		};
	}
	#get(message) {
		this.network.send(message);
	}
	#put() {}
	#post() {}
	#delete() {}
}
class Network {
	#servers;
	constructor() {
		this.#servers = { 'users': new UsersServer(this), 'items': new ItemsServer(this) };
	}
	/**
	 * Sends message to specified address
	 * @param {Message} message
	 */
	send(message) {
		let randWait = Math.floor(Math.random() * 4500) + 500;
		let randDrop = Math.random();
		if (randDrop < 0.02) return false;

		setTimeout(() => {
			if (message.processed) message.client.recieve(message); // send to client
			else this.#servers[message.server].addMessage(message);
		}, randWait);
	}
}
class FXMLHttpRequest {
	/**@type {Function}*/ onload;
	/**@type {string}*/ responseText;
	/**@type {Message}*/ #message;
	/**@type {Network}*/ #network;
	constructor() {
		this.#network = new Network();
	}

	open(type, address) {
		this.#message = new Message(type, address, this);
	}
	/**
	 *
	 * @param {JSON} body
	 */
	send(body = null) {
		this.#message.body = body;
		this.#network.send(this.#message);
	}

	recieve(response) {
		this.responseText = response;
		this.onload(response);
	}
}

//
