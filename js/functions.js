$(document).ready(function() {
    $('#message-to-send').keypress(function(event){
        
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            doSendMessage();	
        }
    
    });

    setDropdown('96625909')


    navigator.geolocation.getCurrentPosition(success, error, options);

    setInterval(function() {
        getMessages(0)
        navigator.geolocation.getCurrentPosition(success, error, options);

    }, 10000);
});


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
    console.log(event.keyCode);
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
function getMessages(seqNo) {
    meldingUrl = 'https://bbr2015.azurewebsites.net/api/Meldinger/' + sekvensnummer
    $.ajax({
        url: meldingUrl,
        contentType: 'application/json',
        method: 'GET',
        headers: createHeaders(),

        success: function(data) {
            data.meldinger.forEach(function(melding) {
            $("#meldinger").prepend("<p id='m'> Melding: " + melding.melding + "</p>");
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

var goldStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.3,
    scale: 0.1,
    strokeColor: 'gold',
    strokeWeight: 2
};

var redStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.3,
    scale: 0.1,
    strokeColor: 'red',
    strokeWeight: 2
};

var greenStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.3,
    scale: 0.1,
    strokeColor: 'green',
    strokeWeight: 2
};

var blueStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.3,
    scale: 0.1,
    strokeColor: 'blue',
    strokeWeight: 2
};
var blackStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.3,
    scale: 0.1,
    strokeColor: 'black',
    strokeWeight: 2
};

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};



function updateMap(data, crd) {
    var locations = [];
    var posts = data.poster;
    for (x = 0; x < posts.length; x++) {
        if(posts.harRegistrert) {
            continue;
        }
        locations.push([JSON.stringify(posts[x].poengVerdi), posts[x].latitude, posts[x].longitude, 4]);
    }
    locations.push(['You!', crd.latitude, crd.longitude, 0]);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: new google.maps.LatLng(crd.latitude, crd.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    getPosition(function members(data) {
        for (x = 0; x < data.length; x++) {
            locations.push([data[x].navn, data[x].latitude, data[x].longitude, 0]);
        }
    });

    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    for (i = 0; i < locations.length; i++) {
        if (locations[i][0] == 'You!') {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                icon: goldStar,
                map: map
            });
        } else {
            //alert(locations[i][0]);
            if (locations[i][0] == 'Gareth Western') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: redStar
                });
            } else if (locations[i][0] == 'Qadeer Ahmad') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: greenStar
                });
            } else if (locations[i][0] == 'Karianne Leland') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: blueStar
                });
            } else if (locations[i][0] == 'Inge Syvertsen') {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                    icon: blackStar
                });
            } else {
                marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    labelContent: locations[i][0],
                });
            }
        }

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

function updateWeapons(data) {
    var harBombe = false;
    var harFelle = false;
    console.log(data);
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
    $('#'+verdi).css('background-color', 'rgb(235, 104, 41)')
}


