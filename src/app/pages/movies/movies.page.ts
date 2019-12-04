import { MovieService, SearchType } from './../../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {

  results: any;
  searchResults: any;
  searchTerm: string = '';
  type: SearchType = SearchType.all;

  /**
   * Constructor of our first page
   * @param movieService The movie Service to get data
   */
  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit() {
    this.getAllData();
  }

  moreDetails(item){
    console.log(item);
    this.router.navigate(['/movie-details', item]);
  }

  searchChanged() {
    var self = this;
    if(this.searchTerm == ''){
      this.getAllData();
    }else{
      self.searchResults = [];
      for(var i=0; i < self.results.length; i++){
        var itemdata = JSON.stringify(self.results[i]);
        if(itemdata.search(this.searchTerm) > 0 ){
          self.searchResults.push(self.results[i]);
        }
      }
    }
  }

  getAllData() {
    var self = this;
    self.results = [];
    self.searchResults = [];
    this.movieService.searchData(this.searchTerm, this.type).subscribe((res => {
      console.log(res.feed.entry);
      if(res.feed && res.feed.entry){
        for(var i=0; i < res.feed.entry.length; i++){
          if(res.feed.entry[i].content && res.feed.entry[i].content.$t){
            var str = res.feed.entry[i].content.$t;
            var splitarray = str.split(",");
            var jsondata = "";
            for(var j=0; j< splitarray.length; j++){
              var itemarray = splitarray[j].split(":");
              var jitem = itemarray[0].trim();
              var jvalue = splitarray[j].replace(jitem+":", "");
              jvalue = jvalue.replace(/"/g , "'");
              jsondata += '"' + jitem + '"' + ':' + '"' + jvalue.trim() + '"';

              if(j !== splitarray.length-1){
                jsondata += ",";
              }
            }

            jsondata = "{" + jsondata + "}";
            jsondata = JSON.parse(jsondata);
            if(jsondata['jobnumber']){
              if(res.feed.entry[i].updated && res.feed.entry[i].updated.$t)
                jsondata['timestamp'] = res.feed.entry[i].updated.$t;

              self.results.push(jsondata);
            }
            self.searchResults = self.results;
          }
        }

        console.log(self.results);
      }
    }), (err) => {
      console.log(err);
    });
  }
}
