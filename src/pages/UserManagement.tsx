import { useState } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@dominos.com", role: "engineer", status: "active", lastActive: "2 min ago", joinedAt: "2024-01-01" },
  { id: "2", name: "Mike Johnson", email: "mike.johnson@dominos.com", role: "chef", status: "active", lastActive: "15 min ago", joinedAt: "2024-01-05" },
  { id: "3", name: "Emily Davis", email: "emily.davis@dominos.com", role: "chef", status: "active", lastActive: "1 hour ago", joinedAt: "2024-01-08" },
  { id: "4", name: "Alex Kim", email: "alex.kim@dominos.com", role: "stakeholder", status: "active", lastActive: "3 hours ago", joinedAt: "2024-01-10" },
  { id: "5", name: "Chris Lee", email: "chris.lee@dominos.com", role: "chef", status: "inactive", lastActive: "2 days ago", joinedAt: "2024-01-12" },
  { id: "6", name: "Jordan Taylor", email: "jordan.taylor@dominos.com", role: "engineer", status: "active", lastActive: "Just now", joinedAt: "2024-01-15" },
];

const roleConfig = {
  engineer: { label: "Engineer", color: "bg-primary text-primary-foreground" },
  chef: { label: "Chef", color: "bg-warning text-warning-foreground" },
  stakeholder: { label: "Stakeholder", color: "bg-accent text-accent-foreground" },
};

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (statusFilter !== "all" && user.status !== statusFilter) return false;
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage team members and their access permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to join the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="user@dominos.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="stakeholder">Stakeholder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{mockUsers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Engineers</p>
            <p className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "engineer").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Chefs</p>
            <p className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "chef").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Now</p>
            <p className="text-2xl font-bold text-success">{mockUsers.filter((u) => u.status === "active").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <Shield className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="stakeholder">Stakeholder</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleConfig[user.role as keyof typeof roleConfig].color}>
                      {roleConfig[user.role as keyof typeof roleConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.status === "active" ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={user.status === "active" ? "text-success" : "text-muted-foreground"}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell className="text-muted-foreground">{user.joinedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Overview of what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-warning text-warning-foreground">Chef</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Classify images
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Score pizza quality
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Annotate defects
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  View analytics
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary text-primary-foreground">Engineer</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  All Chef permissions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  View all analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Manage users
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  API access
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-accent text-accent-foreground">Stakeholder</Badge>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  View analytics (read-only)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Export reports
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  Classification
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  Quality scoring
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
