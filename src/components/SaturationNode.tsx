import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";

interface SaturationNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onSaturationChange?: (value: number) => void;
    saturation?: number;
  };
  id: string;
}

const SaturationNode: React.FC<SaturationNodeProps> = ({ data, id }) => {
  const [saturationValue, setSaturationValue] = useState(
    data.saturation || 100
  );

  // Update parent when saturation changes
  useEffect(() => {
    if (data.onSaturationChange) {
      data.onSaturationChange(saturationValue);
    }
  }, [saturationValue, data.onSaturationChange]);

  // Update local state when prop changes
  useEffect(() => {
    if (data.saturation !== undefined) {
      setSaturationValue(data.saturation);
    }
  }, [data.saturation]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-pink-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-pink-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-pink-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🎨</span>
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
          htmlFor="saturation"
          className="text-sm font-medium text-gray-600"
        >
          Saturation: {saturationValue}%
        </label>
        <input
          type="range"
          id="saturation"
          min="0"
          max="200"
          value={saturationValue}
          onChange={(e) => setSaturationValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between mt-2">
          <button
            onClick={() => setSaturationValue(50)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Muted
          </button>
          <button
            onClick={() => setSaturationValue(100)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Normal
          </button>
          <button
            onClick={() => setSaturationValue(150)}
            className="text-xs p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Vibrant
          </button>
        </div>

        <div className="mt-2 text-sm text-green-600">
          ✅ Live preview active
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-pink-500"
      />
    </div>
  );
};

export default SaturationNode;
