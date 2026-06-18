const {Router} = require("express")
const { authUser } = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller')
const upload = require("../middlewares/file.middleware")

const interviewRouter = Router();


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user's self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authUser, 
    upload.single("resume"), 
    interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/
 * @description get all interview report of logged in user.
 * @access private
 */
interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController)

module.exports = interviewRouter;