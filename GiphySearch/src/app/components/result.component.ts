import {Component, OnDestroy, OnInit} from '@angular/core';
import {GiphyService} from './giphy.service';
import {Subscription} from 'rxjs/Subscription';
import {GiphyImage} from '../GiphyImage';
import {AccountService} from './account.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})

export class ResultComponent implements OnInit, OnDestroy {

  readonly FAVORITE_ICON = '/assets/favorite.png';
  readonly ADDED_ICON = '/assets/favorite-added.png';
  readonly FAVORITE_LG_ICON = '/assets/favorite-lg.png';
  readonly REMOVE_LG_ICON = '/assets/favorite-remove-lg.png';

  private searchSub: Subscription;
  private limitSub: Subscription;
  private jumpSub: Subscription;
  private accountSub: Subscription;
  private loginSub: Subscription;
  private logoutSub: Subscription;
  private saveSub: Subscription;
  private removeSub: Subscription;

  private isLoggedIn: Boolean;
  savedImages: GiphyImage[] = [];
  searchResults: GiphyImage[] = [];

  constructor(private giphySrv: GiphyService, private accountSrv: AccountService) {
  }

  ngOnInit() {
    this.searchSub = this.giphySrv.searchEvent.subscribe(
      (data) => {
        this.giphySrv.performSearch(data).subscribe(
          (result) => {
            this.processSearchResult(result);
          },
          (error) => {
            console.log('>>>search error :', error);
          }
        );
      }
    );
    this.limitSub = this.giphySrv.changeLimitEvent.subscribe(
      (data) => {
        this.giphySrv.changeLimit(data).subscribe(
          (result) => {
            this.processSearchResult(result);
          },
          (error) => {
            console.log('>>>change page limit error :', error);
          }
        );
      }
    );
    this.jumpSub = this.giphySrv.jumpToPageEvent.subscribe(
      (data) => {
        this.giphySrv.jumpToPage(data).subscribe(
          (result) => {
            this.processSearchResult(result);
          },
          (error) => {
            console.log('>>>jump to page error :', error);
          }
        );
      }
    );

    this.accountSub = this.accountSrv.getSavedImagesEvent.subscribe(
      (data) => {
        this.accountSrv.getImagesByEmail(data).subscribe(
          (result) => {
            this.processSavedResult(result);
          },
          (error) => {
            console.log('>>> view saved list error :', error);
          }
        );
      }
    );

    this.loginSub = this.accountSrv.loginEvent.subscribe(
      () => {
        this.isLoggedIn = this.accountSrv.isLoggedIn;

      });
    this.logoutSub = this.accountSrv.logoutEvent.subscribe(
      () => {
        this.isLoggedIn = this.accountSrv.isLoggedIn;
      }
    );

    this.saveSub = this.accountSrv.SaveAnImageEvent.subscribe(
      (data) => {
        this.accountSrv.SaveAnImage(data).subscribe(
          () => {
            console.log('saved it');
          },
          (error) => {
            console.log('>>> reload saved list error :', error);
          }
        );
      }
    );
    this.removeSub = this.accountSrv.RemoveAnImageEvent.subscribe(
      (data) => {
        this.accountSrv.RemoveAnImage(data).subscribe(
          () => {
            console.log('removed it');
          },
          (error) => {
            console.log('>>> reload saved list error :', error);
          }
        );
      }
    );
  }

  processSavedResult(result: any) {
    this.searchResults = [];
    this.savedImages = [];
    for (const r of result['images']) {
      const sr = new GiphyImage();
      sr.id = r['id'];
      sr.url = r['url'];
      sr.isFavorite = true;
      this.searchResults.push(sr);
      this.savedImages.push(sr);
    }
    this.accountSrv.getSavedImageCountsEvent.next(this.accountSrv.savedCount = result['count']);
  }
  processSearchResult(result: any) {
    this.searchResults = [];
    for (const r of result['data']) {
      const sr = new GiphyImage();
      sr.id = r['id'];
      sr.isFavorite = false;
      for (const s of this.savedImages){
        if (sr.id === s.id) {
          sr.isFavorite = true;
          break;
        }
      }
      sr.url = r['images']['fixed_height_downsampled']['url'];
      this.searchResults.push(sr);
    }
  }

  saveToMyList(image: GiphyImage) {
    // more ideal to update upon success in subscription
    image.isFavorite = true;
    this.savedImages.push(image);
    this.accountSrv.SaveAnImageEvent.next(image);
  }

  removeFromMyList(image: GiphyImage) {
    // more ideal to update upon success in subscription
    image.isFavorite = false;
    this.savedImages.splice(this.savedImages.indexOf(image), 1);
    this.accountSrv.RemoveAnImageEvent.next(image);
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
    this.limitSub.unsubscribe();
    this.jumpSub.unsubscribe();
    this.accountSub.unsubscribe();
    this.loginSub.unsubscribe();
    this.logoutSub.unsubscribe();
    this.saveSub.unsubscribe();
    this.removeSub.unsubscribe();
  }
}
