import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppHeaderProps {
  userName?: string;
  userRole?: "chef" | "engineer" | "stakeholder";
}

export function AppHeader({ userName = "John Doe", userRole = "engineer" }: AppHeaderProps) {
  const roleLabels = {
    chef: "Chef",
    engineer: "Engineer",
    stakeholder: "Stakeholder",
  };

  const roleColors = {
    chef: "bg-warning text-warning-foreground",
    engineer: "bg-primary text-primary-foreground",
    stakeholder: "bg-accent text-accent-foreground",
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search images, scores..."
            className="w-64 pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">New batch ready for review</span>
              <span className="text-xs text-muted-foreground">
                42 images need classification
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">Quality alert</span>
              <span className="text-xs text-muted-foreground">
                Store #1234 below threshold
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">Model updated</span>
              <span className="text-xs text-muted-foreground">
                Classification model v2.3 deployed
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">{userName}</span>
                <Badge variant="secondary" className={`text-[10px] ${roleColors[userRole]}`}>
                  {roleLabels[userRole]}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
