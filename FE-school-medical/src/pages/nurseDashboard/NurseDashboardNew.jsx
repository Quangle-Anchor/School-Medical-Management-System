import NotificationsView from "./NotificationsView";
import MedicationScheduleManagement from "./MedicationScheduleView";
import MedicationScheduleForm from "./MedicationScheduleForm";
import MedicationScheduleDetail from "./MedicationScheduleDetail";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import TopNavbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import ChartCard from "../../components/ChartCard";
import HealthEventsView from "../../components/HealthEventsView";
import NurseHealthEventsView from "./NurseHealthEventsView";
import UpcomingHealthEventsCard from "../../components/UpcomingHealthEventsCard";
import StudentsView from "./StudentsView";
import NurseMedicationRequests from "./NurseMedicationRequests";
import HealthIncidentsView from "./HealthIncidentsView";
import InventoryView from "./InventoryView";  
import {
  Users,
  Calendar,
  Heart,
  Bell,
} from "lucide-react";
import { healthIncidentAPI } from "../../api/healthIncidentApi";
import { studentAPI } from "../../api/studentsApi";
import { healthEventAPI } from "../../api/healthEventApi";
import { medicationAPI } from "../../api/medicationApi";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthIncidents, setHealthIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [healthEvents, setHealthEvents] = useState([]);
  const [pendingMedicationRequests, setPendingMedicationRequests] = useState(
    []
  );
  // Get current view from URL
  const getCurrentView = () => {
    const path = location.pathname;    

    // More precise matching to avoid conflicts
    if (path === "/nurseDashboard/students") return "students";
    if (path === "/nurseDashboard/health-events") return "health-events";
    if (path === "/nurseDashboard/health-incidents") return "health-incidents";
    if (path === "/nurseDashboard/medication-requests")
      return "medication-requests";
    if (path === "/nurseDashboard/medication-schedules")
      return "medication-schedules";
    if (path === "/nurseDashboard/medication-schedules/create")
      return "medication-schedule-form";
    if (path.startsWith("/nurseDashboard/medication-schedules/edit/"))
      return "medication-schedule-form";
    if (path.startsWith("/nurseDashboard/medication-schedules/view/"))
      return "medication-schedule-detail";
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
      console.error("Error fetching health incidents:", error);
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
      const pendingRequests = await medicationAPI.getPendingRequests();
      setPendingMedicationRequests(
        Array.isArray(pendingRequests) ? pendingRequests : []
      );
    } catch (error) {
      console.error("Error fetching medication requests:", error);
      // setMedicationRequests([]); // Removed as per edit hint
      setPendingMedicationRequests([]);
    }
  };

  // Đặt ở đầu component
  const nurseId = localStorage.getItem("userId");
  const nurseRole = localStorage.getItem("role");
  const nurseName = localStorage.getItem("fullname");
  const nurseUser = useMemo(
    () => ({
      id: nurseId,
      role: nurseRole,
      name: nurseName,
    }),
    [nurseId, nurseRole, nurseName]
  );

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
        return <NurseHealthEventsView />;

      case "medication-requests":
        return <NurseMedicationRequests />;

      case "medication-schedules":
        return <MedicationScheduleManagement />;

      case "medication-schedule-form":
        return <MedicationScheduleForm />;

      case "medication-schedule-detail":
        return <MedicationScheduleDetail />;

      case "health-incidents":
        return <HealthIncidentsView />;

      case "notifications": {
        return <NotificationsView user={nurseUser} />;
      }

      case "inventory":
        return <InventoryView />;

      default:
        return (
          <div className="bg-gray-100 p-6">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
                  <p className="text-gray-600">Welcome back! Here's your patient care overview and daily tasks.</p>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nurseCardData.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
    <div className="bg-gray-100 p-6">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userRole="nurse"
        activeMenu={activeView}
        onMenuClick={handleMenuClick}
      />
      <main className={`ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen transition-all duration-200 ${sidebarCollapsed ? 'xl:ml-20' : ''}`}>
        <TopNavbar 
          title="Nurse Dashboard"
          breadcrumb={["Nurse", "Dashboard"]}
          userInfo={{ name: localStorage.getItem("fullname") || "Nurse User" }}
          user={nurseUser}
        />
        
        {renderContent()}
      </main>
    </div>
  );
};

export default NurseDashboard;
