import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Plus,
  Menu,
  Pin,
  ArrowDown,
  ArrowUp,
  CircleChevronLeft,
  CircleChevronRight,
  ExternalLink,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteWorkflow,
  getAllWorkflow,
  getWorkflowById,
  updateWorkflowStatus,
} from "../api/workflowApi";
import {
  generateShortId,
  getFormattedDate,
  getFormattedTime,
} from "../../utils";
import useAuthStore from "../store/authStore";
import { executeWorkflow } from "../api/workflowExecution";
import { details } from "framer-motion/client";

const workflows = [
  {
    id: "#500",
    name: "Workflow 1",
    editor: "Editor A | 22:43 IST - 28/05",
    description: "Description for workflow 1...",
    details: [
      {
        id: "1",
        date: "28/06-22:43 IST",
        status: "Passed",
        link: "https://example.com",
      },
      {
        id: "2",
        date: "28/06-22:43 IST",
        status: "Failed",
        link: "https://example.com",
      },
      {
        id: "3",
        date: "28/06-22:43 IST",
        status: "Failed",
        link: "https://example.com",
      },
    ],
  },
  {
    id: "#501",
    name: "Workflow 2",
    editor: "Editor B | 22:45 IST - 29/05",
    description: "Description for workflow 2...",
    details: [
      {
        id: "1",
        date: "28/06-22:43 IST",
        status: "Passed",
        link: "https://example.com",
      },
      {
        id: "2",
        date: "28/06-22:43 IST",
        status: "Failed",
        link: "https://example.com",
      },
    ],
  },
  {
    id: "#502",
    name: "Workflow 3",
    editor: "Editor C | 10:30 IST - 30/05",
    description: "Description for workflow 3...",
    details: [
      {
        id: "1",
        date: "28/06-22:43 IST",
        status: "Passed",
        link: "https://example.com",
      },
      {
        id: "2",
        date: "28/06-22:43 IST",
        status: "Passed",
        link: "https://example.com",
      },
    ],
  },
  {
    id: "#503",
    name: "Workflow 4",
    editor: "Editor D | 14:10 IST - 31/05",
    description: "Description for workflow 4...",
    details: [
      {
        id: "1",
        date: "28/06-22:43 IST",
        status: "Passed",
        link: "https://example.com",
      },
    ],
  },
];

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const [pinActive, setPinActive] = useState(null);
  const [moreBtnActive, setMoreBtnActive] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [workflowData, setWorkflowData] = useState([]);
  const [filteredWorkflowData, setFilteredWorkflowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // ➡️ Pagination State
  const totalPages = Math.ceil(filteredWorkflowData.length / ITEMS_PER_PAGE);
  const [executionData, setExecutionData] = useState({});

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const deleteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteRef.current && !deleteRef.current.contains(event.target)) {
        setMoreBtnActive(null); // Deactivate the delete button
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMoreBtnActive]);

  // const togglePin = (id) => {
  //   setPinActive((prev) => (prev === id ? null : id));
  // };

  const toggleMoreBtn = (id) => {
    setMoreBtnActive((prev) => (prev === id ? null : id));
  };

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const paginatedData = filteredWorkflowData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const fetchData = async () => {
    const response = await getAllWorkflow();
    if (response.success) {
      setWorkflowData(response.data);
      setFilteredWorkflowData(response.data); // Initially display all data
    } else {
      console.error(response.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = workflowData
      .filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          generateShortId(workflow._id).includes(searchQuery)
      )
      .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

    setFilteredWorkflowData(filteredData);
  }, [searchQuery, workflowData]);

  const handleDeleteWorkflow = async (id) => {
    const response = await deleteWorkflow(id);
    if (response.success) {
      console.log(response.data);
      setMoreBtnActive(null);
      fetchData();
      // navigate("/");
    } else {
      console.log(response.message);
    }
  };

  const handleLogout = async () => {
    logout();
  };

  const togglePin = (id) => {
    setPinActive((prev) => (prev === id ? null : id));

    setWorkflowData((prevData) =>
      prevData.map((workflow) =>
        workflow._id === id
          ? { ...workflow, isPinned: !workflow.isPinned }
          : workflow
      )
    );
  };

  const updateworkflowWithStatus = async (id, data) => {
    const response = await updateworkflowWithStatus(id, data);
    if (response.success) {
      console.log(response.data);

    } else {
      console.log(response.message);
    }
    fetchData();
  };

  const handleExecute = async (id) => {
    const response = await getWorkflowById(id);

    if (response.success) {
      console.log("getbyid", response.data);

      const result = await executeWorkflow(response.data.workflow);

      const newDetail = {
        status: result.status,
        time: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
      };

      // Check if workflow ID already exists in state, otherwise initialize
      const existingDetails = executionData[id] || [];
      const updatedDetails = [...existingDetails, newDetail];

      // Update state with new details for the specific workflow
      setExecutionData((prevData) => ({
        ...prevData,
        [id]: updatedDetails,
      }));

      const updatedData = {
        status: result.status,
        details: updatedDetails,
      };

      console.log(updatedDetails);

      await updateWorkflowStatus(id, updatedData);

      if (result.status === "Passed") {
        alert(`Success: ${result.message}`);
      } else {
        alert(`Failed: ${result.message}`);
      }
    }
  };

  return (
    <div className="bg-[#F8F2E7] min-h-screen p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-md border border-gray-200">
            <Menu color="gray" size={20} />
          </div>
          <h2 className="text-lg font-semibold">Workflow Builder</h2>
        </div>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 text-sm rounded flex items-center cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto my-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 p-2 pl-10 border border-gray-300 rounded-lg w-1/3 bg-white focus:none">
            <input
              type="text"
              placeholder="Search by Workflow Name/ID"
              className="w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="text-gray-400" />
          </div>
          <Link to={"/create-workflow"}>
            <button className="bg-black text-white px-4 py-2 text-sm rounded flex items-center cursor-pointer">
              <Plus size={16} className="mr-2" /> Create New Process
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-10 ">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-700 text-center">
                <th className="py-3 px-3">Workflow Name</th>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Last Edited On</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 > 0 ? (
                paginatedData?.map((workflow) => (
                  <React.Fragment key={workflow._id}>
                    <tr className="border-b border-gray-200 text-center">
                      <td className="py-4 px-3 text-[14px] text-[#4F4F4F] font-medium">
                        {workflow.name}
                      </td>
                      <td className="py-4 px-3 text-[14px] text-[#4F4F4F] font-normal">
                        #{generateShortId(workflow._id)}
                      </td>
                      <td className="py-4 px-3 text-[14px] text-[#4F4F4F] font-normal">
                        {`${workflow.editor} | ${getFormattedTime(
                          workflow.editedAt
                        )} IST - ${getFormattedDate(workflow.editedAt)}`}
                      </td>
                      <td className="py-4 px-3 truncate w-60 text-[14px] text-[#4F4F4F] font-normal">
                        {workflow.description}
                      </td>
                      <td className="py-4 px-3 flex items-center space-x-2 gap-3 relative text-[14px] text-[#4F4F4F] font-normal">
                        <Pin
                          onClick={() => togglePin(workflow._id)}
                          className="rotate-45 cursor-pointer"
                          size={20}
                          fill={pinActive === workflow._id ? "yellow" : "none"}
                        />

                        <button
                          onClick={() => handleExecute(workflow._id)}
                          className="bg-white border border-gray-300 text-[12px] text-[#221F20] font-medium px-3 py-1 rounded"
                        >
                          Execute
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/edit-workflow/${workflow._id}`)
                          }
                          className="bg-white border border-gray-300 text-[12px] text-[#221F20] font-medium px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <div className="relative">
                          <button
                            className="p-1 cursor-pointer"
                            onClick={() => toggleMoreBtn(workflow._id)}
                          >
                            <MoreVertical size={18} />
                          </button>
                          <div ref={deleteRef}>
                            {moreBtnActive === workflow._id && (
                              <div
                                className="cursor-pointer absolute top-8 left-0 -translate-x-1/2 bg-white text-red-500 text-sm font-semibold py-1 px-2 rounded-md"
                                style={{
                                  boxShadow:
                                    "0px 0px 16px 0px rgba(44, 62, 80, 0.2)",
                                }}
                              >
                                <div className="absolute -top-2 right-0 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
                                <button
                                  onClick={() =>
                                    handleDeleteWorkflow(workflow._id)
                                  }
                                  className="underline cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          className="p-1 cursor-pointer"
                          onClick={() => toggleExpand(workflow._id)}
                        >
                          {expandedRow === workflow._id &&
                          workflow.details?.length > 0 ? (
                            <ArrowUp size={18} />
                          ) : (
                            <ArrowDown size={18} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {expandedRow === workflow._id &&
                      workflow?.details?.length > 0 && (
                        <tr className="bg-[#FEF3E9]">
                          <td colSpan="5" className="p-4 text-left ">
                            {workflow.details.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 relative pl-6 pb-6 last:pb-0"
                              >
                                {/* Timeline Connector */}
                                {index !== workflow.details.length - 1 && (
                                  <span className="absolute left-[31px] top-5 h-full w-[2px] bg-orange-300"></span>
                                )}
                                {/* Timeline Dot */}
                                <span className="w-4 h-4 bg-orange-500 rounded-full border-2 border-orange-300"></span>
                                {/* Date & Status */}
                                <span className="text-sm text-black whitespace-nowrap">
                                  {item.time}
                                </span>
                                <span
                                  className={`text-xs font-normal px-2 py-1 rounded-md text-black ${
                                    item.status === "Passed"
                                      ? "bg-[#DDEBC0] "
                                      : "bg-[#F8AEA8]"
                                  }`}
                                >
                                  {item.status}
                                </span>
                                {/* External Link Icon */}
                                <SquareArrowOutUpRight onClick={() => navigate(`/edit-workflow/${workflow._id}`)} className="w-5 h-5 text-black cursor-pointer" />
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))
              ) : (
                // No Data Found Message
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No workflows found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredWorkflowData.length > 0 && (
            <div className="flex items-center justify-end gap-4 mt-4">
              <CircleChevronLeft
                className={`text-[12px] text-[#221F20] ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handlePrevPage}
              />

              <div className="space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1 ? "bg-[#FEF3E9]" : "bg-none"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <CircleChevronRight
                className={`text-[12px] text-[#221F20] ${
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleNextPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
