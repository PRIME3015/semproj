import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use_fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .string()
    .regex(/^\d+$/, { message: "Experience must be a number" })
    .transform(Number)
    .refine((num) => num >= 0, { message: "Experience must be at least 0" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post-Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .instanceof(FileList)
    .refine(
      (file) =>
        file?.length &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      {
        message: "Resume must be in PDF or Word format",
      }
    ),
});

const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "Applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title || "this position"} at{" "}
            {job?.companies?.name || "the company"}
          </DrawerTitle>
          <DrawerDescription>Submit the form below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Label htmlFor="experience">Experience (in years)</Label>
          <Input
            id="experience"
            type="number"
            placeholder="Experience in Years"
            className="flex-1"
            {...register("experience")}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <Label htmlFor="skills">Skills</Label>
          <Input
            id="skills"
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Label>Education</Label>
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post-Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post-Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Label htmlFor="resume">Resume</Label>
          <Controller
            name="resume"
            control={control}
            render={({ field }) => (
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="flex-1 file:text-gray-500"
                onChange={(e) => field.onChange(e.target.files)}
              />
            )}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}

          {errorApply && (
            <p className="text-red-500">
              {errorApply.message || "Something went wrong. Please try again."}
            </p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <div className="flex gap-4">
            <Button type="submit" variant="blue" size="lg">
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
