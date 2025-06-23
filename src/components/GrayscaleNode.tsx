import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";

interface GrayscaleNodeProps {
  data: {
    label: string;
    inputImage?: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const GrayscaleNode: React.FC<GrayscaleNodeProps> = ({ data, id }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputImage, setOutputImage] = useState("");
  const [intensity, setIntensity] = useState(50);

  const processImage = () => {
    if (!data.inputImage) return;

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      // In a real app, you'd use Canvas API to apply grayscale filter
      // For now, we'll just use the same image with CSS filter simulation
      setOutputImage(data.inputImage || "");
      setIsProcessing(false);
    }, 1000);
  };

  useEffect(() => {
    if (data.inputImage) {
      processImage();
    }
  }, [data.inputImage, intensity]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-300 w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-gray-700 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">⚫</span>
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
        <label
          htmlFor="intensity"
          className="text-sm font-medium text-gray-600"
        >
          Intensity: {intensity}%
        </label>
        <input
          type="range"
          id="intensity"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-500"
      />
    </div>
  );
};

export default GrayscaleNode;
