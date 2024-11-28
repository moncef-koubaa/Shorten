import { Injectable } from '@nestjs/common';
import {response} from "express";

@Injectable()
export class AppService {
  public URLs: { [key: string]: string } = {};
  public shortURLs: { [key: string]: string } = {};
  public clicks: { [key: string]: number } = {};

  tobase62(n: number): string {
    let base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    while(n > 0){
      result = base62[n % 62] + result;
      n = Math.floor(n / 62);
    }
    return result;
  }

  incrementClick(shortURL: string): void {
    this.clicks[shortURL] += 1;
  }
  findURL(shortURL: string): boolean {
      return this.URLs[shortURL] !== undefined;

  }

    getURL(shortURL: string): string {
        if(this.findURL(shortURL)){
            this.incrementClick(shortURL);
            return this.URLs[shortURL];
        }
        else {
            return "Invalid URL";
        }
    }

  async createShortURL(url: string): Promise<any> {
    if (this.shortURLs[url]) {

      return this.shortURLs[url];
    }
    try {
      const response = await fetch(url);
        if (response.status !== 404) {
            let n = Math.floor(Math.random() * 1000000000);
            let shortURL = this.tobase62(n);
            while(this.URLs[shortURL]){
                n = Math.floor(Math.random() * 1000000000);
                shortURL = this.tobase62(n);
            }
            this.URLs[shortURL] = url;
            this.shortURLs[url] = shortURL;
            this.clicks[shortURL] = 0;
            return shortURL;
        }
        else {
            return "Invalid URL";
        }
    }
    catch (error) {
      return "Invalid URL";
    }

  }

}
