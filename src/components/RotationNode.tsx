import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";

interface RotationNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onRotationChange?: (value: number) => void;
    rotation?: number;
  };
  id: string;
}

const RotationNode: React.FC<RotationNodeProps> = ({ data, id }) => {
  const [rotationValue, setRotationValue] = useState(data.rotation || 0);

  // Update parent when rotation changes
  useEffect(() => {
    if (data.onRotationChange) {
      data.onRotationChange(rotationValue);
    }
  }, [rotationValue, data.onRotationChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (data.rotation !== undefined) {
      setRotationValue(data.rotation);
    }
  }, [data.rotation]);

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
          Rotation: {rotationValue}°
        </label>
        <input
          type="range"
          id="rotation"
          min="0"
          max="360"
          value={rotationValue}
          onChange={(e) => setRotationValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between mt-2">
          <button
            onClick={() => setRotationValue(90)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            90°
          </button>
          <button
            onClick={() => setRotationValue(180)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            180°
          </button>
          <button
            onClick={() => setRotationValue(270)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            270°
          </button>
        </div>

        <div className="mt-2 text-sm text-green-600">
          ✅ Live preview active
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
