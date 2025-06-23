import React, { useState, useCallback } from "react";
import { Handle, Position, useReactFlow, useEdges, type Edge } from "reactflow";

interface ImagePreviewNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const ImagePreviewNode: React.FC<ImagePreviewNodeProps> = ({ data, id }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImageUrl(
        `https://via.placeholder.com/300x250/7C3AED/FFFFFF?text=Final+Image`
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-200 min-w-80">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="w-3 h-3 bg-purple-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-between">
          <span>{data.label}</span>
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

        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 mb-3">
          {generatedImageUrl ? (
            <img
              src={generatedImageUrl}
              alt="Generated"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              {isGenerating ? "⏳ Generating..." : "Click Generate"}
            </span>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
            isGenerating
              ? "bg-gray-400"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {isGenerating
            ? "⏳ Generating Final Image..."
            : "🚀 Generate Final Image"}
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default ImagePreviewNode;
