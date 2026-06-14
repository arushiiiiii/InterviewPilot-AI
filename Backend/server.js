require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");
const { resume, selfDescription, jobDescription } = require("./src/services/temp")
const generateInterviewReport = require("./src/services/ai.service")

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Server error", error);
        throw error;
    })
    app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed! ", error);
})


// generateInterviewReport({resume, selfDescription, jobDescription})

