import CreateApplications from '@/components/created-applications';
import CreatedJobs from '@/components/created-jobs';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { BarLoader } from 'react-spinners';

const MyJobs = () => {
  const { user, isLoaded, isSignedIn } = useUser(); // Extract 'isSignedIn' to check if the user is authenticated

  if (!isLoaded || !isSignedIn) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="#36d7d7" />
    );
  }

  // Conditional rendering based on the user's role
  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {isCandidate ? "My Applications" : "My Jobs"}
      </h1>

      {isCandidate ? <CreateApplications /> : <CreatedJobs />}
    </div>
  );
};

export default MyJobs;
