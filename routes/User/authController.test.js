const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register, login } = require("./authController");
const User = require("../../models/auth/user");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../models/auth/user");

describe("Auth Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should register a new user", async () => {
            const req = { body: { username: "testUser", password: "testPassword" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const newUser = { id: 1 };
            User.create.mockResolvedValue(newUser);
            bcrypt.hash.mockResolvedValue("hashedPassword");

            await register(req, res);

            expect(User.create).toHaveBeenCalledWith({
                username: "testUser",
                password: "hashedPassword",
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User created",
                userId: newUser.id,
            });
        });

        it("should handle registration errors", async () => {
            const req = { body: { username: "testUser", password: "testPassword" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const errorMessage = "Registration failed";
            User.create.mockRejectedValue(new Error(errorMessage));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe("login", () => {
        it("should login a user with valid credentials", async () => {
            const req = { body: { username: "testUser", password: "testPassword" } };
            const res = {
                json: jest.fn(),
            };
            const user = { id: 1, username: "testUser", password: "hashedPassword" };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("jwtToken");

            await login(req, res);

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: user.id, username: req.body.username },
                process.env.JWT_SECRET,
                { expiresIn: "45m" }
            );
            expect(res.json).toHaveBeenCalledWith({ token: "jwtToken" });
        });

        it("should handle login with invalid username or password", async () => {
            const req = { body: { username: "testUser", password: "testPassword" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            User.findOne.mockResolvedValue(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid username or password",
            });
        });

        it("should handle login errors", async () => {
            const req = { body: { username: "testUser", password: "testPassword" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const errorMessage = "Internal server error";
            User.findOne.mockRejectedValue(new Error(errorMessage));

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});
