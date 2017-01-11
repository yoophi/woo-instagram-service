var InstagramService,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

InstagramService = (function(superClass) {
  extend(InstagramService, superClass);

  function InstagramService() {
    return InstagramService.__super__.constructor.apply(this, arguments);
  }

  InstagramService.inject('$http', '$httpParamSerializer', '$interval', '$state', '$window', 'localStorageService', 'INSTAGRAM_CLIENT_ID');

  InstagramService.prototype.initialize = function() {
    this.API_ENDPOINT = 'https://api.instagram.com/v1';
    this.AUTH_URL = 'https://instagram.com/oauth/authorize';
    return this.AUTH_REDIRECT_URL = (this.getBaseUrl()) + "/instagram.html";
  };

  InstagramService.prototype.getBaseUrl = function() {
    var rv;
    rv = this.$window.location.protocol + '//' + this.$window.location.hostname;
    if (this.$window.location.port) {
      rv = rv + ":" + this.$window.location.port;
    }
    return rv;
  };

  InstagramService.prototype.getEndpoint = function() {
    return this.API_ENDPOINT;
  };

  InstagramService.prototype.login = function() {
    var LOGIN_URL, intervalCount, intervalDelay, loginPoller, params, promise, timesToRepeat;
    this.clearAccessToken();
    params = {
      client_id: this.INSTAGRAM_CLIENT_ID,
      scope: "basic comments follower_list likes public_content relationships",
      response_type: 'token',
      redirect_uri: this.AUTH_REDIRECT_URL
    };
    LOGIN_URL = this.AUTH_URL + "?" + (this.$httpParamSerializer(params));
    this.loginWindow = this.$window.open(LOGIN_URL, '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes');
    intervalCount = 0;
    timesToRepeat = 100;
    intervalDelay = 3000;
    loginPoller = (function(_this) {
      return function() {
        intervalCount++;
        if (_this.hasAccessToken()) {
          _this.$interval.cancel(promise);
          _this.$state.go('app.instagram', {
            accessToken: _this.getAccessToken()
          });
        } else {
          if (intervalCount >= timesToRepeat) {
            _this.$interval.cancel(promise);
            _this.loginWindow.close();
          }
        }
      };
    })(this);
    promise = this.$interval(loginPoller, intervalDelay, timesToRepeat, false);
  };

  InstagramService.prototype.clearAccessToken = function() {
    return this.localStorageService.remove('instagramAccessToken');
  };

  InstagramService.prototype.getAccessToken = function() {
    return this.localStorageService.get('instagramAccessToken');
  };

  InstagramService.prototype.hasAccessToken = function() {
    return !!this.getAccessToken();
  };

  return InstagramService;

})(BaseService);

angular.module('woo.instagram', []).service('InstagramService', InstagramService);
