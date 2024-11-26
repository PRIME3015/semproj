import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/use_fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './JobCard';

const CreteadJobs = () => {


    const {user}=useUser();
    const {
        loading:loadingCreatedJobs,
        data:CreatedJobs,
        fn:fnCreatedJobs
    }=useFetch(getMyJobs,{
        recruiter_id:user.id
    });
    useEffect(()=>{
        fnCreatedJobs();

    },[]);

    if (loadingCreatedJobs) return <BarLoader/>
        
        
        return (
          <div>
            { (
              <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {CreatedJobs?.length ? (
                  CreatedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isMyJob
                     onJobSaved={fnCreatedJobs}
                    />
                  ))
                ) : (
                  <div>No Jobs Found</div>
                )}
              </div>
            )}
          </div>
        );
}

export default CreteadJobs;
