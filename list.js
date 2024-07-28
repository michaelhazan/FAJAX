function updateList(username, userid) {
  const list = document.querySelector('#item-list');
  const nameSpan = document.querySelector('#name-span');
  let itemElement;

  nameSpan.textContent = username;

  const fxml = new FXMLHttpRequest()
  fxml.open('GET', 'items');
  fxml.onload = function() {
    const itemArray = JSON.parse(this.responseText);
    const itemTemplate = document.querySelector('#item-template');

    list.replaceChildren(null)
    for (const item in itemArray) {
      itemElement = itemTemplate.content.cloneNode(true);
      itemElement.textContent = item.text;
      if(item.marked) {
        itemElement.classList.add('marked');
      }
      list.appendChild(itemElement);
    }
  }
  fxml.send({userid});
}