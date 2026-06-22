import {useContext, useEffect} from 'react';
import { InterviewContext } from '../interview.context';
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf } from '../services/interivew.api';
import { useParams } from 'react-router';


export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams()   // yeh hum isliye kr rhe h kyunki jb hum page reload kr rhe h toh phir error aa jaata h kyunki saara data chla jaata h, isliye hume ise rehydrate krna padega
 
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport; 
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try{
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf"}))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        } 
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        if (interviewId) {
          getReportById(interviewId)
        } else {
            getReports()
        }
      }, [interviewId])
    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}



