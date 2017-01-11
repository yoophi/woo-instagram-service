class InstagramService extends BaseService
  @inject '$http', '$httpParamSerializer', '$interval', '$state', '$window',
    'localStorageService', 'INSTAGRAM_CLIENT_ID'

  initialize: ->
    @API_ENDPOINT = 'https://api.instagram.com/v1'
    @AUTH_URL = 'https://instagram.com/oauth/authorize'
    @AUTH_REDIRECT_URL = "#{@getBaseUrl()}/instagram.html"

  getBaseUrl: () ->
    rv = @$window.location.protocol + '//' + @$window.location.hostname
    if @$window.location.port
      rv = "#{rv}:#{@$window.location.port}"
    rv

  getEndpoint: ->
    @API_ENDPOINT

  login: ->
    @clearAccessToken()

    params =
      client_id: @INSTAGRAM_CLIENT_ID
      scope: "basic comments follower_list likes public_content relationships"
      response_type: 'token'
      redirect_uri: @AUTH_REDIRECT_URL

    LOGIN_URL = "#{@AUTH_URL}?#{@$httpParamSerializer(params)}"
    @loginWindow = @$window.open LOGIN_URL, '_blank',
      'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'

    intervalCount = 0
    timesToRepeat = 100
    intervalDelay = 3000

    loginPoller = () =>
      intervalCount++
      if @hasAccessToken()
        @$interval.cancel promise
        @$state.go 'app.instagram', accessToken: @getAccessToken()
      else
        if intervalCount >= timesToRepeat
          @$interval.cancel promise
          @loginWindow.close()
      return

    promise = @$interval loginPoller, intervalDelay, timesToRepeat, false
    return

  clearAccessToken: ->
    @localStorageService.remove 'instagramAccessToken'

  getAccessToken: ->
    @localStorageService.get 'instagramAccessToken'

  hasAccessToken: ->
    !! @getAccessToken()


angular.module 'woo.instagram', []
.service 'InstagramService', InstagramService
