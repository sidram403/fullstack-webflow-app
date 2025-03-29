import { useEffect, useRef, useState } from "react";
import { Connector, EndNode, StartNode } from "../components/Nodes";
import PlusIcon from "../components/PlusIcon";
import ActionMenu from "../components/ActionMenu";
import { Trash2 } from "lucide-react";
import ConfigurationForm from "../components/ConfigurationForm";
import { Link, useNavigate } from "react-router-dom";
import SaveModal from "../components/SaveModal";
import { create } from "../api/workflowApi";

export default function FlowChart() {
  const [scale, setScale] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [selectActionToAdd, setSelectActionToAdd] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [isConfigFormVisible, setIsConfigFormVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [workflowData, setWorkflowData] = useState([]);
  const [selectedActionData, setSelectedActionData] = useState({});
  const [savedWorkflowData, setSavedWorkflowData] = useState([]);
  const [title, setTitle] = useState("Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveFormData, setSaveFormData] = useState({});
  
  const menuRef = useRef(null);
  

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const navigate = useNavigate();

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsVisible(false);
    }
  };

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
    setSelectActionToAdd(true);
    setIsConfigFormVisible(true);
    setSelectedAction(action);


    const updatedSelectedData = workflowData.filter((item) =>
      workflowData.length > 0 ? item?.index === index : item?.index === index
    );

    setSelectedActionData(updatedSelectedData[0]);
  };

  const handleSaveFormSubmit = async(data) => {
    // return data

    try {
      const updatedData = [...workflowData];

      const saveData = {
        title: title,
        workflow: updatedData,
        name: data?.name,
        description: data?.description,
        status: "Pending",
      };
      setSaveFormData({name: data?.name, description:data?.description})
      setSavedWorkflowData(saveData);
      const response = await create(saveData);
      if (response.success) {
        console.log(response.data);
  
        navigate("/");
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSaveWorkflowData = () => {
    setIsSaveModalOpen(true);
  };

  const handleDataSubmit = async (data) => {

    // Step 1: Create updated data object
    const updatedWorkflowData = {
      index: selectedNodeIndex,
      ...data,
    };

    setSelectedActionData(updatedWorkflowData);

    // Step 2: Deep copy workflow data
    const updatedData = [...workflowData];

    // Step 3: Check for duplicate indexes and shift indexes accordingly
    for (let i = updatedData.length - 1; i >= 0; i--) {
      if (updatedData[i].index >= updatedWorkflowData.index) {
        updatedData[i].index += 1;
      }
    }

    // Step 4: Add the new object to the correct position
    updatedData.push(updatedWorkflowData);

    // Step 5: Sort the array based on index for correct workflow order
    updatedData.sort((a, b) => a.index - b.index);

    // Step 6: Update the state
    setWorkflowData(updatedData);

  
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
  };

  const handleGoBack = () => {
    navigate("/");
    setWorkflowData([]);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-[#FDF6F0] relative overflow-auto"
      style={{
        backgroundImage: "url('./public/bg-workflow.png')",
      }}
    >
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <button
          onClick={handleGoBack}
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
            onKeyDown={handleKeyDown}
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
          onClick={handleSaveWorkflowData}
          className="bg-yellow-400 px-3 py-1 rounded-md shadow-sm cursor-pointer"
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

      {/* Flowchart Container */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Start Node */}
        <StartNode />

        {/* Connector + Initial Plus Icon */}
        <Connector />
        <PlusIcon onClick={() => handleAddNode(0)} />
        <Connector />

        {/* Dynamic Nodes with Connectors */}
        {nodes.map((node, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() => handleSelectActionToAdd(node.type, index)}
              className={`${
                selectActionToAdd ? "bg-[#F7FAEF]" : "bg-white"
              } text-black w-50 py-4 px-4 text-center rounded-md shadow-md flex items-center justify-between cursor-pointer border border-[#849E4C]`}
            >
              <p>{node.type}</p>
              <Trash2 className="text-red-900 text-14" />
            </button>
            <Connector />
            <PlusIcon onClick={() => handleAddNode(index + 1)} />
            <Connector />
          </div>
        ))}

        {/* End Node */}
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
