
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Brain } from 'lucide-react';

const PredictionModelCard: React.FC = () => {
  const models = [
    { 
      name: 'Crime Type Classification', 
      accuracy: 87.5, 
      lastTrained: '2023-05-15', 
      description: 'Classifies crime types based on location, time, and other factors' 
    },
    { 
      name: 'Hotspot Detection', 
      accuracy: 92.3, 
      lastTrained: '2023-05-18', 
      description: 'Identifies potential crime hotspots using clustering algorithms' 
    },
    { 
      name: 'Crime Trend Forecasting', 
      accuracy: 81.9, 
      lastTrained: '2023-05-12', 
      description: 'Predicts crime trends for the next 30 days' 
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" /> AI Prediction Models
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">{model.name}</h3>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-sm font-medium">{model.accuracy}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{model.description}</p>
              <div className="text-xs text-muted-foreground">
                Last trained: {model.lastTrained}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionModelCard;
