import { useState } from "react";
import {
  Save,
  SkipForward,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Square,
  Pencil,
  MapPin,
  Undo,
  Redo,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ImageZoomDialog } from "@/components/ImageZoomDialog";
import { AnnotationCanvas, type Annotation } from "@/components/AnnotationCanvas";

// Mock data
const mockPizza = {
  id: "4521",
  url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  storeId: "1234",
  timestamp: "2024-01-15 10:23:45",
  type: "Pepperoni",
};

const scoringParameters = [
  { key: "toppingSpread", label: "Topping Spread", description: "Distribution evenness of toppings" },
  { key: "cheeseSpread", label: "Cheese Spread", description: "Coverage and distribution of cheese" },
  { key: "burnScore", label: "Burn Score", description: "Level of desired browning (higher = better)" },
  { key: "undercookedScore", label: "Undercooked Score", description: "Degree of proper cooking (higher = better)" },
  { key: "bubbleCount", label: "Bubble Count", description: "Number of crust bubbles" },
  { key: "bubbleSize", label: "Bubble Size", description: "Consistency of bubble sizes" },
];

const defectTypes = [
  { id: "burnt", label: "Burnt Area", color: "bg-destructive" },
  { id: "undercooked", label: "Undercooked", color: "bg-warning" },
  { id: "missing_topping", label: "Missing Topping", color: "bg-accent" },
  { id: "uneven_cheese", label: "Uneven Cheese", color: "bg-primary" },
  { id: "bubble_defect", label: "Bubble Defect", color: "bg-muted-foreground" },
];

export default function QualityScoring() {
  const [scores, setScores] = useState<Record<string, number>>({
    toppingSpread: 7,
    cheeseSpread: 8,
    burnScore: 8,
    undercookedScore: 9,
    bubbleCount: 7,
    bubbleSize: 6,
  });
  const [selectedTool, setSelectedTool] = useState<"box" | "polygon" | "point">("box");
  const [selectedDefect, setSelectedDefect] = useState<string>("burnt");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [zoom, setZoom] = useState(100);
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);

  // Overall score out of 100 (average of 6 params each out of 10, multiplied by 10)
  const overallScore = (Object.values(scores).reduce((sum, score) => sum + score, 0) / 6) * 10;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const getDefectLabel = (defectId: string) => {
    return defectTypes.find((d) => d.id === defectId)?.label || defectId;
  };

  const getDefectColor = (defectId: string) => {
    return defectTypes.find((d) => d.id === defectId)?.color || "bg-muted";
  };

  const handleScoreChange = (key: string, value: number[]) => {
    setScores((prev) => ({ ...prev, [key]: value[0] }));
  };

  const handleSave = () => {
    console.log("Saving scores:", scores);
    console.log("Annotations:", annotations);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Scoring</h1>
          <p className="mt-1 text-muted-foreground">
            Score pizza quality on 6 parameters and annotate defects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-base px-4 py-2">
            Pizza #{mockPizza.id}
          </Badge>
          <Button variant="outline" onClick={() => {}}>
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save & Next
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Image and Annotation Area */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="border-b p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{zoom}%</span>
                  <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Button variant="ghost" size="icon" onClick={() => setZoom(100)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <AnnotationCanvas
                imageUrl={mockPizza.url}
                selectedTool={selectedTool}
                selectedDefect={selectedDefect}
                defectColor={getDefectColor(selectedDefect)}
                annotations={annotations}
                onAnnotationsChange={setAnnotations}
                zoom={zoom}
                onZoomClick={() => setZoomDialogOpen(true)}
              />
            </CardContent>
          </Card>

          <ImageZoomDialog
            open={zoomDialogOpen}
            onOpenChange={setZoomDialogOpen}
            imageUrl={mockPizza.url}
            alt="Pizza to score"
          />

          {/* Annotation Toolbar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Annotation Tools</CardTitle>
              <CardDescription>Mark defect areas on the pizza</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Tool</Label>
                  <ToggleGroup type="single" value={selectedTool} onValueChange={(v) => v && setSelectedTool(v as "box" | "polygon" | "point")}>
                    <ToggleGroupItem value="box" aria-label="Bounding Box">
                      <Square className="h-4 w-4 mr-2" />
                      Box
                    </ToggleGroupItem>
                    <ToggleGroupItem value="polygon" aria-label="Polygon">
                      <Pencil className="h-4 w-4 mr-2" />
                      Polygon
                    </ToggleGroupItem>
                    <ToggleGroupItem value="point" aria-label="Point">
                      <MapPin className="h-4 w-4 mr-2" />
                      Point
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <Separator orientation="vertical" className="h-10" />

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Defect Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {defectTypes.map((defect) => (
                      <Badge
                        key={defect.id}
                        variant={selectedDefect === defect.id ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedDefect === defect.id && defect.color
                        )}
                        onClick={() => setSelectedDefect(defect.id)}
                      >
                        {defect.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {annotations.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Marked Defects ({annotations.length})</Label>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setAnnotations([])}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {annotations.map((annotation) => (
                      <Badge
                        key={annotation.id}
                        variant="secondary"
                        className={cn("flex items-center gap-1 pr-1", getDefectColor(annotation.defectType), "text-white")}
                      >
                        {getDefectLabel(annotation.defectType)}
                        <button
                          onClick={() => removeAnnotation(annotation.id)}
                          className="ml-1 rounded-full hover:bg-white/20 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scoring Panel */}
        <div className="space-y-4">
          {/* Overall Score */}
          <Card className={cn("border-2", getScoreBg(overallScore).replace("bg-", "border-"))}>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Overall Quality Score</p>
              <p className={cn("text-5xl font-bold", getScoreColor(overallScore))}>
                {overallScore.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
              <div className="mt-4 h-3 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full transition-all", getScoreBg(overallScore))}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parameter Scores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scoring Parameters</CardTitle>
              <CardDescription>Rate each parameter from 0-10 (10 = best)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoringParameters.map((param) => (
                <div key={param.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{param.label}</Label>
                      <p className="text-xs text-muted-foreground">{param.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={scores[param.key]}
                        onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [param.key]: Math.max(0, Math.min(10, parseInt(e.target.value) || 0)),
                          }))
                        }
                        className="w-16 text-center"
                      />
                    </div>
                  </div>
                  <Slider
                    value={[scores[param.key]]}
                    onValueChange={(v) => handleScoreChange(param.key, v)}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Image Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Image Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pizza ID</span>
                <span className="font-mono">{mockPizza.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Store</span>
                <span>#{mockPizza.storeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{mockPizza.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Captured</span>
                <span>{mockPizza.timestamp}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
