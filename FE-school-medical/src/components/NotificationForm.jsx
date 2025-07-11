import { useState, useEffect } from "react";

const NotificationForm = ({ open, onClose, onSubmit, initial }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setError("");
  }, [open, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {initial ? "Sửa thông báo" : "Thêm thông báo"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {initial ? "Lưu" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
