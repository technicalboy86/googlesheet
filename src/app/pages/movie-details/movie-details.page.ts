import { MovieService } from './../../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {

  information = null;

  /**
   * Constructor of our details page
   * @param activatedRoute Information about the route we are on
   * @param movieService The movie Service to get data
   */
  item = {};
  constructor(private activatedRoute: ActivatedRoute, private movieService: MovieService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    // Get the ID that was passed with the URL
    var param = this.activatedRoute.snapshot.paramMap;
    if(param['params']){
      this.item = JSON.parse(JSON.stringify(param['params']));

      if (this.item['doorpicture1'])
        this.item['doorpicture1'] = this.item['doorpicture1'].split("id=")[1];
      if (this.item['pictureofbottompivot'])
        this.item['pictureofbottompivot'] = this.item['pictureofbottompivot'].split("id=")[1];
      if (this.item['pictureoflatchguard'])
        this.item['pictureoflatchguard'] = this.item['pictureoflatchguard'].split("id=")[1];
      if (this.item['pictureofthehandle'])
        this.item['pictureofthehandle'] = this.item['pictureofthehandle'].split("id=")[1];
      if (this.item['pictureofthestrike'])
        this.item['pictureofthestrike'] = this.item['pictureofthestrike'].split("id=")[1];
      if (this.item['picureofthedeadlatch'])
        this.item['picureofthedeadlatch'] = this.item['picureofthedeadlatch'].split("id=")[1];
      if (this.item['pircureoftoppivot'])
        this.item['pircureoftoppivot'] = this.item['pircureoftoppivot'].split("id=")[1];
      if (this.item['videoofdooroperation'])
        this.item['videoofdooroperation'] = 'https://drive.google.com/file/d/'+this.item['videoofdooroperation'].split("id=")[1]+'/preview';
      console.log(this.item);
    }
    console.log(param['params']);
  }

  openWebsite(link) {
    window.open(link, '_blank');
  }
}
