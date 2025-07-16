import React from "react";
import NovaLayout from "../../components/NovaLayout";
import NovaHeader from "../../components/NovaHeader";
import NovaHero from "../../components/NovaHero";
import NovaFooter from "../../components/NovaFooter";
import BlogExperience from "./BlogExperience";

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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((svc, idx) => (
              <div
                key={svc.title}
                className={
                  `shadow-xl border-l-4 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl px-8 py-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 ` +
                  (idx === 0
                    ? "bg-blue-50 border-l-blue-500"
                    : idx === 1
                    ? "bg-pink-50 border-l-pink-500"
                    : "bg-green-50 border-l-green-500")
                }
              >
                <h4 className="text-2xl font-semibold mb-4 text-blue-800">
                  {svc.title}
                </h4>
                <p className="text-gray-600 mb-4 text-base leading-relaxed">
                  {svc.description}
                </p>
                <ul className="text-left text-gray-700 space-y-1 text-sm">
                  <li>• Operating hours: 08:00 AM - 04:00 PM</li>
                  <li>• Applicable for all students</li>
                  <li>• Location: School Health Office</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Health Knowledge
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ARTICLES.map((art, idx) => (
              <div
                key={art.title}
                className={
                  `shadow-xl border-l-4 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl px-8 py-8 transform transition-transform hover:scale-105 ` +
                  (idx === 0
                    ? "bg-blue-50 border-l-blue-400"
                    : "bg-pink-50 border-l-pink-400")
                }
              >
                <h4 className="text-2xl font-semibold mb-4 text-blue-800">
                  {art.title}
                </h4>
                <p className="text-gray-600 mb-4 text-base leading-relaxed">
                  {art.description}
                </p>
                <ul className="list-decimal list-inside mb-4 text-gray-700 space-y-1 text-sm">
                  {art.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BlogExperience />
    </div>
  );
};

export default HomePage;
