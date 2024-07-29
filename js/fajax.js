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
		return this.#network.send(this.#message);
	}

	recieve(response) {
		this.responseText = response;
		this.onload();
	}
}