import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

// Pulls a friendly message out of an axios error, falling back sensibly
// when the backend is unreachable or returns something unexpected.
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
    if (err?.response?.data?.message) return err.response.data.message
    if (err?.request && !err?.response) return "Can't reach the server. Please check your connection and try again."
    return fallback
}

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError, downloading, setDownloading } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            // BUG FIX: this function used to unconditionally
            // `return response.interviewReport` from outside the try block,
            // using a `response` variable that stayed `null` on failure —
            // guaranteed TypeError on any failed request (bad file, AI
            // timeout, 401, network drop, etc). Now we return the value
            // from inside the success path and rethrow on failure so the
            // caller (Home.jsx) can react instead of crashing.
            return response.interviewReport
        } catch (err) {
            setError(getErrorMessage(err, "Couldn't generate your interview report. Please try again."))
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            setReport(null)
            setError(getErrorMessage(err, "Couldn't load this interview report."))
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (err) {
            setError(getErrorMessage(err, "Couldn't load your saved interview plans."))
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setDownloading(true)
        setError(null)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }
        catch (err) {
            setError(getErrorMessage(err, "Couldn't generate the resume PDF. Please try again."))
            throw err
        } finally {
            setDownloading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId).catch(() => {}) // error already captured in context state
        } else {
            getReports().catch(() => {})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-run only when the route param changes
    }, [ interviewId ])

    return { loading, report, reports, error, downloading, generateReport, getReportById, getReports, getResumePdf }

}
