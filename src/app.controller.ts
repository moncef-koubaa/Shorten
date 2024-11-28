import {Body, Controller, Get, HttpException, Param, Post, Redirect, Res} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('hello')
    async getHello(): Promise<string> {
        return "Hello World!";
    }

  @Get(':shortId')
  RedirectToUrl(@Param('shortId') shortUrl : string,
                @Res() res
  ): any {
    if(!this.appService.findURL(shortUrl)){
        throw new HttpException("Not Found", 404);
    }
    else {
      let url = this.appService.getURL(shortUrl);
      res.redirect(url);
        return {url: url};
    }
  }

  @Get('shorten/:shortId')
  RetrieveURL(@Param('shortId') shortUrl : string): any {
    if(!this.appService.findURL(shortUrl)){
        throw new HttpException("Not Found", 404);
    }
    else {
      let url = this.appService.getURL(shortUrl);
      let clicks = this.appService.clicks[shortUrl];
        return {
            url: url,
            clicks: clicks
        };
    }
  }

  @Get(':shortId/clicks')
  NumberOfClicks(@Param('shortId') shortUrl : string): any {
    if(!this.appService.findURL(shortUrl)){
        throw new HttpException("Not Found", 404);
    }
    else {
      let clicks = this.appService.clicks[shortUrl];
        return {clicks: clicks};
    }
  }

  @Post('shorten')
    async shortenURL(@Body() body: {url: string}): Promise<any> {
        let response = await this.appService.createShortURL(body.url);

        if (response === "Invalid URL") {
            throw new HttpException("Invalid URL", 400);
        }
        else {
            return {shortURL: response};
        }
    }
}
