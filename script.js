const prompt = document.getElementById('prompt');
const cancelBtn = document.querySelector('#cancelBtn');
const newBook = document.querySelectorAll('#newBook');
const library = document.querySelector('#library');
const darkBackground = document.querySelector('.dark-background');

// Book Constructors --------------------------------

const title = document.querySelector('#title');
const author = document.querySelector('#author');
const language = document.querySelector('#language');
const pages = document.getElementById('pages');
const haveRead = document.querySelectorAll('input[type="radio"][name="read"]');
const confirmBtn = document.querySelector('#confirmBtn');
const newBookElements = document.querySelectorAll('#newBook');



function createBook (title, author, language, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.language = language;
    this.pages = pages;
    this.haveRead = haveRead;
}

// Show Prompt

function addButton() {
    const bookCards = document.querySelectorAll('.book-card');
    if (bookCards.length === 0 && !document.querySelector('.book-add-card')) {
        newBookElements.forEach(book => {
            book.addEventListener('click', () => {
                book.style.display = 'none';
                prompt.style.display = 'block';
                prompt.style.opacity = '1';
                darkBackground.style.display = 'block';
            });
        });
        addBookCard();
    }
}

// Hide Prompt
cancelBtn.addEventListener('click', () => {
    darkBackground.style.display = 'none';
    prompt.style.display = 'none';
    if (!document.querySelector('.book-add-card')) {
        newBookElements.forEach(book => {
            book.style.display = 'block';
        });
    }
});



addButton();

confirmBtn.addEventListener('click', () => {
    const haveReadValue = document.querySelector('input[type="radio"][name="read"]:checked').value;
    const newBook = new createBook(title.value, author.value, language.value, pages.value, haveReadValue);
    console.log(newBook);
    prompt.style.display = 'none';
    darkBackground.style.display = 'none';

    const newBookCard = document.createElement('div');
    newBookCard.classList.add('book-card');
    newBookCard.innerHTML = `
    <div class="card-header">
        <h1><img src="/Assets/title.svg">${newBook.title}</h1>
    </div>
    <hr class="card-divider">
    <div class="card-body">
        <h2><img src="/Assets/author.svg">${newBook.author}</h2>
        <h2><img src="/Assets/language.svg">${newBook.language}</h2>
        <h2><img src="/Assets/pages.svg">${newBook.pages} pages</h2>
        <button class="card-read" id="card-read" type="button"><img src="/Assets/read.svg"></button>
        <button class="delete-btn" id="delete-btn" type="button"><img src="/Assets/delete.svg"></button>
`;

    const readBtn = newBookCard.querySelector('.card-read');
    if (newBook.haveRead === 'Yes') {
        readBtn.innerHTML = '<img src="/Assets/read.svg">';
        readBtn.classList.add('card-read');
        readBtn.classList.remove('card-notRead');
    } else {
        readBtn.innerHTML = '<img src="/Assets/notRead.svg">';
        readBtn.classList.add('card-notRead');
        readBtn.classList.remove('card-read');
    }

    readBtn.addEventListener('click', () => {
        if (newBook.haveRead === 'Yes') {
            newBook.haveRead = 'No';
            readBtn.innerHTML = '<img src="/Assets/notRead.svg">';
            readBtn.classList.remove('card-read');
            readBtn.classList.add('card-notRead');
            return newBook.haveRead;
        } else {
            newBook.haveRead = 'Yes';
            readBtn.innerHTML = '<img src="/Assets/read.svg">';
            readBtn.classList.remove('card-notRead');
            readBtn.classList.add('card-read');
            return newBook.haveRead;
        }
    });


library.appendChild(newBookCard);

const deleteBtn = newBookCard.querySelector('.delete-btn');
deleteBtn.addEventListener('click', () => {
    library.removeChild(newBookCard);
});

if (!document.querySelector('.book-add-card')) {
    addBookCard();
}


saveCardsToLocalStorage();

return newBook;

});

function addBookCard() {
    if (!document.querySelector('.book-add-card')) {
        const insertBookCard = document.createElement('div');
        insertBookCard.classList.add('book-add-card');
        insertBookCard.innerHTML = `
            <img src="/Assets/add.svg" id="add-icon">
            <button type="button" id="add-btn"><img src="/Assets/add-book.svg">Add book</button>
        `;
        
        library.appendChild(insertBookCard);
        
        const addBookCard = insertBookCard.querySelector('#add-btn');
        addBookCard.addEventListener('click', () => {
            prompt.style.display = 'block';
            prompt.style.opacity = '1';
            darkBackground.style.display = 'block';
        });
        
        darkBackground.style.display = 'none';

        const firstNonBookCard = Array.from(library.children).find(child => !child.classList.contains('book-card'));
        if (firstNonBookCard) {
            library.insertBefore(insertBookCard, firstNonBookCard);
        } else {
            library.appendChild(insertBookCard);
        }
        
        return insertBookCard;
    }
}



