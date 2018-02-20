import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GiphyService} from './giphy.service';

@Component ({
  selector: 'app-search',
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.css']
})
export class NavSearchComponent implements OnInit {

  @ViewChild('searchForm')
  searchForm: NgForm;

  constructor(private giphySrv: GiphyService) {
  }

  ngOnInit() { }

  searchGiphy() {
    // get the observable, and publish
    this.giphySrv.searchEvent.next(this.searchForm.value.searchString);
    this.searchForm.resetForm();
  }

}
