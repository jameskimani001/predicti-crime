
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { CrimeStat } from '@/contexts/CrimeDataContext';

interface CrimeStatCardProps {
  stat: CrimeStat;
}

const CrimeStatCard: React.FC<CrimeStatCardProps> = ({ stat }) => {
  // Determine trend icon and color
  const renderTrend = () => {
    switch (stat.trend) {
      case 'increasing':
        return (
          <div className="flex items-center text-red-500">
            <ArrowUpIcon className="w-4 h-4 mr-1" />
            <span>{stat.percentChange}%</span>
          </div>
        );
      case 'decreasing':
        return (
          <div className="flex items-center text-green-500">
            <ArrowDownIcon className="w-4 h-4 mr-1" />
            <span>{stat.percentChange}%</span>
          </div>
        );
      case 'stable':
        return (
          <div className="flex items-center text-yellow-500">
            <MinusIcon className="w-4 h-4 mr-1" />
            <span>{stat.percentChange}%</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{stat.type}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{stat.count}</div>
          {renderTrend()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {stat.trend === 'increasing' 
            ? 'Increase from last month' 
            : stat.trend === 'decreasing' 
              ? 'Decrease from last month' 
              : 'Relatively stable'}
        </p>
      </CardContent>
    </Card>
  );
};

export default CrimeStatCard;
