import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LatestMangaAPIENService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://api.mangadex.org"

  getLastMangaUpdated(): Observable<any[]> {    
    return this.http.get<any[]>(this.baseUrl+"/manga?limit=20&availableTranslatedLanguage%5B%5D=en&availableTranslatedLanguage%5B%5D=fr&order%5BlatestUploadedChapter%5D=desc");
  }

  getChapterJPG(id:string): Observable<any[]> {    
    return this.http.get<any[]>(this.baseUrl+"/at-home/server/"+ id +"?forcePort443=false");
  }

  getChapter(id:string): Observable<any[]> {    
    return this.http.get<any[]>(this.baseUrl+"/manga"+id+"/aggregate");
  }
}
