import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import React from "react";
import companies from "../data/companies.json";
import faq from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-20 px-5 sm:px-10 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50">
      {/* Title and Description */}
      <section className="text-center px-6">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-tight text-gray-800">
          Find your dream{" "}
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
            job with us
          </span>
        </h1>
        <p className="text-lg sm:text-xl mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover your next career opportunity with us. Whether you're looking
          for a job or posting a new one, we are here to help.
        </p>
      </section>

      {/* Find Jobs and Post Jobs Buttons */}
      <div className="flex justify-center gap-8 mt-10">
        <Link to="/JobListing">
          <Button
            size="xl"
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-all duration-300"
          >
            Find Jobs
          </Button>
        </Link>

        <Link to="/PostJobs">
          <Button
            variant="destructive"
            size="xl"
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300"
          >
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Carousel */}
      <div className="mt-16">
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full py-10"
        >
          <CarouselContent className="flex gap-12 justify-center items-center">
            {companies.map(({ name, id, path }) => {
              return (
                <CarouselItem key={id} className="flex-shrink-0">
                  <img
                    src={path}
                    alt={name}
                    className="h-12 sm:h-16 object-contain hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 px-6">
        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is an example card content. You can add more information
              here.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is another example card content. Customize it as needed.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Yet another card. You can add a description here or other relevant
              details.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Accordion for FAQs */}
      <section className="mt-16">
        <Accordion type="single" collapsible>
          {faq.map((faq, index) => {
            return (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-xl font-medium hover:bg-teal-200 transition-all duration-300 p-4 rounded-md">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="p-4 text-gray-700 bg-gray-50 rounded-b-md">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
