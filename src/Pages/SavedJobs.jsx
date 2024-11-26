import { getSavedJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use_fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard";

const SavedJobs = () => {
  const { isLoaded } = useUser();
  const [uniqueJobs, setUniqueJobs] = useState([]); // State to hold unique jobs

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    error,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (savedJobs) {
      const unique = savedJobs.filter(
        (job, index, self) =>
          index === self.findIndex((t) => t.job.id === job.job.id)
      );
      setUniqueJobs(unique);
    }
  }, [savedJobs]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7d7" />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error fetching saved jobs: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {uniqueJobs.length ? (
          uniqueJobs.map((saved) => (
            <JobCard
              key={saved.job.id}
              job={saved.job}
              saveInit={true}
              onJobSaved={fnSavedJobs}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No Saved Jobs Found
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
