// testing ONLY
// const itemArray = [{text: 'exercise', marked: false}, {text: 'sleep', marked: true}, {text: 'work', marked: false}, {text: 'eat lunch', marked: false}];

let renameMode = false,
	deleteMode = false;

function initializeList(username) {
	const nameSpan = document.querySelector('#name-span');

	nameSpan.textContent = username;
	updateList();
}

function updateList() {
	const list = document.querySelector('#item-list');
	let itemElement;

	let userid = sessionStorage.getItem('current');
	if (!userid) {
		alert('oops. problem. sign in again please');
		navigate('login');
		return;
	}

	const fxml = new FXMLHttpRequest();
	fxml.open('GET', 'items');
	fxml.onload = function () {
		const itemArray = JSON.parse(fxml.responseText.body);
		itemArray.sort((a, b) => {
			if (!a.marked && b.marked) return -1;
			if (a.marked && !b.marked) return 1;
			return a.text < b.text ? -1 : 1;
		});

		list.innerHTML = '';
		for (const item of itemArray) {
			itemElement = document.createElement('li');
			itemElement.classList.add('list-item');
			itemElement.textContent = item.text;
			if (item.marked) {
				itemElement.classList.add('marked');
			}
			itemElement.addEventListener('click', changeItem);
			list.appendChild(itemElement);
		}
	};
	fxml.send({ type: 'list', userid: userid });
}

function addItem() {
	let name = prompt('What is the name of the item you want to add?');
	const item = new TodoItem(name);

	let userid = sessionStorage.getItem('current');
	
	// itemArray.push(item);

	const fxml = new FXMLHttpRequest();
	fxml.open('POST', 'items');
	fxml.onload = function () {
		updateList();
	};
	fxml.send({ userid: userid, item: item });
}

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

function markItem(e) {
	let text = e.target.textContent;
	let userid = sessionStorage.getItem('current');
	
	const fxmlGet = new FXMLHttpRequest()
	fxmlGet.open('GET', 'items');
	fxmlGet.onload = function() {
		let itemid = JSON.parse(this.responseText.body)[0].itemid;
		const fxml = new FXMLHttpRequest()
		fxml.open('PUT', 'items');
		fxml.onload = function() {
			updateList();
		}
		fxml.send({type: 'toggle-checked', userid, itemid});
	}
	fxmlGet.send({type: 'search', userid, text});


}

function renameItem(e) {
	let text = e.target.textContent;
	let newText = prompt('What do you want to rename this element?');
	if (!newText) return;

	let userid = sessionStorage.getItem('current');

	const fxmlGet = new FXMLHttpRequest()
	fxmlGet.open('GET', 'items');
	fxmlGet.onload = function() {
		let itemid = this.responseText.body;
		let newItem = new TodoItem(newText)
		const fxml = new FXMLHttpRequest()
		fxml.open('PUT', 'items');
		fxml.onload = function() {
			updateList();
			toggleRenameMode();
		}
		fxml.send({type: 'edit', userid, itemid, newItem});
	}
	fxmlGet.send({type: 'search', userid, text});
}

function deleteItem(e) {
	if (!confirm('Are you sure you want to delete this item?')) return;

	let text = e.target.textContent;
	let userid = sessionStorage.getItem('current');

	const fxmlGet = new FXMLHttpRequest()
	fxmlGet.open('GET', 'items');
	fxmlGet.onload = function() {
		let itemid = this.responseText.body;
		const fxml = new FXMLHttpRequest()
		fxml.open('DELETE', 'items');
		fxml.onload = function() {
			updateList();
			toggleDeleteMode();
		}
		fxml.send({userid, itemid});
	}
	fxmlGet.send({type: 'search', userid, text});
}

function deleteMarked() {
	let i = 0,
		j = 0;

	while (i < itemArray.length) {
		const item = itemArray[i];
		if (!item.marked) itemArray[j++] = item;
		i++;
	}

	itemArray.length = j;
	updateList();
}

function toggleRenameMode() {
	renameMode = !renameMode;
	if (renameMode && deleteMode) {
		toggleDeleteMode();
	}
	document.querySelector('.rename-button').classList.toggle('clicked');
}

function toggleDeleteMode() {
	deleteMode = !deleteMode;
	if (renameMode && deleteMode) {
		toggleRenameMode();
	}
	document.querySelector('.delete-button').classList.toggle('clicked');
}
