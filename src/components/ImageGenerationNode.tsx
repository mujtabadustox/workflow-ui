import React, { useState } from "react";
import { Handle, Position } from "reactflow";

interface ImageGenerationNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    nodeType?: string;
    sceneType?: string;
    nodeId?: string;
    addConnectedNode?: (targetNodeId: string, nodeType: string) => void;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const ImageGenerationNode: React.FC<ImageGenerationNodeProps> = ({
  data,
  id,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedImageUrl(
        "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Generated+Image"
      );
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-200 min-w-80">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-green-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🎨</span>
            {data.label}
            {data.sceneNumber && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
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

        <div className="space-y-3">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt:
            </label>
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder="Describe the image you want to generate..."
              rows={3}
            />
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model:
              </label>
              <select className="w-full p-1 border rounded text-sm">
                <option>DALL-E 3</option>
                <option>Midjourney</option>
                <option>Stable Diffusion</option>
                <option>Firefly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size:
              </label>
              <select className="w-full p-1 border rounded text-sm">
                <option>1024x1024</option>
                <option>1792x1024</option>
                <option>1024x1792</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
              isGenerating
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isGenerating ? "⏳ Generating..." : "🎨 Generate"}
          </button>

          {/* Built-in Preview */}
          <div className="border-t pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview:
            </label>
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="Generated"
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <span className="text-gray-400 text-sm">
                  {isGenerating ? "⏳ Generating..." : "No image generated yet"}
                </span>
              )}
            </div>
          </div>

          {/* Add Processing Nodes */}
          {data.addConnectedNode && data.nodeId && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Add Processing Nodes:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    data.addConnectedNode!(data.nodeId!, "grayscale")
                  }
                  className="flex items-center justify-center py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                >
                  <span className="mr-1">⚫</span>
                  Grayscale
                </button>
                <button
                  onClick={() =>
                    data.addConnectedNode!(data.nodeId!, "brightness")
                  }
                  className="flex items-center justify-center py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                >
                  <span className="mr-1">☀️</span>
                  Brightness
                </button>
                <button
                  onClick={() =>
                    data.addConnectedNode!(data.nodeId!, "rotation")
                  }
                  className="flex items-center justify-center py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                >
                  <span className="mr-1">🔄</span>
                  Rotation
                </button>
                <button
                  onClick={() =>
                    data.addConnectedNode!(data.nodeId!, "promptEnhance")
                  }
                  className="flex items-center justify-center py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                >
                  <span className="mr-1">✨</span>
                  Enhance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default ImageGenerationNode;
