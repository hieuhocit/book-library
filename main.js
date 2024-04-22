class Book {
    constructor(title = "Unknown", author = "Unknown", pages = 0, isRead = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(newBook) {
        this.books.push(newBook);
    }

    getBook(title) {
        return this.books.filter(book => book.title === title);
    }

    removeBook(title) {
        this.books = this.books.filter((book) => book.title !== title);
    }

    isExists(newBook) {
        return this.books.some((book) => book.title === newBook.title);
    }

    getLength() {
        return this.books.length;
    }
}

const library = new Library();

const addBtn = document.querySelector("#add-book");
const overlay = document.querySelector(".overlay");
const form = document.querySelector("#form");
const errorMessage = document.querySelector(".error-message");

const title = document.querySelector("#title");
const pages = document.querySelector("#pages");
const author = document.querySelector("#author");
const isRead = document.querySelector("#is-read");
const bookContainer = document.querySelector(".library");

getBookFromLocalStorage();
library.books.forEach((book) => {
    displayBook(book);
});

// Form actions
addBtn.addEventListener("click", () => {
    overlay.style.display = "block";
    clearForm();
});

overlay.addEventListener("click", (e) => {
    if (!form.contains(e.target)) {
        overlay.style.display = "none";
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const book = new Book(title.value, author.value, pages.value, isRead.checked);
    if (!library.isExists(book)) {
        displayBook(book);
        library.addBook(book);
        storeBook();
        overlay.style.display = "none";
    } else {
        const keyframes = [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-200%)' }
        ];

        const animateOptions = {
            duration: 2000,
            easing: 'ease'
        };
        errorMessage.animate(keyframes, animateOptions);
    }

});


// LocalStorage
function storeBook() {
    localStorage.setItem("library", JSON.stringify(library.books));
}

function getBookFromLocalStorage() {
    const books = JSON.parse(localStorage.getItem("library"));
    if (books) {
        library.books = books.map((obj) => convertToBook(obj));
    } else {
        library.books = [];
    }
}

function convertToBook(obj) {
    return new Book(obj.title, obj.author, obj.pages, obj.isRead);
}

// Visually
function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) return element.parentElement;
        element = element.parentElement;
    }
}

function removeBookDisplay(e) {
    const book = getParent(e.target, ".book");
    library.removeBook(book.dataset.title);

    while (bookContainer.firstChild) {
        bookContainer.removeChild(bookContainer.firstChild);
    }
    library.books.forEach((book) => {
        displayBook(book);
    });

    storeBook();
}

function changStatus(e) {
    const book = library.getBook(getParent(e.target, ".book").dataset.title)[0];
    book.isRead = !book.isRead;

    storeBook();

    e.target.classList.toggle("read");
    e.target.textContent = e.target.className.includes("read") ? "Read" : "Not read";
}

function displayBook(book) {
    const container = document.createElement("div");
    const titleBook = document.createElement("h2");
    const nameAuthor = document.createElement("p");
    const pageBook = document.createElement("p");
    const btnContainer = document.createElement("div");
    const btnRemove = document.createElement("button");
    const btnStatus = document.createElement("button");

    container.className = "book";
    titleBook.className = "title-book";
    nameAuthor.className = "author-book";
    pageBook.className = "page-book";
    btnContainer.className = "btn-container";
    btnRemove.className = "btn";
    btnRemove.id = "remove";
    btnStatus.className = `btn ${book.isRead ? "read" : ""}`;
    btnStatus.id = "status";

    container.setAttribute("data-title", book.title);
    titleBook.textContent = book.title;
    nameAuthor.textContent = book.author;
    pageBook.textContent = book.pages;
    btnRemove.textContent = "remove";
    btnStatus.textContent = book.isRead ? "Read" : "Not read";

    btnRemove.addEventListener("click", removeBookDisplay);
    btnStatus.addEventListener("click", changStatus);

    btnContainer.appendChild(btnRemove);
    btnContainer.appendChild(btnStatus);
    container.appendChild(titleBook);
    container.appendChild(nameAuthor);
    container.appendChild(pageBook);
    container.appendChild(btnContainer);

    bookContainer.appendChild(container);
}

// Form
function clearForm() {
    title.value = "";
    pages.value = "";
    author.value = "";
    isRead.checked = false;
}