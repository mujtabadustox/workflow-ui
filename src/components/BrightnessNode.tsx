import React, { useState } from "react";
import { Handle, Position } from "reactflow";

const BrightnessNode = ({
  data,
  id,
}: {
  data: { label: string; deleteNode?: (nodeId: string) => void };
  id: string;
}) => {
  const [brightness, setBrightness] = useState(100);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-yellow-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">☀️</span>
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
        <label
          htmlFor="brightness"
          className="text-sm font-medium text-gray-600"
        >
          Brightness: {brightness}%
        </label>
        <input
          type="range"
          id="brightness"
          min="0"
          max="200"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500"
      />
    </div>
  );
};

export default BrightnessNode;
