import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";

// Mock data
const qualityTrendData = [
  { date: "Jan 1", overall: 72, topping: 75, cheese: 70, burn: 68, undercooked: 74, bubble: 65 },
  { date: "Jan 5", overall: 75, topping: 78, cheese: 73, burn: 72, undercooked: 76, bubble: 68 },
  { date: "Jan 10", overall: 78, topping: 80, cheese: 76, burn: 75, undercooked: 79, bubble: 72 },
  { date: "Jan 15", overall: 74, topping: 76, cheese: 72, burn: 70, undercooked: 75, bubble: 69 },
  { date: "Jan 20", overall: 80, topping: 82, cheese: 78, burn: 78, undercooked: 81, bubble: 75 },
  { date: "Jan 25", overall: 82, topping: 85, cheese: 80, burn: 80, undercooked: 83, bubble: 78 },
];

const defectData = [
  { name: "Burnt Areas", count: 45, color: "hsl(var(--destructive))" },
  { name: "Undercooked", count: 32, color: "hsl(var(--warning))" },
  { name: "Uneven Cheese", count: 28, color: "hsl(var(--primary))" },
  { name: "Missing Topping", count: 21, color: "hsl(var(--accent))" },
  { name: "Bubble Defects", count: 15, color: "hsl(var(--muted-foreground))" },
];

const storeComparison = [
  { store: "#1234", score: 78 },
  { store: "#1256", score: 85 },
  { store: "#1289", score: 72 },
  { store: "#1301", score: 80 },
  { store: "#1345", score: 68 },
];

const scoreDistribution = [
  { range: "0-20", count: 5 },
  { range: "21-40", count: 12 },
  { range: "41-60", count: 28 },
  { range: "61-80", count: 156 },
  { range: "81-100", count: 89 },
];

export default function QualityAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Trends</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor pizza quality metrics and trends over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Quality Score</p>
                <p className="text-3xl font-bold">78.4</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">+3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images Scored</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Defects Found</p>
                <p className="text-3xl font-bold">141</p>
              </div>
              <div className="flex items-center text-destructive">
                <TrendingDown className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">-8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Score Rate</p>
                <p className="text-3xl font-bold">67%</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">+5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Score Trends</CardTitle>
          <CardDescription>Overall and parameter-specific scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[50, 100]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="topping"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="cheese"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm">Overall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-sm">Topping Spread</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-sm">Cheese Spread</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Defect Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Top Defect Types</CardTitle>
            <CardDescription>Most common quality issues found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={defectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {defectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {defectData.map((defect) => (
                <div key={defect.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: defect.color }}
                    />
                    <span className="text-sm">{defect.name}</span>
                  </div>
                  <Badge variant="secondary">{defect.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Store Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Store Comparison</CardTitle>
            <CardDescription>Average quality scores by store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="store" type="category" width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Breakdown of quality scores across all pizzas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index < 2
                          ? "hsl(var(--destructive))"
                          : index === 2
                          ? "hsl(var(--warning))"
                          : "hsl(var(--success))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
