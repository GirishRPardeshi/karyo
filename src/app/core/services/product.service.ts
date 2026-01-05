import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: any[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: any;
  images: string[];
  thumbnail: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'assets/db.json';

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ✅ Get all products with optional search
  getProducts(): Observable<Product[]> {
    return this.http.get<{products: Product[]}>(this.apiUrl).pipe(
      map(response => response.products),
      shareReplay(1)
    );
  }

  // ✅ Update search term
  updateSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  getSearchTerm() {
    return this.searchSubject.asObservable();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<{products: Product[]}>(this.apiUrl).pipe(
      map(response => response.products.find(product => product.id === id))
    );
  }


  // ✅ Get categories
  getCategories(): Observable<string[]> {
    return this.getProducts().pipe(
      map(products =>
        [...new Set(products.map(p => p.category))]
      )
    );
  }
}
