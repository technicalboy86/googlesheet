import { MovieService, SearchType } from './../../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

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
  pageType = 'job';
  isDetailPage = true;
  paramId = -1;
  detailIteam = {};
  loading : any;

  constructor(public loadingController: LoadingController, private movieService: MovieService, private router: Router, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
        const jobid = params['jobid'];
        console.log(jobid);

        const doorid = params['doorid'];
        console.log(doorid);

        if(jobid != undefined){
          this.pageType = 'job';
          this.isDetailPage = true;
          this.paramId = jobid;
          this.getAllJobData();
        }
        if(doorid != undefined){
          this.pageType = 'door';
          this.isDetailPage = true;
          this.paramId = doorid;
          this.getAllDoorData();
        }
        if(jobid == undefined && doorid == undefined){
          this.pageType = 'job';
          this.isDetailPage = false;
          this.paramId = -1;
          this.getAllJobData();
        }
        console.log(this.pageType);

    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000
    });
    await this.loading.present();
  }

  moreDetails(item){
    console.log(item);
    if(this.pageType == 'job'){
      this.router.navigate(['/job-details', {jobid:item['jobnumber']}]);
    }else{
      this.router.navigate(['/job-details', {doorid:item['doorid']}]);
    }

  }

  searchChanged() {
    console.log(this.pageType);
    if(this.pageType == 'job'){
      var self = this;
      if(this.searchTerm == ''){
        this.getAllJobData();
      }else{
        self.searchResults = [];
        for(var i=0; i < self.results.length; i++){
          var itemdata = JSON.stringify(self.results[i]);
          if(itemdata.search(this.searchTerm) > 0 ){
            self.searchResults.push(self.results[i]);
          }
        }
      }
    }else{
      var self = this;
      if(this.searchTerm == ''){
        this.getAllDoorData();
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
  }

  async getAllDoorData() {
    var self = this;
    self.results = [];
    self.searchResults = [];
    await this.presentLoading();
    this.movieService.getAllDoorData(this.searchTerm, this.type).subscribe((res => {
      this.loading.onDidDismiss();
      console.log(res.feed.entry);
      if(res.feed && res.feed.entry){

        //parse goodle sheet data
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
            console.log(jsondata);
            if(jsondata['doorid']){
              if(res.feed.entry[i].updated && res.feed.entry[i].updated.$t)
                jsondata['timestamp'] = res.feed.entry[i].updated.$t;

              self.results.push(jsondata);
            }else{
              // jsondata['doorid'] = 'NONE';
              // if(res.feed.entry[i].updated && res.feed.entry[i].updated.$t)
              //   jsondata['timestamp'] = res.feed.entry[i].updated.$t;
              //
              // self.results.push(jsondata);
            }
            self.searchResults = self.results;
          }
        }


        //get detail item data
        if(this.isDetailPage == true && this.paramId != -1){
          for(var i=0; i< self.results.length; i++){
            self.results[i]['isJob'] = false;

            //self.results[i] = JSON.parse(JSON.stringify(self.results[i]));
            if(self.results[i]['doorid'] == self.paramId){
              if (self.results[i]['doorpicture1'])
                self.results[i]['doorpicture1'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['doorpicture1'].split("id=")[1];
                if (self.results[i]['doorpicture2'])
                  self.results[i]['doorpicture2'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['doorpicture2'].split("id=")[1];
              if (self.results[i]['pictureofbottomhinge'])
                self.results[i]['pictureofbottomhinge'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofbottomhinge'].split("id=")[1];
              if (self.results[i]['pictureofdeadbolt'])
                self.results[i]['pictureofdeadbolt'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofdeadbolt'].split("id=")[1];
              if (self.results[i]['pictureofframefrominside'])
                self.results[i]['pictureofframefrominside'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofframefrominside'].split("id=")[1];
              if (self.results[i]['pictureofframefromoutside'])
                self.results[i]['pictureofframefromoutside'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofframefromoutside'].split("id=")[1];
              if (self.results[i]['pictureofmiddlehinge'])
                self.results[i]['pictureofmiddlehinge'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofmiddlehinge'].split("id=")[1];
              if (self.results[i]['pictureofsweep'])
                self.results[i]['pictureofsweep'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofsweep'].split("id=")[1];
              if (self.results[i]['pictureofthelock'])
                self.results[i]['pictureofthelock'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofthelock'].split("id=")[1];
              if (self.results[i]['pictureofthreshold'])
                self.results[i]['pictureofthreshold'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofthreshold'].split("id=")[1];
              if (self.results[i]['pictureoftophinge'])
                self.results[i]['pictureoftophinge'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureoftophinge'].split("id=")[1];
              if (self.results[i]['profilepictureofweatherstipping'])
                self.results[i]['profilepictureofweatherstipping'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['profilepictureofweatherstipping'].split("id=")[1];
              if (self.results[i]['videoofdooroperation'])
                self.results[i]['videoofdooroperation'] = 'https://drive.google.com/file/d/'+self.results[i]['videoofdooroperation'].split("id=")[1]+'/preview';

              self.detailIteam = self.results[i];
            }
          }
        }

        console.log(self.results);

      }
    }), (err) => {
      console.log(err);
    });
  }

  async getAllJobData() {
    var self = this;
    self.results = [];
    self.searchResults = [];
    await this.presentLoading();
    this.movieService.getAllJobData(this.searchTerm, this.type).subscribe((res => {
      this.loading.onDidDismiss();
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
            console.log(jsondata);
            if(jsondata['jobnumber']){
              if(res.feed.entry[i].updated && res.feed.entry[i].updated.$t)
                jsondata['timestamp'] = res.feed.entry[i].updated.$t;

              self.results.push(jsondata);
            }else{
              // jsondata['jobnumber'] = 'NONE';
              // if(res.feed.entry[i].updated && res.feed.entry[i].updated.$t)
              //   jsondata['timestamp'] = res.feed.entry[i].updated.$t;
              //
              // self.results.push(jsondata);
            }
            self.searchResults = self.results;
          }
        }

        //get detail item data
        if(this.isDetailPage == true && this.paramId != -1){
          for(var i=0; i< self.results.length; i++){
            self.results[i]['isJob'] = true;

            //self.results[i] = JSON.parse(JSON.stringify(self.results[i]));
            if(self.results[i]['jobnumber'] == self.paramId){
              if (self.results[i]['doorpicture1'])
                self.results[i]['doorpicture1'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['doorpicture1'].split("id=")[1];
                if (self.results[i]['doorpicture2'])
                  self.results[i]['doorpicture2'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['doorpicture2'].split("id=")[1];
              if (self.results[i]['pictureofbottompivot'])
                self.results[i]['pictureofbottompivot'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofbottompivot'].split("id=")[1];
              if (self.results[i]['pictureofdoorcloser'])
                self.results[i]['pictureofdoorcloser'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofdoorcloser'].split("id=")[1];
              if (self.results[i]['pictureofthehandle'])
                self.results[i]['pictureofthehandle'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofthehandle'].split("id=")[1];
              if (self.results[i]['pictureofthestrike'])
                self.results[i]['pictureofthestrike'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pictureofthestrike'].split("id=")[1];
              if (self.results[i]['picureofthedeadlatch'])
                self.results[i]['picureofthedeadlatch'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['picureofthedeadlatch'].split("id=")[1];
              if (self.results[i]['pircureoftoppivot'])
                self.results[i]['pircureoftoppivot'] = 'https://drive.google.com/thumbnail?id='+self.results[i]['pircureoftoppivot'].split("id=")[1];
              if (self.results[i]['videoofdooroperation'])
                self.results[i]['videoofdooroperation'] = 'https://drive.google.com/file/d/'+self.results[i]['videoofdooroperation'].split("id=")[1]+'/preview';

              self.detailIteam = self.results[i];
              console.log(self.detailIteam);
            }
          }
        }

        console.log(self.results);
      }
    }), (err) => {
      console.log(err);
    });
  }

  openWebsite(link) {
    window.open(link, '_blank');
  }
}
