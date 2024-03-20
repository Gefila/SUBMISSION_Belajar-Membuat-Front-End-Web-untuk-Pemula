const books = [];
const RENDER_EVENT = "render-books";
let edit = false;

document.addEventListener("DOMContentLoaded", () => {
	feather.replace();
	loadFromLocal();

	const inputBook = document.getElementById("inputBook");
	inputBook.addEventListener("submit", (e) => {
		feather.replace();

		const submit = document.getElementById("book-submit").innerText;
		if (submit != "EDIT") {
			addBook();
			inputBook.reset();
		} else {
			replace(bookEdit);
			edit = false;
			inputBook.reset();
		}
		e.preventDefault();
	});
	let button = document.getElementById("book-submit");
	const checkbox = document.getElementById("done");
	checkbox.addEventListener("change", () => {
		if (!edit) {
			if (checkbox.checked) {
				button.innerText = "selesai dibaca";
			} else {
				button.innerText = "belum selesai dibaca";
			}
		}
	});
});

function addBook() {
	const bookTitle = document.getElementById("input-judul").value;
	const bookAuthor = document.getElementById("input-penulis").value;
	const bookYear = parseInt(document.getElementById("input-tahun").value);
	const bookIsComplete = document.getElementById("done").checked;

	const generatedID = generatedId();
	const bookObject = generateBookObject(
		generatedID,
		bookTitle,
		bookAuthor,
		bookYear,
		bookIsComplete
	);

	books.push(bookObject);

	saveToLocal();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function generatedId() {
	return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete,
	};
}

function makeBooks(booksObject) {
	const bookWrapper = document.createElement("div");
	bookWrapper.classList.add("book-wrapper");

	const book = document.createElement("div");
	book.classList.add("book");

	const bookTitle = document.createElement("h1");
	bookTitle.classList.add("book-title");
	bookTitle.innerText = booksObject.title;

	const bookAuthor = document.createElement("div");
	bookAuthor.classList.add("book-author");
	bookAuthor.innerText = `Author : ${booksObject.author}`;

	const bookYear = document.createElement("div");
	bookYear.classList.add("book-year");
	bookYear.innerText = booksObject.year;

	const icon = document.createElement("div");
	icon.classList.add("icon-wrapper");

	if (booksObject.isComplete) {
		icon.innerHTML = `
		<i data-feather="repeat" id="repeat" onclick="undoBookFromCompleted(${booksObject.id})"></i>
		<i data-feather="trash-2" id="delete" onclick="deleteBook(${booksObject.id})"></i>
		<i data-feather="edit" id="edit" onclick="editForm(${booksObject.id})"></i>
		`;
	} else {
		icon.innerHTML = `
		<i data-feather="check" id="done" onclick="addBookToCompleted(${booksObject.id})"></i>
		<i data-feather="trash-2" id="delete" onclick="deleteBook(${booksObject.id})"></i>
		<i data-feather="edit" id="edit" onclick="editForm(${booksObject.id})"></i>
		`;
	}

	book.append(bookTitle, bookAuthor, bookYear, icon);
	bookWrapper.appendChild(book);

	return bookWrapper;
}

document.addEventListener(RENDER_EVENT, () => {
	const inCompleteBookShelfList = document.getElementById(
		"inCompleteBookShelfList"
	);
	inCompleteBookShelfList.innerHTML = "";

	const completeBookShelfList = document.getElementById(
		"completeBookShelfList"
	);
	completeBookShelfList.innerHTML = "";

	for (const book of books) {
		const bookElement = makeBooks(book);
		if (book.isComplete) {
			completeBookShelfList.append(bookElement);
		} else inCompleteBookShelfList.append(bookElement);
		feather.replace();
	}
});

function findBook(bookId) {
	for (const book of books) {
		if (book.id === bookId) {
			return book;
		}
	}
	return null;
}

function getIndex(id) {
	for (const index in books) {
		if (books[index].id === id) {
			return index;
		}
	}
	return -1;
}

function addBookToCompleted(id) {
	const bookTarget = findBook(id);
	if (bookTarget == null) return;
	bookTarget.isComplete = true;
	saveToLocal();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoBookFromCompleted(id) {
	const bookTarget = findBook(id);
	if (bookTarget == null) return;
	bookTarget.isComplete = false;
	saveToLocal();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(id) {
	if (confirm("Hapus Buku ?")) {
		const index = getIndex(id);
		books.splice(index, 1);
		if (index === -1) return;
		saveToLocal();
		document.dispatchEvent(new Event(RENDER_EVENT));
	}
}

let bookEdit;

function editForm(id) {
	edit = true;
	const index = getIndex(id);
	bookEdit = books[index];

	let bookTitle = (document.getElementById("input-judul").value =
		bookEdit.title);
	let bookAuthor = (document.getElementById("input-penulis").value =
		bookEdit.author);
	let bookYear = (document.getElementById("input-tahun").value = bookEdit.year);
	let bookIsComplete = (document.getElementById("done").checked =
		bookEdit.isComplete);

	let button = (document.getElementById("book-submit").innerHTML = "EDIT");
}

function replace(book) {
	let bookTitle = document.getElementById("input-judul").value;
	let bookAuthor = document.getElementById("input-penulis").value;
	let bookYear = document.getElementById("input-tahun").value;
	let bookIsComplete = document.getElementById("done").checked;

	book.title = bookTitle;
	book.author = bookAuthor;
	book.year = bookYear;
	book.isComplete = bookIsComplete;

	saveToLocal();
	let button = (document.getElementById("book-submit").innerHTML =
		"belum selesai dibaca");
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
	if (typeof Storage === undefined) {
		alert("Browser kamu tidak mendukung local storage");
		return false;
	}
	return true;
}

function saveToLocal() {
	if (isStorageExist()) {
		localStorage.setItem("BOOK", JSON.stringify(books));
	}
}

function loadFromLocal() {
	const local = JSON.parse(localStorage.getItem("BOOK"));
	if (local !== null) {
		for (const book of local) {
			books.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

//FITUR SEARCH

const searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => {
	let value = searchBox.value.toLowerCase();
	search(value);
});

function search(searchInput) {
	const bookItems = document.getElementsByClassName("book-wrapper");
	for (let i = 0; i < bookItems.length; i++) {
		const itemTitle = bookItems[i].querySelector(".book-title");
		if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
			bookItems[i].classList.remove("hidden");
		} else {
			bookItems[i].classList.add("hidden");
		}
	}
}
