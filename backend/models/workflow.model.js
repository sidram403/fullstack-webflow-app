import mongoose from 'mongoose'

const WorkflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workflow: [
    {
      type: { type: String, enum: ["API Call", "Email", "Text Box"], required: true },
      method : {type: String},
      url:{type: String},
      headers:{type: String},
      body:{type: String},
      email:{type: String},
      index:{type: Number}

    },
  ],
  description:{type: String, required: true},
  title:{type: String, required: true},
  status: { type: String, enum: ["Pending", "Passed", "Failed"], default: "Pending" },
  editor: { type: String },
  editedAt: { type: Date },
  details: [
    {
      status: String,
      time: String,
    }
  ]
});

const Workflow= mongoose.model("Workflow", WorkflowSchema);

export default Workflow
