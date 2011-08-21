/*
 * Establishes VD as global namespace and instantiates config.
 */
document.domain = "neuropunks.org";
VD = {};
VD.config =
{
    mapContainerName : 'map-container',
    //apiUrl : "/api/",
    apiUrl : "http://dchan.neuropunks.org/image/index/10",
    defaultStart : 0,
    queryInterval : 7, //in seconds
    slideshowTimeout : 5 //in seconds
}
