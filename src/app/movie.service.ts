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
  private baseConfigurationUrl:string = "https://api.themoviedb.org/3/configuration"
  private imageBaseUrl:string = ""
  private imageSizes:{ backdrop?:string[], poster?:string[] } = {}

  constructor(private http:HttpClient) {
    this.setImageConfiguration()
  }

  get currentMovie(){
    return this.selectedMovie$
  }

  searchMovie(query:string){
    const params = new HttpParams().set('api_key', this.apiKey).set('query', query)
    return this.http.get<any>(this.baseApiUrl, { params })
          .pipe(map(res =>
              res.results.map((result:Movie) => {
                return {
                  ...result,
                  backdropUrl:this.createPhotoUrl(result.backdrop_path, true),
                  posterUrl:this.createPhotoUrl(result.poster_path, false)
                }
              })
            )
          )
  }

  changeSelectedMovie(movie: Movie){
    this.selectedMovie$.next(movie)
  }

  setImageConfiguration(){
    const params = new HttpParams().set('api_key', this.apiKey)
    this.http.get(this.baseConfigurationUrl, { params })
                .pipe(map(res => res))
                .subscribe((config) => {
                  this.imageBaseUrl = config.images.base_url,
                  this.imageSizes = {
                    backdrop:config.images.backdrop_sizes,
                    poster:config.images.poster_sizes
                  }
                  console.log(this.imageBaseUrl)
                  console.log(this.imageSizes)
                })
  }
  createPhotoUrl(path:string, isBackdrop:boolean){
    if(!path){
      return ""
    }
    const { backdrop, poster } = this.imageSizes
    const imageSize = isBackdrop ? backdrop[0] : poster[ poster.length - 1 ]
    return `${this.imageBaseUrl}${imageSize}${path}`
  }

}
