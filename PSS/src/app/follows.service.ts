import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

export interface Favorite {
  id: string;
  name: string;
  cover: string;
}

@Injectable({
  providedIn: 'root'
})
export class FollowsService {

  constructor(private http: HttpClient) { }

  private jsonUrl = 'assets/data.json';

  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  addFavorite(favorite: Favorite): Observable<any> {
    return this.getData().pipe(
      map((data: any) => {
        if (!data.favorites) {
          data.favorites = [];
        }
        data.favorites.push(favorite);
        return data;
      })
    );
  }

  removeFavorite(id: string): Observable<any> {
    return this.getData().pipe(
      map((data: any) => {
        if (data.favorites) {
          data.favorites = data.favorites.filter((fav: Favorite) => fav.id !== id);
        }
        return data;
      })
    );
  }

  saveData(data: any): Observable<any> {
    return this.http.put(this.jsonUrl, data);
  }
}
