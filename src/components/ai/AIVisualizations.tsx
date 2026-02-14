/**
 * AI Pulse Visualizations Component
 * Charts and graphs showing AI/ML trends, benchmarks, and category distribution
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AIUpdate } from '@/data/aiUpdates';

interface AIVisualizationsProps {
  items: AIUpdate[];
}

const COLORS = {
  productivity: '#3b82f6', // blue
  creative: '#a855f7', // purple
  gaming_ai: '#22c55e', // green
};

export function AIVisualizations({ items }: AIVisualizationsProps) {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      productivity: 0,
      creative: 0,
      gaming_ai: 0,
    };

    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value,
      fill: COLORS[name as keyof typeof COLORS],
    }));
  }, [items]);

  const hypeVsUtilityData = useMemo(() => {
    const hype = items.filter((i) => i.isHype).length;
    const utility = items.filter((i) => i.hasBenchmarks).length;
    const both = items.filter((i) => i.isHype && i.hasBenchmarks).length;
    const neither = items.filter((i) => !i.isHype && !i.hasBenchmarks).length;

    return [
      { name: 'Hype Only', value: hype - both, fill: '#f59e0b' },
      { name: 'Utility Only', value: utility - both, fill: '#10b981' },
      { name: 'Both', value: both, fill: '#6366f1' },
      { name: 'Neither', value: neither, fill: '#6b7280' },
    ];
  }, [items]);

  const timelineData = useMemo(() => {
    const now = Date.now();
    const month = 30 * 24 * 60 * 60 * 1000;
    const buckets: Record<string, number> = {
      'This Month': 0,
      '1-3 Months': 0,
      '3-6 Months': 0,
      '6+ Months': 0,
    };

    items.forEach((item) => {
      const age = now - item.publishedAt;
      if (age < month) buckets['This Month']++;
      else if (age < 3 * month) buckets['1-3 Months']++;
      else if (age < 6 * month) buckets['3-6 Months']++;
      else buckets['6+ Months']++;
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [items]);

  // Benchmark distribution over time
  const benchmarkTrendData = useMemo(() => {
    const now = Date.now();
    const month = 30 * 24 * 60 * 60 * 1000;
    const buckets: Record<string, { total: number; withBenchmarks: number }> = {};
    
    items.forEach((item) => {
      const age = now - item.publishedAt;
      let period: string;
      if (age < month) period = 'This Month';
      else if (age < 3 * month) period = '1-3 Months';
      else if (age < 6 * month) period = '3-6 Months';
      else period = '6+ Months';
      
      if (!buckets[period]) {
        buckets[period] = { total: 0, withBenchmarks: 0 };
      }
      buckets[period].total++;
      if (item.hasBenchmarks) buckets[period].withBenchmarks++;
    });

    return Object.entries(buckets).map(([name, data]) => ({
      name,
      total: data.total,
      withBenchmarks: data.withBenchmarks,
      benchmarkRate: data.total > 0 ? Math.round((data.withBenchmarks / data.total) * 100) : 0,
    }));
  }, [items]);

  // Category performance metrics
  const categoryMetrics = useMemo(() => {
    const metrics: Record<string, { total: number; benchmarks: number; hype: number }> = {};
    
    items.forEach((item) => {
      if (!metrics[item.category]) {
        metrics[item.category] = { total: 0, benchmarks: 0, hype: 0 };
      }
      metrics[item.category].total++;
      if (item.hasBenchmarks) metrics[item.category].benchmarks++;
      if (item.isHype) metrics[item.category].hype++;
    });

    return Object.entries(metrics).map(([category, data]) => ({
      category: category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      total: data.total,
      benchmarks: data.benchmarks,
      hype: data.hype,
      benchmarkRate: data.total > 0 ? Math.round((data.benchmarks / data.total) * 100) : 0,
      utilityRate: data.total > 0 ? Math.round(((data.total - data.hype) / data.total) * 100) : 0,
    }));
  }, [items]);

  const chartConfig = {
    value: {
      label: 'Count',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-2 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          AI/ML Trends Visualization
        </h2>
        <p className="text-muted-foreground">
          Visual insights into AI and ML trends, category distribution, and benchmark coverage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Hype vs Utility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hype vs Utility Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={hypeVsUtilityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {hypeVsUtilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Timeline Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Updates Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={timelineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Benchmark Trend Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Benchmark Coverage Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Percentage of updates with confirmed ML benchmarks over time
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart data={benchmarkTrendData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="benchmarkRate" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Category Performance Metrics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Benchmark coverage and utility rates by category
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryMetrics.map((metric) => (
                <div key={metric.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{metric.category}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {metric.total} total
                      </Badge>
                      <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
                        {metric.benchmarkRate}% benchmarks
                      </Badge>
                      <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400">
                        {metric.utilityRate}% utility
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${metric.benchmarkRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
