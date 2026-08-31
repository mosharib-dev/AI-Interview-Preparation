import { createContext,useState } from "react";


const InterviewContext = createContext();

export { InterviewContext };

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [error, setError] = useState(null)
    // BUG FIX: downloading a resume PDF used to share the same `loading`
    // flag as fetching/generating a report, which made the "Download
    // Resume" button unmount the entire report page and replace it with
    // the full-screen loading spinner. It now gets its own flag.
    const [downloading, setDownloading] = useState(false)

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports, error, setError, downloading, setDownloading }}>
            {children}
        </InterviewContext.Provider>
    )
}
