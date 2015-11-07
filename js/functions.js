$(document).ready(function() {
    $('#message-to-send').keypress(function(event){
        
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            doSendMessage();	
        }
    
    });
    
    var deltaker = getCookie('deltaker');
    if(!deltaker || deltaker.length == 0) {
        setDropdown('96625909')        
    } else {
        setDropdown(deltaker);
    }


    navigator.geolocation.getCurrentPosition(success, error, options);

    setInterval(function() {
        getMessages(0)
        navigator.geolocation.getCurrentPosition(success, error, options);

    }, 10000);
});

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}


function getDeltakerkode() {
	return $('#person').val();
}

function createHeaders() {
    return {
        LagKode: lagKode,
        DeltakerKode: getDeltakerkode()
    }
}

function register(vapen) {
    var postKode =  $('#postkode').val();
    if(vapen) {
       registerPost(postKode, vapen);
    } else {
        registerPost(postKode);
    }
}


function doSendMessage() {
    var message = $('#message-to-send').val();
    sendMessage(message);
    $('#message-to-send').val('');
}

function sendMessageOnEnter(event) {
    if(event.keyCode == 13) {
        doSendMessage();
    }   
}

function getState(callback) {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/GameStateFeed',
        contentType: 'application/json',
        method: 'GET',
        headers: createHeaders(),
        success: callback
    });
}

function registerPost(postKode, bruktVåpen) {

    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/GameService',
        contentType: 'application/json',
        method: 'POST',
        headers: createHeaders(),
        data: JSON.stringify({
           "postKode": postKode,
           "bruktVåpen": bruktVåpen
        })
    });


}

var sekvensnummer = 0;
var deltakere = {
    'JAVA_1-1': 'Karianne',
    'JAVA_1-2': 'Gareth',
    'JAVA_1-3': 'Inge',
    'JAVA_1-4': 'Qadeer'
}
function getMessages(seqNo) {
    var meldingUrl = 'https://bbr2015.azurewebsites.net/api/Meldinger/' + sekvensnummer
    $.ajax({
        url: meldingUrl,
        contentType: 'application/json',
        method: 'GET',
        headers: createHeaders(),

        success: function(data) {
            data.meldinger.forEach(function(melding) {
                var deltaker = deltakere[melding.deltaker];
                $("#meldinger").prepend("<p id='m'>" + (deltaker ? deltaker : 'Public') + ':' + melding.melding + "</p>");
                if (melding.sekvens > sekvensnummer) {
                    sekvensnummer = melding.sekvens;
                }
            });
        }
    });
}

function sendMessage(msg) {
    
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/Meldinger',
        contentType: 'application/json',
        method: 'POST',
        headers: createHeaders(),
        data: JSON.stringify({
            "tekst": msg
        })
    });
}

function getPosition(callback) {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/PosisjonsService',
        contentType: 'application/json',
        method: 'GET',
        headers: createHeaders(),
        success: callback
    });
}

function sendPosition(latitude, longitude) {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/PosisjonsService',
        contentType: 'application/json',
        method: 'POST',
        headers: createHeaders(),
        data: JSON.stringify({
            "latitude": latitude,
            "longitude": longitude
        })
    });
}

var gwImg = {
    url: 'img/gw.jpg',
    scaledSize: new google.maps.Size(40, 40)
};

var isImg = {
    url: 'img/is.jpg',
    scaledSize: new google.maps.Size(40, 40)
};

var klImg = {
    url: 'img/kl.jpg',
    scaledSize: new google.maps.Size(40, 40)
};
var qaImg = {
    url: 'img/qa.jpg',
    scaledSize: new google.maps.Size(40, 40)
};

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

var map;
var markers = [];
var infowindow = {};

function updateMap(data, crd) {
    if(!map) {
        infowindow = new google.maps.InfoWindow();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 17,
            center: new google.maps.LatLng(crd.latitude, crd.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }
    var locations = [];
    var posts = data.poster;
    for (var x = 0; x < posts.length; x++) {
        if(posts[x].harRegistert) {
            continue;
        }
        locations.push([JSON.stringify(posts[x].poengVerdi), posts[x].latitude, posts[x].longitude, 4]);
    }

    getPosition(function members(data) {
        for (x = 0; x < data.length; x++) {
            locations.push([data[x].navn, data[x].latitude, data[x].longitude, 0]);
        }
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        
        for (var i = 0; i < locations.length; i++) {
            var marker;
            if (locations[i][0] == 'Gareth Western') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: gwImg
                });
            } else if (locations[i][0] == 'Qadeer Ahmad') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: qaImg
                });
            } else if (locations[i][0] == 'Karianne Leland') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: klImg
                });
            } else if (locations[i][0] == 'Inge Syvertsen') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: isImg
                });
            } else {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                });
            }
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }

    });

}

function updateWeapons(data) {
    var harBombe = false;
    var harFelle = false;
    for(var vaapenIdx in data.vaapen) {
        if(data.vaapen[vaapenIdx].vaapenId == 'BOMBE') {
            harBombe = true;
        }
        
        if(data.vaapen[vaapenIdx].vaapenId == 'FELLE') {
            harFelle = true;
        }
    }
    
    if(!harBombe) {
        $('#button-bomb').hide();
    }
    
    if(!harFelle) {
        $('#button-trap').hide();
    }
    
}

function success(pos) {
    var crd = pos.coords;
    sendPosition(crd.latitude, crd.longitude);
    getState(function (data){
        updateMap(data, crd);
        updateWeapons(data);
    });
};

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};

function setDropdown(verdi) {
    $('#person').val(verdi);
    $('#person li').css('background-color', 'white');
    $('#'+verdi).css('background-color', 'rgb(235, 104, 41)');
    setCookie('deltaker', verdi);
}


