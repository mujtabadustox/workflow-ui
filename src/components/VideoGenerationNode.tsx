import React from "react";
import { Handle, Position } from "reactflow";

interface VideoGenerationNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    nodeType?: string;
    sceneType?: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const VideoGenerationNode: React.FC<VideoGenerationNodeProps> = ({
  data,
  id,
}) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🎬</span>
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
              Prompt:
            </label>
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder="Describe the video you want to generate..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>Runway Gen-2</option>
                <option>Pika Labs</option>
                <option>Stable Video</option>
                <option>Sora</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>4s</option>
                <option>8s</option>
                <option>16s</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resolution:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>720p</option>
                <option>1080p</option>
                <option>4K</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                FPS:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>24</option>
                <option>30</option>
                <option>60</option>
              </select>
            </div>
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

export default VideoGenerationNode;
