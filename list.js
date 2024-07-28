// testing ONLY
const itemArray = [{text: 'exercise', marked: false}, {text: 'sleep', marked: true}, {text: 'work', marked: false}, {text: 'eat lunch', marked: false}];

let renameMode = false, deleteMode = false;

function initializeList(username) {
  const nameSpan = document.querySelector('#name-span');

  nameSpan.textContent = username;
  updateList();
}

function updateList() {
  const list = document.querySelector('#item-list');
  let itemElement;

  const itemTemplate = document.querySelector('#item-template');
  itemArray.sort((a, b) => {
    if(!a.marked && b.marked) return -1;
    if(a.marked && !b.marked) return 1;
    return a.text < b.text? -1 : 1;
  })

  list.innerHTML = "";
  for (const item of itemArray) {
    itemElement = document.createElement('li');
    itemElement.classList.add('list-item')
    itemElement.textContent = item.text;
    if(item.marked) {
      itemElement.classList.add('marked');
      itemElement.style.textDecoration = 'line-through';
    }
    itemElement.addEventListener('click', changeItem)
    list.appendChild(itemElement);
  }

  // for later 

  // let userid = sessionStorage.getItem("current")
  
  /* const fxml = new FXMLHttpRequest()
  fxml.open('GET', 'items');
  fxml.onload = function() {
  }
  fxml.send({userid}); */
}

function addItem() {
  let name = prompt('What is the name of the item you want to add?');
  const item = {
    text: name,
    marked: false
  }

  itemArray.push(item);

  // post request with a body of item

  updateList()
}

function changeItem(e) {
  if(!renameMode && !deleteMode) {
    markItem(e);
  }
  if (renameMode) {
    renameItem(e);
  }
  if(deleteMode) {
    deleteItem(e);
  }
}

function markItem(e) {
  let text = e.target.textContent;
  for (const item of itemArray) {
    if(item.text === text) {
      item.marked = !item.marked;
    }
  }
  // put request with a body of item
  updateList()
}

function toggleRenameMode() {
  renameMode = !renameMode
}

function toggleDeleteMode() {
  deleteMode = !deleteMode
}

function renameItem(e) {
  let text = e.target.textContent;
  let newText = prompt('What do you want to rename this element?');

  for (const item of itemArray) {
    if(item.text === text) {
      item.text = newText;
    }
  }

  // put request with the new name

  updateList();
  renameMode = false;
}

function deleteItem(e) {
  let text = e.target.textContent;
  let index = -1;
  
  for (let i in itemArray) {
    if(itemArray[i].text === text) {
      index = i;
    }
  }

  itemArray.splice(index, 1)

  // delete request with a body of item

  updateList();
  deleteMode = false;
}
