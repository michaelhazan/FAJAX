# <div align="center">FAJAX</div>

# <div align="center">Fake Asynchronous JavaScript and XML</div>

## <div align="center">Works completely client side and doesn't actually connect to the server. <br><br>Connect to your fake internet and change your fake database with your fake server!</div>

## [<div align="center">Check out this example.</div>](https://michaelh-hilma.github.io/FAJAX/)
---

# <div align="center">FAQ</div>

## Why?

### No reason, we were asked to build it so we did.

## What can it be used for?

### Nothing really, you can look into the code to "learn" how communication between server and client works...<br> but lets be real...<br> just learn nodejs.

## How does it work?

### Really? ok.

<br>

> [!WARNING]
> This repository was made on whim and will most likely never be updated, any issues will not be looked at.
> <br>Also this code is wanky af, be warned.
<h1 align="center">The Base</h1>

## [FXMLHttpRequest](./js/fajax.js)

### This class basically works exactly the same as XMLHttpRequest, without many of its features.

```js
	let fxml = new FXMLHttpRequest();
	// can be users / items at its base line, edit servers and databases as u want.
	fxml.open('GET', 'users');
	fxml.onload = () => {
		console.log(fxml.responseText);
		console.log('OMG LOOK AT THAT RESPONSE!');
	};
	// can contain the body of the message
	fxml.send();
```

<br>

<h1 align="center">The In Between</h1>


## [Network (the internet connection)](./js/network.js)

### The Network has a fake packet drop functionality, the send functions returns ${\color{red}false}$ if failed ${\color{greenyellow}true}$ if succeeded. 

```js
	const network = new Network();

	const userFXML = new FXMLHttpRequest();

	let success = network.send(new Message('GET', 'users', userFXML));

	if(success) console.log('Message sent!');
	else console.log('wompwomp message failed ;(');
```
<br>

<h1 align="center">The Backend</h1>


## [Servers](./js/server.js)

```js

	class exampleServer extends Server {
		/*
			There are 2 servers, 
			you can look at the way that they work with the link above
		*/
	}

```

## [Databases](./js/database.js)

```js

	/*
		There are 2 databases, 
		you can look at the way that they work with the link above
	*/

```
<h1 align="center">The Format</h1>

## [Objects](./js/objects.js)

```js

	let todoItem = new TodoItem('figure out a purpose for life.');

	let purposefound = confirm('is there a purpose?');
	if(purposefound) todoItem.checked = true;

```


```js

	let user = new User(
		'my-amazing-name',
		'my-super-secure-password', 
		'my-special-id'
	);
	
	let username = confirm('whats ur name cuh?');
	if(username !== user.username) return 'cuh aint him';

	let password = confirm('whats the pass cuh?');
	if(password === user.password) return 'cuh pretending';

```

```js

	let userFXML = new FXMLHttpRequest();

	let message = new Message('GET','users',userFXML);

	let network = new Network();

	message.body = {
		text: "my amazin message"
	}

	network.send(message);

```

Authors: [MikeyPants](https://github.com/MikeyPantsOn), [Jonathan-Arga](https://github.com/Jonathan-Arga)
