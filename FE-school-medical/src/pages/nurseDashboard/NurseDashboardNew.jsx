import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import DashboardCard from "../../components/DashboardCard";
import ChartCard from "../../components/ChartCard";
import HealthEventsView from "../../components/HealthEventsView";
import UpcomingHealthEventsCard from "../../components/UpcomingHealthEventsCard";
import StudentsView from "./StudentsView";
import NurseMedicationRequests from "./NurseMedicationRequests";
import HealthIncidentsView from "./HealthIncidentsView";
import InventoryView from "./InventoryView";
import NotificationsView from "./NotificationsView";
import {
  Users,
  Calendar,
  FileText,
  Heart,
  Activity,
  Stethoscope,
  Bell,
  Warehouse,
  Pill,
} from "lucide-react";
import { healthIncidentAPI } from "../../api/healthIncidentApi";
import { studentAPI } from "../../api/studentsApi";
import { healthEventAPI } from "../../api/healthEventApi";
import { medicationAPI } from "../../api/medicationApi";
import {
  formatEventDate,
  getCategoryStyle,
  safeDisplay,
} from "../../utils/dashboardUtils";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidents, setHealthIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [healthEvents, setHealthEvents] = useState([]);
  const [medicationRequests, setMedicationRequests] = useState([]);
  const [pendingMedicationRequests, setPendingMedicationRequests] = useState(
    []
  );
  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    console.log("Current path:", path); // Debug log

    // More precise matching to avoid conflicts
    if (path === "/nurseDashboard/students") return "students";
    if (path === "/nurseDashboard/health-events") return "health-events";
    if (path === "/nurseDashboard/health-incidents") return "health-incidents";
    if (path === "/nurseDashboard/medication-requests")
      return "medication-requests";
    if (path === "/nurseDashboard/notifications") return "notifications";
    if (path === "/nurseDashboard/inventory") return "inventory";

    return "dashboard";
  };
  const [activeView, setActiveView] = useState(getCurrentView());

  // Update active view when URL changes
  useEffect(() => {
    setActiveView(getCurrentView());
  }, [location.pathname]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      console.log("Starting to fetch all data...");

      try {
        await Promise.all([
          fetchStudents(),
          fetchHealthIncidents(),
          fetchHealthEvents(),
          fetchMedicationRequests(),
        ]);
        console.log("All data fetched successfully");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = (menuId) => {
    console.log("Menu clicked:", menuId); // Debug log
    if (menuId === "dashboard") {
      navigate("/nurseDashboard");
    } else {
      navigate(`/nurseDashboard/${menuId}`);
    }
    // Don't manually set activeView here, let the useEffect handle it based on URL
  };

  const fetchStudents = async () => {
    try {
      // For nurses, we want to get all students, but we need to handle the paginated response

      const studentsData = await studentAPI.getAllStudents(0, 1000); // Get a large page to include all students

      // Handle paginated response - extract content array
      if (
        studentsData &&
        studentsData.content &&
        Array.isArray(studentsData.content)
      ) {
        setStudents(studentsData.content);
      } else if (Array.isArray(studentsData)) {
        // Fallback in case the API returns an array directly

        setStudents(studentsData);
      } else {
        setStudents([]); // Set empty array if no content
      }
    } catch (error) {
      setStudents([]); // Set empty array on error
    }
  };
  const fetchHealthIncidents = async () => {
    try {
      const incidents = await healthIncidentAPI.getAllHealthIncidents();
      setHealthIncidents(incidents || []); // Ensure we always set an array
    } catch (error) {
      setHealthIncidents([]); // Set empty array on error
    }
  };

  const fetchHealthEvents = async () => {
    try {
      const events = await healthEventAPI.getAllEvents(); // Get all events for nurse
      setHealthEvents(events || []);
    } catch (error) {
      console.error("Error fetching health events:", error);
      setHealthEvents([]);
    }
  };

  const fetchMedicationRequests = async () => {
    try {
      // Fetch all medication requests
      const allRequests = await medicationAPI.getAllRequests();
      setMedicationRequests(Array.isArray(allRequests) ? allRequests : []);

      // Fetch pending medication requests
      const pendingRequests = await medicationAPI.getPendingRequests();
      setPendingMedicationRequests(
        Array.isArray(pendingRequests) ? pendingRequests : []
      );
    } catch (error) {
      console.error("Error fetching medication requests:", error);
      setMedicationRequests([]);
      setPendingMedicationRequests([]);
    }
  };

  // Nurse dashboard data
  const nurseCardData = [
    {
      title: "Total Students",
      value: loading
        ? "..."
        : (Array.isArray(students) ? students.length : 0).toString(),
      change: "Students in database",
      changeType: "neutral",
      icon: Users,
    },
    {
      title: "Health Events",
      value: loading ? "..." : healthEvents.length.toString(),
      change: `${
        healthEvents.filter((event) => {
          const today = new Date();
          const eventDate = new Date(event.scheduleDate);
          return eventDate.toDateString() === today.toDateString();
        }).length
      } scheduled today`,
      changeType: "neutral",
      icon: Calendar,
    },
    {
      title: "Health Incidents",
      value: loading ? "..." : healthIncidents.length.toString(),
      change: "Total recorded incidents",
      changeType: healthIncidents.length > 5 ? "negative" : "neutral",
      icon: Heart,
    },
    {
      title: "Pending Medication Requests",
      value: loading ? "..." : pendingMedicationRequests.length.toString(),
      change: "Awaiting confirmation",
      changeType: pendingMedicationRequests.length > 5 ? "negative" : "neutral",
      icon: Bell,
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "students":
        return <StudentsView />;

      case "health-events":
        return <HealthEventsView userRole="nurse" />;

      case "medication-requests":
        return <NurseMedicationRequests />;

      case "health-incidents":
        return <HealthIncidentsView />;

      case "notifications": {
        // Lấy user nurse hiện tại từ localStorage
        const nurseUser = {
          id: localStorage.getItem("userId"),
          role: localStorage.getItem("role"),
          name: localStorage.getItem("fullname"),
        };
        return <NotificationsView user={nurseUser} />;
      }

      case "inventory":
        return <InventoryView />;

      default:
        return (
          <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Nurse Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's your patient care overview and daily
                    tasks.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {nurseCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar Card */}
              <ChartCard userRole="nurse" />

              {/* Upcoming Health Events Section */}
              <UpcomingHealthEventsCard
                userRole="nurse"
                onViewAll={() => handleMenuClick("health-events")}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userRole="nurse"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 overflow-hidden">{renderContent()}</main>
    </div>
  );
};

export default NurseDashboard;
