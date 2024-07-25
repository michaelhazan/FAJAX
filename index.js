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
	 * @param {} server
	 * @param {*} sender
	 */
	constructor(type, server, client, processed = false) {
		this.type = type;
		this.processed = processed;
		this.server = server;
		this.client = client;
		this.body = '';
	}
}
/**
 * @argument username
 */
class User {
	/**@type {string} */ username;
	/**@type {string} */ password;
	/**@type {number} */ userid;
}

class TodoItem {
	/**@type {string} */ whatToDo;
	/**@type {boolean} */ finished;
}
/**
 * User DB - localstorage: dbUsers-(username)
 * Toodoo DB - localstorage: dbData-(userid-itemid)
 * Toodoo DB Index - localstorage: dbData-(userid)-Index
 */
class ItemsDatabase {
	itemsAdded;
	constructor() {
		this.itemsAdded = 0;
	}
	get(userid, itemid = null) {
		// if !index || index.length == 0 return empty
		if (itemid != null) return this.#getItem(userid, itemid);
		// return all by userid
	}
	#getItem(userid, itemid) {
		// returns item by userid and itemid
	}
	find(userid, str) {
		// returns itemid that contains str
	}
	post(userid, item) {
		// if !index create index
		//adds item to db by userid, increments itemid as well
		/**
		with itemsadded 
		*/
	}
	put(userid, itemid) {
		// edit item by itemid
	}
	delete(userid, itemid) {
		// delete item and index by itemid and userid
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
	constructor() {
		super();
		this.functions = {
			'GET': this.#get,
			'PUT': this.#put,
			'POST': this.#post,
			'DELETE': this.#delete,
		};
	}
	#get() {}
	#put() {}
	#post() {}
	#delete() {}
}
const itemsServer = new ItemsServer();
class UsersServer extends Server {
	constructor() {
		super();
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
const usersServer = new UsersServer();
/**
 * @type {Object.<string,Server>}
 */
const servers = { 'users': usersServer, 'items': itemsServer };

class Network {
	constructor() {
		this.ItemsServer = new ItemsServer();
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
			else servers[message.server].addMessage(message);
		}, randWait);
	}
}
const network = new Network();

class FXMLHttpRequest {
	/**@type {Function}*/ onload;
	/**@type {string}*/ responseText;
	/**@type {Message}*/ #message;

	open(type, address) {
		this.#message = new Message(type, address, this);
	}
	/**
	 *
	 * @param {JSON} body
	 */
	send(body = null) {
		this.#message.body = body;
		network.send(this.#message);
	}

	recieve(response) {
		this.responseText = response;
		this.onload(response);
	}
}

var fxml = new FXMLHttpRequest();
fxml.open('GET', 'users');
fxml.onload = (res) => {
	console.log(res);
	console.log('finished');
};
fxml.send();
