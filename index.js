/**
 * @typedef RESTAPI
 * @type {string}
 */

/**
 * Message on network
 */
class Message {
	/**@type {RESTAPI} */ type;
	/**@type {string} */ address;
	/**@type {string} */ sender;
	/**@type {JSON}*/ body;
}
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
		setInterval(this.processMessages, 3000);
	}
	addMessage(message) {
		this.messages.push(message);
	}
	processMessages() {
		this.messages.forEach((message) => {
			this.processMessage(message);
		});
		this.messages = [];
	}
	/**
	 *
	 * @param {Message} message
	 */
	processMessage(message) {
		var messageType = message.type.toUpperCase();
		if (this.functions[messageType]) this.functions[messageType](message);
		// else return bad type message
	}
}
class ItemsServer extends Server {
	constructor() {
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
class UsersServer extends Server {
	constructor() {
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

// class Network {
// 	ItemsServer;
// 	UsersServer;
// 	constructor() {
// 		this.ItemsServer = new ItemsServer
// 	}
// }

class FXMLHttpRequest {}
