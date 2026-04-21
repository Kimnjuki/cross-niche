/**
 * ComparisonTable – HTML table component for Featured Snippet optimization.
 * Use for "X vs Y" or comparison queries. Keep simple: 2–4 columns, 5–10 rows.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface ComparisonRow {
  [key: string]: string | number;
}

interface ComparisonTableProps {
  headers: string[];
  rows: ComparisonRow[];
  className?: string;
  caption?: string;
}

export function ComparisonTable({ headers, rows, className, caption }: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto my-6', className)}>
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHead key={h} className="font-semibold">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {headers.map((key) => (
                <TableCell key={key}>{row[key] ?? '—'}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
