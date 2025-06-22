import React, { useState } from "react";
import UiCalendar from "./UiCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "./UiCard";
import Button from "./UiButton";
import Badge from "./UiBadge";
import { CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import EventDialog from "./EventDialog";
import EventList from "./EventList";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Khám sức khỏe định kỳ lớp 10",
      description: "Khám sức khỏe tổng quát cho học sinh lớp 10",
      date: new Date(),
      type: "checkup",
      time: "8:00",
    },
    {
      id: "2",
      title: "Tiêm phòng viêm gan B",
      description: "Tiêm phòng viêm gan B cho học sinh khối 11",
      date: new Date(Date.now() + 86400000),
      type: "vaccination",
      time: "14:00",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const selectedDateEvents = events.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  const eventTypeColors = {
    checkup: "bg-blue-100 text-blue-800",
    vaccination: "bg-green-100 text-green-800",
    "health-education": "bg-purple-100 text-purple-800",
    emergency: "bg-red-100 text-red-800",
    meeting: "bg-yellow-100 text-yellow-800",
  };

  const eventTypeLabels = {
    checkup: "Khám sức khỏe",
    vaccination: "Tiêm phòng",
    "health-education": "Giáo dục sức khỏe",
    emergency: "Cấp cứu",
    meeting: "Họp",
  };

  const handleAddEvent = (eventData) => {
    const newEvent = { ...eventData, id: Date.now().toString() };
    setEvents([...events, newEvent]);
    setIsDialogOpen(false);
  };

  const handleEditEvent = (eventData) => {
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id }
            : event
        )
      );
      setEditingEvent(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const openEditDialog = (event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const getDayEvents = (date) =>
    events.filter((event) => isSameDay(event.date, date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Lịch Y Tế Học Đường
          </h1>
          <p className="text-green-600 text-lg">
            Quản lý và theo dõi các hoạt động sức khỏe trong trường học
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6" />
                    <CardTitle className="text-xl">
                      {format(currentMonth, "MMMM yyyy", { locale: vi })}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        )
                      }
                    >
                      <ChevronLeft />
                    </Button>
                    <Button onClick={() => setCurrentMonth(new Date())}>
                      Hôm nay
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        )
                      }
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <UiCalendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  locale="vi-VN"
                  tileContent={({ date, view }) => {
                    if (view === "month") {
                      const dayEvents = getDayEvents(date);
                      return (
                        <div className="flex gap-1 flex-wrap justify-center mt-1">
                          {dayEvents.slice(0, 3).map((event, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                event.type === "checkup"
                                  ? "bg-blue-500"
                                  : event.type === "vaccination"
                                  ? "bg-green-500"
                                  : event.type === "health-education"
                                  ? "bg-purple-500"
                                  : event.type === "emergency"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-xs">
                              +{dayEvents.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </CardTitle>
                  {/* Luôn hiển thị nút Thêm sự kiện */}
                  <Button
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setEditingEvent(null);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Thêm sự kiện
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <EventList
                  events={selectedDateEvents}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteEvent}
                  eventTypeColors={eventTypeColors}
                  eventTypeLabels={eventTypeLabels}
                />
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">
                  Thống kê tháng này
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(eventTypeLabels).map(([type, label]) => {
                  const count = events.filter(
                    (event) =>
                      event.type === type &&
                      event.date.getMonth() === currentMonth.getMonth() &&
                      event.date.getFullYear() === currentMonth.getFullYear()
                  ).length;
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            type === "checkup"
                              ? "bg-blue-500"
                              : type === "vaccination"
                              ? "bg-green-500"
                              : type === "health-education"
                              ? "bg-purple-500"
                              : type === "emergency"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <Badge className="text-xs">{count}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <EventDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingEvent(null);
          }}
          onSave={editingEvent ? handleEditEvent : handleAddEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
          eventTypeLabels={eventTypeLabels}
        />
      </div>
    </div>
  );
};

export default Calendar;
  