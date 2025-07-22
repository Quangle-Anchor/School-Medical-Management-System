import React, { useState } from "react";
import { searchStudentByCode } from "../../api/studentsApi";

const HealthLookup = () => {
  const [studentCode, setStudentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  // Không cần state riêng cho healthInfo, sẽ lấy từ student.healthInfoList

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setStudent(null);
    if (!studentCode.trim()) {
      setError("Please enter student code.");
      return;
    }
    setLoading(true);
    try {
      const res = await searchStudentByCode(studentCode.trim());
      setStudent(res);
    } catch {
      setError("Student not found or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-2 py-8" style={{ background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)' }}>
      {!student ? (
        // Centered search form when no student is found
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            Student Information Lookup
          </h1>
          <p className="text-lg text-center mb-8 text-white">
            Enter student code to view personal and health history information
          </p>
          <form
            className="w-full max-w-xl bg-white rounded-xl shadow p-6 flex flex-col gap-2"
            onSubmit={handleSearch}
          >
            <label className="text-xl font-semibold flex items-center gap-2 mb-2 text-blue-700">
              Lookup student information
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-4 py-2 text-lg focus:outline-blue-500"
                placeholder="Enter student code (e.g. HS001, HS002)"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg flex items-center gap-1"
                disabled={loading}
              >
                Search
              </button>
            </div>
            <span className="text-gray-500 text-sm mt-1">
              After entering the student code, you can view personal and health
              history information
            </span>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
          {loading && <div className="mt-6 text-blue-600">Searching...</div>}
        </div>
      ) : (
        // Split layout when student is found
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Student Information Lookup
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            {/* Left side - Search form */}
            <div className="flex flex-col justify-center">  
              <form
                className="bg-white rounded-xl shadow p-6 flex flex-col gap-2"
                onSubmit={handleSearch}
              >
                <label className="text-xl font-semibold flex items-center gap-2 mb-2 text-blue-700">
                  Lookup student information
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded px-4 py-2 text-lg focus:outline-blue-500"
                    placeholder="Enter student code (e.g. HS001, HS002)"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg flex items-center gap-1"
                    disabled={loading}
                  >
                    Search
                  </button>
                </div>
                <span className="text-gray-500 text-sm mt-1">
                  After entering the student code, you can view personal and health
                  history information
                </span>
                {error && <div className="text-red-600 mt-2">{error}</div>}
              </form>
              {loading && <div className="mt-6 text-blue-600">Searching...</div>}
            </div>

            {/* Right side - Student information */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <b>Student ID:</b> {student.studentId}
                </div>
                <div>
                  <b>Student Code:</b> {student.studentCode}
                </div>
                <div>
                  <b>Full Name:</b> {student.fullName}
                </div>
                <div>
                  <b>Date of Birth:</b> {student.dateOfBirth}
                </div>
                <div>
                  <b>Class:</b> {student.className}
                </div>
                <div>
                  <b>Gender:</b> {student.gender}
                </div>
                <div>
                  <b>Blood Type:</b> {student.bloodType}
                </div>
                <div>
                  <b>Height:</b> {student.heightCm} cm
                </div>
                <div>
                  <b>Weight:</b> {student.weightKg} kg
                </div>
                <div>
                  <b>Last Updated:</b>{" "}
                  {student.updatedAt ? student.updatedAt.slice(0, 10) : ""}
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Health & Vaccination History
              </h3>
              {student.healthInfoList && student.healthInfoList.length > 0 ? (
                <table className="min-w-full border text-sm mb-2">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border px-2 py-1">Health Info ID</th>
                      <th className="border px-2 py-1">Medical Conditions</th>
                      <th className="border px-2 py-1">Allergies</th>
                      <th className="border px-2 py-1">Notes</th>
                      <th className="border px-2 py-1">Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.healthInfoList.map((info, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{info.healthInfoId}</td>
                        <td className="border px-2 py-1">
                          {info.medicalConditions || ""}
                        </td>
                        <td className="border px-2 py-1">{info.allergies || ""}</td>
                        <td className="border px-2 py-1">{info.notes || ""}</td>
                        <td className="border px-2 py-1">
                          {info.updatedAt ? info.updatedAt.slice(0, 10) : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">No health history data.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthLookup;
