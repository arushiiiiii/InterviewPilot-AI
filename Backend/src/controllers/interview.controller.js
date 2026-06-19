const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const InterviewReport = require("../models/interviewReport.model")


/**
 * @description Controller to generate interview report based on user self desription, resume and job description.
 */
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


/**
 * @description Controller to get interview report by interviewId. 
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await InterviewReport.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched succesfully.",
        interviewReport
    })
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await InterviewReport.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -behaviouralQuestions -technicalQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController} 