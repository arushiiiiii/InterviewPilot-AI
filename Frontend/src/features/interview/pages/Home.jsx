import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

import {
  FileText,
  User,
  UploadCloud,
  Sparkles,
  Info,
} from "lucide-react";

const Home = () => {

  const { loading, generateReport, reports } = useInterview()

  const [jobDescription, setJobDescription] = useState("");
  // const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef()

  const navigate = useNavigate()
  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];
    if (!jobDescription.trim()) {
        alert("Job Description is required");
        return;
    }

    if (!resumeFile && !selfDescription.trim()) {
        alert(
            "Please upload a resume or provide a self description."
        );
        return;
    }

    const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
    });
    console.log("Generated data:", data)
    if (!data?._id) {
    alert("Failed to generate report");
    return;
}
    navigate(`/interview/${data._id}`)
  }

  return (
    <main className="home">
      <div className="container">

        <div className="header">
          <h1>
            Create Your Custom{" "}
            <span className="highlight">
              Interview Plan
            </span>
          </h1>

          <p className="subtitle">
            Let our AI analyze the job requirements and your unique profile
            to build a winning strategy.
          </p>
        </div>

        <div className="interview-input-group">

          <div className="section left">

            <div className="section-header">
              <FileText size={18} />
              <h2>Target Job Description</h2>

              <span className="badge required">
                REQUIRED
              </span>
            </div>

            <textarea
              id="jobDescription"
              placeholder='Paste the full job description here...
e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
            />

            <div className="char-count">
              {jobDescription.length} / 5000 chars
            </div>

          </div>

          <div className="section right">

            <div className="profile-header">
              <User size={18} />
              <h2>Your Profile</h2>
            </div>

            <div className="resume-section">

              <div className="resume-header">
                <span>Upload Resume</span>

                <span className="badge best-results">
                  BEST RESULTS
                </span>
              </div>

              <label
                htmlFor="resume"
                className="file-upload"
              >
                <UploadCloud size={38} />

                <p className="upload-text">
                  Click to upload or drag & drop
                </p>

                <p className="upload-subtext">
                  PDF or DOCX (Max 5MB)
                </p>
              </label>

              <input
                hidden
                type="file"
                id="resume"
                accept=".pdf,.docx"
                ref={resumeInputRef}
                // onChange={(e) =>
                //   setResume(
                //     e.target.files?.[0] || null
                //   )
                // }
              />

              {/* {resume && (
                <p className="file-selected">
                  ✓ {resume.name}
                </p>
              )} */}
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="description-section">

              <label htmlFor="selfDescription">
                Quick Self-Description
              </label>

              <textarea
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                value={selfDescription}
                onChange={(e) =>
                  setSelfDescription(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="info-box">
              <Info size={16} />

              <span>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong>{" "}
                is required to generate a personalized
                plan.
              </span>
            </div>

            <button 
            className="primary-button"
            onClick={handleGenerateReport}
            disabled={loading}
            >
              <Sparkles size={18} />
              {loading? "Generating...": "Generate My Interview Strategy"}

              {/* Generate My Interview Strategy */}
            </button>

          </div>
        </div>

        {/* Recent report list */}
        {reports?.length > 0 && (
          <section className="recent-reports">
            <h2>My Recent Interview Plans</h2>
            <ul className="reports-list">
              {reports.map(report => {
                return <li key={report._id} className="report-item" onClick={()=> navigate(`/interview/${report._id}`)}>
                  <div className="report-top">
                    <h3>{report.title || 'Untitled Position'}</h3>
                    <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                  </div>
                  <p className="report-meta">Generated on{" "} {new Date(report.createdAt).toLocaleDateString()}</p>
                </li>
              })}
            </ul>
          </section>
        )}

        <footer className="footer">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Help Center</a>
        </footer>

      </div>
    </main>
  );
};

export default Home;