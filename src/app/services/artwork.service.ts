import { Injectable, signal, computed } from '@angular/core';
import { Artwork } from '../models/artwork.model';
import { ART_WORKS } from '../../assets/arts/art-store';

@Injectable({ providedIn: 'root' })
export class ArtworkService {
  private readonly rawArtworks = signal<Artwork[]>(ART_WORKS);

  readonly selectedConceptFilter = signal<string>('All');

  readonly filteredArtworks = computed(() => {
    const concept = this.selectedConceptFilter();
    if (concept === 'All') return this.rawArtworks();
    return this.rawArtworks().filter(art => art.concept === concept);
  });

  readonly concepts = ['All', 'Cyberpunk', 'Surrealism', 'Abstract', 'Minimalism'];

  setFilter(concept: string) {
    this.selectedConceptFilter.set(concept);
  }
}