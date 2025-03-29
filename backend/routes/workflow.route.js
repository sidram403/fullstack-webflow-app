const express = require("express");
const {
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    getAllWorkflows,
    getWorkflowById,
    updateWorkflowWithStatus
} = require("../controllers/workflow.controller.js");

const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Routes with Authentication
router.post("/create", authMiddleware, createWorkflow);
router.put("/:id", authMiddleware, updateWorkflow);
router.put("/update-status/:id", authMiddleware, updateWorkflowWithStatus);
router.delete("/:id", authMiddleware, deleteWorkflow);
router.get("/all", getAllWorkflows);
router.get("/:id", getWorkflowById);

module.exports = router;
