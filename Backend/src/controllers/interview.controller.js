const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const { httpError } = require("../middlewares/error.middleware")

async function generateInterViewReportController(req, res) {

    const { selfDescription, jobDescription } = req.body

    if (!jobDescription || !jobDescription.trim()) {
        throw httpError(400, "Job description is required.")
    }

    // Either a resume file OR a self-description must be provided
    if (!req.file && (!selfDescription || !selfDescription.trim())) {
        throw httpError(400, "Please upload a resume or provide a self-description.")
    }

    let resumeText = ""
    if (req.file) {
        try {
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = parsed.text
        } catch (err) {
            console.error("PDF parsing failed:", err)
            throw httpError(400, "We couldn't read that PDF. Please make sure it isn't password-protected or corrupted, and try again.")
        }

        if (!resumeText || !resumeText.trim()) {
            throw httpError(400, "Your resume PDF appears to be empty or unreadable (e.g. a scanned image). Please try a text-based PDF, or use the self-description field instead.")
        }
    }

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        throw httpError(404, "Interview report not found.")
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    // BUG FIX: this used to be `findById(interviewReportId)` with no
    // ownership check, meaning ANY logged-in user could download ANY
    // other user's tailored resume just by guessing/incrementing an id
    // (an IDOR vulnerability). Scoping the query to req.user.id closes it.
    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

    if (!interviewReport) {
        throw httpError(404, "Interview report not found.")
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
