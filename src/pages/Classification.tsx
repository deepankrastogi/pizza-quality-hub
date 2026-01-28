import { useState, useEffect } from "react";
import { Pizza, UtensilsCrossed, SkipForward, Keyboard, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ImageZoomDialog } from "@/components/ImageZoomDialog";

// Pizza and Side item types
const pizzaTypes = [
  "Peppy Paneer",
  "Farmhouse",
  "Margherita",
  "Pepperoni",
  "Mexican Green Wave",
  "Chicken Dominator",
  "Non Veg Supreme",
  "Veg Extravaganza",
];

const sideTypes = [
  "Garlic Bread",
  "Stuffed Garlic Bread",
  "Chicken Wings",
  "Taco Mexicana",
  "Pasta Italiano",
  "Cheese Dip",
  "Veg Parcel",
];

// Mock data for unclassified images
const mockImages = [
  { id: "1", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", timestamp: "2024-01-15 10:23:45" },
  { id: "2", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600", timestamp: "2024-01-15 10:24:12" },
  { id: "3", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600", timestamp: "2024-01-15 10:25:01" },
  { id: "4", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600", timestamp: "2024-01-15 10:26:33" },
  { id: "5", url: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600", timestamp: "2024-01-15 10:27:15" },
];

export default function Classification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [classified, setClassified] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [zoomOpen, setZoomOpen] = useState(false);
  
  const currentImage = mockImages[currentIndex % mockImages.length];
  const totalImages = mockImages.length;
  const progress = ((classified + skipped) / totalImages) * 100;

  const handleClassify = () => {
    if (!selectedItemType) return;
    setClassified((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
    setSelectedItemType("");
  };

  const handleSkip = () => {
    setSkipped((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
    setSelectedItemType("");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        handleSkip();
      } else if (e.key === "Enter" && selectedItemType) {
        e.preventDefault();
        handleClassify();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manual Classification</h1>
          <p className="mt-1 text-muted-foreground">
            Train the model by classifying images as Pizza or Side
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Keyboard className="mr-2 h-4 w-4" />
              Shortcuts
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>Use these for faster classification</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <span>Confirm Selection</span>
                <Badge>Enter</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <span>Skip Image</span>
                <Badge>Space / →</Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Session Progress</span>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-success/10 text-success">
                {classified} classified
              </Badge>
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                {skipped} skipped
              </Badge>
              <span className="font-medium">
                {classified + skipped} / {totalImages}
              </span>
            </div>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Main Classification Area */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Image Display */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <AspectRatio ratio={4 / 3}>
              <img
                src={currentImage.url}
                alt="Image to classify"
                className="h-full w-full object-cover transition-opacity cursor-zoom-in"
                onClick={() => setZoomOpen(true)}
              />
            </AspectRatio>
          </CardContent>
        </Card>

        <ImageZoomDialog
          open={zoomOpen}
          onOpenChange={setZoomOpen}
          imageUrl={currentImage.url}
          alt="Image to classify"
        />

        {/* Controls Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Classification</CardTitle>
              <CardDescription>Select the item type from the dropdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedItemType} onValueChange={setSelectedItemType}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Select item type..." />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel className="flex items-center gap-2">
                      <Pizza className="h-4 w-4" />
                      Pizzas
                    </SelectLabel>
                    {pizzaTypes.map((type) => (
                      <SelectItem key={type} value={`pizza:${type}`}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Side Items
                    </SelectLabel>
                    {sideTypes.map((type) => (
                      <SelectItem key={type} value={`side:${type}`}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                onClick={handleClassify}
                className="h-14 w-full text-lg"
                size="lg"
                disabled={!selectedItemType}
              >
                {selectedItemType ? (
                  <>
                    Classify as {selectedItemType.split(":")[1]}
                    <Badge variant="secondary" className="ml-auto">
                      Enter
                    </Badge>
                  </>
                ) : (
                  "Select item type to classify"
                )}
              </Button>

              <Button
                onClick={handleSkip}
                variant="outline"
                className="h-12 w-full"
              >
                <SkipForward className="mr-2 h-5 w-5" />
                Skip (Unclear)
              </Button>
            </CardContent>
          </Card>

          {/* Image Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Image Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Image ID</span>
                <span className="font-mono">{currentImage.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Captured</span>
                <span>{currentImage.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Position</span>
                <span>{currentIndex + 1} of {totalImages}</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Queue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {mockImages.slice(currentIndex + 1, currentIndex + 4).map((img) => (
                  <div key={img.id} className="overflow-hidden rounded-md">
                    <AspectRatio ratio={1}>
                      <img
                        src={img.url}
                        alt="Upcoming"
                        className="h-full w-full object-cover opacity-70"
                      />
                    </AspectRatio>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
