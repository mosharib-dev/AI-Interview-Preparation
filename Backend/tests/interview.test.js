const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/services/ai.service");

async function registerAndLogin(email) {
    const res = await request(app).post("/api/auth/register").send({ username: email.split("@")[0], email, password: "password123" });
    return res.headers["set-cookie"];
}

describe("POST /api/interview", () => {
    test("rejects an unauthenticated request", async () => {
        const res = await request(app).post("/api/interview").send({ jobDescription: "x", selfDescription: "y" });
        expect(res.status).toBe(401);
    });

    test("rejects a request with no job description", async () => {
        const cookie = await registerAndLogin("nojobdesc@test.com");
        const res = await request(app).post("/api/interview").set("Cookie", cookie).send({ selfDescription: "I am a developer" });
        expect(res.status).toBe(400);
    });

    test("rejects a request with neither a resume nor a self-description", async () => {
        const cookie = await registerAndLogin("noprofile@test.com");
        const res = await request(app).post("/api/interview").set("Cookie", cookie).send({ jobDescription: "Senior Engineer" });
        expect(res.status).toBe(400);
    });

    test("generates a report successfully with a self-description", async () => {
        const cookie = await registerAndLogin("gooduser@test.com");
        const res = await request(app).post("/api/interview").set("Cookie", cookie).send({
            jobDescription: "Senior Backend Engineer, Node.js, MongoDB",
            selfDescription: "3 years experience with Node.js and Express",
        });
        expect(res.status).toBe(201);
        expect(res.body.interviewReport.matchScore).toBe(82);
        expect(res.body.interviewReport.technicalQuestions).toHaveLength(1);
    });
});

describe("GET /api/interview  (list own reports)", () => {
    test("only returns the logged-in user's own reports", async () => {
        const cookieA = await registerAndLogin("lista@test.com");
        const cookieB = await registerAndLogin("listb@test.com");

        await request(app).post("/api/interview").set("Cookie", cookieA).send({ jobDescription: "Job A", selfDescription: "Profile A" });
        await request(app).post("/api/interview").set("Cookie", cookieB).send({ jobDescription: "Job B", selfDescription: "Profile B" });

        const res = await request(app).get("/api/interview").set("Cookie", cookieA);
        expect(res.status).toBe(200);
        expect(res.body.interviewReports).toHaveLength(1);
    });
});

describe("Ownership protection (IDOR)", () => {
    test("a user cannot fetch another user's interview report", async () => {
        const cookieA = await registerAndLogin("usera@test.com");
        const createRes = await request(app).post("/api/interview").set("Cookie", cookieA).send({ jobDescription: "Frontend Engineer", selfDescription: "React developer" });
        const reportId = createRes.body.interviewReport._id;

        const cookieB = await registerAndLogin("userb@test.com");
        const res = await request(app).get(`/api/interview/report/${reportId}`).set("Cookie", cookieB);
        expect(res.status).toBe(404);
    });

    test("a user cannot download another user's resume PDF", async () => {
        const cookieA = await registerAndLogin("usera2@test.com");
        const createRes = await request(app).post("/api/interview").set("Cookie", cookieA).send({ jobDescription: "Data Scientist", selfDescription: "Python and ML experience" });
        const reportId = createRes.body.interviewReport._id;

        const cookieB = await registerAndLogin("userb2@test.com");
        const res = await request(app).post(`/api/interview/resume/pdf/${reportId}`).set("Cookie", cookieB);
        expect(res.status).toBe(404);
    });

    test("a user CAN fetch their own report", async () => {
        const cookie = await registerAndLogin("ownreport@test.com");
        const createRes = await request(app).post("/api/interview").set("Cookie", cookie).send({ jobDescription: "DevOps Engineer", selfDescription: "AWS and Docker experience" });
        const reportId = createRes.body.interviewReport._id;

        const res = await request(app).get(`/api/interview/report/${reportId}`).set("Cookie", cookie);
        expect(res.status).toBe(200);
        expect(res.body.interviewReport._id).toBe(reportId);
    });
});