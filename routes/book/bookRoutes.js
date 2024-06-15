const express = require('express');
const { addBook, getBooks, deleteBook, editBook, getBook } = require('./bookController');

const router = express.Router();

router.post('/books', addBook);
router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.put('/books/:id', editBook);
router.delete('/books/:id', deleteBook);

module.exports = router;