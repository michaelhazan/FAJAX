// SPA 

document.addEventListener('DOMContentLoaded', init);
const page = document.querySelector('.main-page');
let loginTemp, signupTemp, listTemp;

function init() {
  sessionStorage.removeItem("current");
  loginTemp = document.querySelector('#login-template');
  signupTemp = document.querySelector('#signup-template');
  gameTemp = document.querySelector('#list-template');
  page.appendChild(loginTemp.content.cloneNode(true));
  document.removeEventListener('DOMContentLoaded', init);
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
    let userid = fxml.responseText
    if (userid) {
      entrySuccess(userid, username)
    }
    else{
      alert('Had problem logging in, try again.')
    }
  }
  fxml.send({username, password});
}

function validateSignup() {
  let username = this['signup-username'].value;
  let password = this['signup-password'].value;
  let pwVerification = this['pw-verification'].value;
  let errText = document.querySelector('.validation-text');
  errText.textContent = "";

  if (password !== pwVerification) {
    errText.textContent = "Passwords do not match";
    this['signup-password'].value = "";
    this['pw-verification'].value = "";
    return;
  }

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
  fxml.send();
}

function entrySuccess(userid, username) {
  navigate('list');
  sessionStorage.setItem("current", userid)
  initializeList(username)
}

function logout() {
  sessionStorage.removeItem("current");
  navigate('login')
}