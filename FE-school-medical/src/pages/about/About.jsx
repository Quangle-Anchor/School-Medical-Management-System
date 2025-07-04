import React from "react";
import {
  Heart,
  School,
  User,
  Users,
  BookOpen,
} from "lucide-react";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      {/* Header */}
      <section className="text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">
          About Us
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Our School Health Management software is a modern solution designed to
          help educational institutions comprehensively manage student
          healthcare. The application connects the school health office,
          teachers, parents, and students to ensure that all health information
          is recorded, monitored, and addressed promptly.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className=" py-16 px-4 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl text-center text-blue-800 font-bold mb-4">
                  Mission
                </h2>
                <p className="text-gray-600 text-base leading-relaxed text-center">
                  To create a safe, healthy, and holistic learning environment
                  for students through professional and modern school health
                  programs. We are committed to partnering with schools and
                  families to care for students' physical and mental well-being.
                </p>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <School className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl text-center text-blue-800 font-bold mb-4">
                  Vision
                </h2>
                <p className="text-gray-600 text-base leading-relaxed text-center">
                  To become a leading unit in school health in Vietnam, trusted
                  by educators, parents, and students. We aim to build a young
                  generation that is healthy, confident, and equipped with the
                  knowledge to care for themselves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Professionalism
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our team consists of experienced healthcare professionals,
                well-trained and continuously updated with the latest knowledge
                in school health.
              </p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Dedication
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We always put students' health and well-being first, serving
                with sincerity and high responsibility.
              </p>
            </div>
            <div className="text-center transform transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Collaboration
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We work closely with schools, families, and the community to
                create a comprehensive health care network for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Detail */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>
          <div className="space-y-8">
            <div className="bg-white shadow-xl border-l-4 border-l-blue-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 mr-3 text-blue-700" />
                  <h3 className="text-2xl text-blue-800 font-semibold">
                    School Nutrition Program
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Services include:
                    </h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Designing balanced menus for each age group</li>
                      <li>
                        • Nutrition counseling for students with special needs
                      </li>
                      <li>• Training for school kitchen staff</li>
                      <li>• Food quality inspection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Benefits:
                    </h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Ensures students' comprehensive development</li>
                      <li>• Enhances immunity and learning ability</li>
                      <li>• Prevents nutrition-related diseases</li>
                      <li>• Builds healthy eating habits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl border-l-4 border-l-pink-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 mr-3 text-pink-600" />
                  <h3 className="text-2xl text-blue-800 font-semibold">
                    Disease Prevention
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Services include:
                    </h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Developing disease prevention plans</li>
                      <li>• Organizing vaccination programs</li>
                      <li>• Daily health monitoring for students</li>
                      <li>• Consulting on school environmental hygiene</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Benefits:
                    </h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Minimizes the risk of disease outbreaks</li>
                      <li>• Protects the health of the school community</li>
                      <li>
                        • Raises disease prevention awareness among students
                      </li>
                      <li>• Ensures a safe learning environment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl border-l-4 border-l-green-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 mr-3 text-green-600" />
                  <h3 className="text-2xl text-blue-800 font-semibold">
                    Mental Health Care
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Services include:
                    </h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Psychological counseling for students</li>
                      <li>• Life skills development programs</li>
                      <li>• Teacher training on mental health</li>
                      <li>• Family support in child-rearing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Benefits:
                    </h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Develops positive personality</li>
                      <li>• Improves social adaptability</li>
                      <li>• Reduces stress and academic pressure</li>
                      <li>• Builds confidence and self-esteem</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-16 px-4 bg-white">
        <p className="text-2xl font-semibold text-blue-800 animate-pulse">
          Let’s work together to build a safe and modern learning environment!
        </p>
      </section>
    </main>
  );
}


