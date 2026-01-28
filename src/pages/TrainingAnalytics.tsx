import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Target,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AreaChart,
  Area,
} from "recharts";

// Mock data
const accuracyTrend = [
  { date: "Jan 1", accuracy: 89.2 },
  { date: "Jan 5", accuracy: 90.1 },
  { date: "Jan 10", accuracy: 91.5 },
  { date: "Jan 15", accuracy: 90.8 },
  { date: "Jan 20", accuracy: 93.2 },
  { date: "Jan 25", accuracy: 94.2 },
];

const confidenceDistribution = [
  { range: "0-50%", count: 45 },
  { range: "50-70%", count: 128 },
  { range: "70-90%", count: 356 },
  { range: "90-100%", count: 489 },
];

const dailyProcessing = [
  { day: "Mon", classified: 245, reviewed: 42 },
  { day: "Tue", classified: 312, reviewed: 56 },
  { day: "Wed", classified: 278, reviewed: 38 },
  { day: "Thu", classified: 356, reviewed: 61 },
  { day: "Fri", classified: 289, reviewed: 45 },
  { day: "Sat", classified: 156, reviewed: 23 },
  { day: "Sun", classified: 98, reviewed: 12 },
];

const leaderboard = [
  { name: "Sarah Chen", classified: 1245, reviewed: 234, accuracy: 98.2 },
  { name: "Mike Johnson", classified: 1102, reviewed: 198, accuracy: 97.5 },
  { name: "Emily Davis", classified: 987, reviewed: 176, accuracy: 96.8 },
  { name: "Alex Kim", classified: 856, reviewed: 145, accuracy: 95.9 },
  { name: "Chris Lee", classified: 743, reviewed: 112, accuracy: 95.2 },
];

export default function TrainingAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training Metrics</h1>
          <p className="mt-1 text-muted-foreground">
            Model performance and training progress analytics
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
                <p className="text-sm text-muted-foreground">Model Accuracy</p>
                <p className="text-3xl font-bold">94.2%</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">+1.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Classified</p>
                <p className="text-3xl font-bold">12,847</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">+847</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Correction Rate</p>
                <p className="text-3xl font-bold">5.8%</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingDown className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">-1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Classification Accuracy Over Time</CardTitle>
          <CardDescription>Model prediction accuracy trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyTrend}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis domain={[85, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Accuracy"]}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#accuracyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Model Confidence Distribution</CardTitle>
            <CardDescription>Breakdown of prediction confidence levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceDistribution}>
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
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              High confidence (&gt;90%) predictions: <strong className="text-foreground">48%</strong>
            </div>
          </CardContent>
        </Card>

        {/* Daily Processing */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Processing Volume</CardTitle>
            <CardDescription>Images classified and reviewed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyProcessing}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="classified" fill="hsl(var(--primary))" name="Classified" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviewed" fill="hsl(var(--warning))" name="Reviewed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm">Classified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm">Reviewed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" />
                Top Contributors
              </CardTitle>
              <CardDescription>Users with most classifications this month</CardDescription>
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div
                key={user.name}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <Avatar>
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{user.classified.toLocaleString()} classified</span>
                    <span>{user.reviewed} reviewed</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-success/10 text-success">
                    {user.accuracy}% accuracy
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goals Progress
          </CardTitle>
          <CardDescription>Team targets for this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Classifications Target</span>
              <span className="text-sm text-muted-foreground">1,734 / 2,000</span>
            </div>
            <Progress value={86.7} className="h-3" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Reviews Target</span>
              <span className="text-sm text-muted-foreground">277 / 300</span>
            </div>
            <Progress value={92.3} className="h-3" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Model Accuracy Goal</span>
              <span className="text-sm text-muted-foreground">94.2% / 95%</span>
            </div>
            <Progress value={94.2} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
