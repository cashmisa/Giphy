import {Component, OnInit, OnDestroy} from '@angular/core';
import {GiphyService} from './giphy.service';
import {AccountService} from './account.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy {

  readonly NUMBER_OF_PAGES = 10;
  isNew: boolean;
  totalCount: number;
  totalPages: number;
  perPage: number;
  pageRange: number[] = Array(this.NUMBER_OF_PAGES).fill(1).map((e, i) => e + i);
  currentPage: number;

  private searchSub: Subscription
  private savedSub: Subscription

  constructor(private giphySrv: GiphyService, private accountSrv: AccountService) {
  }

  ngOnInit() {
    // when a searchEvent emitted, use received data to get some info
    this.searchSub = this.giphySrv.searchEvent.subscribe(
      (data) => {
        this.giphySrv.performSearch(data).subscribe(
          (result) => {
            this.isNew = true;
            this.perPage = 40;
            this.totalCount = result['pagination']['total_count'];
            this.totalPages = Math.floor(this.totalCount / this.perPage + 1);
            this.generatePageRange(this.currentPage = 1);
          },
          (error) => {
            console.log('>>>search error :', error);
          }
        );
      }
    );

    this.savedSub = this.accountSrv.getSavedImagesEvent.subscribe(
      (data) => {
        this.accountSrv.getImagesByEmail(data).subscribe(
          (result) => {
            this.isNew = true;
            this.perPage = 40;
            this.totalCount = result['count'];
            this.totalPages = Math.floor(this.totalCount / this.perPage + 1);
            this.generatePageRange(this.currentPage = 1);
          },
          (error) => {
            console.log('>>>search error :', error);
          }
        );
      }
    );
  }

  changePageLimit(event: any) {
    this.isNew = false;
    this.perPage = event.target.value;
    this.totalPages = Math.floor(this.totalCount / this.perPage + 1);
    this.generatePageRange(this.currentPage = 1);
    this.giphySrv.changeLimitEvent.next(event.target.value);
  }

  jumpToPage(requestedPage: any) {
    this.currentPage = requestedPage;
    this.giphySrv.jumpToPageEvent.next(requestedPage);
  }

  previousPage() {
    this.jumpToPage(--this.currentPage);
    if (this.currentPage < this.pageRange[0]) {
      this.generatePageRange(this.currentPage);
    }
  }

  nextPage() {
    this.jumpToPage(++this.currentPage);
    if (this.currentPage > this.pageRange[this.NUMBER_OF_PAGES - 1]) {
      this.generatePageRange(this.currentPage);
    }
  }


  generatePageRange(requestedPage: number) {

    let startPage = 1;
    // page range is 21 - 30, requested page is 20, display 11 - 20
    // page range is 9 - 18, requested page is 8, display 1 - 10
    if (requestedPage < this.pageRange[0]) {
      startPage = requestedPage - this.NUMBER_OF_PAGES + 1 > 1 ? requestedPage - this.NUMBER_OF_PAGES + 1 : 1;
    }
    // page rage is 11 - 20, requested 21， total page is 29, display 20 - 29 || total page is 40, display 21 - 30
    if (requestedPage > this.pageRange[this.NUMBER_OF_PAGES - 1]) {
      startPage = requestedPage + this.NUMBER_OF_PAGES > this.totalPages ? this.totalPages - this.NUMBER_OF_PAGES + 1 : requestedPage;
    }
    // get a new array of 10 or less, fill it with startPage, fn(each + index + 1) on each elements
    this.pageRange = Array(this.totalPages < this.NUMBER_OF_PAGES ? this.totalPages : this.NUMBER_OF_PAGES)
      .fill(startPage).map((e, i) => e + i);
  }
 
  ngOnDestroy() {
    this.savedSub.unsubscribe();
    this.searchSub.unsubscribe();
  }

}
