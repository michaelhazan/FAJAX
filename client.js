// SPA 

document.addEventListener('DOMContentLoaded', init);
const page = document.querySelector('.main-page');
let loginTemp, signupTemp, listTemp;

function init() {
  loginTemp = document.querySelector('#login-template');
  signupTemp = document.querySelector('#signup-template');
  gameTemp = document.querySelector('#list-template');
  page.appendChild(loginTemp.content.cloneNode(true));
}

function navigate(pageName) {
  let templateToLoad = document.querySelector('#' + pageName + "-template");

  page.replaceChildren(templateToLoad.content.cloneNode(true))
}


// form validation

function validateLogin() {
  let username = this['login-username'].value;
  let password = this['login-password'].value;

  const fxml = new FXMLHttpRequest();
  fxml.open('GET', 'users');
  fxml.onload = function() {

  }
  fxml.send();
}

function validateSignup() {
  let username = this['signup-username'].value;
  let password = this['signup-password'].value;
  let pwVerification = this['pw-verification'].value;

  if (!this['signup-username'].reportValidity()) {
    alert('invalid username');
    this['signup-username'].reset();
    return;
  }

  if (!this['signup-password'].reportValidity()) {
    alert('invalid password');
    this['signup-password'].reset();
    return;
  }

  if (password !== pwVerification) {
    alert('passwords do not match');
    this['signup-password'].reset();
    this['pw-verification'].reset();
    return;
  }

  const fxml = new FXMLHttpRequest();
  fxml.open('GET', 'users');
  fxml.onload = function() {

  }
  fxml.send();
}

function entrySuccess(login, username) {
  
}