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
    this.body = "";
  }
}
/**
 * @argument username
 */
class User {
  /**@type {string} */ username;
  /**@type {string} */ password;
  /**@type {Number} */ userId;
  constructor(username, password, userId) {
    this.username = username;
    this.password = password;
    this.userId = userId;
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
