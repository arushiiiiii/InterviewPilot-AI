import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams } from "react-router";
import {
  Code2,
  MessageSquare,
  Navigation,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Left-nav sections
const SECTIONS = [
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
  { id: "roadmap", label: "Road Map", icon: Navigation },
];

// TODO: swap this out for the report fetched from your API
// (e.g. GET /api/interview-reports/:id). Shape mirrors the
// `interviewreports` collection: matchScore, technicalQuestions,
// behaviouralQuestions, skillGaps, preparationPlan.
// const mockReport = {
//   matchScore: 88,
//   technicalQuestions: [
//     {
//       question:
//         "Explain the Node.js event loop and how it handles asynchronous I/O operations.",
//       intention:
//         "To assess the candidate's deep understanding of Node.js internal architecture and non-blocking I/O.",
//       answer:
//         "The candidate should explain the different phases of the event loop (timers, pending callbacks, idle/prepare, poll, check, close). They should mention how Libuv handles the thread pool and how the callback queue works with the call stack to ensure performance without blocking the main thread.",
//     },
//     {
//       question:
//         "How do you optimize a MongoDB aggregation pipeline for high-volume data?",
//       intention:
//         "To assess the candidate's ability to write performant queries against large datasets.",
//       answer:
//         "The candidate should mention using indexes early in the pipeline, filtering with $match before $group or $sort, projecting only needed fields, and reviewing execution plans with .explain('executionStats') to spot full collection scans.",
//     },
//     {
//       question:
//         "Can you describe the Cache-Aside pattern and when you would use Redis in a Node.js application?",
//       intention:
//         "To assess the candidate's understanding of caching strategies and trade-offs.",
//       answer:
//         "The candidate should explain that the application checks the cache first, falls back to the database on a miss, then populates the cache for subsequent reads. Redis fits well for frequently read, rarely changing data such as session storage or computed results.",
//     },
//     {
//       question:
//         "What are the challenges of migrating a monolithic application to a modular service-based architecture?",
//       intention:
//         "To assess the candidate's awareness of distributed systems trade-offs.",
//       answer:
//         "The candidate should discuss data consistency across services, network latency, service discovery, distributed tracing, and the added operational overhead of deploying and monitoring multiple services.",
//     },
//   ],
//   behaviouralQuestions: [
//     {
//       question:
//         "TrueFoundry is a fast-paced startup working with cutting-edge AI infrastructure. Describe a time you had to learn a new technology quickly to deliver a project.",
//       intention:
//         "To assess the candidate's eagerness to learn, adaptability, and self-direction in ambiguous environments.",
//       answer:
//         "The candidate should use the STAR method: describe the Situation, the Task at hand, the Action taken to learn the new technology, and the Result achieved, emphasizing initiative and a structured learning approach.",
//     },
//     {
//       question:
//         "Tell us about a time you disagreed with a teammate on a technical decision. How did you handle it?",
//       intention:
//         "To assess communication style and the ability to resolve conflict constructively.",
//       answer:
//         "The candidate should show they listened to the other perspective, backed their position with data or trade-offs, and reached a resolution focused on the best outcome rather than 'winning' the argument.",
//     },
//     {
//       question:
//         "Describe a project where you had to manage competing priorities under a tight deadline.",
//       intention: "To assess prioritization skills and composure under pressure.",
//       answer:
//         "The candidate should describe how they assessed urgency and impact, communicated trade-offs to stakeholders, and adjusted scope or timeline where necessary.",
//     },
//   ],
//   skillGaps: [
//     { skill: "Message Queues (Kafka/RabbitMQ)", severity: "critical" },
//     { skill: "Advanced Docker & CI/CD Pipelines", severity: "high" },
//     { skill: "Distributed Systems Design", severity: "medium" },
//     { skill: "Production-level Redis management", severity: "low" },
//   ],
//   preparationPlan: [
//     {
//       day: 1,
//       focus: "Node.js Internals & Streams",
//       tasks: [
//         "Deep dive into the Event Loop phases and process.nextTick vs setImmediate.",
//         "Practice implementing Node.js Streams for handling large data sets.",
//       ],
//     },
//     {
//       day: 2,
//       focus: "Advanced MongoDB & Indexing",
//       tasks: [
//         "Study Compound Indexes, TTL Indexes, and Text Indexes.",
//         "Practice writing complex Aggregation pipelines and using the .explain('executionStats') method.",
//       ],
//     },
//     {
//       day: 3,
//       focus: "Caching & Redis Strategies",
//       tasks: [
//         "Read about Redis data types beyond strings (Sets, Hashes, Sorted Sets).",
//         "Implement a Redis-based rate limiter or a caching layer for a sample API.",
//       ],
//     },
//     {
//       day: 4,
//       focus: "System Design & Microservices",
//       tasks: [
//         "Study Microservices communication patterns (Synchronous vs Asynchronous).",
//         "Learn about the API Gateway pattern and Circuit Breakers.",
//       ],
//     },
//     {
//       day: 5,
//       focus: "Message Queues & DevOps Basics",
//       tasks: [
//         "Watch introductory tutorials on RabbitMQ or Kafka.",
//         "Dockerize a project and write a simple GitHub Actions workflow for CI.",
//       ],
//     },
//     {
//       day: 6,
//       focus: "Data Structures & Algorithms",
//       tasks: [
//         "Solve 5-10 Medium LeetCode problems focusing on Arrays, Strings, and Hash Maps.",
//         "Review common sorting and searching algorithms.",
//       ],
//     },
//     {
//       day: 7,
//       focus: "Mock Interview & Project Review",
//       tasks: [
//         "Conduct a mock interview focusing on explaining the Real-time Chat Application architecture.",
//         "Prepare concise summaries for all work experience bullets.",
//       ],
//     },
//   ],
// };

// Normalizes whatever severity string the backend sends into one of
// four buckets so the badge always gets a color.
const SEVERITY_ALIASES = {
  critical: "critical",
  high: "high",
  medium: "medium",
  moderate: "medium",
  low: "low",
  minor: "low",
};

const getSeverityClass = (severity = "") => {
  const key = SEVERITY_ALIASES[severity.toLowerCase()] || "medium";
  return `severity-${key}`;
};

const getMatchInfo = (score) => {
  if (score >= 80) {
    return { label: "Strong match for this role", className: "match-strong" };
  }
  if (score >= 60) {
    return { label: "Good match for this role", className: "match-good" };
  }
  if (score >= 40) {
    return {
      label: "Moderate match for this role",
      className: "match-moderate",
    };
  }
  return {
    label: "Needs more preparation for this role",
    className: "match-weak",
  };
};

const Interview = () => {
  // const [report] = useState(mockReport);
  const [activeSection, setActiveSection] = useState("technical");
  // Q1 starts expanded to mirror the reference design
  const [openQuestion, setOpenQuestion] = useState("tech-0");
  const {report, getReportById, loading} = useInterview()
  // const { interviewId } = useParams()   // yeh hum isliye kr rhe h kyunki jb hum page reload kr rhe h toh phir error aa jaata h kyunki saara data chla jaata h, isliye hume ise rehydrate krna padega

  if (loading) {
  return <h1>Loading...</h1>;
  }
  if (!report) {
    return <h1>No Report Found</h1>;
  }
  // useEffect(()=> {
  //   if (interviewId) {
  //     getReportById(interviewId)
  //   }
  // }, [interviewId])
  const toggleQuestion = (key) => {
    setOpenQuestion((prev) => (prev === key ? null : key));
  };

  // console.log(report);
  // console.log(report?.matchScore);
  const score = Number(report?.matchScore ?? 0);
  const matchInfo = getMatchInfo(score);
  const gaugeRadius = 54;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset =
    gaugeCircumference * (1 - score / 100);

  const renderQuestionList = (questions, prefix) => (
    <div className="questions-list">
      {questions?.map((q, index) => {
        const key = `${prefix}-${index}`;
        const isOpen = openQuestion === key;

        return (
          <div className={`question-card ${isOpen ? "open" : ""}`} key={key}>
            <button
              className="question-header"
              onClick={() => toggleQuestion(key)}
              aria-expanded={isOpen}
            >
              <span className="q-badge">Q{index + 1}</span>
              <span className="q-text">{q.question}</span>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isOpen && (
              <div className="question-body">
                <span className="tag intention-tag">Intention</span>
                <p className="body-text">{q.intention}</p>

                <span className="tag answer-tag">Model Answer</span>
                <p className="body-text">{q.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRoadmap = () => (
    <>
      <div className="content-header">
        <h2>Preparation Road Map</h2>
        <span className="count-badge">
          {report?.preparationPlan?.length}-day plan
        </span>
      </div>

      <div className="roadmap-timeline">
        {report?.preparationPlan?.map((dayPlan) => (
          <div className="roadmap-item" key={dayPlan.day}>
            <span className="roadmap-marker" />

            <div className="roadmap-content">
              <div className="day-row">
                <span className="day-badge">Day {dayPlan.day}</span>
                <h4>{dayPlan.focus}</h4>
              </div>

              <ul>
                {dayPlan.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <main className="interview">
      <div className="container">
        <div className="interview-layout">
          <aside className="sections-sidebar">
            <h3 className="sidebar-title">Sections</h3>

            <nav className="section-nav">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    className={`section-link ${isActive ? "active" : ""}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon size={16} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="main-content">
            {activeSection === "technical" && (
              <>
                <div className="content-header">
                  <h2>Technical Questions</h2>
                  <span className="count-badge">
                    {report?.technicalQuestions?.length} questions
                  </span>
                </div>
                {renderQuestionList(report?.technicalQuestions, "tech")}
              </>
            )}

            {activeSection === "behavioral" && (
              <>
                <div className="content-header">
                  <h2>Behavioral Questions</h2>
                  <span className="count-badge">
                    {report?.behaviouralQuestions?.length} questions
                  </span>
                </div>
                {renderQuestionList(report?.behaviouralQuestions, "behavioral")}
              </>
            )}

            {activeSection === "roadmap" && renderRoadmap()}
          </section>

          <aside className="insights-sidebar">
            <div className="insight-block">
              <h3 className="sidebar-title">Match Score</h3>

              <div className="score-gauge">
                <svg viewBox="0 0 130 130">
                  <circle className="gauge-track" cx="65" cy="65" r={gaugeRadius} />
                  <circle
                    className={`gauge-fill ${matchInfo.className}`}
                    cx="65"
                    cy="65"
                    r={gaugeRadius}
                    style={{
                      strokeDasharray: gaugeCircumference,
                      strokeDashoffset: gaugeOffset,
                    }}
                  />
                </svg>

                <div className="gauge-label">
                  <span className="gauge-value">{report?.matchScore}</span>
                  <span className="gauge-percent">%</span>
                </div>
              </div>

              <p className={`match-text ${matchInfo.className}`}>
                {matchInfo.label}
              </p>
            </div>

            <div className="insight-block">
              <h3 className="sidebar-title">Skill Gaps</h3>

              <div className="skill-list">
                {report?.skillGaps.map((gap) => (
                  <div
                    className={`skill-badge ${getSeverityClass(gap.severity)}`}
                    key={gap.skill}
                  >
                    {gap.skill}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Interview;
