import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

const unitMultipliers: Record<SizeUnit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
  PB: 1024 * 1024 * 1024 * 1024 * 1024,
};

export default function FileSizeConverter() {
  const [inputValue, setInputValue] = useState<number>(1);
  const [inputUnit, setInputUnit] = useState<SizeUnit>('GB');
  const [outputUnit, setOutputUnit] = useState<SizeUnit>('MB');

  const convert = (value: number, fromUnit: SizeUnit, toUnit: SizeUnit): number => {
    if (fromUnit === toUnit) return value;
    const bytes = value * unitMultipliers[fromUnit];
    return bytes / unitMultipliers[toUnit];
  };

  const convertedValue = convert(inputValue, inputUnit, outputUnit);

  const swapUnits = () => {
    const temp = inputUnit;
    setInputUnit(outputUnit);
    setOutputUnit(temp);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">File Size Converter</h1>
              <p className="text-muted-foreground">Convert between different file size units (B, KB, MB, GB, TB, PB)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Convert File Size</CardTitle>
                <CardDescription>Enter a value and select units to convert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="inputValue">Value</Label>
                    <Input
                      id="inputValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputValue}
                      onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inputUnit">From Unit</Label>
                    <select
                      id="inputUnit"
                      value={inputUnit}
                      onChange={(e) => setInputUnit(e.target.value as SizeUnit)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      {Object.keys(unitMultipliers).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={swapUnits}
                      className="h-10 w-10"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outputUnit">To Unit</Label>
                    <select
                      id="outputUnit"
                      value={outputUnit}
                      onChange={(e) => setOutputUnit(e.target.value as SizeUnit)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      {Object.keys(unitMultipliers).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Result</Label>
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-lg font-semibold">
                      {convertedValue.toLocaleString('en-US', {
                        maximumFractionDigits: 6,
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Common Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(unitMultipliers).map((unit) => {
                    const value = convert(1, inputUnit, unit as SizeUnit);
                    return (
                      <div key={unit} className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">{value.toLocaleString('en-US', { maximumFractionDigits: 4 })}</div>
                        <div className="text-sm text-muted-foreground">{unit}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Showing conversions from {inputValue} {inputUnit}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

