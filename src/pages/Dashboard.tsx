import {
  Tags,
  Star,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Classified Today",
    value: "147",
    change: "+12%",
    icon: Tags,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Pending Reviews",
    value: "42",
    change: "-8%",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Avg. Quality Score",
    value: "78.4",
    change: "+3.2",
    icon: Star,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Model Accuracy",
    value: "94.2%",
    change: "+1.8%",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const workflowCards = [
  {
    title: "Classify Images",
    description: "Classify untagged images as Pizza or Side",
    icon: Tags,
    link: "/classify",
    pending: 156,
    color: "border-accent",
  },
  {
    title: "Quality Scoring",
    description: "Score pizzas on 6 quality parameters",
    icon: Star,
    link: "/scoring",
    pending: 89,
    color: "border-primary",
  },
  {
    title: "Review Model Scores",
    description: "Correct model predictions that need human review",
    icon: RefreshCw,
    link: "/reclassify",
    pending: 42,
    color: "border-warning",
  },
];

const recentActivity = [
  {
    action: "Classified 25 images",
    user: "Sarah Chen",
    time: "2 min ago",
    type: "success",
  },
  {
    action: "Scored pizza #4521 - 82/100",
    user: "Mike Johnson",
    time: "5 min ago",
    type: "success",
  },
  {
    action: "Flagged low confidence batch",
    user: "System",
    time: "12 min ago",
    type: "warning",
  },
  {
    action: "Corrected 8 classifications",
    user: "Emily Davis",
    time: "18 min ago",
    type: "success",
  },
  {
    action: "Quality alert: Store #1234",
    user: "System",
    time: "25 min ago",
    type: "alert",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's your quality control overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-success">{stat.change}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {workflowCards.map((card) => (
          <Card
            key={card.title}
            className={`border-l-4 ${card.color} transition-shadow hover:shadow-md`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary p-2">
                  <card.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">
                  {card.pending} pending
                </Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={card.link} className="flex items-center gap-1">
                    Start <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>Your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Classification</span>
                <span className="font-medium">147 / 200</span>
              </div>
              <Progress value={73.5} className="h-2" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Quality Scoring</span>
                <span className="font-medium">89 / 150</span>
              </div>
              <Progress value={59.3} className="h-2" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Re-Classification Review</span>
                <span className="font-medium">38 / 50</span>
              </div>
              <Progress value={76} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="mt-0.5">
                    {activity.type === "success" && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                    {activity.type === "warning" && (
                      <Clock className="h-5 w-5 text-warning" />
                    )}
                    {activity.type === "alert" && (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
