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
	/**@type {string} */ whatToDo;
	/**@type {boolean} */ finished;
}
/*
 * User DB - localstorage: dbUsers-(username)
 * Toodoo DB - localstorage: dbData-(userid-itemid)
 * Toodoo DB Index - localstorage: dbData-(userid)-Index
 */
class ItemsDatabase {
	itemsAdded;
	constructor() {
		this.itemsAdded = 0;
	}
	/**
	 *
	 * @param {User.userid} userid
	 * @param {Number} itemid
	 * @returns {Array.<TodoItem>}
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
	find(userid, str) {
		let items = this.get(userid);
		let ret = [];
		items.forEach((item) => {
			if (item.whatToDo.indexOf(str) != -1) ret.push(item);
		});
		return ret;
	}
	post(userid, item) {
		let indexes = this.#getIndexes(userid);
	}
	put(userid, itemid) {
		// edit item by itemid
	}
	delete(userid, itemid) {
		// delete item and index by itemid and userid
	}
	/**
	 *
	 * @param {User.userid} userid
	 * @returns {Array.<Number>}
	 */
	#getIndexes(userid) {
		let /** @type {Array.<Number>} */ indexes = JSON.parse(localStorage.getItem(`dbData-${userid}-Index`));
		if (!indexes) return [];
		return indexes;
	}
	/**
	 *
	 * @param {User.userid} userid
	 * @param {Number} itemid
	 * @returns {TodoItem}
	 */
	#getItem(userid, itemid) {
		return JSON.parse(localStorage.getItem(`dbData-${userid}-${itemid}`));
	}
}
class UsersDatabase {
	usersAdded;
	constructor() {
		this.usersAdded = 0;
	}
	/**
	 * get info by userID
	 * @param {User.userid} userid
	 */
	get(userid) {
		// get user by userid
	}
	find(username) {
		// returns User by username
	}
	post(user) {
		// create User with user object
	}
	put(userid) {
		// edit User by userid
	}
	delete(userid) {
		// delete User by userid
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
		network.send(message);
	}
}
class ItemsServer extends Server {
	#ItemsDB;
	constructor() {
		super();
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
	constructor() {
		super();
		this.#UsersDB = new UsersDatabase();
		this.functions = {
			'GET': this.#get,
			'PUT': this.#put,
			'POST': this.#post,
			'DELETE': this.#delete,
		};
	}
	#get(message) {
		network.send(message);
	}
	#put() {}
	#post() {}
	#delete() {}
}
class Network {
	#servers;
	constructor() {
		this.#servers = { 'users': new UsersServer(), 'items': new ItemsServer() };
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
