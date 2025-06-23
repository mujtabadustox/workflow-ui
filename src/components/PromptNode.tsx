import React from "react";
import { Handle, Position } from "reactflow";

const PromptNode = ({
  data,
  id,
}: {
  data: { label: string; deleteNode?: (nodeId: string) => void };
  id: string;
}) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-200 w-64">
      <div className="flex flex-col">
        <div className="text-lg font-bold text-indigo-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📝</span>
            {data.label}
          </div>
          {data.deleteNode && (
            <button
              onClick={() => data.deleteNode!(id)}
              className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete node"
            >
              ✕
            </button>
          )}
        </div>
        <textarea
          className="w-full p-2 border rounded text-sm bg-gray-50"
          placeholder="Describe the image you want to generate..."
          rows={4}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-indigo-500"
      />
    </div>
  );
};

export default PromptNode;
