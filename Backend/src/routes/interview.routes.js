const {Router} = require("express")
const { authUser } = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller')
const upload = require("../middlewares/file.middleware")

const interviewRouter = Router();

interviewRouter.post("/", authUser, 
    upload.single("resume"), 
    interviewController.generateInterviewReportController)

module.exports = interviewRouter;