import { useState } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Square,
  Pencil,
  MapPin,
  Undo,
  Redo,
  Trash2,
  SkipForward,
  Edit2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageZoomDialog } from "@/components/ImageZoomDialog";
import { AnnotationCanvas, type Annotation } from "@/components/AnnotationCanvas";
import { cn } from "@/lib/utils";

// Product options
const pizzaOptions = ["Pepperoni", "Margherita", "Supreme", "BBQ Chicken", "Veggie", "Hawaiian", "Meat Lovers"];
const sideOptions = ["Garlic Bread", "Wings", "Cheese Sticks", "Salad", "Breadsticks", "Onion Rings"];

// Mock data for model predictions with scores
const mockPredictions = [
  { id: "1", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", category: "pizza", productName: "Pepperoni", confidence: 0.94, storeId: "1234", timestamp: "2024-01-15 10:23:45", scores: { toppingSpread: 8, cheeseSpread: 9, burnScore: 7, undercookedScore: 9, bubbleCount: 8, bubbleSize: 7 } },
  { id: "2", url: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600", category: "side", productName: "Garlic Bread", confidence: 0.67, storeId: "1235", timestamp: "2024-01-15 10:25:12", scores: { toppingSpread: 6, cheeseSpread: 7, burnScore: 5, undercookedScore: 8, bubbleCount: 6, bubbleSize: 5 } },
  { id: "3", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600", category: "pizza", productName: "Margherita", confidence: 0.82, storeId: "1236", timestamp: "2024-01-15 10:27:33", scores: { toppingSpread: 7, cheeseSpread: 8, burnScore: 8, undercookedScore: 7, bubbleCount: 7, bubbleSize: 8 } },
  { id: "4", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600", category: "pizza", productName: "Supreme", confidence: 0.51, storeId: "1237", timestamp: "2024-01-15 10:30:45", scores: { toppingSpread: 5, cheeseSpread: 4, burnScore: 6, undercookedScore: 5, bubbleCount: 4, bubbleSize: 5 } },
  { id: "5", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600", category: "side", productName: "Wings", confidence: 0.73, storeId: "1238", timestamp: "2024-01-15 10:32:18", scores: { toppingSpread: 7, cheeseSpread: 6, burnScore: 8, undercookedScore: 7, bubbleCount: 6, bubbleSize: 7 } },
];

const defectTypes = [
  { id: "burnt", label: "Burnt Area", color: "bg-destructive" },
  { id: "undercooked", label: "Undercooked", color: "bg-warning" },
  { id: "missing_topping", label: "Missing Topping", color: "bg-accent" },
  { id: "uneven_cheese", label: "Uneven Cheese", color: "bg-primary" },
  { id: "bubble_defect", label: "Bubble Defect", color: "bg-muted-foreground" },
];

const scoringParameters = [
  { key: "toppingSpread", label: "Topping Spread", description: "Distribution evenness of toppings" },
  { key: "cheeseSpread", label: "Cheese Spread", description: "Coverage and distribution of cheese" },
  { key: "burnScore", label: "Burn Score", description: "Level of desired browning (higher = better)" },
  { key: "undercookedScore", label: "Undercooked Score", description: "Degree of proper cooking (higher = better)" },
  { key: "bubbleCount", label: "Bubble Count", description: "Number of crust bubbles" },
  { key: "bubbleSize", label: "Bubble Size", description: "Consistency of bubble sizes" },
];

export default function ReClassification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [corrected, setCorrected] = useState(0);
  const [filter, setFilter] = useState<string>("all");
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);

  // Annotation state
  const [selectedTool, setSelectedTool] = useState<"box" | "polygon" | "point">("box");
  const [selectedDefect, setSelectedDefect] = useState<string>("burnt");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [zoom, setZoom] = useState(100);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingClassification, setIsEditingClassification] = useState(false);
  const [editCategory, setEditCategory] = useState<"Pizza" | "Side">("Pizza");
  const [editProductName, setEditProductName] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({
    toppingSpread: 7,
    cheeseSpread: 8,
    burnScore: 8,
    undercookedScore: 9,
    bubbleCount: 7,
    bubbleSize: 6,
  });

  const filteredPredictions = mockPredictions.filter((pred) => {
    if (filter === "low") return pred.confidence < 0.7;
    if (filter === "medium") return pred.confidence >= 0.7 && pred.confidence < 0.9;
    if (filter === "high") return pred.confidence >= 0.9;
    return true;
  });

  const currentImage = filteredPredictions[currentIndex % filteredPredictions.length];
  const total = filteredPredictions.length;

  const resetEditState = () => {
    setIsEditing(false);
    setIsEditingClassification(false);
    setAnnotations([]);
    setScores({
      toppingSpread: 7,
      cheeseSpread: 8,
      burnScore: 8,
      undercookedScore: 9,
      bubbleCount: 7,
      bubbleSize: 6,
    });
  };

  const handleConfirm = () => {
    setConfirmed((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
    resetEditState();
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditCategory(currentImage.category === "pizza" ? "Pizza" : "Side");
    setEditProductName(currentImage.productName);
    // Copy model's predicted scores to editable state
    setScores({ ...currentImage.scores });
  };

  const handleSaveCorrection = () => {
    setCorrected((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
    resetEditState();
    console.log("Saved correction:", { editCategory, editProductName, scores, annotations });
  };

  const handleCancelEdit = () => {
    resetEditState();
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
    resetEditState();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-success";
    if (confidence >= 0.7) return "text-warning";
    return "text-destructive";
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return "bg-success/10 text-success";
    if (confidence >= 0.7) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
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

  const overallScore = (Object.values(scores).reduce((sum, score) => sum + score, 0) / 6) * 10;
  
  // Model's predicted overall score (read-only display)
  const modelOverallScore = currentImage 
    ? (Object.values(currentImage.scores).reduce((sum, score) => sum + score, 0) / 6) * 10 
    : 0;

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

  const productOptions = editCategory === "Pizza" ? pizzaOptions : sideOptions;

  if (!currentImage) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
          <h2 className="mt-4 text-xl font-semibold">No images to review</h2>
          <p className="mt-2 text-muted-foreground">
            All predictions have been reviewed for the current filter.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Model Scores</h1>
          <p className="mt-1 text-muted-foreground">
            Confirm or correct model predictions and annotate defects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Confidence</SelectItem>
              <SelectItem value="low">Low (&lt;70%)</SelectItem>
              <SelectItem value="medium">Medium (70-90%)</SelectItem>
              <SelectItem value="high">High (&gt;90%)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSkip}>
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total to Review</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-success">{confirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Corrected</p>
            <p className="text-2xl font-bold text-warning">{corrected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            <p className="text-2xl font-bold">
              {confirmed + corrected > 0
                ? ((confirmed / (confirmed + corrected)) * 100).toFixed(1)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Review Area */}
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
                imageUrl={currentImage.url}
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
            imageUrl={currentImage.url}
            alt="Image to review"
          />

          {/* Annotation Toolbar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Annotation Tools</CardTitle>
              <CardDescription>Mark defect areas on the image</CardDescription>
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

        {/* Review Panel */}
        <div className="space-y-4">
          {/* Model Prediction */}
          <Card className="border-2 border-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Model Prediction</CardTitle>
                <div className={cn("text-2xl font-bold", getScoreColor(modelOverallScore))}>
                  {modelOverallScore.toFixed(0)}/100
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary" className="text-base capitalize">
                    {currentImage.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product Name</span>
                  <span className="font-semibold">{currentImage.productName}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">Confidence:</span>
                  <Badge className={getConfidenceBadge(currentImage.confidence)}>
                    {(currentImage.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress
                  value={currentImage.confidence * 100}
                  className="h-3"
                />
                
                {/* Parameter Scores - Read Only */}
                <Separator />
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">Parameter Scores</Label>
                  {scoringParameters.map((param) => (
                    <div key={param.key} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{param.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn("h-full", getScoreBg(currentImage.scores[param.key as keyof typeof currentImage.scores] * 10))}
                            style={{ width: `${currentImage.scores[param.key as keyof typeof currentImage.scores] * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-6 text-right">
                          {currentImage.scores[param.key as keyof typeof currentImage.scores]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Overall Score Bar */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm text-muted-foreground">Overall Score</Label>
                    <span className={cn("font-bold", getScoreColor(modelOverallScore))}>
                      {modelOverallScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full transition-all", getScoreBg(modelOverallScore))}
                      style={{ width: `${modelOverallScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions / Edit Mode */}
          {!isEditing ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Decision</CardTitle>
                <CardDescription>Is the model's prediction correct?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleConfirm}
                  className="h-14 w-full text-lg bg-success hover:bg-success/90"
                  size="lg"
                >
                  <Check className="mr-2 h-6 w-6" />
                  Confirm Prediction
                </Button>

                <Button
                  variant="outline"
                  onClick={handleStartEdit}
                  className="h-14 w-full text-lg border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                  size="lg"
                >
                  <Edit2 className="mr-2 h-6 w-6" />
                  Make Corrections
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Item Classification - Matching Quality Scoring UI */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Item Classification</CardTitle>
                    {!isEditingClassification && (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingClassification(true)}>
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingClassification ? (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Category</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={editCategory === "Pizza" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => {
                              setEditCategory("Pizza");
                              setEditProductName(pizzaOptions[0]);
                            }}
                          >
                            🍕 Pizza
                          </Button>
                          <Button
                            variant={editCategory === "Side" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => {
                              setEditCategory("Side");
                              setEditProductName(sideOptions[0]);
                            }}
                          >
                            🍗 Side
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Product Name</Label>
                        <Select value={editProductName} onValueChange={setEditProductName}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {productOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setIsEditingClassification(false)}
                      >
                        Done
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary">{editCategory}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product</span>
                        <span className="font-medium">{editProductName}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scoring Parameters */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Quality Scoring</CardTitle>
                      <CardDescription>Rate each parameter from 0-10</CardDescription>
                    </div>
                    <div className={cn("text-2xl font-bold", getScoreColor(overallScore))}>
                      {overallScore.toFixed(0)}/100
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {scoringParameters.map((param) => (
                    <div key={param.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium text-sm">{param.label}</Label>
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
                            className="w-14 h-8 text-center text-sm"
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

                  {/* Overall Score Bar */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground">Overall Score</Label>
                      <span className={cn("font-bold", getScoreColor(overallScore))}>
                        {overallScore.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn("h-full transition-all", getScoreBg(overallScore))}
                        style={{ width: `${overallScore}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save/Cancel Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCorrection}
                  className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Save Correction
                </Button>
              </div>
            </>
          )}

          {/* Image Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Image Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Image ID</span>
                <span className="font-mono">{currentImage.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Store</span>
                <span>#{currentImage.storeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Captured</span>
                <span>{currentImage.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span>{currentIndex + 1} of {total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence Level</span>
                <span className={getConfidenceColor(currentImage.confidence)}>
                  {currentImage.confidence >= 0.9
                    ? "High"
                    : currentImage.confidence >= 0.7
                    ? "Medium"
                    : "Low"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
