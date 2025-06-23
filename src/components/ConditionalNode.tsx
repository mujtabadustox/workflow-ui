import React from "react";
import { Handle, Position } from "reactflow";

interface ConditionalNodeProps {
  data: {
    label: string;
  };
}

const ConditionalNode: React.FC<ConditionalNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-yellow-800 mb-2 flex items-center">
          <span className="mr-2">⚡</span>
          {data.label}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition:
            </label>
            <select className="w-full p-2 border rounded text-sm">
              <option>Quality Score &gt; 0.8</option>
              <option>Content Safe</option>
              <option>Style Match</option>
              <option>Custom Logic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Custom Rule:
            </label>
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder="Enter custom condition..."
              rows={2}
            />
          </div>

          <div className="flex justify-between text-xs font-medium">
            <span className="text-green-600">✓ TRUE</span>
            <span className="text-red-600">✗ FALSE</span>
          </div>
        </div>
      </div>

      {/* True path */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-500"
        style={{ top: "60%" }}
      />

      {/* False path */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-500"
        style={{ top: "80%" }}
      />
    </div>
  );
};

export default ConditionalNode;
