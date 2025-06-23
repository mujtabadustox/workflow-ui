import React from "react";
import { Handle, Position } from "reactflow";

interface SequenceNodeProps {
  data: {
    label: string;
  };
}

const SequenceNode: React.FC<SequenceNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-200 min-w-52">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-indigo-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-indigo-800 mb-2 flex items-center">
          <span className="mr-2">🔄</span>
          {data.label}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sequence Type:
            </label>
            <select className="w-full p-2 border rounded text-sm">
              <option>Story Sequence</option>
              <option>Comic Book</option>
              <option>Movie Scenes</option>
              <option>Social Media Series</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Steps:
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded text-sm"
              defaultValue={4}
              min={2}
              max={10}
            />
          </div>

          <div className="flex space-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timing:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>Sequential</option>
                <option>Parallel</option>
                <option>Conditional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-run:
              </label>
              <input type="checkbox" className="mt-2" />
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-indigo-500"
      />
    </div>
  );
};

export default SequenceNode;
