<?php

/*
 * Abraham Williams (abraham@abrah.am) http://abrah.am
 *
 * The first PHP Library to support OAuth for Twitter's REST API.
 */

/* Load OAuth lib. You can find it at http://oauth.net */
require_once('OAuth.php');

/**
 * Twitter OAuth class
 */
class FoursquareOAuth extends BaseOAuth {
  /* Facebook reinvents everything?  Access Token used for FB Requests*/
  public $access_token = null;
  
  /* Set up the API root URL. */
  public $host = "https://api.foursquare.com/v2/";
  /* Set timeout default. */
  /* Set the useragnet. */
  public $useragent = 'FoursquareOAuth v0.2.0-beta2';
  /* Immediately retry the API call if the response was not successful. */
  //public $retry = TRUE;

  /**
   * Set API URLS
   */
  public function accessTokenURL()  { return 'https://foursquare.com/oauth2/access_token'; }
  public function authenticateURL() { return 'https://foursquare.com/oauth2/authenticate'; }
  public function authorizeURL()    { return 'https://foursquare.com/oauth2/authorize'; }
  public function requestTokenURL() { return ''; }
   
   /**
    * constructor - we only need oauth_token if set for Facebook.
    * 
    * @param string $consumer_key
    * @param string $consumer_secret
    * @param string $oauth_token 
    */
    public function __construct($consumer_key, $consumer_secret, $oauth_token = NULL)
    {
        if ($oauth_token !== null) {
            $this->access_token = $oauth_token;
        }
        
        parent::__construct($consumer_key, $consumer_secret, $oauth_token, NULL);
    }
    
  /**
   * Format and sign an OAuth / API request
   */
  public function oAuthRequest($url, $method, $parameters) {
    if (strrpos($url, 'https://') !== 0 && strrpos($url, 'http://') !== 0) {
      $url = "{$this->host}{$url}";
    }
   
    if (! is_array($parameters)) {
        $parameters = array();
    }
    
    if ($this->access_token !== null) {
        $parameters['oauth_token'] = $this->access_token;
    }
    
    $request = new OAuthRequest($method, $url, $parameters);
    switch ($method) {
    case 'GET':
      return $this->http($request->to_url(), 'GET');
    default:
      return $this->http($request->get_normalized_http_url(), $method, $request->to_postdata());
    }
  }
    
  public function getRedirectURL($callback_url, $response_type='code')
  {
        return $this->authenticateURL() . '?' . http_build_query(array(
            'client_id'     => $this->consumer->key,
            'redirect_uri'  => $callback_url,
            'response_type' => $response_type,
        )); 
  }
  
   /**
   * Exchange request token and secret for an access token and
   * secret, to sign API calls.
   *
   * 
   * @returns array("access_token" => "the-access-token")
   */
  public function getAccessToken($code=false, $redirect_url='', $grant_type='authorization_code') {
    $parameters = array(
        'client_id'     => $this->consumer->key,
        'redirect_uri'  => $redirect_url,
        'client_secret' => $this->consumer->secret,
        'code'          => $code,
        'grant_type'    => $grant_type,
    );

    $request = $this->oAuthRequest($this->accessTokenURL(), 'GET', $parameters);

    /**
     * Something went wrong?
     */
    if ($this->http_code != 200) {
        //var_dump($request, $parameters);
        return false;
    }

    $token = json_decode($request, true);

    $this->access_token = $token['access_token'];
    
    return $token;
  }

    public function getUserInfo() {
        $ret = $this->get('users/self');
        return $ret['user'];
    }

}
