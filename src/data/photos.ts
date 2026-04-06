export interface Photo {
  src: string
  caption?: string
  game?: string // e.g. "vs Stevenson · Mar 18"
}

// Add photos to the public/photos/ directory and list them here.
// Example: { src: '/photos/game1-action.jpg', caption: 'Goal celebration', game: 'vs Stevenson · Mar 18' }
export const photos: Photo[] = []
