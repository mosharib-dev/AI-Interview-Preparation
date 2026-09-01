const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/services/ai.service");

describe("POST /api/auth/register", () => {
    test("rejects a request with missing fields", async () => {
        const res = await request(app).post("/api/auth/register").send({ email: "a@a.com" });
        expect(res.status).toBe(400);
    });

    test("rejects an invalid email address", async () => {
        const res = await request(app).post("/api/auth/register").send({ username: "validuser", email: "not-an-email", password: "password123" });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/valid email/i);
    });

    test("rejects a password shorter than 8 characters", async () => {
        const res = await request(app).post("/api/auth/register").send({ username: "validuser", email: "valid@test.com", password: "short" });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/8 characters/i);
    });

    test("registers a new user successfully and sets an auth cookie", async () => {
        const res = await request(app).post("/api/auth/register").send({ username: "johndoe", email: "john@test.com", password: "password123" });
        expect(res.status).toBe(201);
        expect(res.body.user.username).toBe("johndoe");
        expect(res.body.user.password).toBeUndefined();
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("rejects a duplicate email", async () => {
        await request(app).post("/api/auth/register").send({ username: "userone", email: "dupe@test.com", password: "password123" });
        const res = await request(app).post("/api/auth/register").send({ username: "usertwo", email: "dupe@test.com", password: "password123" });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/already exist/i);
    });
});

describe("POST /api/auth/login", () => {
    beforeEach(async () => {
        await request(app).post("/api/auth/register").send({ username: "loginuser", email: "login@test.com", password: "password123" });
    });

    test("fails with a wrong password", async () => {
        const res = await request(app).post("/api/auth/login").send({ email: "login@test.com", password: "wrongpassword" });
        expect(res.status).toBe(401);
        expect(res.headers["set-cookie"]).toBeUndefined();
    });

    test("fails with an email that doesn't exist", async () => {
        const res = await request(app).post("/api/auth/login").send({ email: "doesnotexist@test.com", password: "password123" });
        expect(res.status).toBe(401);
    });

    test("succeeds with correct credentials", async () => {
        const res = await request(app).post("/api/auth/login").send({ email: "login@test.com", password: "password123" });
        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("login@test.com");
        expect(res.headers["set-cookie"]).toBeDefined();
    });
});

describe("GET /api/auth/getme", () => {
    test("rejects an unauthenticated request", async () => {
        const res = await request(app).get("/api/auth/getme");
        expect(res.status).toBe(401);
    });

    test("returns the current user when authenticated", async () => {
        const registerRes = await request(app).post("/api/auth/register").send({ username: "meuser", email: "me@test.com", password: "password123" });
        const res = await request(app).get("/api/auth/getme").set("Cookie", registerRes.headers["set-cookie"]);
        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("me@test.com");
    });
});

describe("GET /api/auth/logout", () => {
    test("clears the auth cookie", async () => {
        const registerRes = await request(app).post("/api/auth/register").send({ username: "logoutuser", email: "logout@test.com", password: "password123" });
        const res = await request(app).get("/api/auth/logout").set("Cookie", registerRes.headers["set-cookie"]);
        expect(res.status).toBe(200);

        const meRes = await request(app).get("/api/auth/getme").set("Cookie", registerRes.headers["set-cookie"]);
        expect(meRes.status).toBe(401);
    });
});