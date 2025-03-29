export function StartNode() {
    return (
        <div className="bg-green-500 text-white w-24 h-24 flex items-center justify-center rounded-full shadow-lg text-lg font-bold">
            Start
        </div>
    );
}

export function EndNode() {
    return (
        <div className="bg-red-500 text-white w-24 h-24 flex items-center justify-center rounded-full shadow-lg text-lg font-bold">
            End
        </div>
    );
}

export  function Connector() {
    return <div className="w-1 h-8 bg-gray-400"></div>;
}
