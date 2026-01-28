import { useState } from "react";
import { Check, X, AlertTriangle, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageZoomDialog } from "@/components/ImageZoomDialog";

// Mock data for model predictions
const mockPredictions = [
  { id: "1", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", prediction: "pizza", confidence: 0.94 },
  { id: "2", url: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600", prediction: "side", confidence: 0.67 },
  { id: "3", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600", prediction: "pizza", confidence: 0.82 },
  { id: "4", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600", prediction: "pizza", confidence: 0.51 },
  { id: "5", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600", prediction: "side", confidence: 0.73 },
];

export default function ReClassification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [corrected, setCorrected] = useState(0);
  const [filter, setFilter] = useState<string>("all");
  const [zoomOpen, setZoomOpen] = useState(false);

  const filteredPredictions = mockPredictions.filter((pred) => {
    if (filter === "low") return pred.confidence < 0.7;
    if (filter === "medium") return pred.confidence >= 0.7 && pred.confidence < 0.9;
    if (filter === "high") return pred.confidence >= 0.9;
    return true;
  });

  const currentImage = filteredPredictions[currentIndex % filteredPredictions.length];
  const total = filteredPredictions.length;

  const handleConfirm = () => {
    setConfirmed((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCorrect = (newType: string) => {
    setCorrected((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
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
          <h1 className="text-3xl font-bold text-foreground">Re-Classification Review</h1>
          <p className="mt-1 text-muted-foreground">
            Confirm or correct model predictions
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
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Image Display */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <AspectRatio ratio={4 / 3}>
              <img
                src={currentImage.url}
                alt="Image to review"
                className="h-full w-full object-cover cursor-zoom-in"
                onClick={() => setZoomOpen(true)}
              />
            </AspectRatio>
          </CardContent>
        </Card>

        <ImageZoomDialog
          open={zoomOpen}
          onOpenChange={setZoomOpen}
          imageUrl={currentImage.url}
          alt="Image to review"
        />

        {/* Review Panel */}
        <div className="space-y-4">
          {/* Model Prediction */}
          <Card className="border-2 border-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Model Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold capitalize">{currentImage.prediction}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">Confidence:</span>
                  <Badge className={getConfidenceBadge(currentImage.confidence)}>
                    {(currentImage.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress
                  value={currentImage.confidence * 100}
                  className="mt-4 h-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-14 w-full text-lg border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    size="lg"
                  >
                    <X className="mr-2 h-6 w-6" />
                    Correct Prediction
                    <ChevronDown className="ml-auto h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleCorrect("pizza")}>
                    Actually a Pizza
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCorrect("side")}>
                    Actually a Side Item
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCorrect("unclear")}>
                    Unclear / Bad Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

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
