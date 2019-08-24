import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'

import { Movie } from './Movie'

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private selectedMovie$:Subject<Movie> = new Subject<Movie>()

  constructor() { }

  get currentMovie(){
    return this.selectedMovie$
  }

  changeSelectedMovie(movie: Movie){
    this.selectedMovie$.next(movie)
  }
}
