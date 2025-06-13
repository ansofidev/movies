export type MovieFormat = 'VHS' | 'DVD' | 'Blu-ray';

export interface Movie {
  id?: number;
  title: string;
  year: number;
  format: MovieFormat;
  actors: (string | Actor)[];
}

export interface Actor {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
