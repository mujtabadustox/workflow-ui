import React from "react";
import { Handle, Position } from "reactflow";

interface SceneViewNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    nodeType?: string;
  };
}

const SceneViewNode: React.FC<SceneViewNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-orange-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500"
        style={{ top: "25%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="content"
        className="w-3 h-3 bg-orange-500"
        style={{ top: "50%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="effects"
        className="w-3 h-3 bg-orange-500"
        style={{ top: "75%" }}
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-orange-800 mb-2 flex items-center">
          <span className="mr-2">🎬</span>
          {data.label}
          {data.sceneNumber && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
              Scene {data.sceneNumber}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="bg-gray-50 p-2 rounded text-sm">
            <div className="font-medium text-gray-700 mb-1">Scene Preview</div>
            <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">
                Preview will appear here
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div>📝 Voice: Connected</div>
            <div>🎨 Content: Connected</div>
            <div>✨ Effects: Connected</div>
          </div>

          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-800 text-sm mb-1">
              Status
            </div>
            <div className="text-green-700 text-xs">Ready to generate</div>
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
            Generate Scene
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-500"
      />
    </div>
  );
};

export default SceneViewNode;
