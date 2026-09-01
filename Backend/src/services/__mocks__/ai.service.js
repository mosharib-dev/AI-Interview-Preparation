module.exports = {
    generateInterviewReport: jest.fn().mockResolvedValue({
        technicalQuestions: [{ question: "Explain closures", intention: "test", answer: "test answer" }],
        behavioralQuestions: [{ question: "Tell me about a challenge", intention: "test", answer: "test answer" }],
        matchScore: 82,
        skillGaps: [{ skill: "TypeScript", severity: "medium" }],
        preparationPlan: [{ day: 1, focus: "Basics", tasks: ["Review fundamentals"] }],
    }),
    generateResumePdf: jest.fn().mockResolvedValue(Buffer.from("fake-pdf-content")),
};