export type MovieFormat = 'VHS' | 'DVD' | 'Blu-ray';

export interface Movie {
  id: number;
  title: string;
  release_year: number;
  format: MovieFormat;
  stars: string[];
}
