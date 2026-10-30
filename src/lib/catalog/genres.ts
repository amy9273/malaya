export interface GenreOption {
  id: string;
  name: string;
  tagUuid?: string;
}

export const POPULAR_GENRES: GenreOption[] = [
  { id: 'all', name: 'All Manhwa' },
  {
    id: 'action',
    name: 'Action',
    tagUuid: '391b0423-d847-456f-aff0-8b0cfc03066b',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    tagUuid: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
  },
  {
    id: 'regression',
    name: 'Time Travel / Regression',
    tagUuid: '292e862b-2d17-4062-90a2-0356caa4ae27',
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts',
    tagUuid: '799c202e-7daa-44eb-9cf7-8a3c0441531e',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    tagUuid: '87cc87cd-a395-47af-b27a-93258283bbc6',
  },
  {
    id: 'reincarnation',
    name: 'Reincarnation',
    tagUuid: '0bc42a35-a20c-4514-9450-e62411c9c917',
  },
  {
    id: 'romance',
    name: 'Romance',
    tagUuid: '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    tagUuid: '4d32cc48-9f00-4cca-9b5a-a839f0764984',
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    tagUuid: '256c8bd9-4904-4360-bf4f-508a76d67183',
  },
];
