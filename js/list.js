let renameMode = false,
  deleteMode = false;

/**
 * Initializes the list page the first time a user logs in
 * @param {string} username
 */
function initializeList(username) {
  const nameSpan = document.querySelector("#name-span");

  nameSpan.textContent = username;
  updateList();
}

/**
 * Updates the item list by calling the server and getting
 * the updated items
 */
function updateList() {
  const list = document.querySelector("#item-list");
  let itemElement;

  let userid = sessionStorage.getItem("current");
  if (!userid) {
    alert("oops. problem. sign in again please");
    navigate("login");
    return;
  }
  let fxml = new FXMLHttpRequest();
  fxml.open("GET", "items");
  fxml.onload = function () {
    let item;
    const itemArray = JSON.parse(fxml.responseText.body);
    itemArray.sort((a, b) => {
      if (!a.item.marked && b.item.marked) return -1;
      if (a.item.marked && !b.item.marked) return 1;
      return a.item.text < b.item.text ? -1 : 1;
    });

    list.innerHTML = "";
    for (const element of itemArray) {
      item = element.item;
      itemElement = document.createElement("li");
      itemElement.classList.add("list-item");
      itemElement.textContent = item.text;
      if (item.marked) {
        itemElement.classList.add("marked");
      }
      itemElement.setAttribute("data-id", element.itemid);
      itemElement.addEventListener("click", changeItem);
      list.appendChild(itemElement);
    }
  };
  while(!fxml.send({ type: "list", userid: userid }));
}

/**
 * adds item to the list, and then updates it
 */
function addItem() {
  let name = prompt("What is the name of the item you want to add?");
  const item = new TodoItem(name);

  let userid = sessionStorage.getItem("current");

  // itemArray.push(item);

  const fxml = new FXMLHttpRequest();
  fxml.open("POST", "items");
  fxml.onload = function () {
    updateList();
  };
  alertError(fxml.send({ userid: userid, item: item }));
}

/**
 * marks, renames, or deletes an item depending on
 * which mode the page is in.
 * @param {PointerEvent} e
 */
function changeItem(e) {
  if (!renameMode && !deleteMode) {
    markItem(e);
  }
  if (renameMode) {
    renameItem(e);
  }
  if (deleteMode) {
    deleteItem(e);
  }
}

/**
 * marks the item the user clicked on
 * @param {PointerEvent} e
 */
function markItem(e) {
  let userid = sessionStorage.getItem("current");
  let itemid = e.target.getAttribute("data-id");

  const fxml = new FXMLHttpRequest();
  fxml.open("PUT", "items");
  fxml.onload = function () {
    updateList();
  };
  alertError(fxml.send({ type: "toggle-checked", userid, itemid }));
}

/**
 * renames the item the user clicked on
 * @param {PointerEvent} e
 */
function renameItem(e) {
  let userid = sessionStorage.getItem("current");
  let itemid = e.target.getAttribute("data-id");

  const listElement = document.querySelector(`li[data-id="${itemid}"]`);
  let itemText = listElement.textContent;
  const listParent = listElement.parentElement;
  listParent.replaceChild(document.getElementById('edit-item-template').content.cloneNode(true), listElement)
  const editElement = document.querySelector('.edit-list-item')

  const inputElement = document.querySelector('.edit-item-input');
  inputElement.setAttribute('value', itemText)
  inputElement.select();
  inputElement.addEventListener('focusout', () => {
    listParent.replaceChild(listElement, editElement);
    toggleRenameMode();
  })
  inputElement.parentElement.addEventListener('submit', () => {
    let item = new TodoItem(inputElement.parentElement['text'].value)
    sendRenameRequest(item, userid, itemid);
    return false;
  })
}

function sendRenameRequest(item, userid, itemid) {
  const fxml = new FXMLHttpRequest();
  fxml.open("PUT", "items");
  fxml.onload = function () {
    updateList();
  };
  alertError(fxml.send({ type: "edit", userid, itemid, item }));
}

/**
 * deletes the item the user clicked on
 * @param {PointerEvent} e
 */
function deleteItem(e) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  let userid = sessionStorage.getItem("current");
  let itemid = e.target.getAttribute("data-id");

  const fxml = new FXMLHttpRequest();
  fxml.open("DELETE", "items");
  fxml.onload = function () {
    updateList();
  };
  alertError(fxml.send({ userid, itemid }));
  toggleDeleteMode();
}

/**
 * deletes all marked items in the list
 */
function deleteMarked() {
  let userid = sessionStorage.getItem("current");
  let itemFXML, deleteFXML;

  const fxml = new FXMLHttpRequest();
  fxml.open("GET", "items");
  fxml.onload = function () {
    const markedArray = JSON.parse(fxml.responseText.body).filter(
      (elem) => elem.item.marked === true
    );

    for (const elem of markedArray) {
      let itemid = elem.itemid;
      deleteFXML = new FXMLHttpRequest();
      deleteFXML.open("DELETE", "items");
      deleteFXML.onload = function () {
        updateList();
      };
      alertError(deleteFXML.send({ userid, itemid }));
    }
  };
  alertError(fxml.send({ type: "list", userid: userid }));
}

/**
 * toggles rename mode, in which clicking on an
 * item renames it instead of marks it
 */
function toggleRenameMode() {
  renameMode = !renameMode;
  if (renameMode && deleteMode) {
    toggleDeleteMode();
  }
  document.querySelector(".rename-button").classList.toggle("clicked");
  document.querySelectorAll('li').forEach((li) => li.classList.toggle('rename-mode'))
}

/**
 * toggles delete mode, in which clicking on an
 * item deletes it instead of marks it
 */
function toggleDeleteMode() {
  deleteMode = !deleteMode;
  if (renameMode && deleteMode) {
    toggleRenameMode();
  }
  document.querySelector(".delete-button").classList.toggle("clicked");
  document.querySelectorAll('li').forEach((li) => li.classList.toggle('delete-mode'))
}

/**
 * alerts that an error with communication with the
 * server hsa occured, when recieving falsy value
 * @param {*} bool
 */
function alertError(bool) {
  if (!bool) {
    alert(
      "Something happened when attempting to reach the server. please try again"
    );
  }
}
