import { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Loader2,
  RefreshCcw,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface InferenceResult {
  imageUrl: string;
  itemType: string;
  itemTypeConfidence: number;
  itemName: string;
  itemNameConfidence: number;
  isRecaptured: boolean;
  recaptureConfidence: number;
  overallScore: number;
  params: { name: string; score: number }[];
}

const scoreParams = [
  "Topping Spread",
  "Cheese Spread",
  "Burn Score",
  "Undercooked Score",
  "Bubble Count",
  "Bubble Size",
];

const randomParam = () => Math.round((5 + Math.random() * 5) * 10) / 10;

function runMockInference(imageUrl: string): InferenceResult {
  const params = scoreParams.map((name) => ({ name, score: randomParam() }));
  const overall = Math.round((params.reduce((s, p) => s + p.score, 0) / params.length) * 10);
  const names = ["Peppy Paneer", "Farmhouse", "Margherita", "Cheese & Corn", "Deluxe Veggie"];
  return {
    imageUrl,
    itemType: "Pizza",
    itemTypeConfidence: 90 + Math.round(Math.random() * 9 * 10) / 10,
    itemName: names[Math.floor(Math.random() * names.length)],
    itemNameConfidence: 80 + Math.round(Math.random() * 18 * 10) / 10,
    isRecaptured: Math.random() < 0.3,
    recaptureConfidence: 75 + Math.round(Math.random() * 23 * 10) / 10,
    overallScore: overall,
    params,
  };
}

function ConfidenceBadge({ value }: { value: number }) {
  const color =
    value >= 90
      ? "bg-success/10 text-success"
      : value >= 75
        ? "bg-warning/10 text-warning"
        : "bg-destructive/10 text-destructive";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>
      {value.toFixed(1)}%
    </span>
  );
}

function DetailRow({
  label,
  value,
  confidence,
  beta,
}: {
  label: string;
  value: string;
  confidence?: number;
  beta?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {beta && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Beta
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {confidence !== undefined && <ConfidenceBadge value={confidence} />}
      </div>
    </div>
  );
}

function paramColor(score: number) {
  if (score >= 8) return "text-success";
  if (score >= 6) return "text-warning";
  return "text-destructive";
}

export default function InferenceTester() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runInference = (src: string) => {
    setImageUrl(src);
    setIsRunning(true);
    setResult(null);
    // Simulate model latency
    setTimeout(() => {
      setResult(runMockInference(src));
      setIsRunning(false);
      toast.success("Inference complete");
    }, 1500);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    runInference(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid image URL");
      return;
    }
    runInference(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inference Tester</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a photo or paste an image URL to run model inference.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary hover:bg-muted/50"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Upload a photo</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            {/* URL */}
            <div className="flex flex-col justify-center gap-3 rounded-lg border border-border p-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-accent/10 p-2">
                  <LinkIcon className="h-5 w-5 text-accent" />
                </div>
                <p className="font-medium">Paste image URL</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/pizza.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button onClick={handleUrlSubmit}>Run</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isRunning && imageUrl && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-12">
            <img src={imageUrl} alt="Test input" className="h-40 w-40 rounded-lg object-cover" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Running model inference...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && !isRunning && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => runInference(result.imageUrl)}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Re-run Inference
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Block 1: Image Details */}
            <Card>
              <CardHeader>
                <CardTitle>Image Details</CardTitle>
                <CardDescription>Classification results with confidence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={result.imageUrl}
                    alt="Inference input"
                    className="h-44 w-44 rounded-lg object-cover shadow-md"
                  />
                </div>
                <div>
                  <DetailRow
                    label="Item Type"
                    value={result.itemType}
                    confidence={result.itemTypeConfidence}
                  />
                  <DetailRow
                    label="Pizza Name"
                    value={result.itemName}
                    confidence={result.itemNameConfidence}
                    beta
                  />
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Recaptured Image</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        Beta
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={result.isRecaptured ? "destructive" : "secondary"}
                        className="gap-1"
                      >
                        {result.isRecaptured && <AlertTriangle className="h-3 w-3" />}
                        {result.isRecaptured ? "Yes" : "No"}
                      </Badge>
                      <ConfidenceBadge value={result.recaptureConfidence} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Block 2: Score Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Score Details</CardTitle>
                    <CardDescription>
                      {result.itemType === "Pizza"
                        ? "Parameter-wise quality scores"
                        : "Quality scoring is only available for pizzas"}
                    </CardDescription>
                  </div>
                  {result.itemType === "Pizza" && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                      <p
                        className={`text-3xl font-bold ${
                          result.overallScore >= 80
                            ? "text-success"
                            : result.overallScore >= 60
                              ? "text-warning"
                              : "text-destructive"
                        }`}
                      >
                        {result.overallScore}
                        <span className="text-base text-muted-foreground">/100</span>
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.itemType === "Pizza" ? (
                  <>
                    <div className="flex justify-center">
                      <img
                        src={result.imageUrl}
                        alt="Scored pizza"
                        className="h-44 w-44 rounded-lg object-cover shadow-md"
                      />
                    </div>
                    <div className="space-y-3">
                      {result.params.map((param) => (
                        <div key={param.name}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span>{param.name}</span>
                            <span className={`font-semibold ${paramColor(param.score)}`}>
                              {param.score}/10
                            </span>
                          </div>
                          <Progress value={param.score * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
                    <p>Upload a pizza image to get quality score details.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !isRunning && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
            <p>Upload an image or paste a URL above to see inference results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
