import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CookieManagerService } from '@shared/services/cookie.service';
import { TokenService } from '@shared/services/token.service';
import { AppSessionService } from '@shared/session/app-session.service';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { SimpleCrypt } from 'ngx-simple-crypt';

@Component({
  selector: 'app-login-url',
  templateUrl: './login-url.component.html',
  styleUrls: ['./login-url.component.scss']
})
export class LoginUrlComponent implements OnInit {

  constructor(
    private _tokenAuthService: TokenAuthServiceProxy,
    private activatedRoute: ActivatedRoute,
    private _tokenService: TokenService,
    private _cookieService: CookieManagerService,
    private _appSessionService: AppSessionService,
  ) {
    this.accessTokenEnCode = this.activatedRoute.snapshot.paramMap.get('accessToken');
    this.refreshToken = this.activatedRoute.snapshot.paramMap.get('refreshToken');
  }

  simpleCrypt = new SimpleCrypt();

  accessTokenEnCode: string;
  refreshToken: string;
  accessToken: string;
  isLoadingPage = false;

  ngOnInit(): void {
    this.isLoadingPage = true;
    if (this.accessTokenEnCode && this.refreshToken) {
        this.accessToken = this.simpleCrypt.decode("accessTokenEncode", this.accessTokenEnCode);
        // console.log({'token______': this.accessToken, 'deCodeToken___': jwtDecode(this.accessToken) });

      const exp = jwtDecode(this.accessToken)['exp'];
      const tokenExpireDate = this.unixToDate(exp);
      console.log('exp', exp);
      
      this._tokenService.setToken(this.accessToken, tokenExpireDate);
      this._tokenService.setRefreshToken(this.refreshToken);

      this._appSessionService.init().then(
        (result) => {
          console.log(result);
        },
        (err) => {
          console.error(err);
        }
      );
      // this._router.navigate(['/']);
      let initialUrl = UrlHelper.initialUrl;
      if (initialUrl.indexOf('/login') > 0) {
        initialUrl = AppConsts.appBaseUrl;
      }

      location.href = initialUrl;
    } else {
      
    }
  }

  private unixToDate(UNIX_timestamp){
		return moment.unix(UNIX_timestamp).toDate();
	};

}
