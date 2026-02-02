import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Product options
const pizzaOptions = ["Pepperoni", "Margherita", "BBQ Chicken", "Hawaiian", "Veggie Supreme", "Meat Lovers", "Buffalo Chicken", "Four Cheese"];
const sideOptions = ["Garlic Bread", "Chicken Wings", "Mozzarella Sticks", "Breadsticks", "Caesar Salad", "Onion Rings", "Jalapeño Poppers"];

const scoringParameters = [
  { key: "toppingSpread", label: "Topping Spread" },
  { key: "cheeseSpread", label: "Cheese Spread" },
  { key: "burnScore", label: "Burn Score" },
  { key: "undercookedScore", label: "Undercooked Score" },
  { key: "bubbleCount", label: "Bubble Count" },
  { key: "bubbleSize", label: "Bubble Size" },
];

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  prediction: {
    isPizza: boolean;
    category: "Pizza" | "Side";
    productName: string;
    confidence: number;
    scores?: {
      overall: number;
      params: Record<string, number>;
    };
  };
  isEditing: boolean;
  showScoring: boolean;
  expanded: boolean;
}

// Simulate model prediction
function simulatePrediction(isPizzaScoring: boolean): UploadedImage["prediction"] {
  const isPizza = Math.random() > 0.3;
  const category: "Pizza" | "Side" = isPizza ? "Pizza" : "Side";
  const options = isPizza ? pizzaOptions : sideOptions;
  const productName = options[Math.floor(Math.random() * options.length)];
  const confidence = Math.floor(Math.random() * 20) + 80;

  const scores = isPizzaScoring
    ? {
        overall: Math.floor(Math.random() * 30) + 70,
        params: {
          toppingSpread: Math.floor(Math.random() * 4) + 6,
          cheeseSpread: Math.floor(Math.random() * 4) + 6,
          burnScore: Math.floor(Math.random() * 4) + 6,
          undercookedScore: Math.floor(Math.random() * 4) + 6,
          bubbleCount: Math.floor(Math.random() * 4) + 6,
          bubbleSize: Math.floor(Math.random() * 4) + 6,
        },
      }
    : undefined;

  return { isPizza, category, productName, confidence, scores };
}

export default function UploadRate() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [enableScoring, setEnableScoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: UploadedImage[] = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          prediction: simulatePrediction(enableScoring),
          isEditing: false,
          showScoring: enableScoring,
          expanded: false,
        }));

      setUploadedImages((prev) => [...prev, ...newImages]);
    },
    [enableScoring]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const toggleEdit = (id: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isEditing: !img.isEditing } : img))
    );
  };

  const toggleExpand = (id: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, expanded: !img.expanded } : img))
    );
  };

  const updatePrediction = (id: string, updates: Partial<UploadedImage["prediction"]>) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, prediction: { ...img.prediction, ...updates } } : img
      )
    );
  };

  const updateScore = (id: string, key: string, value: number) => {
    setUploadedImages((prev) =>
      prev.map((img) => {
        if (img.id !== id || !img.prediction.scores) return img;
        const newParams = { ...img.prediction.scores.params, [key]: value };
        const overall = Math.round(
          (Object.values(newParams).reduce((sum, v) => sum + v, 0) / 6) * 10
        );
        return {
          ...img,
          prediction: {
            ...img.prediction,
            scores: { overall, params: newParams },
          },
        };
      })
    );
  };

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

  const hasImages = uploadedImages.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasImages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Add More
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Upload & Rate</h1>
            <p className="mt-1 text-muted-foreground">
              Upload photos for model prediction and quality scoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="scoring-toggle" className="text-sm text-muted-foreground">
              Include Scoring
            </Label>
            <Switch
              id="scoring-toggle"
              checked={enableScoring}
              onCheckedChange={setEnableScoring}
            />
          </div>
          {hasImages && (
            <Button onClick={() => console.log("Submitting:", uploadedImages)}>
              <Save className="mr-2 h-4 w-4" />
              Submit All ({uploadedImages.length})
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Empty State - Full Drop Zone */}
      {!hasImages && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>Drag & drop or click to upload single or batch photos</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-16 transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Drag & drop images here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Images View */}
      {hasImages && (
        <Card
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "transition-colors",
            isDragging && "border-primary bg-primary/5"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Uploaded Images ({uploadedImages.length})</CardTitle>
              <CardDescription>Review and edit model predictions</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => {
                uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
                setUploadedImages([]);
              }}
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  {/* Image Preview Row */}
                  <div className="flex gap-4 p-4">
                    <img
                      src={img.preview}
                      alt="Uploaded"
                      className="h-24 w-24 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {/* Classification Section */}
                      {img.isEditing ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={img.prediction.category === "Pizza" ? "default" : "outline"}
                              onClick={() => {
                                updatePrediction(img.id, {
                                  category: "Pizza",
                                  productName: pizzaOptions[0],
                                });
                              }}
                            >
                              🍕 Pizza
                            </Button>
                            <Button
                              size="sm"
                              variant={img.prediction.category === "Side" ? "default" : "outline"}
                              onClick={() => {
                                updatePrediction(img.id, {
                                  category: "Side",
                                  productName: sideOptions[0],
                                });
                              }}
                            >
                              🍗 Side
                            </Button>
                          </div>
                          <Select
                            value={img.prediction.productName}
                            onValueChange={(value) => updatePrediction(img.id, { productName: value })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(img.prediction.category === "Pizza" ? pizzaOptions : sideOptions).map(
                                (option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleEdit(img.id)}
                          >
                            Done
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {img.prediction.category === "Pizza" ? "🍕" : "🍗"}{" "}
                              {img.prediction.category}
                            </Badge>
                            <span className="font-medium">{img.prediction.productName}</span>
                            <Badge variant="outline" className="text-xs">
                              {img.prediction.confidence}% confidence
                            </Badge>
                          </div>

                          {/* Overall Score (if scoring enabled) */}
                          {img.showScoring && img.prediction.scores && (
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">Overall:</span>
                              <span
                                className={cn("text-lg font-bold", getScoreColor(img.prediction.scores.overall))}
                              >
                                {img.prediction.scores.overall}
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-secondary max-w-32">
                                <div
                                  className={cn("h-full rounded-full transition-all", getScoreBg(img.prediction.scores.overall))}
                                  style={{ width: `${img.prediction.scores.overall}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleEdit(img.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {img.showScoring && img.prediction.scores && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleExpand(img.id)}
                        >
                          {img.expanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Scoring Section */}
                  {img.expanded && img.showScoring && img.prediction.scores && (
                    <div className="border-t bg-muted/30 p-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {scoringParameters.map((param) => (
                          <div key={param.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">{param.label}</Label>
                              <Input
                                type="number"
                                min={0}
                                max={10}
                                value={img.prediction.scores!.params[param.key]}
                                onChange={(e) =>
                                  updateScore(
                                    img.id,
                                    param.key,
                                    Math.max(0, Math.min(10, parseInt(e.target.value) || 0))
                                  )
                                }
                                className="w-14 h-7 text-center text-xs"
                              />
                            </div>
                            <Slider
                              value={[img.prediction.scores!.params[param.key]]}
                              onValueChange={(v) => updateScore(img.id, param.key, v[0])}
                              max={10}
                              step={1}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
