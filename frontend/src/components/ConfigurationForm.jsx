import React, { useState, useEffect, useRef } from "react";

export default function ConfigurationForm({
  selectedAction,
  onClose,
  onSubmit,
  data
}) {
  const [formData, setFormData] = useState({
    method: data?.method || "",
    url: data?.url || "",
    headers: data?.headers || "",
    apiBody: data?.body || "",
    textBody: data?.body || "",
    email: data?.email || "",
    type: data?.type || selectedAction,
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    let updatedForm = { type: data?.type  || selectedAction };

    if (selectedAction === "API Call") {
      updatedForm = {
        ...updatedForm,
        method: formData.method,
        url: formData.url,
        headers: formData.headers,
        body: formData.apiBody,
      };
    } else if (selectedAction === "Email") {
      updatedForm = { ...updatedForm, email: formData.email };
    } else if (selectedAction === "Text Box") {
      updatedForm = { ...updatedForm, body: formData.textBody };
    }

    onSubmit(updatedForm);
    onClose();
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-[50%] right-0 -translate-y-1/2 backdrop-blur-md flex items-end ">
      <div
        className="bg-white px-3 py-2 rotate-[-90deg] origin-center rounded-md shadow-md text-center self-start mt-16"
      >
        <h2 className="text-red-500 text-lg font-bold ">Configuration</h2>
      </div>

      <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg w-[280px]">
        {selectedAction === "API Call" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Method</label>
              <select
                name="method"
                value={formData.method || data?.method}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm outline-none bg-white cursor-pointer"
              >
                <option value="">Select Method</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Type here..."
                className="w-full border px-3 py-2 rounded-md text-sm outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Headers</label>
              <input
                type="text"
                name="headers"
                value={formData.headers}
                onChange={handleChange}
                placeholder="Header Name"
                className="w-full border px-3 py-2 rounded-md text-sm outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Body</label>
              <textarea
                name="apiBody"
                value={formData.apiBody}
                onChange={handleChange}
                placeholder="Enter Descriptions..."
                className="w-full border px-3 py-2 rounded-md text-sm outline-none"
                rows="3"
              />
            </div>
          </>
        )}

        {selectedAction === "Email" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email..."
              className="w-full border px-3 py-2 rounded-md text-sm outline-none"
            />
          </div>
        )}

        {selectedAction === "Text Box" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Body</label>
            <textarea
              name="textBody"
              value={formData.textBody}
              onChange={handleChange}
              placeholder="Enter Descriptions..."
              className="w-full border px-3 py-2 rounded-md text-sm outline-none"
              rows="3"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}