import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  type Connection,
  type Edge,
  type NodeTypes,
  MarkerType,
} from "reactflow";

// Import the actual generator components
import TextGenerationNode from "./TextGenerationNode";
import ImageGenerationNode from "./ImageGenerationNode";
import VideoGenerationNode from "./VideoGenerationNode";

interface SceneNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    onDelete?: (id: string) => void;
    id?: string;
  };
}

const SceneNode: React.FC<SceneNodeProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  // Custom node types for the scene's internal workflow
  const sceneNodeTypes: NodeTypes = {
    textGeneration: TextGenerationNode,
    imageGeneration: ImageGenerationNode,
    videoGeneration: VideoGenerationNode,
  };

  // Real generator nodes inside the scene
  const initialSceneNodes = [
    {
      id: "script-gen",
      type: "textGeneration",
      position: { x: 50, y: 50 },
      data: { label: "Script Generator" },
    },
    {
      id: "voice-gen",
      type: "textGeneration",
      position: { x: 50, y: 200 },
      data: { label: "Voice Generator" },
    },
    {
      id: "image-gen",
      type: "imageGeneration",
      position: { x: 400, y: 50 },
      data: { label: "Scene Image" },
    },
    {
      id: "video-gen",
      type: "videoGeneration",
      position: { x: 750, y: 125 },
      data: { label: "Final Scene" },
    },
  ];

  const initialSceneEdges: Edge[] = [
    {
      id: "script-to-voice",
      source: "script-gen",
      target: "voice-gen",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#3b82f6", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
    },
    {
      id: "script-to-image",
      source: "script-gen",
      target: "image-gen",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
    },
    {
      id: "voice-to-video",
      source: "voice-gen",
      target: "video-gen",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#f59e0b", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
    },
    {
      id: "image-to-video",
      source: "image-gen",
      target: "video-gen",
      type: "smoothstep",
      animated: true,
      style: { stroke: "#ec4899", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ec4899" },
    },
  ];

  const [sceneNodes, setSceneNodes, onSceneNodesChange] =
    useNodesState(initialSceneNodes);
  const [sceneEdges, setSceneEdges, onSceneEdgesChange] =
    useEdgesState(initialSceneEdges);

  const onSceneConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: `hsl(${Math.random() * 360}, 70%, 50%)`,
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        },
      };
      setSceneEdges((eds) => addEdge(newEdge, eds));
    },
    [setSceneEdges]
  );

  const handleDelete = () => {
    if (data.onDelete && data.id) {
      data.onDelete(data.id);
    }
  };

  return (
    <div className="shadow-lg rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-purple-600"
      />

      {/* Scene Header */}
      <div className="px-4 py-3 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-purple-900 flex items-center">
            <span className="mr-2">🎬</span>
            {data.label} {data.sceneNumber && `#${data.sceneNumber}`}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-purple-600 hover:text-purple-800 px-3 py-1 rounded bg-purple-100 hover:bg-purple-200 text-sm font-medium"
            >
              {expanded ? "📥 Collapse" : "📤 Open Workflow"}
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-100 hover:bg-red-200"
            >
              🗑️
            </button>
          </div>
        </div>

        {!expanded && (
          <div className="mt-2 text-sm text-purple-700 bg-purple-100 p-2 rounded">
            📝 Script → 🎙️ Voice → 🎨 Image → 🎬 Video (Click "Open Workflow" to
            edit)
          </div>
        )}
      </div>

      {/* ACTUAL GENERATOR WORKFLOW CANVAS */}
      {expanded && (
        <div className="p-4">
          <div
            className="bg-white rounded-lg border-2 border-gray-300"
            style={{ height: "500px", width: "1100px" }}
          >
            <ReactFlow
              nodes={sceneNodes}
              edges={sceneEdges}
              onNodesChange={onSceneNodesChange}
              onEdgesChange={onSceneEdgesChange}
              onConnect={onSceneConnect}
              nodeTypes={sceneNodeTypes}
              fitView
              attributionPosition="bottom-left"
              zoomOnScroll={true}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            >
              <Background color="#f3f4f6" gap={20} size={1} />
              <Controls position="top-right" />
            </ReactFlow>
          </div>

          <div className="mt-3 text-sm text-gray-700 bg-yellow-100 p-3 rounded border-l-4 border-yellow-500">
            <div className="font-bold text-yellow-800 mb-1">
              🎬 Scene Workflow:
            </div>
            <div className="text-yellow-700">
              This scene contains REAL generator nodes! Edit prompts, connect
              nodes, and customize the workflow for this specific scene.
            </div>
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-purple-600"
      />
    </div>
  );
};

export default SceneNode;
