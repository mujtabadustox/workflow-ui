import React from "react";
import { Handle, Position } from "reactflow";

interface OutputNodeProps {
  data: {
    label: string;
  };
}

const OutputNode: React.FC<OutputNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-red-800 mb-2 flex items-center">
          <span className="mr-2">📤</span>
          {data.label}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Output Format:
            </label>
            <select className="w-full p-2 border rounded text-sm">
              <option>Download File</option>
              <option>Save to Gallery</option>
              <option>Share Link</option>
              <option>Email</option>
              <option>API Response</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              File Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm"
              placeholder="my_creation_{timestamp}"
            />
          </div>

          <div className="flex space-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quality:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-save:
              </label>
              <input type="checkbox" className="mt-2" defaultChecked />
            </div>
          </div>

          <div className="bg-gray-100 p-2 rounded text-xs">
            <div className="font-medium">Preview:</div>
            <div className="text-gray-600">Output will appear here...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputNode;
