import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface StorageOption {
  name: string;
  price: number;
  capacity: number;
  unit: 'GB' | 'TB';
  type: 'SSD' | 'HDD' | 'NVMe';
}

export default function PricePerGB() {
  const [options, setOptions] = useState<StorageOption[]>([
    { name: '1TB SSD', price: 100, capacity: 1, unit: 'TB', type: 'SSD' },
    { name: '2TB SSD', price: 180, capacity: 2, unit: 'TB', type: 'SSD' },
    { name: '4TB HDD', price: 80, capacity: 4, unit: 'TB', type: 'HDD' },
  ]);

  const calculatePricePerGB = (option: StorageOption): number => {
    const capacityInGB = option.unit === 'TB' ? option.capacity * 1024 : option.capacity;
    return option.price / capacityInGB;
  };

  const sortedOptions = [...options].sort((a, b) => 
    calculatePricePerGB(a) - calculatePricePerGB(b)
  );

  const updateOption = (index: number, field: keyof StorageOption, value: string | number) => {
    const newOptions = [...options];
    if (field === 'unit' || field === 'type') {
      newOptions[index] = { ...newOptions[index], [field]: value as any };
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { name: 'New Option', price: 100, capacity: 1, unit: 'TB', type: 'SSD' }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Price per GB Calculator</h1>
              <p className="text-muted-foreground">Compare storage prices to find the best value per gigabyte</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Options</CardTitle>
                <CardDescription>Add storage options to compare prices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {options.map((option, index) => {
                  const pricePerGB = calculatePricePerGB(option);
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`name-${index}`}>Name</Label>
                        <Input
                          id={`name-${index}`}
                          value={option.name}
                          onChange={(e) => updateOption(index, 'name', e.target.value)}
                          className="w-48"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor={`price-${index}`} className="text-xs">Price ($)</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={option.price}
                            onChange={(e) => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`capacity-${index}`} className="text-xs">Capacity</Label>
                          <Input
                            id={`capacity-${index}`}
                            type="number"
                            min="0"
                            step="0.1"
                            value={option.capacity}
                            onChange={(e) => updateOption(index, 'capacity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`unit-${index}`} className="text-xs">Unit</Label>
                          <select
                            id={`unit-${index}`}
                            value={option.unit}
                            onChange={(e) => updateOption(index, 'unit', e.target.value as 'GB' | 'TB')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="GB">GB</option>
                            <option value="TB">TB</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor={`type-${index}`} className="text-xs">Type</Label>
                          <select
                            id={`type-${index}`}
                            value={option.type}
                            onChange={(e) => updateOption(index, 'type', e.target.value as 'SSD' | 'HDD' | 'NVMe')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="SSD">SSD</option>
                            <option value="HDD">HDD</option>
                            <option value="NVMe">NVMe</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price/GB</Label>
                          <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 font-semibold">
                            ${pricePerGB.toFixed(4)}
                          </div>
                        </div>
                      </div>
                      {options.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
                <Button variant="outline" onClick={addOption} className="w-full">
                  Add Option
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Best Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedOptions.length > 0 && (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {sortedOptions[0].name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Best price per GB
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold">${sortedOptions[0].price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-semibold">
                          {sortedOptions[0].capacity} {sortedOptions[0].unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price/GB:</span>
                        <span className="font-semibold text-primary">
                          ${calculatePricePerGB(sortedOptions[0]).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{sortedOptions[0].type}</Badge>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedOptions.map((option, index) => {
                    const pricePerGB = calculatePricePerGB(option);
                    const isBest = index === 0;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isBest ? 'border-primary/50 bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{option.name}</div>
                          {isBest && <Badge className="bg-primary">Best Value</Badge>}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Price/GB: </span>
                            <span className="font-semibold">${pricePerGB.toFixed(4)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-semibold">${option.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

