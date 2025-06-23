import React from "react";
import { Handle, Position } from "reactflow";

const ImageSettingsNode = ({
  data,
  id,
}: {
  data: { label: string; deleteNode?: (nodeId: string) => void };
  id: string;
}) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-sky-200 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-sky-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-sky-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🛠️</span>
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
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <select className="w-full p-1 border rounded text-sm bg-gray-50">
              <option>DALL-E 3</option>
              <option>Midjourney</option>
              <option>Stable Diffusion</option>
              <option>Firefly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <select className="w-full p-1 border rounded text-sm bg-gray-50">
              <option>1024x1024</option>
              <option>1792x1024</option>
              <option>1024x1792</option>
            </select>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="w-3 h-3 bg-sky-500"
      />
    </div>
  );
};

export default ImageSettingsNode;
