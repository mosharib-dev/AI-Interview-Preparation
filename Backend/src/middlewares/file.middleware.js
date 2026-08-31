const multer = require("multer")

// NOTE: the resume-parsing service (ai.service.js) only knows how to read
// PDFs (via pdf-parse). The old version of this middleware accepted any
// file type — including the .docx the frontend advertised — which meant a
// .docx upload would slip past validation and crash later on
// `pdfParse(...)`. We now reject non-PDF uploads here, up front, with a
// clear message instead of letting them blow up deeper in the request.
const ALLOWED_MIME_TYPES = new Set(["application/pdf"])

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB — matches what the UI tells the user
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            const err = new Error("Only PDF resumes are supported right now. Please upload a .pdf file, or use the self-description field instead.")
            err.statusCode = 400
            return cb(err)
        }
        cb(null, true)
    }
})

module.exports = upload
