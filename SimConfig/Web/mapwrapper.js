var g_mapPackConfig = null;
var g_pathPrefix = "/Web";
var g_runningGame;
var g_map;

function loadScripts(mapPack, index, array) {
    $.getScript(g_pathPrefix + '/maps/' + mapPack + '/' + array[index], function() {
        var nextIndex = index + 1;
        if (nextIndex != array.length) {
            loadScripts(mapPack, nextIndex, array);
        } else {
            if (buildMap('mymap')) {
                //$('article > p.loading-text').hide();
            }
        }
    });
}

function loadMapPack(mapPack) {
    g_runningGame = mapPack;
    // Process map pack JSON
    $.getJSON(g_pathPrefix + '/maps/' + mapPack + '/config.json', function (json) {
        g_mapPackConfig = json;

        loadScripts(mapPack, 0, g_mapPackConfig.scripts);
    });
}