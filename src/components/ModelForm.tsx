
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

interface ModelFormProps {
  model?: {
    id: string;
    name: string;
    type: string;
    accuracy: number;
    lastTrained: string;
    status: string;
  };
  onSubmit: (modelData: any) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({ model, onSubmit }) => {
  const [modelData, setModelData] = useState({
    id: model?.id || '',
    name: model?.name || '',
    type: model?.type || 'Classification',
    accuracy: model?.accuracy || 80.0,
    lastTrained: model?.lastTrained || new Date().toISOString().split('T')[0],
    status: model?.status || 'development'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(modelData);
    document.querySelector('[data-dialog-close]')?.click();
  };

  const handleChange = (field: string, value: any) => {
    setModelData({ ...modelData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Model Name</Label>
        <Input
          id="name"
          value={modelData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Model Type</Label>
        <Select
          value={modelData.type}
          onValueChange={(value) => handleChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Classification">Classification</SelectItem>
            <SelectItem value="Regression">Regression</SelectItem>
            <SelectItem value="Clustering">Clustering</SelectItem>
            <SelectItem value="Time Series">Time Series</SelectItem>
            <SelectItem value="Neural Network">Neural Network</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accuracy">Initial Accuracy (%)</Label>
        <Input
          id="accuracy"
          type="number"
          min="50"
          max="99.9"
          step="0.1"
          value={modelData.accuracy}
          onChange={(e) => handleChange('accuracy', parseFloat(e.target.value))}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={modelData.status}
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="development">In Development</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">{model ? 'Update' : 'Add'} Model</Button>
      </DialogFooter>
    </form>
  );
};

export default ModelForm;
