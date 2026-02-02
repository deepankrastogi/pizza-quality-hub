import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Annotation {
  id: string;
  defectType: string;
  tool: "box" | "polygon" | "point";
  points: { x: number; y: number }[];
  color: string;
}

interface AnnotationCanvasProps {
  imageUrl: string;
  selectedTool: "box" | "polygon" | "point";
  selectedDefect: string;
  defectColor: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  zoom: number;
  onZoomClick?: () => void;
}

const DEFECT_COLORS: Record<string, string> = {
  burnt: "#ef4444",
  undercooked: "#f59e0b",
  missing_topping: "#8b5cf6",
  uneven_cheese: "#3b82f6",
  bubble_defect: "#6b7280",
};

export function AnnotationCanvas({
  imageUrl,
  selectedTool,
  selectedDefect,
  defectColor,
  annotations,
  onAnnotationsChange,
  zoom,
  onZoomClick,
}: AnnotationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const getColor = (defectId: string) => DEFECT_COLORS[defectId] || "#6b7280";

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    annotations.forEach((annotation) => {
      const color = getColor(annotation.defectType);
      ctx.strokeStyle = color;
      ctx.fillStyle = color + "40";
      ctx.lineWidth = 3;

      if (annotation.tool === "box" && annotation.points.length === 2) {
        const [start, end] = annotation.points;
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.fillRect(start.x, start.y, width, height);
        ctx.strokeRect(start.x, start.y, width, height);
      } else if (annotation.tool === "polygon" && annotation.points.length > 2) {
        ctx.beginPath();
        ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
        annotation.points.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (annotation.tool === "point" && annotation.points.length === 1) {
        const point = annotation.points[0];
        ctx.beginPath();
        ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Draw crosshair
        ctx.beginPath();
        ctx.moveTo(point.x - 8, point.y);
        ctx.lineTo(point.x + 8, point.y);
        ctx.moveTo(point.x, point.y - 8);
        ctx.lineTo(point.x, point.y + 8);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw current annotation being created
    if (currentPoints.length > 0) {
      const color = getColor(selectedDefect);
      ctx.strokeStyle = color;
      ctx.fillStyle = color + "40";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      if (selectedTool === "box" && currentPoints.length === 2) {
        const [start, end] = currentPoints;
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.fillRect(start.x, start.y, width, height);
        ctx.strokeRect(start.x, start.y, width, height);
      } else if (selectedTool === "polygon" && currentPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        currentPoints.forEach((point) => ctx.lineTo(point.x, point.y));
        if (currentPoints.length > 2) {
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();
        // Draw points
        currentPoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        });
      }

      ctx.setLineDash([]);
    }
  }, [annotations, currentPoints, selectedDefect, selectedTool]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.shiftKey) {
      onZoomClick?.();
      return;
    }

    const coords = getCanvasCoords(e);

    if (selectedTool === "point") {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        defectType: selectedDefect,
        tool: "point",
        points: [coords],
        color: getColor(selectedDefect),
      };
      onAnnotationsChange([...annotations, newAnnotation]);
    } else if (selectedTool === "box") {
      setIsDrawing(true);
      setCurrentPoints([coords]);
    } else if (selectedTool === "polygon") {
      // Check if clicking near first point to close polygon
      if (currentPoints.length > 2) {
        const firstPoint = currentPoints[0];
        const distance = Math.sqrt(
          Math.pow(coords.x - firstPoint.x, 2) + Math.pow(coords.y - firstPoint.y, 2)
        );
        if (distance < 20) {
          const newAnnotation: Annotation = {
            id: Date.now().toString(),
            defectType: selectedDefect,
            tool: "polygon",
            points: currentPoints,
            color: getColor(selectedDefect),
          };
          onAnnotationsChange([...annotations, newAnnotation]);
          setCurrentPoints([]);
          return;
        }
      }
      setCurrentPoints([...currentPoints, coords]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "box") return;

    const coords = getCanvasCoords(e);
    setCurrentPoints([currentPoints[0], coords]);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "box") return;

    const coords = getCanvasCoords(e);
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      defectType: selectedDefect,
      tool: "box",
      points: [currentPoints[0], coords],
      color: getColor(selectedDefect),
    };
    onAnnotationsChange([...annotations, newAnnotation]);
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  const handleDoubleClick = () => {
    // Finalize polygon on double click
    if (selectedTool === "polygon" && currentPoints.length > 2) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        defectType: selectedDefect,
        tool: "polygon",
        points: currentPoints,
        color: getColor(selectedDefect),
      };
      onAnnotationsChange([...annotations, newAnnotation]);
      setCurrentPoints([]);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto"
      style={{ maxHeight: "60vh" }}
    >
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top left",
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          src={imageUrl}
          alt="Pizza to annotate"
          className="block"
          onLoad={handleImageLoad}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {imageLoaded && (
          <canvas
            ref={canvasRef}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className={cn(
              "absolute inset-0",
              selectedTool === "box" && "cursor-crosshair",
              selectedTool === "polygon" && "cursor-cell",
              selectedTool === "point" && "cursor-pointer"
            )}
            style={{ width: "100%", height: "100%" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </div>
    </div>
  );
}

export type { Annotation };
