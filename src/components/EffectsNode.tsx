import React from "react";
import { Handle, Position } from "reactflow";

interface EffectsNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    nodeType?: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const EffectsNode: React.FC<EffectsNodeProps> = ({ data, id }) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-purple-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">✨</span>
            {data.label}
            {data.sceneNumber && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Scene {data.sceneNumber}
              </span>
            )}
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
              Visual Effects:
            </label>
            <div className="space-y-1">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Fade In/Out</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Zoom</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Pan</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Ken Burns</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color Grading:
            </label>
            <select className="w-full p-2 border rounded text-sm">
              <option value="none">None</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="vintage">Vintage</option>
              <option value="dramatic">Dramatic</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transition:
            </label>
            <select className="w-full p-2 border rounded text-sm">
              <option value="cut">Cut</option>
              <option value="fade">Fade</option>
              <option value="wipe">Wipe</option>
              <option value="slide">Slide</option>
              <option value="dissolve">Dissolve</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration:
            </label>
            <input
              type="text"
              defaultValue="1s"
              className="w-full p-2 border rounded text-sm"
              placeholder="e.g., 1s, 0.5s"
            />
          </div>
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

export default EffectsNode;
