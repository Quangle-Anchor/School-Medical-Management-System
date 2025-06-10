// src/pages/AboutPage.jsx
import React from "react";

const docs = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
    title: "School Nutrition",
    desc: "Guidelines for creating balanced menus and appropriate nutrition plans for students at all levels.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
    title: "Disease Prevention",
    desc: "Information, recommendations, and materials for preventing infectious diseases in the school environment.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    title: "Mental Health",
    desc: "Resources on mental health care, stress management, and life skills development for students.",
  },
];

const blogs = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    title: "Parent Stories",
    desc: "Real-life experiences in managing children’s health, nutrition, and disease prevention at home and at school.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3132/3132687.png",
    title: "Teacher Insights",
    desc: "Stories, lessons, and extracurricular activities that promote student wellbeing and life skills.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3132/3132679.png",
    title: "Expert Advice",
    desc: "Articles and videos from healthcare and psychology experts on various school health topics.",
  },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-700">About Us</h1>
        <p className="text-gray-800 max-w-2xl mx-auto">
          Our School Health Management software is a modern solution designed to
          help educational institutions comprehensively manage student
          healthcare. The application connects the school health office,
          teachers, parents, and students to ensure that all health information
          is recorded, monitored, and addressed promptly.
        </p>
      </section>

      {/* Resources Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          School Health Resources
        </h2>
        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          {docs.map((doc, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-xl p-6 flex flex-col items-center text-center shadow"
            >
              <img
                src={doc.icon}
                alt={doc.title}
                className="w-20 h-20 mb-4 bg-white rounded-full p-2"
              />
              <h3 className="text-lg font-medium text-blue-700 mb-2">
                {doc.title}
              </h3>
              <p className="text-gray-700">{doc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Experience Sharing Blog
        </h2>
        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-xl p-6 flex flex-col items-center text-center shadow"
            >
              <img
                src={blog.icon}
                alt={blog.title}
                className="w-12 h-12 mb-4"
              />
              <h3 className="text-lg font-medium text-blue-700 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-700">{blog.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center">
        <p className="text-xl font-semibold text-blue-700">
          Let’s work together to build a safe and modern learning environment!
        </p>
      </section>
    </main>
  );
}
