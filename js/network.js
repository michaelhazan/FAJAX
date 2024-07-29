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
		let randWait = Math.floor(Math.random() * 2);
		let randDrop = Math.random();
		if (randDrop < 0.02) return false;

		setTimeout(() => {
			if (typeof message.responder != 'string') message.responder.recieve(message); // send to client
			else this.#servers[message.responder].addMessage(message);
		}, randWait);
		return true;
	}
}