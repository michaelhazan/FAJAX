class FXMLHttpRequest {
  /**@type {Function}*/ onload;
  /**@type {string}*/ responseText;
  /**@type {Message}*/ #message;
  /**@type {Network}*/ #network;
  constructor() {
    this.#network = MainNetwork;
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
   *	send request,
   * @param {JSON} body
   */
  send(body = {}) {
    this.#message.body = JSON.stringify(body);
    return this.#network.send(this.#message);
  }

  receive(response) {
    this.responseText = response;
    this.onload();
  }
}
