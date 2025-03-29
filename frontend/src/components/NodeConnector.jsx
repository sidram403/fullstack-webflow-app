import { Plus } from "lucide-react";

export default function NodeConnecter({ label, onAddClick }) {
    return (
        <>
            <div className="bg-white relative border w-6 h-6 flex items-center justify-center rounded-full shadow-md text-lg font-bold cursor-pointer" onClick={onAddClick}>
                <Plus size={16} />
            </div>
            <div className="w-1 h-6 bg-gray-600"></div>
            {label && (
                <div className="bg-blue-500 text-white w-24 py-1 text-center rounded-md shadow-md">
                    {label}
                </div>
            )}
            <div className="w-1 h-6 bg-gray-600"></div>
        </>
    );
}
