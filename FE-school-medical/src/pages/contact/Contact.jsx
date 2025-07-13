import React from "react";

export default function Contact() {
  const team = [
    {
      name: "Dr. Nguyễn Thị Mai",
      role: "School Doctor",
      specialty: "General Medicine",
      color: "bg-blue-600",
      img: "https://cdn-icons-png.flaticon.com/512/706/706830.png",
      desc: "Responsible for health checks, treatment plans, and emergency care.",
    },
    {
      name: "Mr. Trần Văn Hùng",
      role: "Medical Assistant",
      specialty: "Patient Care",
      color: "bg-red-500",
      img: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
      desc: "Supports the doctor in daily routines and coordinates with teachers.",
    },
    {
      name: "Ms. Lê Hoàng Anh",
      role: "Mental Health Counselor",
      specialty: "Psychology",
      color: "bg-purple-600",
      img: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
      desc: "Provides counseling and emotional support to students.",
    },
  ];

  return (
    <main className="bg-white-100 font-sans min-h-screen">
      {/* Header */}
      <section className="max-w-4xl mx-auto py-16 ">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-blue-700">Contact Us</h1>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Reach out to our school health team for support with appointments,
            emergencies, or general inquiries. We’re committed to ensuring every
            student’s health and wellbeing is cared for.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* General Contact */}
            <div className="bg-blue-50 shadow border-l-4 border-l-blue-500 rounded-2xl px-6 py-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-blue-500 p-3 rounded-lg mb-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
                    alt="Contact"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  General Contact
                </h3>
              </div>
              <div className="text-gray-700 space-y-1 text-sm">
                <p>
                  <strong>Phone:</strong> (123) 456-7890
                </p>
                <p>
                  <strong>Email:</strong> contact@schoolhealth.com
                </p>
                <p>
                  <strong>Fax:</strong> (123) 456-7891
                </p>
                <p>
                  <strong>Reply time:</strong> Within 24 hours
                </p>
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-pink-50 shadow border-l-4 border-l-pink-500 rounded-2xl px-6 py-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-blue-500 p-3 rounded-lg mb-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
                    alt="Emergency"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Emergency
                </h3>
              </div>
              <div className="text-gray-700 space-y-1 text-sm">
                <p>
                  <strong>24/7 Hotline:</strong> 1800-999-888
                </p>
                <p>
                  <strong>On-site nurse:</strong> Always available
                </p>
                <p>
                  <strong>Emergency room:</strong> Block A, ground floor
                </p>
                <p>
                  <strong>Note:</strong> Call before arrival if possible
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-green-50 shadow border-l-4 border-l-green-500 rounded-2xl px-6 py-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-blue-500 p-3 rounded-lg mb-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                    alt="Location"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  School Health Office
                </h3>
              </div>
              <div className="text-gray-700 space-y-1 text-sm">
                <p>
                  <strong>Address:</strong> 123 Education Lane
                </p>
                <p>
                  <strong>Location:</strong> District 1, HoChiMinh, Vietnam
                </p>
                <p>
                  <strong>Room:</strong> Building B, 2nd Floor, Room 204
                </p>
                <p>
                  <strong>Parking:</strong> Lot C (free)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Team */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Meet Our Medical Team
          </h2>
          <p className="text-center text-gray-500 text-lg mb-8">
            Experienced professionals dedicated to your health and wellbeing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={
                  `rounded-2xl shadow p-6 flex flex-col items-center text-center space-y-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl ` +
                  (index === 0
                    ? "bg-blue-50"
                    : index === 1
                    ? "bg-pink-50"
                    : "bg-purple-50")
                }
              >
                <div className="relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-3 py-1 rounded-full ${member.color}`}
                  >
                    {member.specialty}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Office Hours
          </h2>
          <p className="text-center text-gray-500 text-lg mb-8">
            Our schedule to serve you better
          </p>
          <div className="bg-white rounded-2xl shadow overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white flex flex-col items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
                  alt="Working Hours"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold">Working Hours</h3>
            </div>

            {/* Schedule */}
            <div className="px-6 py-4 space-y-2 text-sm text-gray-800">
              <div className="flex justify-between border-b pb-2">
                <span>Monday – Friday</span>
                <span>08:00 – 17:00</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Saturday</span>
                <span>08:00 – 12:00</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Lunch Break</span>
                <span>12:00 – 13:30</span>
              </div>
              <div className="bg-blue-100 border-l-4 border-blue-400 rounded-md p-3 mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>Emergency Note:</strong> Emergency calls are accepted
                  outside working hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
