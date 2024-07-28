document.addEventListener('DOMContentLoaded', init);
const page = document.querySelector('.main-page');
let loginTemp, signupTemp, listTemp;

function init() {
  loginTemp = document.querySelector('#login-template');
  signupTemp = document.querySelector('#signup-template');
  gameTemp = document.querySelector('#list-template');
  page.appendChild(loginTemp.content.cloneNode(true));

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', navigate)
  })
}

function navigate(pageName) {
  let templateToLoad = document.querySelector('.' + pageName + "-template");

  page.replaceChildren(templateToLoad.content.cloneNode(true))
}




function validateLogin() {

}

function validateSignup() {
  
}

function entrySuccess(login, username) {
  
}