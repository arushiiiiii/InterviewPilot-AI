const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const InterviewReport = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res){
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAI = await generateInterviewReport({resume:resumeContent.text, jobDescription, selfDescription})
    // console.log(interviewReportByAI)
    const interviewReport = await InterviewReport.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAI, //yeh destructure krke technical questions wagera dega
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}

module.exports = {generateInterviewReportController} 