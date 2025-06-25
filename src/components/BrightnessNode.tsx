import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";

interface BrightnessNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onBrightnessChange?: (value: number) => void;
    onContrastChange?: (value: number) => void;
    brightness?: number;
    contrast?: number;
  };
  id: string;
}

const BrightnessNode: React.FC<BrightnessNodeProps> = ({ data, id }) => {
  const [brightnessValue, setBrightnessValue] = useState(
    data.brightness || 100
  );
  const [contrastValue, setContrastValue] = useState(data.contrast || 100);

  // Update parent when values change
  useEffect(() => {
    if (data.onBrightnessChange) {
      data.onBrightnessChange(brightnessValue);
    }
  }, [brightnessValue, data.onBrightnessChange]);

  useEffect(() => {
    if (data.onContrastChange) {
      data.onContrastChange(contrastValue);
    }
  }, [contrastValue, data.onContrastChange]);

  // Update local state when props change
  useEffect(() => {
    if (data.brightness !== undefined) {
      setBrightnessValue(data.brightness);
    }
  }, [data.brightness]);

  useEffect(() => {
    if (data.contrast !== undefined) {
      setContrastValue(data.contrast);
    }
  }, [data.contrast]);

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
          Brightness: {brightnessValue}%
        </label>
        <input
          type="range"
          id="brightness"
          min="0"
          max="200"
          value={brightnessValue}
          onChange={(e) => setBrightnessValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <label
          htmlFor="contrast"
          className="text-sm font-medium text-gray-600 mt-2"
        >
          Contrast: {contrastValue}%
        </label>
        <input
          type="range"
          id="contrast"
          min="0"
          max="200"
          value={contrastValue}
          onChange={(e) => setContrastValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <div className="mt-2 text-sm text-green-600">
          ✅ Live preview active
        </div>
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
