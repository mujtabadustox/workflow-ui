import React, { useState, useRef } from "react";
import { Handle, Position } from "reactflow";

interface PromptNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    onImageUpload?: (imageUrl: string) => void;
    uploadedImage?: string | null;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    saturation?: number;
    rotation?: number;
    blur?: number;
    scale?: number;
    onGenerateClick?: () => void;
  };
  id: string;
}

const PromptNode: React.FC<PromptNodeProps> = ({ data, id }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (data.onImageUpload) {
          data.onImageUpload(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate processing delay
    setTimeout(() => {
      setIsGenerating(false);
      if (data.onGenerateClick) {
        data.onGenerateClick();
      }
    }, 2000); // 2 second delay
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-200 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-indigo-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-indigo-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📝</span>
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

        {/* Image Upload Section */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Upload Image
          </label>
          <button
            onClick={triggerFileUpload}
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            {data.uploadedImage ? "Change Image" : "Click to upload image"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Image Preview */}
        {data.uploadedImage && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Original Image
            </label>
            <img
              src={data.uploadedImage}
              alt="Original"
              className="w-full h-48 object-contain rounded border"
            />
          </div>
        )}

        {/* Prompt Textarea */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded text-sm bg-gray-50"
            placeholder="Describe any modifications you want..."
            rows={3}
          />
        </div>

        {/* Status */}
        {data.uploadedImage && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            ✅ Image uploaded successfully!
            <button
              onClick={handleGenerate}
              className="w-full mt-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-indigo-500"
      />
    </div>
  );
};

export default PromptNode;
