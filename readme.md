# FAJAX

# Fake Asynchronous JavaScript and XML

## Works completely client side and doesn't actually connect to the server. <br>Connect to your fake internet and change your fake database with your fake server!

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

<br>

<div align="center">The Base</div>

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
## [Network (the internet connection)](./js/network.js)

## [Servers](./js/server.js)
## [Databases](./js/database.js)
## [Objects](./js/objects.js)
```js:js/object.js

```












Authors: [MikeyPants](https://github.com/MikeyPantsOn), [Jonathan-Arga](https://github.com/Jonathan-Arga)
