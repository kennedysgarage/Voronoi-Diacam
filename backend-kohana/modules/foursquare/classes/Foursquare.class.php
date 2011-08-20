<?php
require_once('foursquareoauth.php');

class Foursquare extends FoursquareOAuth {

    /**
     * meta portion of foursquare response, we return it on GET errors only
     * @var string
     */
    public $meta;

    public $api_key;
    public $api_secret;

    /**
     * constructor
     * 
     * @param string $oauth_token
     */
    public function __construct($oauth_token = NULL){

        $this->api_key = '';
        $this->secret = '';
        parent::__construct($this->api_key, $this->secret, $oauth_token);
    }
    
    public function get($url, $parameters = array()) {
        $response = parent::get($url, $parameters);

        if ($this->isValid($response)) {
            return $response['response'];
        }
        return $this->meta;
    }

    protected function isValid($response) {
        if (!is_array($response)) {
            return false;
        }

        if (!(array_key_exists('meta', $response) && array_key_exists('response', $response))) {
            return false;
        }

        $this->meta = $response['meta'];

        if ($this->meta['code'] != '200') {
            return false;
        }

        return true;
    }
    
    public function post($url, $parameters = array()) {
        $response = parent::post($url, $parameters);
        return $response;
    }

    public function delete($url, $parameters = array()) {
        $response = parent::delete($url, $parameters);
        return $response;
    }

    public function getRedirectURL($callback_url, $response_type='code') {        
        return parent::getRedirectURL($callback_url, $response_type);
    }
}
