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
	alertError(fxml.send({ type: 'list', userid: userid }));
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
	alertError(fxml.send({ userid: userid, item: item }));
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
		alertError(fxml.send({type: 'toggle-checked', userid, itemid}));
	}
	alertError(fxmlGet.send({type: 'search', userid, search:text}));


}

function renameItem(e) {
	let text = e.target.textContent;
	let newText = prompt('What do you want to rename this element?');
	if (!newText) return;

	let userid = sessionStorage.getItem('current');

	const fxmlGet = new FXMLHttpRequest()
	fxmlGet.open('GET', 'items');
	fxmlGet.onload = function() {
		let itemid = JSON.parse(this.responseText.body)[0].itemid;
		let newItem = new TodoItem(newText)
		const fxml = new FXMLHttpRequest()
		fxml.open('PUT', 'items');
		fxml.onload = function() {
			updateList();
			toggleRenameMode();
		}
		alertError(fxml.send({type: 'edit', userid, itemid, 'item': newItem}));
	}
	alertError(fxmlGet.send({type: 'search', userid, search:text}));
}

function deleteItem(e) {
	if (!confirm('Are you sure you want to delete this item?')) return;

	let text = e.target.textContent;
	let userid = sessionStorage.getItem('current');

	const fxmlGet = new FXMLHttpRequest()
	fxmlGet.open('GET', 'items');
	fxmlGet.onload = function() {
		let itemid = JSON.parse(this.responseText.body)[0].itemid;
		const fxml = new FXMLHttpRequest()
		fxml.open('DELETE', 'items');
		fxml.onload = function() {
			updateList();
			toggleDeleteMode();
		}
		alertError(fxml.send({userid, itemid}));
	}
	alertError(fxmlGet.send({type: 'search', userid, search:text}));
}

function deleteMarked() {
	let userid = sessionStorage.getItem('current');
	let itemFXML, deleteFXML;
	
	const fxml = new FXMLHttpRequest();
	fxml.open('GET', 'items');
	fxml.onload = function () {
		const markedArray = JSON.parse(fxml.responseText.body).filter((item) => item.marked === true);
		
		for (const item of markedArray) {
			itemFXML = new FXMLHttpRequest();
			itemFXML.open('GET', 'items');
			itemFXML.onload = function () {
				let itemid = JSON.parse(this.responseText.body)[0].itemid;
				deleteFXML = new FXMLHttpRequest()
				deleteFXML.open('DELETE', 'items');
				deleteFXML.onload = function() {
					updateList();
				}
				alertError(deleteFXML.send({userid, itemid}))
			}
			alertError(itemFXML.send({type: 'search', userid, search:item.text}))
		}
	};
	alertError(fxml.send({ type: 'list', userid: userid }));
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

function alertError (bool) {
	if (!bool) {
		alert('Something happened when attempting to reach the server. please try again')
	}
}