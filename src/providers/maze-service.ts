import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TimeDateServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MazeProvider {
    apiUrl = './assets/maze.json';
    quoteUrl = './assets/monster-quotes.json';
    constructor(public http: HttpClient) {
        // console.log('Hello TimeDateServiceProvider Provider');
    }

    // getData() {
    //     return new Promise(resolve => {
    //         this.http.get(this.apiUrl).subscribe(
    //             data => {
    //                 // console.log(data)
    //                 resolve(data);
    //             },
    //             err => {
    //                 console.log(err);
    //             }
    //         );
    //     });
    // }

    getRoute(id) {
        return new Promise(resolve => {
            this.http.get(this.apiUrl).subscribe(
                data => {
                    //  console.log(data['paths']);
                    const filteredData = [];
                    data['paths'].forEach(element => {
                        if (element.id == id) {
                            filteredData.push(element);
                        }
                    });
                    // console.log(filteredData);
                    resolve(filteredData);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }

    getQuotes() {
        return new Promise(resolve => {
            this.http.get(this.quoteUrl).subscribe(
                data => {
                    //  console.log(data['paths']);
                    // const filteredData = [];
                    // data['paths'].forEach(element => {
                    //     if (element.id == id) {
                    //         filteredData.push(element);
                    //     }
                    // });
                    // console.log(filteredData);
                    resolve(data);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
}
