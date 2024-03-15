document.addEventListener("DOMContentLoaded", () => {
	feather.replace();

	const inputBook = document.getElementById("inputBook");
	inputBook.addEventListener("submit", (e) => {
		e.preventDefault();
		feather.replace();

		const submit = document.getElementById("book-submit").innerText;
		if (submit != "edit") {
			addTodo();
		}
	});
});

const books = [];
const RENDER_EVENT = "render-books";

function addTodo() {
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

function showBooks(booksObject) {
	const bookWrapper = document.createElement("div");
	bookWrapper.classList.add("book-wrapper");

	const book = document.createElement("div");
	book.classList.add("book");

	const bookTitle = document.createElement("h1");
	bookTitle.classList.add("book-title");
	bookTitle.innerText = booksObject.title;
	bookTitle.addEventListener("click", () => {});

	const bookAuthor = document.createElement("div");
	bookAuthor.classList.add("book-author");
	bookAuthor.innerText = booksObject.author;

	const bookYear = document.createElement("div");
	bookYear.classList.add("book-author");
	bookYear.innerText = booksObject.year;

	const icon = document.createElement("div");
	if (booksObject.isComplete) {
		icon.innerHTML = `
		<i data-feather="repeat" id="repeat" onclick="repeatBook(${booksObject.id})"></i>
		<i data-feather="trash-2" id="delete" onclick="deleteBook(${booksObject.id})"></i>
		<i data-feather="edit" id="edit" onclick="edit(${booksObject.id})"></i>
		`;
	} else {
		icon.innerHTML = `
		<i data-feather="check" id="done" onclick="completedBook(${booksObject.id})"></i>
		<i data-feather="trash-2" id="delete" onclick="deleteBook(${booksObject.id})"></i>
		<i data-feather="edit" id="edit" onclick="edit(${booksObject.id})"></i>
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
		const bookElement = showBooks(book);
		if (book.isComplete) {
			completeBookShelfList.append(bookElement);
		} else inCompleteBookShelfList.append(bookElement);
		feather.replace();
	}
});

function completedBook(id) {
	for (const book of books) {
		if (book.id === id) {
			book.isComplete = true;
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function repeatBook(id) {
	for (const book of books) {
		if (book.id === id) {
			book.isComplete = false;
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(id) {
	for (const book of books) {
		if (book.id === id) {
			const index = getIndex(id);
			books.splice(index, 1);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

function getIndex(id) {
	for (const index in books) {
		if (books[index].id === id) {
			return index;
		}
	}
}

function edit(id) {
	for (const book of books) {
		if (book.id === id) {
			let bookTitle = document.getElementById("input-judul");
			bookTitle.value = book.title;
			let bookAuthor = document.getElementById("input-penulis");
			bookAuthor.value = book.author;
			let bookYear = document.getElementById("input-tahun");
			bookYear.value = book.year;
			let bookIsComplete = document.getElementById("done");
			bookIsComplete.checked = book.isComplete;
			let submit = (document.getElementById("book-submit").innerText = "edit");

			const inputBook = document.getElementById("inputBook");
			inputBook.addEventListener("submit", (e) => {
				e.preventDefault();
				book.title = bookTitle.value;
				book.author = bookAuthor.value;
				book.year = bookYear.value;
				book.isComplete = bookIsComplete.checked;
				document.dispatchEvent(new Event(RENDER_EVENT));
			});
		}
	}
}
