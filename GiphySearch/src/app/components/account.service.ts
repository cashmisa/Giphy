import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GiphyImage} from '../GiphyImage';


@Injectable()
export class AccountService {

  isLoggedIn: boolean;
  userEmail: string;
  savedCount: number;

  loginEvent = new EventEmitter();
  logoutEvent = new EventEmitter();
  getSavedImagesEvent = new EventEmitter<string>();
  getSavedImageCountsEvent = new EventEmitter<number>();
  SaveAnImageEvent = new EventEmitter<GiphyImage>();
  RemoveAnImageEvent = new EventEmitter<GiphyImage>();

  getImagesByEmail(email: string) {
    return (this.http.get(`/GiphySearch_Server/account/${email}`));
  }

  SaveAnImage(image: GiphyImage) {
    return (this.http.post('/GiphySearch_Server/add', {
      userEmail: this.userEmail,
      id: image.id,
      url: image.url
    }));
  }

  RemoveAnImage(image: GiphyImage) {
    return (this.http.post('/GiphySearch_Server/remove', {
      userEmail: this.userEmail,
      id: image.id,
      url: image.url
    }));
  }

  constructor(private http: HttpClient) { }

}
