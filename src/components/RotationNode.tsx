import React, { useState } from "react";
import { Handle, Position } from "reactflow";

const RotationNode = ({
  data,
  id,
}: {
  data: { label: string; deleteNode?: (nodeId: string) => void };
  id: string;
}) => {
  const [rotation, setRotation] = useState(0);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🔄</span>
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
        <label htmlFor="rotation" className="text-sm font-medium text-gray-600">
          Rotation: {rotation}°
        </label>
        <input
          type="range"
          id="rotation"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <button
            onClick={() => setRotation(90)}
            className="text-xs p-1 bg-gray-200 rounded"
          >
            90°
          </button>
          <button
            onClick={() => setRotation(180)}
            className="text-xs p-1 bg-gray-200 rounded"
          >
            180°
          </button>
          <button
            onClick={() => setRotation(270)}
            className="text-xs p-1 bg-gray-200 rounded"
          >
            270°
          </button>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default RotationNode;
