import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./UiDialog";
import Button from "./UiButton";
import { Input } from "./UiInput";
import Textarea from "./UiTextarea";
import { Label } from "./UiLabel";
import { Select, SelectItem } from "./UiSelect";
import UiCalendar from "./UiCalendar";
import { Popover, PopoverContent, PopoverTrigger } from "./UiPopover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const EventDialog = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent,
  eventTypeLabels,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: selectedDate,
    type: "checkup",
    time: "",
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        type: editingEvent.type,
        time: editingEvent.time || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: selectedDate,
        type: "checkup",
        time: "",
      });
    }
  }, [editingEvent, selectedDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        type: formData.type,
        time: formData.time || undefined,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-800">
            {editingEvent ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề sự kiện *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nhập tiêu đề sự kiện..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loại sự kiện</Label>
            <Select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              {Object.entries(eventTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày</Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date
                      ? format(formData.date, "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <UiCalendar
                    value={formData.date}
                    onChange={(date) =>
                      date && setFormData({ ...formData, date })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Giờ (tùy chọn)</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả chi tiết về sự kiện..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {editingEvent ? "Cập nhật" : "Thêm sự kiện"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
