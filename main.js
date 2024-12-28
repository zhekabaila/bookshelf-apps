const books = []
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'books'

function generateId() {
  return +new Date()
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem
    }
  }
  return null
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index
    }
  }
  return -1
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage')
    return false
  }
  return true
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if (data !== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject

  const container = document.createElement('article')
  container.classList.add('book_item')

  const textTitle = document.createElement('h3')
  textTitle.innerText = title

  const textAuthor = document.createElement('p')
  textAuthor.innerText = author

  const textYear = document.createElement('p')
  textYear.innerText = year

  const actionContainer = document.createElement('div')
  actionContainer.classList.add('action')

  const trashButton = document.createElement('button')
  trashButton.innerText = 'Hapus buku'
  trashButton.classList.add('red')
  trashButton.addEventListener('click', function () {
    removeBook(id)
  })

  actionContainer.append(trashButton)

  container.append(textTitle, textAuthor, textYear, actionContainer)
  container.setAttribute('id', `todo-${id}`)

  if (isCompleted) {
    const undoButton = document.createElement('button')
    undoButton.innerText = 'undo'
    undoButton.classList.add('green')
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id)
    })
    actionContainer.append(undoButton)
  } else {
    const checkButton = document.createElement('button')
    checkButton.classList.add('green')
    checkButton.innerText = 'check'
    checkButton.addEventListener('click', function () {
      addBookToComplete(id)
    })

    actionContainer.append(checkButton)
  }

  return container
}

function checkIfChecked() {
  const isCompleted = document.getElementById('inputBookIsComplete')

  isCompleted.checked = false // memberikan nilai default false pada checkbox
  isCompleted.addEventListener('change', function (event) {
    if (event.target.checked) {
      document.getElementById('submitTextStatus').innerText =
        'Sudah selesai dibaca'
    } else {
      document.getElementById('submitTextStatus').innerText =
        'Belum selesai dibaca'
    }
  })
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value
  const author = document.getElementById('inputBookAuthor').value
  const year = document.getElementById('inputBookYear').value
  const isCompleted = document.getElementById('inputBookIsComplete').checked

  const parsedYear = Number(year)

  const generatedID = generateId()
  const todoObject = generateBookObject(
    generatedID,
    title,
    author,
    parsedYear,
    isCompleted
  )
  books.push(todoObject)
  console.log(books)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId)

  if (bookTarget == null) return

  bookTarget.isCompleted = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function removeBook(bookId) {
  const todoTarget = findBookIndex(bookId)

  if (todoTarget === -1) return

  books.splice(todoTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId)
  if (bookTarget == null) return

  bookTarget.isCompleted = false

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

document.addEventListener('DOMContentLoaded', function () {
  const searchBookForm = document.getElementById('searchBook')
  const submitForm = document.getElementById('inputBook')

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault()
    addBook()
  })

  if (isStorageExist()) {
    loadDataFromStorage()
  }
})

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.')
})

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    'incompleteBookshelfList'
  )
  const completeBookshelfList = document.getElementById('completeBookshelfList')

  // clearing list item
  incompleteBookshelfList.innerHTML = ''
  completeBookshelfList.innerHTML = ''

  for (const book of books) {
    const todoElement = makeBook(book)
    if (book.isCompleted) {
      completeBookshelfList.append(todoElement)
    } else {
      incompleteBookshelfList.append(todoElement)
    }
  }
})

checkIfChecked()
