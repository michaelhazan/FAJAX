/**
 * @typedef RESTAPI
 * @type {string}
 */

/**
 * Message on network
 */
class Message {
	/**@type {RESTAPI} */ type;
	/**@type {FXMLHttpRequest || string} */ responder;
	/**@type {FXMLHttpRequest || string} */ requester;
	/**@type {string}*/ body;
	/**
	 *
	 * @param {RESTAPI} type
	 * @param {FXMLHttpRequest || string} responder
	 * @param {FXMLHttpRequest || string} requester
	 */
	constructor(type, responder, requester) {
		this.type = type;
		this.responder = responder;
		this.requester = requester;
		this.body = '';
	}
}
/**
 * @argument username
 */
class User {
	/**@type {string} */ username;
	/**@type {string} */ password;
	/**@type {Number} */ userid;
	constructor(username, password, userid) {
		this.username = username;
		this.password = password;
		this.userid = userid;
	}
}

class TodoItem {
	/**@type {string} */ text;
	/**@type {boolean} */ marked;
	constructor(text) {
		this.text = text;
		this.marked = false;
	}
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
		this.#addedUsernames.splice(user.username);
		localStorage.removeItem(userString);
	}
	#getUserString(username) {
		return `dbUsers-${username}`;
	}
	#getUserStringbyID(userid) {
		this.#addedUsernames.forEach((username) => {
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

	constructor() {
		this.messages = [];
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
			// flip the values, resquester is now responder and otherwise
			message.requester = [message.responder, (message.responder = message.requester)][0];

			this.functions[messageType](message);
		} else throw `Not a valid REST API code: ${messageType}`;
	}
	/**
	 * Sends message to network
	 * @param {Message} message
	 */
	sendMessage(message) {
		message.body = JSON.stringify(message.body);
		this.network.send(message);
	}
}
/**
 * get:
 *
 * 	{type:'list', userid:(userid)} - Gets the list of all of the items related with userid.
 *
 * 	{type:'item', userid:(userid), itemid:(itemid)} - Get item by userid and itemid.
 *
 * 	{type:'search', userid:(userid), search:(string)} - Get item by userid and itemid.
 *
 * \ end of get /
 *
 * put:
 *
 * 	{type:'edit',userid:(userid), itemid:(itemid), item: (TodoItem) } - Edit item by userid and itemid, change it to item.
 *
 * 	{type:'toggle-checked',userid:(userid), itemid:(itemid) } - Check / Uncheck an item.
 *
 * \ end of put /
 *
 * post:
 *
 *	{userid: (userid), item:(TodoItem)} - Add a new item by userid.
 *
 * \ end of post /
 *
 * delete:
 *
 *	{userid: (userid), itemid: (itemid)} - Delete an item by userid and itemid.
 *
 * \ end of delete /
 */
class ItemsServer extends Server {
	#ItemsDB;
	constructor(network) {
		super();
		this.network = network;
		this.#ItemsDB = new ItemsDatabase();
		this.functions = {
			'GET': this.#get.bind(this),
			'PUT': this.#put.bind(this),
			'POST': this.#post.bind(this),
			'DELETE': this.#delete.bind(this),
		};
	}
	/**
	 * Get function.
	 * @param {Message} message
	 */
	#get(message) {
		let body = JSON.parse(message.body);
		if (!body.userid) throw `Missing userid!`;
		message.type = 'POST';
		switch (body.type) {
			case 'list':
				message.body = this.#ItemsDB.get(body.userid);
				break;
			case 'item':
				if (!body.itemid) throw `Missing itemid!`;
				message.body = this.#ItemsDB.get(body.userid, body.itemid);
				break;
			case 'search':
				if (!body.search) throw `Missing search!`;
				message.body = this.#ItemsDB.find(body.userid, body.search);
				break;
			default:
				throw 'No or Invalid type specified!';
		}
		this.sendMessage(message);
	}
	/**
	 * Put function.
	 * @param {Message} message
	 */
	#put(message) {
		let body = JSON.parse(message.body);
		if (!body.userid || !body.itemid) throw `Missing userid or itemid!`;
		switch (body.type) {
			case 'edit':
				if (!body.item) throw `Missing Item!`;
				if (typeof body.item != TodoItem) throw `Incorrect item type! (not a TodoItem).`;
				message.body = this.#ItemsDB.put(body.userid, body.itemid, body.item);
				break;
			case 'toggle-checked':
				let item = this.#ItemsDB.get(body.userid, body.itemid)[0];
				item.marked = true;
				this.#ItemsDB.put(body.userid, body.itemid, item);
		}

		this.sendMessage(message);
	}
	/**
	 * Post function.
	 * @param {Message} message
	 */
	#post(message) {
		let body = JSON.parse(message.body);
		if (!body.userid || !body.item) throw `Missing userid or item!`;
		message.body = { 'response': this.#ItemsDB.post(body.userid, body.item) };
		this.sendMessage(message);
	}
	/**
	 * Delete function.
	 * @param {Message} message
	 */
	#delete(message) {
		let body = JSON.parse(message.body);
		if (!body.userid || !body.itemid) throw `Missing userid or itemid!`;
		this.#ItemsDB.delete(body.userid, body.itemid);
	}
}
/**
 * get:
 * 	{type:'login', username:(username)} - Gets the list of all of the items related with userid
 */

