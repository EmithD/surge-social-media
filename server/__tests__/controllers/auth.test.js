import { signUp } from "../../controllers/auth/signup.controller";
import User from "../../models/user.model";
import { createUserWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({})),
    createUserWithEmailAndPassword: jest.fn(),
}));


jest.mock("../../models/user.model", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));


describe("signUp Controller", () => {

    let req, res;

    beforeEach(() => { //stubbing aka mocking

        req = {
            body: {
                username: "testuser",
                email: "test@example.com",
                fullName: "Test User",
                password: "password123",
                pfp: "http://test.com.lk/image.png",
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();

    });

    it("return 200 + create new", async () => {

        User.findOne.mockResolvedValueOnce(null);
        User.findOne.mockResolvedValueOnce(null);
        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: { uid: "firebaseUid123" },
        });

        User.create.mockResolvedValueOnce({
            toObject: () => ({
                username: "testuser",
                email: "test@example.com",
                fullName: "Test User",
                pfp: "https://this.link",
                firebaseUid: "firebaseUid123",
            }),
        });

        await signUp(req, res);
    });

    it("should return 500 if an error occurs", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Firebase error"));

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Firebase error" });
    });
});