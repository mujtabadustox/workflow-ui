import React, { useState } from "react";
import { Handle, Position } from "reactflow";

interface TextGenerationNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    nodeType?: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const TextGenerationNode: React.FC<TextGenerationNodeProps> = ({
  data,
  id,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedText(
        "This is a sample generated text output. In a real implementation, this would call your AI API to generate content based on the prompt."
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📝</span>
            {data.label}
            {data.sceneNumber && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
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
              placeholder="Enter your text prompt..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model:
              </label>
              <select className="p-1 border rounded text-sm">
                <option>GPT-4</option>
                <option>Claude</option>
                <option>Gemini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Length:
              </label>
              <input
                type="number"
                className="w-16 p-1 border rounded text-sm"
                defaultValue={100}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
              isGenerating
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isGenerating ? "⏳ Generating..." : "🚀 Generate Text"}
          </button>

          {generatedText && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview:
              </label>
              <div className="w-full p-2 border rounded text-sm bg-gray-50 max-h-20 overflow-y-auto">
                {generatedText}
              </div>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default TextGenerationNode;
