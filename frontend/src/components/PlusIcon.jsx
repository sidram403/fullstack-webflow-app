import { Plus } from "lucide-react";

export default function PlusIcon({ onClick }) {
    return (
        <div
            className="bg-white border w-6 h-6 flex items-center justify-center rounded-full shadow-md text-lg font-bold cursor-pointer"
            onClick={onClick}
        >
            <Plus size={16} />
        </div>
    );
}