// Menu 1 --------------------------------

const filterAll = document.querySelector('#filterAll');
const filterHaveRead = document.querySelector('#filterHaveRead');
const filterWannaRead = document.querySelector('#filterWannaRead');

filterAll.addEventListener('click', () => {
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        card.style.display = 'block';
    });
});

filterHaveRead.addEventListener('click', () => {
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        if (card.querySelector('.card-read')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
})

filterWannaRead.addEventListener('click', () => {
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        if (card.querySelector('.card-notRead')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});


// Menu 2 --------------------------------

const filterTitle = document.querySelector('#filterTitle');
const filterAuthor = document.querySelector('#filterAuthor');

function sortCardsAlphabetically(cards) {
    return Array.from(cards).sort((a, b) => {
        const titleA = a.querySelector('.card-header h1').textContent.trim().toLowerCase();
        const titleB = b.querySelector('.card-header h1').textContent.trim().toLowerCase();
        return titleA.localeCompare(titleB);
    });
}

function sortAuthorsAlphabetically(authors){
    return Array.from(authors).sort((a, b) => {
        const authorA = a.querySelector('.card-body h2').textContent.trim().toLowerCase();
        const authorB = b.querySelector('.card-body h2').textContent.trim().toLowerCase();
        return authorA.localeCompare(authorB);
    });
}

filterTitle.addEventListener('click', () => {
    const cards = document.querySelectorAll('.book-card');
    const sortedCards = sortCardsAlphabetically(cards);
    const container = document.querySelector('#library');
    sortedCards.forEach(card => {
        card.style.display = 'block';
        container.appendChild(card);
    });
});

filterAuthor.addEventListener('click', () => {
    const authors = document.querySelectorAll('.book-card');
    const sortedAuthors = sortAuthorsAlphabetically(authors);
    const container = document.querySelector('#library');
    sortedAuthors.forEach(author => {
        author.style.display = 'block';
        container.appendChild(author);
    });
});


// Local Storage --------------------------------

function saveCardsToLocalStorage() {
    const cards = document.querySelectorAll('.book-card');
    const cardsData = Array.from(cards).map(card => {
        return {
            title: card.querySelector('.card-header h1').textContent.trim(),
            author: card.querySelector('.card-body h2').textContent.trim(),
            language: card.querySelector('.card-body h2:nth-of-type(2)').textContent.trim(),
            pages: card.querySelector('.card-body h2:nth-of-type(3)').textContent.trim(),
            haveRead: card.querySelector('.card-read') ? 'Yes' : 'No'
        };
    });
    localStorage.setItem('cards', JSON.stringify(cardsData));
}

function loadCardsFromLocalStorage() {
    const cardsData = JSON.parse(localStorage.getItem('cards'));
    if (cardsData) {
        cardsData.forEach(data => {
            const newBookCard = document.createElement('div');
            newBookCard.classList.add('book-card');
            newBookCard.innerHTML = `
                <div class="card-header">
                    <h1><img src="/Assets/title.svg">${data.title}</h1>
                </div>
                <hr class="card-divider">
                <div class="card-body">
                    <h2><img src="/Assets/author.svg">${data.author}</h2>
                    <h2><img src="/Assets/language.svg">${data.language}</h2>
                    <h2><img src="/Assets/pages.svg">${data.pages} pages</h2>
                    <button class="card-read" id="card-read" type="button"><img src="/Assets/read.svg"></button>
                    <button class="delete-btn" id="delete-btn" type="button"><img src="/Assets/delete.svg"></button>
            `;

            const readBtn = newBookCard.querySelector('.card-read');
            if (data.haveRead === 'Yes') {
                readBtn.innerHTML = '<img src="/Assets/read.svg">';
                readBtn.classList.add('card-read');
                readBtn.classList.remove('card-notRead');
            } else {
                readBtn.innerHTML = '<img src="/Assets/notRead.svg">';
                readBtn.classList.add('card-notRead');
                readBtn.classList.remove('card-read');
            }

            readBtn.addEventListener('click', () => {
                if (data.haveRead === 'Yes') {
                    data.haveRead = 'No';
                    readBtn.innerHTML = '<img src="/Assets/notRead.svg">';
                    readBtn.classList.remove('card-read');
                    readBtn.classList.add('card-notRead');
                } else {
                    data.haveRead = 'Yes';
                    readBtn.innerHTML = '<img src="/Assets/read.svg">';
                    readBtn.classList.remove('card-notRead');
                    readBtn.classList.add('card-read');
                }
                saveCardsToLocalStorage();
            });

            const deleteBtn = newBookCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                library.removeChild(newBookCard);
                saveCardsToLocalStorage();
            });

            library.appendChild(newBookCard);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCardsFromLocalStorage();
    addButton();
});
