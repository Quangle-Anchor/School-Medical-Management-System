import React from "react";
import { Button, Card } from "antd";
import Navbar from "../../components/Navbar";

const SERVICES = [
  {
    title: "Regular Health Checkups",
    description: "Comprehensive annual health monitoring for students.",
  },
  {
    title: "Emergency First Aid",
    description: "Quick medical support in urgent situations.",
  },
  {
    title: "Mental Health Counseling",
    description: "Support students in overcoming stress and study pressure.",
  },
];

const ARTICLES = [
  {
    title: "5 Personal Hygiene Tips",
    description:
      "Guide students on maintaining personal hygiene to prevent illness.",
    tips: [
      "Wash hands with soap and clean water for at least 20 seconds.",
      "Keep nails trimmed and clean regularly.",
      "Bathe daily and wear clean clothes.",
      "Cover your mouth when coughing or sneezing with a tissue or elbow.",
      "Do not share towels or toothbrushes with others.",
    ],
  },
  {
    title: "5 Signs of Stress",
    description: "How to recognize and help students cope with stress.",
    tips: [
      "Persistent feelings of anxiety or restlessness.",
      "Difficulty sleeping or poor sleep quality.",
      "Loss of interest in daily activities.",
      "Changes in appetite or eating habits.",
      "Difficulty concentrating and forgetfulness.",
    ],
  },
];

const HomePage = () => {
  return (
    <div className="bg-gray-100 font-sans">

      {/* Hero Section */}
      <section className="bg-blue-100 flex h-[400px]">
        <div className="w-1/2 flex flex-col justify-center px-20">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            School Health Services
          </h2>
          <p className="text-lg text-gray-700 max-w-lg">
            Ensuring a safe and healthy learning environment for all students.
            We provide regular health checkups, emergency first aid, mental
            health counseling, and health education programs to support
            comprehensive student development.
          </p>
        </div>
        <div className="w-1/2 h-full">
          <img
            src="https://edulinkvn.com/Upload/Articles/Photos/main-slider-1.jpg"
            alt="School Health Services"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((svc) => (
              <Card key={svc.title} className="p-6 text-center shadow-md">
                <h4 className="text-xl font-semibold mb-2">{svc.title}</h4>
                <p className="text-gray-600 mb-4">{svc.description}</p>
                <ul className="text-left list-disc list-inside text-gray-700">
                  <li>Operating hours: 08:00 AM - 04:00 PM</li>
                  <li>Applicable for all students</li>
                  <li>Location: School Health Office</li>
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Health Knowledge
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ARTICLES.map((art) => (
              <Card key={art.title} className="p-6 shadow-md">
                <h4 className="text-xl font-semibold mb-2">{art.title}</h4>
                <p className="text-gray-600 mb-4">{art.description}</p>
                <ul className="list-decimal list-inside mb-4 text-gray-700">
                  {art.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
