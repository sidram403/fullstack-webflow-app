import { useEffect, useRef, useState } from "react";
import { Connector, EndNode, StartNode } from "../components/Nodes";
import PlusIcon from "../components/PlusIcon";
import ActionMenu from "../components/ActionMenu";
import { Trash2 } from "lucide-react";
import ConfigurationForm from "../components/ConfigurationForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import SaveModal from "../components/SaveModal";
import { getWorkflowById, updateWorkflow } from "../api/workflowApi";



export default function EditWebflow() {
  const [scale, setScale] = useState(1);
  const [nodes, setNodes] = useState( []);
  const [workflowData, setWorkflowData] = useState( []);
  const [title, setTitle] = useState("Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [selectedEditIndex, setSelectedEditIndex] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isConfigFormVisible, setIsConfigFormVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedActionData, setSelectedActionData] = useState({});
  const [saveFormData, setSaveFormData] = useState({});
  

  const navigate = useNavigate();

  const { id } = useParams();

  const fetchWorkflowById = async() =>{
    const response = await getWorkflowById(id);
    if (response.success) {
      console.log("getbyid", response.data);
      setNodes(response.data?.workflow)
      setWorkflowData(response.data?.workflow)
      setTitle(response.data?.title)
      setSaveFormData({name: response.data?.name, description:response.data?.description})
      // navigate("/");
    } else {
      console.log(response.message);
    }
  }

  useEffect(() =>{
    fetchWorkflowById()
  },[id])

  const handleAddNode = (index) => {
    setSelectedNodeIndex(index);
    setIsMenuVisible(true);
  };

  const handleSelectAction = (action) => {
    const updatedNodes = [...nodes];
    updatedNodes.splice(selectedNodeIndex, 0, { type: action });
    setNodes(updatedNodes);
    setIsMenuVisible(false);
    setSelectedAction(action);
  };

  const handleSelectActionToAdd = (action, index) => {
    setIsConfigFormVisible(true);
    setSelectedAction(action);

    let updatedSelectedData;
    if (nodes.length === workflowData.length) {
      setSelectedEditIndex(index + 1);
      updatedSelectedData = workflowData.filter(
        (item) => item?.index === index
      );

      setSelectedActionData(updatedSelectedData[0]);
    } else {
      setSelectedEditIndex(null);
      setSelectedActionData(null);
    }
  };

  const handleDataSubmit = async (data) => {
    const updatedData = [...workflowData];
    const existingNodeIndex = await updatedData.findIndex(
      (item) => item.index === selectedEditIndex - 1
    );

    const updatedWorkflowData = {
      index: selectedEditIndex > 0 ? selectedEditIndex - 1 : selectedNodeIndex,
      ...data,
    };

    if (existingNodeIndex !== -1 && nodes.length === workflowData.length) {
      // Update existing node
      updatedData[existingNodeIndex] = updatedWorkflowData;
    } else {
      // Add new node and adjust indexing
      for (let i = updatedData.length - 1; i >= 0; i--) {
        if (updatedData[i].index >= updatedWorkflowData.index) {
          updatedData[i].index += 1;
        }
      }

      updatedData.push(updatedWorkflowData);
      updatedData.sort((a, b) => a.index - b.index);
    }

    setWorkflowData(updatedData);
  };

  const handleSaveFormSubmit = async (data) => {
    const saveData = {
      title: title,
      workflow: workflowData,
      name: data?.name,
      description: data?.description,
    };
    const response = await updateWorkflow(id, saveData);
    if (response.success) {
      console.log(response.data);

      // navigate("/");
    } else {
      console.log(response.message);
    }

    navigate("/");
  };

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-[#FDF6F0] relative "
      style={{ backgroundImage: "url('./public/bg-workflow.png')" }}
    >
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-white border px-3 py-1 rounded-md text-black shadow-sm"
        >
          ← Go Back
        </button>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="font-medium border border-gray-300 px-2 py-1 rounded-md outline-none"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="font-medium cursor-pointer"
          >
            {title}
          </span>
        )}
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="bg-yellow-400 px-3 py-1 rounded-md shadow-sm"
        >
          💾
        </button>
      </div>
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded-md shadow-md ">
        <button
          onClick={() => setScale(scale - 0.1)}
          className="px-2 py-1 border rounded-md cursor-pointer"
        >
          -
        </button>
        <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
        <button
          onClick={() => setScale(scale + 0.1)}
          className="px-2 py-1 border rounded-md cursor-pointer"
        >
          +
        </button>
      </div>

      <div
        className="relative flex flex-col items-center justify-center"
        style={{ transform: `scale(${scale})` }}
      >
        <StartNode />
        <Connector />
        <PlusIcon onClick={() => handleAddNode(0)} />
        <Connector />

        {nodes.map((node, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() => handleSelectActionToAdd(node.type, index)}
              className="bg-white text-black w-50 py-4 px-4 text-center rounded-md shadow-md flex items-center justify-between cursor-pointer border border-[#849E4C]"
            >
              <p>{node.type}</p>
              <Trash2 className="text-red-900 text-14" />
            </button>
            <Connector />
            <PlusIcon onClick={() => handleAddNode(index + 1)} />
            <Connector />
          </div>
        ))}

        <EndNode />
      </div>

      {isMenuVisible && <ActionMenu onSelectAction={handleSelectAction} />}
      {isConfigFormVisible && (
        <ConfigurationForm
          selectedAction={selectedAction}
          onClose={() => setIsConfigFormVisible(false)}
          onSubmit={handleDataSubmit}
          data={selectedActionData}
        />
      )}
      {isSaveModalOpen && (
        <SaveModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSubmit={handleSaveFormSubmit}
          data={saveFormData}
        />
      )}
    </div>
  );
}
