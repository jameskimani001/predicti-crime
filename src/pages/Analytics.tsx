
import React from 'react';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock component for bar chart
const BarChartComponent = () => (
  <div className="w-full h-64 bg-muted/30 rounded-md flex items-center justify-center">
    <div className="text-muted-foreground flex flex-col items-center">
      <BarChart3 className="h-8 w-8 mb-2" />
      <p>Bar Chart Visualization</p>
      <p className="text-xs">(Would be implemented with Recharts)</p>
    </div>
  </div>
);

// Mock component for pie chart
const PieChartComponent = () => (
  <div className="w-full h-64 bg-muted/30 rounded-md flex items-center justify-center">
    <div className="text-muted-foreground flex flex-col items-center">
      <PieChart className="h-8 w-8 mb-2" />
      <p>Pie Chart Visualization</p>
      <p className="text-xs">(Would be implemented with Recharts)</p>
    </div>
  </div>
);

// Mock component for trend chart
const TrendChartComponent = () => (
  <div className="w-full h-64 bg-muted/30 rounded-md flex items-center justify-center">
    <div className="text-muted-foreground flex flex-col items-center">
      <TrendingUp className="h-8 w-8 mb-2" />
      <p>Trend Line Visualization</p>
      <p className="text-xs">(Would be implemented with Recharts)</p>
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const { crimeStats, isLoading } = useCrimeData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Analyze crime data, trends, and patterns
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px] flex-shrink-0">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="6month">Last 6 Months</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px] flex-shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Crime Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="theft">Theft</SelectItem>
            <SelectItem value="assault">Assault</SelectItem>
            <SelectItem value="burglary">Burglary</SelectItem>
            <SelectItem value="vandalism">Vandalism</SelectItem>
            <SelectItem value="robbery">Robbery</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto">Generate Report</Button>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="mb-4">
          <TabsTrigger value="trends" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" /> Trends
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" /> Distribution
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" /> Comparison
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crime Trends Over Time</CardTitle>
              <CardDescription>Visualizing crime patterns over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-64" /> : <TrendChartComponent />}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-64" /> : <TrendChartComponent />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-64" /> : <BarChartComponent />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crime Type Distribution</CardTitle>
              <CardDescription>Breakdown of crime categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-64" /> : <PieChartComponent />}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-64" /> : <PieChartComponent />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-64" /> : <PieChartComponent />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Comparison</CardTitle>
              <CardDescription>Comparing crime data between periods</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-64" /> : <BarChartComponent />}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Area Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-64" /> : <BarChartComponent />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Crime Type Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-64" /> : <BarChartComponent />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
