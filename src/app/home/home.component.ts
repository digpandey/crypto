import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeCmc = true;
  activeRedis: boolean;
  cmcData: any;
  redisData: any;
  totalPages: any;
  page = 1;
  currPage: number;
  limit: number;
  count: number;
  logoDialog = false;
  modelData: any;
  data: any;
  dataLine: any;
  colorScheme: any = {
    domain: ['#08DDC1']
  };

  dataValue = [
    {
      name: 'green',
      series: [
        {
          name: 'Aug',
          value: 14
        },
        {
          name: 'Sep',
          value: 35
        },
        {
          name: 'Oct',
          value: -4
        },
        {
          name: 'Nov',
          value: 17
        },
        {
          name: 'Dec',
          value: 14
        },
        {
          name: 'Jan',
          value: -35
        }
      ]
    },
  ];
  chartArea: any = {
    height: 200,
    width: 800,
    fill: '#eee',
  };  constructor(private http: HttpClient) {
    this.totalPages = 1;
    this.currPage = 1;
  }

  ngOnInit(): void {
    this.limit = 10;
    this.getCmcData();
  }

  getCmcData(): void {
    this.http.get('https://cryptobirbapi.ddns.net/crypto', {
      params: {
        __limit: this.limit.toString(),
        __page: this.page.toString(),
        __cmc_rank: 'true',
      }
    }).subscribe((res: any) => {
      res.crypto.forEach((row: any) => {
        row.tweet_count = row.tweet[0]?.twitter_tweet_count;
        row.followers_count = row.tweet[0]?.twitter_followers_count;
        row.percent_change_24h = Number(row.percent_change_24h);
        // row.percpercent_change_1h_chart.forEach(rep => {
        //   rep.series.forEach(dd => {
        //     dd.value += 10;
        //   });
        // });
      });
      console.log('rrrrrrrr', res.crypto);
      this.cmcData = res.crypto;
      this.count = res.count;
      this.totalPages = Math.ceil((this.count) / this.limit);
    });
  }

  getRedisData(): void {
    this.activeCmc = false;
    this.http.get('https://cryptobirbapi.ddns.net/crypto', {
      params: {
        __limit: this.limit.toString(),
        __page: this.page.toString(),
        __redis_rank: 'true',
      }
    }).subscribe((res: any) => {
      res.crypto.forEach((row: any) => {
        row.tweet_count = row.tweet[0]?.twitter_tweet_count;
        row.followers_count = row.tweet[0]?.twitter_followers_count;
      });
      this.redisData = res.crypto;
    });
  }

  previousPage(value): void {
    this.currPage = (this.currPage > 1) ? (this.currPage - 1) : this.currPage;
    this.page = this.currPage;
    if (value === 'cmc') {
      this.getCmcData();
    } else {
      this.getRedisData();
    }
  }

  nextPage(value): void {
    this.currPage = (this.currPage < this.totalPages) ? (this.currPage + 1) : this.currPage;
    this.page = this.currPage;
    if (value === 'cmc') {
      this.getCmcData();
    } else {
      this.getRedisData();
    }
  }

  logoModle(row): void {
    this.logoDialog = true;
    this.modelData = row;
  }
}
