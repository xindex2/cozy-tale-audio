import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";

interface StatsCardsProps {
  usersCount: number;
  storiesCount: number;
  isLoading: boolean;
}

export function StatsCards({ usersCount, storiesCount, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{usersCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Total Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{storiesCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}