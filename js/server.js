class Server {
	messages;
	functions;
	network;

	constructor() {
		this.messages = [];
		setInterval(this.processMessages.bind(this), 500);
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
		this.messages.splice(this.messages.indexOf(message), 1);
	}
	/**
	 * Sends message to network
	 * @param {Message} message
	 */
	sendMessage(message) {
		message.body = JSON.stringify(message.body);
		let messageSent = false;
		while (!messageSent) {
			messageSent = this.network.send(message);
		}
	}
}
/**
 * get:
 *
 * 	{type:'list', userid:(userid)} - Gets the list of all of the items related with userid.
 *
 * 	{type:'item', userid:(userid), itemid:(itemid)} - Get item by userid and itemid.
 *
 * 	{type:'search', userid:(userid), search:(string)} - Get all items with text containing string.
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
				if (body.itemid === null) throw `Missing itemid!`;
				message.body = this.#ItemsDB.get(body.userid, body.itemid);
				break;
			case 'search':
				if (!body.search) throw `Missing search!`;
				if (typeof body.search != 'string') throw `Search isn't a string!`;
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
		if (!body.userid || body.itemid === null) throw `Missing userid or itemid!`;
		switch (body.type) {
			case 'edit':
				if (!body.item) throw `Missing Item!`;
				if (!body.item.text || body.item.marked === null) throw `Incorrect item type! (not a TodoItem).`;
				message.body = this.#ItemsDB.put(body.userid, body.itemid, body.item);
				break;
			case 'toggle-checked':
				let item = this.#ItemsDB.get(body.userid, body.itemid)[0];
				item.marked = !item.marked;
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
		console.log('DELETE');
		let body = JSON.parse(message.body);
		if (!body.userid || body.itemid === null) throw `Missing userid or itemid!`;
		console.log(this.#ItemsDB.delete(Number.parseInt(body.userid), Number.parseInt(body.itemid)));
		message.body = true;
		this.sendMessage(message);
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
				if (res && res.password == body.password) userid = res.userid;
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
			let rand = Number.parseInt(Math.random() * (9 - 1) + 1);
			console.log(`rand ${rand}`);
			userid += `${rand}`;
			console.log(userid);
		}
		return Number.parseInt(userid);
	}
}
