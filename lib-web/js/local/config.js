/*
 * Establishes VD as global namespace and instantiates config.
 */
VD = {};
VD.config =
{
    mapContainerName : 'map-container',
    //apiUrl : "/api/",
    apiUrl : "/~max/voronoi/backend-kohana/venues.json",
    defaultStart : 0,
    queryInterval : 7, //in seconds
    slideshowTimeout : 5 //in seconds
}