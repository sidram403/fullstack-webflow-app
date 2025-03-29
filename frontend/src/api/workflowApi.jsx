import API from "./apiClient";

export const create = async (data) => {
  try {
    const response = await API.post("/workflow/create", data);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message || "Failed to create workflow" };
  }
};

export const updateWorkflow = async (id, data) => {
  try {
    const response = await API.put(`/workflow/${id}`, data);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message || "Failed to update workflow" };
  }
};


export const updateWorkflowStatus = async (id, data) => {
  try {
    const response = await API.put(`/workflow/update-status/${id}`, data);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message || "Failed to update workflow" };
  }
};
// Get Workflow by ID
export const getWorkflowById = async (id) => {
  try {
    const response = await API.get(`/workflow/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to fetch workflow" };
  }
};

export const getAllWorkflow = async () => {
  try {
    const response = await API.get(`/workflow/all`);
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    return { success: false, message: error.message || "Failed to update workflow" };
  }
};

export const deleteWorkflow = async (id) => {
  try {
    const response = await API.delete(`/workflow/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message || "Failed to delete workflow" };
  }
};
