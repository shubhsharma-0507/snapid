'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Dimension {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: string;
  countries: string[];
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'india',
    name: 'India',
    width: 35,
    height: 45,
    unit: 'mm',
    countries: ['India', 'Nepal', 'Sri Lanka'],
  },
  {
    id: 'usa',
    name: 'USA',
    width: 2,
    height: 2,
    unit: 'inch',
    countries: ['USA', 'Canada'],
  },
  {
    id: 'europe',
    name: 'Europe',
    width: 35,
    height: 45,
    unit: 'mm',
    countries: ['UK', 'Germany', 'France', 'Italy', 'Spain'],
  },
  {
    id: 'australia',
    name: 'Australia',
    width: 35,
    height: 45,
    unit: 'mm',
    countries: ['Australia', 'New Zealand'],
  },
  {
    id: 'china',
    name: 'China',
    width: 33,
    height: 48,
    unit: 'mm',
    countries: ['China', 'Hong Kong', 'Taiwan'],
  },
  {
    id: 'japan',
    name: 'Japan',
    width: 24,
    height: 30,
    unit: 'mm',
    countries: ['Japan', 'South Korea'],
  },
];

interface DimensionSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function DimensionSelector({ selected, onSelect }: DimensionSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Country/Region</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {DIMENSIONS.map((dim, idx) => (
          <motion.button
            key={dim.id}
            onClick={() => onSelect(dim.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selected === dim.id
                ? 'border-primary bg-primary/10'
                : 'border-primary/20 hover:border-primary/50 bg-card/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{dim.name}</p>
                <p className="text-xs text-muted-foreground">
                  {dim.width} x {dim.height} {dim.unit}
                </p>
              </div>
              {selected === dim.id && (
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {dim.countries.slice(0, 2).map((country) => (
                <span
                  key={country}
                  className="text-xs px-2 py-1 rounded bg-primary/20 text-primary"
                >
                  {country}
                </span>
              ))}
              {dim.countries.length > 2 && (
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-muted-foreground">
                  +{dim.countries.length - 2}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
