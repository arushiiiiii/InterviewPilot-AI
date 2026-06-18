const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { resume, jobDescription, selfDescription } = require("./temp");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// async function invokeGeminiAi(){
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: "Hello Gemini ! Explain what is an Interview ?"
//     })

//     console.log(response.text)
// }

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().min(10).describe("The technical question that can be asked in the interview"),
        intention: z.string().min(30).describe("The intention of interviewer behind asking this question"),
        answer: z.string().min(30).describe("A detailed model answer of at least 150 words. Explain concepts, approach, examples, common mistakes, and key talking points that the candidate should mention.")
    })).length(10).describe("Technical question that can be asked in the interview along with their intention and how to answer them."),
    behaviouralQuestions: z.array(z.object({
        question: z.string().min(10).describe("The behavioural question can be asked in the interview"),
        intention: z.string().min(30).describe("The intention of interviewer behind asking this question"),
        answer: z.string().min(30).describe("A detailed model answer of at least 150 words. Explain concepts, approach, examples, common mistakes, and key talking points that the candidate should mention.")
    })).length(5).describe("Behavioural question that can be asked in the interview along with their intention and how to"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("REQUIRED FIELD. Must be exactly one of: low, medium, high. Every skill gap must have a severity level.")
    })).min(3).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book, complete a certain topic or complete any lecture etc"),
    })).length(7).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
    

});
async function generateInterviewReport({resume, selfDescription, jobDescription}) {

    const prompt = `
    Return JSON in EXACTLY the following format:

{
  "title": string,
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behaviouralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ]
}

Do not use any other field names.
Do not use snake_case.
Use exactly the keys shown above.
You are an expert Technical Recruiter, Senior Hiring Manager, Interview Coach, and Career Mentor.

Your task is to evaluate a candidate's profile against a target job description and generate a comprehensive interview preparation report.

You must carefully analyze:

1. The candidate's resume.
2. The candidate's self-description.
3. The target job description.

Your goal is to identify how well the candidate fits the role, predict likely interview questions, identify skill gaps, and create a personalized preparation roadmap.

IMPORTANT RULES:

* Return ONLY valid JSON matching the provided schema.
* Do not include markdown.
* Do not include code fences.
* Do not include explanations outside the JSON.
* Populate every field in the schema.
* Ensure all arrays contain meaningful and useful entries.
* Generate realistic and role-specific content.
* Avoid generic career advice.
* Base all recommendations on the candidate profile and target role.

==================================================
CANDIDATE RESUME
================

${resume}

==================================================
CANDIDATE SELF DESCRIPTION
==========================

${selfDescription}

==================================================
TARGET JOB DESCRIPTION
======================

${jobDescription}

==================================================
REPORT REQUIREMENTS
===================

TITLE:

* Extract the most appropriate job title from the job description.
* Examples:
  - Frontend Developer
  - Software Engineer Intern
  - Backend Engineer
  - Full Stack Developer

MATCH SCORE:

* Generate a score between 0 and 100.
* Consider:

  * Technical skill alignment
  * Project relevance
  * Technology stack match
  * Educational background
  * Problem-solving ability
  * Leadership and extracurricular experience
  * Overall suitability for the role
* The score should be realistic and not overly optimistic.

TECHNICAL QUESTIONS:

* Generate exactly 10 technical interview questions.
* Questions should be tailored to:

  * Skills mentioned in the resume.
  * Technologies required in the job description.
  * Candidate projects.
  * Data Structures and Algorithms.
  * Databases, APIs, Backend Development, Frontend Development, System Design or Software Engineering concepts when relevant.
* For every question:

  * Explain the interviewer's intention.
  * Explain what topics the candidate should cover.
  * Provide a strong answer strategy.
  * Make answers detailed enough to guide preparation.

BEHAVIOURAL QUESTIONS:

* Generate exactly 5 behavioural interview questions.
* Focus on:

  * Leadership
  * Teamwork
  * Conflict resolution
  * Communication
  * Learning ability
  * Ownership
  * Problem solving
  * Project challenges
  * Time management
* For every question:

  * Explain interviewer intent.
  * Explain how to structure the answer.
  * Mention key points the candidate should discuss.

SKILL GAPS:

* Identify genuine missing or weak skills.
* Only include skills that matter for the target role.
* Do not invent irrelevant weaknesses.
* Assign severity:

  * high: critical missing skill likely to impact selection.
  * medium: important but learnable before interview.
  * low: useful improvement area but not critical.
* Include at least 3 skill gaps whenever possible.

PREPARATION PLAN:

* Create a personalized 7-day interview preparation plan.
* Day numbers must start from 1 and increase sequentially.
* Each day must have:

  * One clear focus area.
  * At least 3 actionable tasks.
* Tasks must be concrete and measurable.
* The plan should address:

  * Technical interview preparation.
  * DSA preparation.
  * Resume walkthrough preparation.
  * Project discussion preparation.
  * Behavioural interview preparation.
  * Mock interview practice.
  * Identified skill gaps.

QUALITY EXPECTATIONS:

* Be realistic.
* Be specific.
* Be personalized.
* Be practical.
* Be interview-focused.
* Make recommendations that would genuinely improve the candidate's chances of success.
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        // config: {
        //     responseMimeType: "application/json",
        //     responseSchema: zodToJsonSchema(interviewReportSchema)
        // },   Not working in this case
    })

    const report = JSON.parse(response.text);
    const validatedReport = interviewReportSchema.parse(report);
    return validatedReport
    // console.log(validateReport);
    // return report
    
} 

module.exports = generateInterviewReport