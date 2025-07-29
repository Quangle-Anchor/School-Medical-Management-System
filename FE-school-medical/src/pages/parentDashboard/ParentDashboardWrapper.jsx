import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import TopNavbar from "../../components/Navbar";
import ChartCard from "../../components/ChartCard";
import DashboardCard from "../../components/DashboardCard";
import HealthEventsView from "../../components/HealthEventsView";
import UpcomingHealthEventsCard from "../../components/UpcomingHealthEventsCard";
import MyChildView from "./MyChildView";
import AddStudentForm from "./AddStudentForm";
import MyMedicationRequests from "./MyMedicationRequests";
import ParentMedicationSchedules from "./ParentMedicationSchedules";
import HealthIncidentsView from "../nurseDashboard/HealthIncidentsView";
import NotificationsView from "../nurseDashboard/NotificationsView";
import { User, Calendar, FileText, Heart, Plus } from "lucide-react";
import { studentAPI } from "../../api/studentsApi";
import { healthIncidentAPI } from "../../api/healthIncidentApi";
import { medicationAPI } from "../../api/medicationApi";
import { medicationScheduleAPI } from "../../api/medicationScheduleApi";
import { healthEventAPI } from "../../api/healthEventApi";

const ParentDashboardWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidentsCount, setHealthIncidentsCount] = useState(0);
  const [medicationRequestsCount, setMedicationRequestsCount] = useState(0);
  const [medicationSchedulesCount, setMedicationSchedulesCount] = useState(0);
  const [futureHealthEventsCount, setFutureHealthEventsCount] = useState(0);

  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/my-child")) return "my-child";
    if (path.includes("/health-event")) return "health-event";
    if (path.includes("/medical-records")) return "medical-records";
    if (path.includes("/medication-requests")) return "medication-requests";
    if (path.includes("/medication-schedules")) return "medication-schedules";
    if (path.includes("/notifications")) return "notifications";
    if (path.includes("/medical-request")) return "medical-request";
    return "dashboard";
  };

  const [activeView, setActiveView] = useState(getCurrentView());

  // Update active view when URL changes
  useEffect(() => {
    setActiveView(getCurrentView());
  }, [location.pathname]);
  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
    fetchMedicationRequests();
    fetchMedicationSchedules();
    fetchFutureHealthEventsCount();

    // Set up automatic refresh every 30 seconds for parent dashboard
    // This ensures the dashboard counts are updated when nurses confirm/reject requests
    const refreshInterval = setInterval(() => {
      fetchStudents(); // Add student refresh for confirmation status updates
      fetchMedicationRequests();
      fetchMedicationSchedules();
      fetchFutureHealthEventsCount();
    }, 30000);

    // Also refresh when the window regains focus
    const handleFocus = () => {
      fetchStudents(); // Add student refresh for confirmation status updates
      fetchMedicationRequests();
      fetchMedicationSchedules();
      fetchFutureHealthEventsCount();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Fetch health incidents after students are loaded
  useEffect(() => {
    if (students.length > 0) {
      fetchHealthIncidents();
    } else if (students.length === 0 && !loading) {
      setHealthIncidentsCount(0);
    }
  }, [students, loading]);
  const fetchStudents = async () => {
    try {
      const studentsData = await studentAPI.getMyStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchHealthIncidents = async () => {
    try {
      if (students.length === 0) {
        setHealthIncidentsCount(0);
        return;
      }

      let totalCount = 0;
      // Fetch health incidents for each student
      for (const student of students) {
        try {
          const incidents = await healthIncidentAPI.getHealthIncidentsByStudent(
            student.studentId
          );
          totalCount += incidents ? incidents.length : 0;
        } catch (error) {
          console.error(
            `Error fetching health incidents for student ${student.studentId}:`,
            error
          );
          // Continue with other students even if one fails
        }
      }
      setHealthIncidentsCount(totalCount);
    } catch (error) {
      console.error("Error fetching health incidents:", error);
      setHealthIncidentsCount(0);
    }
  };

  const fetchMedicationRequests = async () => {
    try {
      const medicationRequests = await medicationAPI.getMyMedicationRequests();
      setMedicationRequestsCount(
        medicationRequests ? medicationRequests.length : 0
      );
    } catch (error) {
      console.error("Error fetching medication requests:", error);
      setMedicationRequestsCount(0);
    }
  };

  const fetchMedicationSchedules = async () => {
    try {
      const medicationSchedules =
        await medicationScheduleAPI.getSchedulesForMyStudents();
      setMedicationSchedulesCount(
        medicationSchedules ? medicationSchedules.length : 0
      );
    } catch (error) {
      console.error("Error fetching medication schedules:", error);
      setMedicationSchedulesCount(0);
    }
  };

  const fetchFutureHealthEventsCount = async () => {
    try {
      const events = await healthEventAPI.getUpcomingEvents(); // Get all upcoming events
      setFutureHealthEventsCount(events ? events.length : 0);
    } catch (error) {
      console.error("Error fetching future health events count:", error);
      setFutureHealthEventsCount(0);
    }
  };
  const handleStudentAdded = (newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
    // Refresh health incidents count after adding a new student
    // The useEffect will handle fetching incidents for the new student
  };

  const handleMedicationRequestAdded = () => {
    // Refresh medication requests count when a new request is added
    fetchMedicationRequests();
  };

  const handleMenuClick = (menuId) => {
    // Update URL and let React Router handle the navigation
    switch (menuId) {
      case "dashboard":
        navigate("/parentDashboard");
        break;
      case "my-child":
        navigate("/parentDashboard/my-child");
        break;
      case "health-event":
        navigate("/parentDashboard/health-event");
        break;
      case "medical-records":
        navigate("/parentDashboard/medical-records");
        break;
      case "notifications":
        navigate("/parentDashboard/notifications");
        break;
      case "medication-schedules":
        navigate("/parentDashboard/medication-schedules");
        break;
      case "medical-request":
        navigate("/parentDashboard/medical-request");
        break;
      default:
        navigate("/parentDashboard");
    }
  };

  // Dashboard cards data
  const parentCardData = [
    {
      title: "My Children",
      value: loading ? "..." : students.length.toString(),
      change: "Active students",
      changeType: "neutral",
      icon: User,
      priority: "normal",
    },
    {
      title: "Upcoming Health Events",
      value: loading ? "..." : futureHealthEventsCount.toString(),
      change: "Scheduled events",
      changeType: "positive",
      icon: Calendar,
      priority: "normal",
    },
    {
      title: "Health Incidents",
      value: loading ? "..." : healthIncidentsCount.toString(),
      change: "Health incidents",
      changeType: "neutral",
      icon: FileText,
      priority: healthIncidentsCount > 0 ? "high" : "normal",
    },
    {
      title: "Medication Requests",
      value: loading ? "..." : medicationRequestsCount.toString(),
      change: "Total requests sent",
      changeType: "neutral",
      icon: Heart,
      priority: medicationRequestsCount > 5 ? "high" : "normal",
    },
    {
      title: "Medication Schedules",
      value: loading ? "..." : medicationSchedulesCount.toString(),
      change: "Scheduled medications",
      changeType: "positive",
      icon: Calendar,
      priority: "normal",
    },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Đặt ở đầu component
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("fullname");
  const parentUser = useMemo(
    () => ({
      id: userId,
      role,
      name,
    }),
    [userId, role, name]
  );

  // Content rendering in Siderbar
  const renderContent = () => {
    switch (activeView) {
      case "my-child":
        return (
          <MyChildView
            students={students}
            onStudentAdded={handleStudentAdded}
            onAddStudent={() => setShowAddForm(true)}
          />
        );
      case "health-event":
        return <HealthEventsView userRole="parent" />;

      case "medical-records":
        return (
          <HealthIncidentsView
            isParentView={true}
            students={students}
            parentLoading={loading}
          />
        );
      case "notifications": {
        return <NotificationsView user={parentUser} />;
      }

      case "medical-request":
        return (
          <MyMedicationRequests onRequestAdded={handleMedicationRequestAdded} />
        );

      case "medication-schedules":
        return <ParentMedicationSchedules />;

      case "medication-requests":
        return (
          <MyMedicationRequests onRequestAdded={handleMedicationRequestAdded} />
        );
      default:
        return (
          <div className="bg-gray-100 p-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {parentCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Charts and Calendar Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Calendar Card */}
              <ChartCard userRole="parent" />

              {/* Upcoming Health Events */}
              <UpcomingHealthEventsCard
                userRole="parent"
                onViewAll={() => handleMenuClick("health-event")}
              />
            </div>
          </div>
        );
    }
  };
  return (
    <div className="bg-gray-100 p-6">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userRole="parent"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />

      <main
        className={`ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen transition-all duration-200 ${
          sidebarCollapsed ? "xl:ml-20" : ""
        }`}
      >
        <TopNavbar
          title="Parent Dashboard"
          breadcrumb={["Parent", "Dashboard"]}
          userInfo={{ name: localStorage.getItem("fullname") || "Parent User" }}
          user={parentUser}
        />

        {renderContent()}
      </main>

      <AddStudentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

export default ParentDashboardWrapper;
