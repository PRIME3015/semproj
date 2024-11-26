import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, BriefcaseBusiness, Download } from "lucide-react";
import { School } from "lucide-react";
import useFetch from "@/hooks/use_fetch";
import { updateApplicationStatus } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    if (application?.resume) {
      const link = document.createElement("a");
      link.href = application.resume;
      link.target = "_blank";
      link.download = "resume"; // Optional: Sets a default download name
      document.body.appendChild(link); // Attach link to the DOM
      link.click();
      document.body.removeChild(link); // Clean up after the download
    } else {
      console.error("No resume found to download.");
    }
  };

  const {loading:loadingHiringStatus,fn:fnHiringStatus}=
  useFetch(
updateApplicationStatus,
{
  job_id:application.job_id,
}
  );

const handleStatusChange=(status)=>{
  fnHiringStatus(status);
}


  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7d7" />}
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-bold">
          {isCandidate
            ? `${application?.job?.title || "Job Title"} at ${
                application?.job?.companies?.name || "Company Name"
              }`
            : application?.name || "Candidate Name"}
          <Download
            size={18}
            className="text-black rounded-full h-8 w-8 p-2 cursor-pointer hover:bg-gray-200"
            onClick={handleDownload}
            aria-label="Download Resume"
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} Years of
            experience
          </div>

          <div className="flex gap-2 items-center">
            <School size={15} /> Education: {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status:{application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Group Discussion">Group Discussion</SelectItem>
              {/* <SelectItem value="closed">Closed</SelectItem> */}
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
