// SPA

document.addEventListener('DOMContentLoaded', init);
const page = document.querySelector('.main-page');
let loginTemp, signupTemp, listTemp;

/**
 * initialize main page
 */
function init() {
	sessionStorage.removeItem('current');
	loginTemp = document.querySelector('#login-template');
	signupTemp = document.querySelector('#signup-template');
	gameTemp = document.querySelector('#list-template');
	page.appendChild(loginTemp.content.cloneNode(true));
	document.removeEventListener('DOMContentLoaded', init);
}

/**
 * navigate to a given page in the SPA
 * @param {string} pageName
 */
function navigate(pageName) {
	let templateToLoad = document.querySelector('#' + pageName + '-template');

	page.replaceChildren(templateToLoad.content.cloneNode(true));
}

// form validation

/**
 * Validate a log in attempt
 */
function validateLogin() {
	let username = this['login-username'].value;
	let password = this['login-password'].value;

	user = { username, password };

  const fxml = new FXMLHttpRequest();
  fxml.open('GET', 'users');
  fxml.onload = function() {
    let userid = fxml.responseText
    if (userid) {
      entrySuccess(userid, username)
    }
    else{
      alert('Had problem logging in, try again.')
    }
  }
  fxml.send(user);
}

/**
 * validates a sign up attempt
 */
function validateSignup() {
	let username = this['signup-username'].value;
	let password = this['signup-password'].value;
	let pwVerification = this['pw-verification'].value;
	let errText = document.querySelector('.validation-text');
	errText.textContent = '';

	if (password !== pwVerification) {
		errText.textContent = 'Passwords do not match';
		this['signup-password'].value = '';
		this['pw-verification'].value = '';
		return;
	}

	// passed validation

	const user = { 'username': username, 'password': password };

  const fxml = new FXMLHttpRequest();
  fxml.open('POST', 'users');
  fxml.onload = function() {
    let userid = fxml.responseText
    if (userid) {
      entrySuccess(userid, username)
    }
    else{
      alert('Had problem signing up, try again.')
    }
  }
  fxml.send(user);
	const fxml = new FXMLHttpRequest();
	fxml.open('POST', 'users');
	fxml.onload = function () {
		let userid = fxml.responseText;
		if (userid) {
			entrySuccess(userid, username);
		} else {
			alert('Had problem signing up, try again.');
		}
	};
	fxml.send(user);
}

/**
 * called when the user succefully entered their account.
 * puts the user on their account page and sets them as
 * current user in local storage
 * @param {User.userid} userid
 * @param {string} username
 */
function entrySuccess(userid, username) {
	navigate('list');
	sessionStorage.setItem('current', userid);
	initializeList(username);
}

/**
 * logs out the current user and returns them to login screen
 */
function logout() {
	sessionStorage.removeItem('current');
	navigate('login');
}
