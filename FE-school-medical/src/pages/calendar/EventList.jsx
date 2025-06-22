import React from "react";
import  Button  from "./UiButton";
import  Badge  from "./UiBadge";
import { Card, CardContent } from "./UiCard";
import { Edit, Trash2, Clock, FileText } from "lucide-react";

const EventList = ({
  events,
  onEdit,
  onDelete,
  eventTypeColors,
  eventTypeLabels,
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Không có sự kiện nào trong ngày này</p>
        <p className="text-xs text-gray-400 mt-1">
          Nhấn "Thêm sự kiện" để tạo sự kiện mới
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card
          key={event.id}
          className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {event.title}
                  </h3>
                  <Badge className={`text-xs ${eventTypeColors[event.type]}`}>
                    {eventTypeLabels[event.type]}
                  </Badge>
                </div>
                {event.time && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(event)}
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
