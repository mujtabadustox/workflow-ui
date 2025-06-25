import React, { useState, useEffect, useRef, useCallback } from "react";
import { Handle, Position } from "reactflow";

interface GrayscaleNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onGrayscaleChange?: (value: number) => void;
    grayscale?: number;
  };
  id: string;
}

const GrayscaleNode: React.FC<GrayscaleNodeProps> = ({ data, id }) => {
  const [intensity, setIntensity] = useState(data.grayscale || 0);

  // Update parent when intensity changes
  useEffect(() => {
    if (data.onGrayscaleChange) {
      data.onGrayscaleChange(intensity);
    }
  }, [intensity, data.onGrayscaleChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (data.grayscale !== undefined) {
      setIntensity(data.grayscale);
    }
  }, [data.grayscale]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-gray-700 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">⚫</span>
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
          htmlFor="intensity"
          className="text-sm font-medium text-gray-600"
        >
          Intensity: {intensity}%
        </label>
        <input
          type="range"
          id="intensity"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="mt-2 text-sm text-green-600">
          ✅ Live preview active
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500"
      />
    </div>
  );
};

export default GrayscaleNode;
