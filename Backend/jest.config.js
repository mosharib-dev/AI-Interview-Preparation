module.exports = {
    testEnvironment: "node",
    setupFiles: ["<rootDir>/tests/env.setup.js"],
    setupFilesAfterEnv: ["<rootDir>/tests/db.setup.js"],
    testTimeout: 20000,
    maxWorkers: 1,
};