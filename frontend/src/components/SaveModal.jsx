import React, { useState, useEffect } from "react";

export default function SaveModal({ isOpen, onClose, onSubmit, data }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        description: data.description || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const filteredData = {
      ...(formData.name && { name: formData.name }),
      ...(formData.description && { description: formData.description })
    };

    onSubmit(filteredData); // Send cleaned data to parent
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-bold text-lg">Save your workflow</h2>
          <button onClick={onClose} className="text-red-500 text-xl font-bold">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name here"
              className="w-full border px-3 py-2 rounded-md text-sm outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write here.."
              rows="3"
              className="w-full border px-3 py-2 rounded-md text-sm outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
