import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class GiphyService {

  readonly GIPHY_API = 'https://api.giphy.com/v1/gifs/search?api_key=DSl7kQFVjA3CSfjLzUvwTWAHW9Tg0WYI';

  searchEvent = new EventEmitter<string>();
  changeLimitEvent = new EventEmitter<number>();
  jumpToPageEvent = new EventEmitter<number>();
  searchString: string;
  limit = 40;

  constructor(private http: HttpClient) {
  }

  defaultSearch(searchString: string, limit: number, offset: number) {
    const qs = new HttpParams()
      .append('q', searchString)
      .append('limit', limit.toString())
      .append('offset', offset.toString())
      .append('rating', 'G')
      .append('lang', 'en');
    return (this.http
      .get(this.GIPHY_API, {params: qs}));
  }

  performSearch(searchString: string) {
    this.searchString = searchString;
    return this.defaultSearch(searchString, 40, 0);
  }

  changeLimit(limit: number) {
    this.limit = limit;
    return this.defaultSearch(this.searchString, limit, 0);
  }

  jumpToPage(requestedPage: number) {
    return this.defaultSearch(this.searchString, this.limit, this.limit * (requestedPage - 1) + 1);
  }
}
