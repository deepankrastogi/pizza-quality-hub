import { useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  Download,
  Eye,
  Star,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Mock data
const mockImages = [
  { id: "4521", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", score: 82, type: "Pepperoni", status: "scored", date: "2024-01-15", store: "1234" },
  { id: "4522", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", score: 68, type: "Margherita", status: "scored", date: "2024-01-15", store: "1234" },
  { id: "4523", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", score: 91, type: "Supreme", status: "scored", date: "2024-01-14", store: "1256" },
  { id: "4524", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400", score: 45, type: "Hawaiian", status: "scored", date: "2024-01-14", store: "1234" },
  { id: "4525", url: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400", score: null, type: "Cheese", status: "pending", date: "2024-01-13", store: "1289" },
  { id: "4526", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", score: 76, type: "Meat Lovers", status: "scored", date: "2024-01-13", store: "1256" },
  { id: "4527", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", score: 88, type: "Veggie", status: "scored", date: "2024-01-12", store: "1234" },
  { id: "4528", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", score: null, type: "BBQ Chicken", status: "pending", date: "2024-01-12", store: "1289" },
];

export default function BrowseImages() {
  const [viewMode, setViewMode] = useState<string>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<typeof mockImages[0] | null>(null);

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-muted text-muted-foreground";
    if (score >= 80) return "bg-success text-success-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const filteredImages = mockImages.filter((img) => {
    if (statusFilter !== "all" && img.status !== statusFilter) return false;
    if (scoreFilter === "high" && (img.score === null || img.score < 80)) return false;
    if (scoreFilter === "medium" && (img.score === null || img.score < 60 || img.score >= 80)) return false;
    if (scoreFilter === "low" && (img.score === null || img.score >= 60)) return false;
    if (searchQuery && !img.id.includes(searchQuery) && !img.type.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Images</h1>
          <p className="mt-1 text-muted-foreground">
            Search, view, and manage scored pizza images
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export with Images</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID or pizza type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scored">Scored</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Score Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (80+)</SelectItem>
                <SelectItem value="medium">Medium (60-79)</SelectItem>
                <SelectItem value="low">Low (&lt;60)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>

            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredImages.length} images</span>
        <Select defaultValue="newest">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="score-high">Score ↓</SelectItem>
            <SelectItem value="score-low">Score ↑</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((image) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <CardContent className="p-0">
                    <AspectRatio ratio={1}>
                      <img
                        src={image.url}
                        alt={`Pizza ${image.id}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-medium">#{image.id}</span>
                          <Badge className={getScoreColor(image.score)}>
                            {image.score !== null ? (
                              <><Star className="mr-1 h-3 w-3" />{image.score}</>
                            ) : "Pending"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-white/80">{image.type}</p>
                      </div>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Pizza #{image.id}</DialogTitle>
                  <DialogDescription>{image.type} - Store #{image.store}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={image.url}
                      alt={`Pizza ${image.id}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </AspectRatio>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Quality Score</h4>
                      {image.score !== null ? (
                        <div className="flex items-center gap-3">
                          <span className={cn("text-4xl font-bold", image.score >= 80 ? "text-success" : image.score >= 60 ? "text-warning" : "text-destructive")}>
                            {image.score}
                          </span>
                          <span className="text-muted-foreground">/ 100</span>
                        </div>
                      ) : (
                        <Badge variant="outline">Not scored yet</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{image.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Store</p>
                        <p className="font-medium">#{image.store}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{image.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant={image.status === "scored" ? "default" : "secondary"}>
                          {image.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline">Edit</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={`Pizza ${image.id}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">#{image.id} - {image.type}</p>
                    <p className="text-sm text-muted-foreground">Store #{image.store} • {image.date}</p>
                  </div>
                  <Badge className={getScoreColor(image.score)}>
                    {image.score !== null ? image.score : "Pending"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
