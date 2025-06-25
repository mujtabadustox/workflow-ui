import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";

interface BlurNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onBlurChange?: (value: number) => void;
    blur?: number;
  };
  id: string;
}

const BlurNode: React.FC<BlurNodeProps> = ({ data, id }) => {
  const [blurRadius, setBlurRadius] = useState(data.blur || 0);

  // Update parent when blur changes
  useEffect(() => {
    if (data.onBlurChange) {
      data.onBlurChange(blurRadius);
    }
  }, [blurRadius, data.onBlurChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (data.blur !== undefined) {
      setBlurRadius(data.blur);
    }
  }, [data.blur]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🌫️</span>
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

        <label htmlFor="blur" className="text-sm font-medium text-gray-600">
          Blur Radius: {blurRadius}px
        </label>
        <input
          type="range"
          id="blur"
          min="0"
          max="20"
          value={blurRadius}
          onChange={(e) => setBlurRadius(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between mt-2">
          <button
            onClick={() => setBlurRadius(2)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Light
          </button>
          <button
            onClick={() => setBlurRadius(8)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Medium
          </button>
          <button
            onClick={() => setBlurRadius(15)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Heavy
          </button>
        </div>

        <div className="mt-2 text-sm text-green-600">
          ✅ Live preview active
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default BlurNode;
