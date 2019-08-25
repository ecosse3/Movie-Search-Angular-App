import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Movie } from './Movie'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private selectedMovie$:Subject<Movie> = new Subject<Movie>()
  private apiKey:string = "2e64ee1ffe9f547ce7cf8d17286601c8"
  private baseApiUrl:string = "https://api.themoviedb.org/3/search/movie"
  constructor(private http:HttpClient) { }

  get currentMovie(){
    return this.selectedMovie$
  }

  searchMovie(query:string){
    const params = new HttpParams().set('api_key', this.apiKey).set('query', query)
    return this.http.get<any>(this.baseApiUrl, { params }).pipe(map(res => res.results))
  }

  changeSelectedMovie(movie: Movie){
    this.selectedMovie$.next(movie)
  }
}
