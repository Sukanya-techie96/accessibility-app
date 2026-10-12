export interface Artwork {
  id: string;
  title: string;
  concept: 'Cyberpunk' | 'Surrealism' | 'Abstract' | 'Minimalism';
  artist: string;
  price: number;
  imageUrl: string;
  altText: string;
  longDescription: string;
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}