import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";

interface ResizeNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onScaleChange?: (value: number) => void;
    scale?: number;
  };
  id: string;
}

const ResizeNode: React.FC<ResizeNodeProps> = ({ data, id }) => {
  const [scale, setScale] = useState(data.scale || 100);

  // Update parent when scale changes
  useEffect(() => {
    if (data.onScaleChange) {
      data.onScaleChange(scale);
    }
  }, [scale, data.onScaleChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (data.scale !== undefined) {
      setScale(data.scale);
    }
  }, [data.scale]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-green-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📏</span>
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

        <label htmlFor="scale" className="text-sm font-medium text-gray-600">
          Scale: {scale}%
        </label>
        <input
          type="range"
          id="scale"
          min="10"
          max="300"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between mt-2">
          <button
            onClick={() => setScale(50)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Small
          </button>
          <button
            onClick={() => setScale(100)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Normal
          </button>
          <button
            onClick={() => setScale(200)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Large
          </button>
        </div>

        <div className="mt-2 text-sm text-green-600">
          ✅ Live preview active
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default ResizeNode;
