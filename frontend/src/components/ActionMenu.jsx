export default function ActionMenu({ onSelectAction }) {
    return (
        <div className="absolute top-[50%] right-[20%] -translate-y-1/2 bg-white rounded-md shadow-lg p-5">
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 
                            border-t-8 border-b-8 border-r-8 border-transparent 
                            border-r-white"
            ></div>

            <div className="flex items-center gap-4 flex-wrap w-[180px]">
                <button onClick={() => onSelectAction("API Call")} className="border border-[#E0E0E0] px-3 py-1 rounded-md text-black text-[16px] font-medium cursor-pointer">
                    API Call
                </button>
                <button onClick={() => onSelectAction("Email")} className="border border-[#E0E0E0] px-3 py-1 rounded-md text-black text-[16px] font-medium cursor-pointer">
                    Email
                </button>
                <button onClick={() => onSelectAction("Text Box")} className="border border-[#E0E0E0] px-3 py-1 rounded-md text-black text-[16px] font-medium cursor-pointer">
                    Text Box
                </button>
            </div>
        </div>
    );
}
