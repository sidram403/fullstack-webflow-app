import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createWorkflow, deleteWorkflow, getAllWorkflows, getWorkflowById, updateWorkflow, updateWorkflowWithStatus } from '../controllers/workflow.controller.js';


const router = express.Router();

// Routes with Authentication
router.post("/create", authMiddleware, createWorkflow);
router.put("/:id", authMiddleware, updateWorkflow);
router.put("/update-status/:id", authMiddleware, updateWorkflowWithStatus);
router.delete("/:id", authMiddleware, deleteWorkflow);
router.get("/all", getAllWorkflows);
router.get("/:id", getWorkflowById);

export default router;
