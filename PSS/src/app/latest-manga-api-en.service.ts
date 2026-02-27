import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

interface MangaApiResponse {
  data: any[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class LatestMangaAPIENService {
  baseUrl = 'https://api.mangadex.org';

  private lastMangaCache$?: Observable<any[]>;

  constructor(private http: HttpClient) { }

  getLastMangaUpdated(): Observable<any[]> {
    if (!this.lastMangaCache$) {
      this.lastMangaCache$ = this.http
        .get<MangaApiResponse>(
          `${this.baseUrl}/manga?limit=20&availableTranslatedLanguage[]=en&contentRating%5B%5D=safe&availableTranslatedLanguage[]=fr&order[latestUploadedChapter]=desc&includes[]=cover_art`
        )
        .pipe(
          switchMap(res => {
            const mangas = res?.data || [];
            // Pour chaque manga, récupérer la cover si possible
            const mangaWithCover$ = mangas.map((manga: any) => {
              const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art');
              if (coverRel && coverRel.id) {
                // Appel à /cover/{coverId} pour obtenir le nom du fichier
                return this.http.get<any>(`${this.baseUrl}/cover/${coverRel.id}`).pipe(
                  map(coverRes => {
                    const fileName = coverRes?.data?.attributes?.fileName;
                    const coverUrl = fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : '';
                    return { ...manga, coverUrl };
                  }),
                  catchError(() => of({ ...manga, coverUrl: '' }))
                );
              } else {
                return of({ ...manga, coverUrl: '' });
              }
            });
            return mangaWithCover$.length ? forkJoin(mangaWithCover$) : of([]);
          }),
          shareReplay({ bufferSize: 1, refCount: true }),
          catchError((err) => {
            console.error('getLastMangaUpdated error', err);
            return of([]);
          })
        );
    }
    return this.lastMangaCache$;
  }

  getPopularManga(): Observable<any[]> {
    return this.http
      .get<MangaApiResponse>(
        `${this.baseUrl}/manga?limit=20&availableTranslatedLanguage[]=en&contentRating[]=safe&order[followedCount]=desc&includes[]=cover_art`
      )
      .pipe(
        switchMap(res => {
          const mangas = res?.data || [];
          const mangaWithCover$ = mangas.map((manga: any) => {
            const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art');
            if (coverRel && coverRel.id) {
              return this.http.get<any>(`${this.baseUrl}/cover/${coverRel.id}`).pipe(
                map(coverRes => {
                  const fileName = coverRes?.data?.attributes?.fileName;
                  const coverUrl = fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : '';
                  return { ...manga, coverUrl };
                }),
                catchError(() => of({ ...manga, coverUrl: '' }))
              );
            } else {
              return of({ ...manga, coverUrl: '' });
            }
          });
          return mangaWithCover$.length ? forkJoin(mangaWithCover$) : of([]);
        }),
        catchError((err) => {
          console.error('getPopularManga error', err);
          return of([]);
        })
      );
  }

  getChapterEN(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/manga/${id}/aggregate?translatedLanguage[]=en`)
      .pipe(catchError((err) => { console.error(err); return of(null); }));
  }

  getChapterFR(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/manga/${id}/aggregate?translatedLanguage[]=fr`)
      .pipe(catchError((err) => { console.error(err); return of(null); }));
  }

  getChapterJPG(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/at-home/server/${id}?forcePort443=false`)
      .pipe(catchError((err) => { console.error(err); return of(null); }));
  }

  getSearchManga(name: string): Observable<any[]> {
    return this.http
      .get<MangaApiResponse>(`${this.baseUrl}/manga?limit=20&title=${encodeURIComponent(name)}&includes[]=cover_art`)
      .pipe(
        switchMap(res => {
          const mangas = res?.data || [];
          const mangaWithCover$ = mangas.map((manga: any) => {
            const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art');
            if (coverRel && coverRel.id) {
              return this.http.get<any>(`${this.baseUrl}/cover/${coverRel.id}`).pipe(
                map(coverRes => {
                  const fileName = coverRes?.data?.attributes?.fileName;
                  const coverUrl = fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : '';
                  return { ...manga, coverUrl };
                }),
                catchError(() => of({ ...manga, coverUrl: '' }))
              );
            } else {
              return of({ ...manga, coverUrl: '' });
            }
          });
          return mangaWithCover$.length ? forkJoin(mangaWithCover$) : of([]);
        }),
        catchError((err) => { console.error(err); return of([]); })
      );
  }

  getMangaById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/manga/${id}?includes[]=cover_art`)
      .pipe(catchError((err) => { console.error(err); return of(null); }));
  }
}
