import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use_fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapPin } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/applyjob";
import Applicationcard from "./applicationcard";

const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(null); // Local state for hiring status

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
    error: jobError,
  } = useFetch(getSingleJob, { job_id: id });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  useEffect(() => {
    if (isLoaded) {
      fnJob();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (job) {
      setIsOpen(job?.isOpen);
    }
  }, [job]);

  const handleStatusChange = (value) => {
    const newStatus = value === "open";
    fnHiringStatus(newStatus).then(() => {
      setIsOpen(newStatus); // Update local state
      fnJob(); // Refetch job details to keep data consistent
    });
  };

  if (!isLoaded || loadingJob) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width="100%" />
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error fetching job details. Please try again later.
      </div>
    );
  }

  const jobDescription = job?.description || "No description available.";
  const jobRequirements =
    job?.requirements || "No specific requirements mentioned.";
  const jobBenefits = job?.benefits || "No benefits information provided.";
  const jobResponsibilities =
    job?.responsibilities || "No key responsibilities provided.";
  const applicationDeadline = job?.deadline
    ? new Date(job?.deadline).toLocaleDateString()
    : "Open until filled";

  const formattedDescription = `## ✨ Job Overview
${jobDescription}

## 🛠️ Required Skills
${jobRequirements}

## 💼 Benefits
${jobBenefits}

## 📅 Application Deadline
${applicationDeadline}`;

  return (
    <div className="flex flex-col gap-8 mt-8 p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl shadow-lg">
      {/* Job Title and Company Logo */}
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl text-gray-800">
          {job?.title || "Job Title"}
        </h1>
        {job?.companies?.logo_url && (
          <img
            src={job.companies.logo_url}
            className="h-16 rounded-lg shadow-lg"
            alt={job?.title || "Company Logo"}
          />
        )}
      </div>

      {/* Job Details */}
      <div className="flex justify-between items-center gap-6 flex-wrap p-4 bg-white rounded-xl shadow-md">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="text-blue-500" />
          <span>{job?.location || "Location not specified"}</span>
        </div>

        {/* Applicants */}
        <div className="flex items-center gap-2 text-gray-700">
          <Briefcase className="text-blue-500" />
          <span>{job?.application?.length || 0} Applicants</span>
        </div>

        {/* Job Status */}
        <div className="flex items-center gap-2 text-gray-700">
          {isOpen ? (
            <>
              <DoorOpen className="text-green-500" />
              <span className="text-green-600">Open</span>
            </>
          ) : (
            <>
              <DoorClosed className="text-red-500" />
              <span className="text-red-600">Closed</span>
            </>
          )}
        </div>
      </div>

      {/* Hiring Status */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7d7" />}

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full rounded-md text-white ${
              isOpen
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <SelectValue
              placeholder={`Hiring Status ${
                isOpen ? "( Open )" : "( Closed )"
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Job Description */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Job Description
        </h2>
        <MDEditor.Markdown
          source={formattedDescription}
          className="bg-transparent sm:text-lg text-gray-700"
        />
      </div>

      {/* Apply Job Section */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.application?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {/* Applications Section */}
      {job?.application?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Applications
          </h2>
          {job?.application?.map((application) => (
            <Applicationcard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Job;
