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
    }
    itemElement.addEventListener('click', changeItem)
    list.appendChild(itemElement);
  }

  let userid = sessionStorage.getItem("current");
  // if(!userid) {
  //   alert('oops. problem. sign in again please')
  //   navigate('login')
  //   return;
  // }
  
  // const fxml = new FXMLHttpRequest()
  // fxml.open('GET', 'items');
  // fxml.onload = function() {
  //   const itemArray = JSON.parse(fxml.responseText)
  //   itemArray.sort((a, b) => {
  //     if(!a.marked && b.marked) return -1;
  //     if(a.marked && !b.marked) return 1;
  //     return a.text < b.text? -1 : 1;
  //   })
  
  //   list.innerHTML = "";
  //   for (const item of itemArray) {
  //     itemElement = document.createElement('li');
  //     itemElement.classList.add('list-item')
  //     itemElement.textContent = item.text;
  //     if(item.marked) {
  //       itemElement.classList.add('marked');
  //     }
  //     itemElement.addEventListener('click', changeItem)
  //     list.appendChild(itemElement);
  //   }
  // }
  // fxml.send(JSON.stringify({userid}));
}

function addItem() {
  let name = prompt('What is the name of the item you want to add?');
  const item = {
    text: name,
    marked: false
  }
  const toAdd = {item, userid}

  itemArray.push(item);

  // const fxml = new FXMLHttpRequest()
  // fxml.open('POST', 'items');
  // fxml.onload = function() {
  // }
  // fxml.send(JSON.stringify(toAdd));

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
  
  // const fxml = new FXMLHttpRequest()
  // fxml.open('PUT', 'items');
  // fxml.onload = function() {
  //  
  // }
  // fxml.send(/);

  updateList()
}

function renameItem(e) {
  let text = e.target.textContent;
  let newText = prompt('What do you want to rename this element?');
  if (!newText) 
    return;

  for (const item of itemArray) {
    if(item.text === text) {
      item.text = newText;
    }
  }

  // put request with the new name
  
  updateList();
  toggleRenameMode()
}

function deleteItem(e) {
  if (!confirm('Are you sure you want to delete this item?'))
    return;
  
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
  toggleDeleteMode()
}

function deleteMarked() {
  let i = 0, j = 0;
  
  while (i < itemArray.length) {
    const item = itemArray[i];
    if (!item.marked) itemArray[j++] = item;
    i++;
  }
  
  itemArray.length = j;
  updateList();
}

function toggleRenameMode() {
  renameMode = !renameMode
  if(renameMode && deleteMode) {
    toggleDeleteMode()
  }
  document.querySelector(".rename-button").classList.toggle('clicked')
}

function toggleDeleteMode() {
  deleteMode = !deleteMode
  if(renameMode && deleteMode) {
    toggleRenameMode()
  }
  document.querySelector(".delete-button").classList.toggle('clicked')
}
