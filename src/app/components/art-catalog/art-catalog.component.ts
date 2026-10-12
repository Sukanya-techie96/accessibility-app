import { Component, inject } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { ArtCardComponent } from '../art-card/art-card.component';

@Component({
  selector: 'app-art-catalog',
  standalone: true,
  imports: [ArtCardComponent],
  template: `
    <section class="container py-4 py-md-5" aria-labelledby="catalog-heading">
      <h2 id="catalog-heading" class="visually-hidden">Artwork Catalog</h2>

      <!-- Bootstrap Filter Fieldset -->
      <fieldset class="card border-2 border-dark mb-4 bg-white">
        <div class="card-body">
          <legend class="float-none w-auto fs-6 fw-bold px-2 mb-2">Filter by Art Concept</legend>
          <div class="d-flex flex-wrap gap-3">
            @for (concept of artService.concepts; track concept) {
              <div class="form-check">
                <input 
                  class="form-check-input border-dark"
                  type="radio" 
                  [id]="'filter-' + concept"
                  name="conceptFilter" 
                  [value]="concept" 
                  [checked]="artService.selectedConceptFilter() === concept"
                  (change)="artService.setFilter(concept)" />
                <label class="form-check-label fw-bold" [for]="'filter-' + concept">
                  {{ concept }}
                </label>
              </div>
            }
          </div>
        </div>
      </fieldset>

      <!-- Grid displaying Artworks -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4" role="region" aria-live="polite">
        @for (art of artService.filteredArtworks(); track art.id) {
          <div class="col">
            <app-art-card [artwork]="art" />
          </div>
        } @empty {
          <div class="col-12 text-center py-5">
            <p class="fs-5 text-muted">No artwork concepts found in this category.</p>
          </div>
        }
      </div>
    </section>
  `
})
export class ArtCatalogComponent {
  artService = inject(ArtworkService);
}