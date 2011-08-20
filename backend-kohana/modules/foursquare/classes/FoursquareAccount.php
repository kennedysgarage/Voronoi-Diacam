<?php
class FoursquareAccount extends Foursquare {

   protected $oauth_creds = null;
   protected $foreign_data = null;

   public function __construct($oauth_creds=null) {
        if ($oauth_creds) {
            $this->oauth_creds = $oauth_creds;
            $this->foreign_data = unserialize($oauth_creds->getForeignData());
            parent::__construct($this->foreign_data['access_token']);
       } else {
            parent::__construct();
       }
   }

    /**
     *
     * @param SocialPost $post
     * @param string $message
     */
    public function postComment($post_id, $message) {
        $params = array('CHECKIN_ID' => $post_d,
            'text' => $message);

        $ret = $this->post('checkins/' . $post_id . '/addcomment', $params);
        return $ret['response']['comment']['id'];
    }

   
    /**
     * Publish a check in
     * @see https://developer.foursquare.com/docs/responses/checkin.html
     * @param string $venue_id
     * @param string $msg - cannot be longer than 140 chars
     * @param string $venue_name - arbitrary name of the venue, used in venue-less (no venue id) checkins
     * @return array - Foursquare Checkin json object
     */
    public function createCheckIn($venue_id = null, $msg = null, $venue_name = null, $lat = null, $long = null) {
        $params = array('venueId' => $venue_id, 'shout' => $msg, 'broadcast' => 'public');

        // create venue-less checkin
        if ($venue_name) {
            $params['venue'] = $venue_name;
        }

        if ($lat && $long) {
            $params['ll'] = "$lat,$long";
        }
        
        $ret = $this->post('checkins/add', $params);
        return $ret['response'];
    }

    /**
     * Pull down checkin objects by their id's
     * We accept a batch of checkins to process using multi request
     * @see https://developer.foursquare.com/docs/multi/multi.html
     * @param array $checkins
     * @return array - collection of checkin objects
     */
    public function getCheckin(array $checkins) {
        $p = array();
        foreach ($checkins as $c) {
            $p[] = '/checkins/' . $c;
        }
        $param = array('requests' => implode(',', $p));
        $ret = $this->get('multi', $param);
        return $ret['responses'];
    }


    /**
     * Look up a Foursquare venue by coordinates and a search string
     * @see https://developer.foursquare.com/docs/responses/venue.html
     * @param float $lat
     * @param float $long
     * @param string $string
     * @return array - Foursquare Venue json object
     */
    public function lookupVenue($lat, $long, $string) {
        $params = array('ll' => "$lat,$long", 'query' => $string);
        $ret = $this->get('venues/search', $params);
        return $ret['response'];
    }

    public function setForeignData($token) {
        $this->foreign_data = $token;
        parent::init($this->apikey, $this->foursquare_secret, $token['access_token']);
        $this->access_token = $token['access_token'];
    }

   /**
    * Get the Network/Foreign User Id
    * @return string
    */
   public function getForeignId() {
        if ($this->foreign_data === null) {
            throw new Exception('Foursquare Account is not linked. Can not provide foreign id.');
        }
   
        return $this->foreign_data['user_id'];
   }
    
   /**
    * Returns list of foursquare contacts in raw format
    *
    * @return array
    */
   public function getFriends() {
        $ret = $this->get('users/self/friends');
        return $ret['friends']['items'];
    }

    public function getMyInfo() {
        $ret = $this->get('users/self');
        return $ret['user'];
    }
}



