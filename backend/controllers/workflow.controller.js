// const Workflow = require("../models/workflow.model.js");
// const moment = require("moment")

import Workflow from '../models/workflow.model.js'
import moment from 'moment'

// Create Workflow
export const createWorkflow = async (req, res) => {
  try {
    const { title, name, workflow, status, description } = req.body;
    const editor = req.user?.user || "Unknown Editor";
    const workflowData = new Workflow({
      title,
      name,
      workflow,
      status,
      description,
      editor,
      editedAt: new Date(),
    });
    await workflowData.save();
    res.status(201).json({ success: true, data: workflowData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all workflows
export const getAllWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find({});
    res.status(200).json({ success: true, data: workflows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get workflow by ID
export const getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow)
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });

    res.status(200).json({ success: true, data: workflow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a workflow
export const updateWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!workflow)
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });

    res.status(200).json({ success: true, data: workflow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWorkflowWithStatus = async (req, res) => {
  const id = req.params.id;
  const { status, details } = req.body;
  const _id = id;

  try {
      const formattedDetails = details.map(detail => ({
          ...detail,
          time: moment().format("DD/MM - HH:mm [IST]") // Correct timestamp format
      }));

      const updatedWorkflow = await Workflow.findByIdAndUpdate(
          _id,
          {
              status,
              $set: { details: formattedDetails } // Initialize or overwrite details
          },
          { new: true, upsert: true } // Ensures new entry creation if not found
      );

      if (!updatedWorkflow) {
          return res.status(404).json({ message: "Workflow not found" });
      }

      res.status(200).json(updatedWorkflow);
  } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Error updating workflow", error });
  }
};

// Delete a workflow
export const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow)
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });

    res
      .status(200)
      .json({ success: true, message: "Workflow deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
