const Book = require("../../models/book/book");

// Add a new book to the database
const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).send(book);
  } catch (error) {
    res.status(400).send("Failed to create");
  }
};

// Edit an existing book in the database by ID
const editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Book.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedBook = await Book.findOne({ where: { id } });
      res.status(200).send(updatedBook);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(400).send("Failed to update");
  }
};

// Retrieve all books from the database
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).send("Failed to fetch");
  }
};

// Delete a book from the database by ID
const deleteBook = async (req, res) => {
  try {
    await Book.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send("The item is deleted successfully");
  } catch (error) {
    res.status(500).send("Failed to delete");
  }
};

// Get a book by ID
const getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBook,
  editBook,
  getBooks,
  deleteBook,
  getBook,
};