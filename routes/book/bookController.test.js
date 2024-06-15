const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const { addBook, editBook, getBooks, deleteBook, getBook } = require('./bookController');
const Book = require('../../models/book/book'); // Adjust this import based on your project structure

const app = express();
app.use(bodyParser.json());

app.post('/books', addBook);
app.put('/books/:id', editBook);
app.get('/books', getBooks);
app.get('/books/:id', getBook);
app.delete('/books/:id', deleteBook);

jest.mock('../../models/book/book');

describe('Book Controller', () => {
    describe('addBook', () => {
        it('should add a new book', async () => {
            const bookData = { title: 'Test Book', author: 'Test Author' };
            Book.create.mockResolvedValue(bookData);

            const response = await request(app).post('/books').send(bookData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(bookData);
        });

        it('should return 400 if there is an error', async () => {
            Book.create.mockRejectedValue(new Error('Failed to create'));

            const response = await request(app).post('/books').send({ title: 'Test Book' });

            expect(response.status).toBe(400);
            expect(response.text).toBe('Failed to create');
        });
    });

    describe('editBook', () => {
        it('should edit an existing book', async () => {
            const bookData = { title: 'Updated Book', author: 'Updated Author' };
            Book.update.mockResolvedValue([1]);
            Book.findOne.mockResolvedValue(bookData);

            const response = await request(app).put('/books/1').send(bookData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(bookData);
        });

        it('should return 404 if the book is not found', async () => {
            Book.update.mockResolvedValue([0]);

            const response = await request(app).put('/books/1').send({ title: 'Updated Book' });

            expect(response.status).toBe(404);
            expect(response.text).toBe('Book not found');
        });

        it('should return 400 if there is an error', async () => {
            Book.update.mockRejectedValue(new Error('Failed to update'));

            const response = await request(app).put('/books/1').send({ title: 'Updated Book' });

            expect(response.status).toBe(400);
            expect(response.text).toBe('Failed to update');
        });
    });

    describe('getBooks', () => {
        it('should retrieve all books', async () => {
            const books = [{ title: 'Test Book', author: 'Test Author' }];
            Book.findAll.mockResolvedValue(books);

            const response = await request(app).get('/books');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(books);
        });

        it('should return 500 if there is an error', async () => {
            Book.findAll.mockRejectedValue(new Error('Failed to fetch'));

            const response = await request(app).get('/books');

            expect(response.status).toBe(500);
            expect(response.text).toBe('Failed to fetch');
        });
    });

    describe('deleteBook', () => {
        it('should delete a book', async () => {
            Book.destroy.mockResolvedValue(1);

            const response = await request(app).delete('/books/1');

            expect(response.status).toBe(200);
            expect(response.text).toBe('The item is deleted successfully');
        });

        it('should return 500 if there is an error', async () => {
            Book.destroy.mockRejectedValue(new Error('Failed to delete'));

            const response = await request(app).delete('/books/1');

            expect(response.status).toBe(500);
            expect(response.text).toBe('Failed to delete');
        });
    });
    describe("getBook", () => {
        it("should get a book by ID", async () => {
            const req = { params: { id: 1 } };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };
            const book = { id: 1, title: "Test Book", author: "Test Author" };
            Book.findByPk.mockResolvedValue(book);

            await getBook(req, res);

            expect(Book.findByPk).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(book);
        });

        it("should return 404 if book is not found", async () => {
            const req = { params: { id: 1 } };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };
            Book.findByPk.mockResolvedValue(null);

            await getBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });

        it("should handle errors", async () => {
            const req = { params: { id: 1 } };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };
            const errorMessage = "Internal server error";
            Book.findByPk.mockRejectedValue(new Error(errorMessage));

            await getBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});