class UsersServer extends Server {
	#UsersDB;
	#userIDLength;
	constructor(network) {
		super();

		this.network = network;
		this.#UsersDB = new UsersDatabase();
		this.functions = {
			'GET': this.#get.bind(this),
			'PUT': this.#put.bind(this),
			'POST': this.#post.bind(this),
			'DELETE': this.#delete.bind(this),
		};

		this.#userIDLength = 10;
	}
	/**
	 * Get function.
	 * @param {Message} message
	 */
	#get(message) {
		let body = JSON.parse(message.body);
		message.type = 'POST';
		switch (body.type) {
			case 'login':
				let userid = false;
				let res = this.#UsersDB.get(body.username);
				if (res || res.password == body.password) userid = res.userid;
				message.body = { 'userid': userid };
				break;
			default:
				throw 'No or Invalid type specified!';
		}
		this.sendMessage(message);
	}
	/**
	 * Put function.
	 * @param {Message} message
	 */
	#put(message) {
		message.body = {};
		message.type = 'POST';
		this.sendMessage(message);
	}
	/**
	 * Post function.this.#userIDLength - amountOfUsers.toString().length
	 * @param {Message} message
	 */
	#post(message) {
		let body = JSON.parse(message.body);
		console.log(body);
		if (!body['username'] || !body['password']) throw `Missing username / password!`;
		if (this.#UsersDB.get(body.username)) throw `Username already exists!`;
		let userid = this.#generateUserID();
		let user = new User(body.username, body.password, userid);
		this.#UsersDB.post(user);
		message.body = { 'userid': userid };
		this.sendMessage(message);
	}
	/**
	 * Delete function.
	 * @param {Message} message
	 */
	#delete(message) {}

	#generateUserID() {
		let amountOfUsers = this.#UsersDB.get();
		let userid = `${amountOfUsers}`;
		for (let i = 0; i < this.#userIDLength - amountOfUsers.toString().length; i++) {
			userid += `${Math.random() * 9}`;
		}
		return Number.parseInt(userid);
	}
}

class Network {
	#servers;
	constructor() {
		this.#servers = {
			'users': new UsersServer(this),
			'items': new ItemsServer(this),
		};
	}
	test(message) {
		this.#servers['users'].sendMessage(new Message('POST', message.requester, message.responder));
	}
	/**
	 * Sends message to specified address
	 * @param {Message} message
	 */
	send(message) {
		let randWait = Math.floor(Math.random() * 4500) + 500;
		let randDrop = Math.random();
		if (randDrop < 0.02) return false;
		console.log(message.responder);

		setTimeout(() => {
			if (typeof message.responder != 'string') message.responder.recieve(message); // send to client
			else this.#servers[message.responder].addMessage(message);
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
	/**
	 *
	 * @param {string} type
	 * @param {string} address
	 */
	open(type, address) {
		this.#message = new Message(type.toUpperCase(), address, this);
	}
	/**
	 *
	 * @param {JSON} body
	 */
	send(body = null) {
		if (body) this.#message.body = JSON.stringify(body);
		else this.#message.body = JSON.stringify({});
		console.log(this.#message);
		this.#network.send(this.#message);
	}

	recieve(response) {
		this.responseText = response;
		this.onload();
	}
}
