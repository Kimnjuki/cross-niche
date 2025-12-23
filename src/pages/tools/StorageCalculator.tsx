import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, HardDrive, Gamepad2, Film, Music, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface StorageItem {
  category: string;
  count: number;
  sizePerItem: number;
  unit: 'GB' | 'TB';
}

const defaultStorageItems: StorageItem[] = [
  { category: 'Games', count: 10, sizePerItem: 50, unit: 'GB' },
  { category: 'Movies', count: 5, sizePerItem: 5, unit: 'GB' },
  { category: 'Music', count: 100, sizePerItem: 5, unit: 'MB' },
  { category: 'Photos', count: 500, sizePerItem: 5, unit: 'MB' },
  { category: 'Documents', count: 100, sizePerItem: 1, unit: 'MB' },
  { category: 'Applications', count: 20, sizePerItem: 2, unit: 'GB' },
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Games: Gamepad2,
  Movies: Film,
  Music: Music,
  Photos: FileText,
  Documents: FileText,
  Applications: FileText,
};

export default function StorageCalculator() {
  const [items, setItems] = useState<StorageItem[]>(defaultStorageItems);
  const [osSize, setOsSize] = useState(50); // GB
  const [overhead, setOverhead] = useState(20); // Percentage

  const convertToGB = (size: number, unit: string): number => {
    switch (unit) {
      case 'TB':
        return size * 1024;
      case 'GB':
        return size;
      case 'MB':
        return size / 1024;
      case 'KB':
        return size / (1024 * 1024);
      default:
        return size;
    }
  };

  const calculateTotalStorage = (): number => {
    let total = 0;
    items.forEach((item) => {
      const sizeInGB = convertToGB(item.sizePerItem, item.unit);
      total += sizeInGB * item.count;
    });
    return total;
  };

  const calculateRecommendedStorage = (): number => {
    const total = calculateTotalStorage();
    const withOS = total + osSize;
    const withOverhead = withOS * (1 + overhead / 100);
    return Math.ceil(withOverhead / 100) * 100; // Round up to nearest 100GB
  };

  const updateItem = (index: number, field: keyof StorageItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'unit') {
      newItems[index] = { ...newItems[index], [field]: value as 'GB' | 'TB' };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { category: 'Custom', count: 1, sizePerItem: 1, unit: 'GB' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalStorage = calculateTotalStorage();
  const recommendedStorage = calculateRecommendedStorage();

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
              <HardDrive className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Storage Calculator</h1>
              <p className="text-muted-foreground">Calculate storage needs for games, media, and applications</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Items</CardTitle>
                <CardDescription>Add items to calculate your total storage needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => {
                  const Icon = categoryIcons[item.category] || FileText;
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor={`category-${index}`}>Category</Label>
                        </div>
                        <Input
                          id={`category-${index}`}
                          value={item.category}
                          onChange={(e) => updateItem(index, 'category', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor={`count-${index}`} className="text-xs">Count</Label>
                          <Input
                            id={`count-${index}`}
                            type="number"
                            min="0"
                            value={item.count}
                            onChange={(e) => updateItem(index, 'count', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`size-${index}`} className="text-xs">Size</Label>
                          <Input
                            id={`size-${index}`}
                            type="number"
                            min="0"
                            step="0.1"
                            value={item.sizePerItem}
                            onChange={(e) => updateItem(index, 'sizePerItem', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`unit-${index}`} className="text-xs">Unit</Label>
                          <select
                            id={`unit-${index}`}
                            value={item.unit}
                            onChange={(e) => updateItem(index, 'unit', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="MB">MB</option>
                            <option value="GB">GB</option>
                            <option value="TB">TB</option>
                          </select>
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
                <Button variant="outline" onClick={addItem} className="w-full">
                  Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="osSize">Operating System Size (GB)</Label>
                  <Input
                    id="osSize"
                    type="number"
                    min="0"
                    value={osSize}
                    onChange={(e) => setOsSize(parseInt(e.target.value) || 0)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Typical OS size: Windows 50GB, macOS 20GB, Linux 10-30GB
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overhead">Overhead/Reserve (%)</Label>
                  <Input
                    id="overhead"
                    type="number"
                    min="0"
                    max="50"
                    value={overhead}
                    onChange={(e) => setOverhead(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                  />
                  <div className="text-xs text-muted-foreground">
                    Recommended: 20-30% for system files, updates, and future growth
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Storage Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Content Storage</div>
                  <div className="text-3xl font-bold">{totalStorage.toFixed(2)} GB</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(totalStorage / 1024).toFixed(2)} TB
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-1">+ OS Size</div>
                  <div className="text-xl font-semibold">{osSize} GB</div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-1">Recommended Storage</div>
                  <div className="text-4xl font-bold text-primary">{recommendedStorage} GB</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(recommendedStorage / 1024).toFixed(2)} TB (with {overhead}% overhead)
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-2">Recommended Storage Options</div>
                  <div className="space-y-1 text-xs">
                    {recommendedStorage <= 500 && (
                      <Badge variant="outline" className="mr-1">500GB SSD</Badge>
                    )}
                    {recommendedStorage > 500 && recommendedStorage <= 1000 && (
                      <>
                        <Badge variant="outline" className="mr-1">1TB SSD</Badge>
                        <Badge variant="outline">1TB HDD</Badge>
                      </>
                    )}
                    {recommendedStorage > 1000 && recommendedStorage <= 2000 && (
                      <>
                        <Badge variant="outline" className="mr-1">2TB SSD</Badge>
                        <Badge variant="outline">2TB HDD</Badge>
                      </>
                    )}
                    {recommendedStorage > 2000 && (
                      <>
                        <Badge variant="outline" className="mr-1">4TB+ SSD</Badge>
                        <Badge variant="outline">4TB+ HDD</Badge>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item, index) => {
                    const sizeInGB = convertToGB(item.sizePerItem, item.unit) * item.count;
                    if (sizeInGB < 0.01) return null;
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.category}</span>
                        <span className="font-medium">{sizeInGB.toFixed(2)} GB</span>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-border flex justify-between font-semibold">
                    <span>Total Content</span>
                    <span>{totalStorage.toFixed(2)} GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

