$(document).ready(function() {
    $('#message-to-send').keypress(function(event){
        
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            doSendMessage();	
        }
    
    });
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
        headers: {
            LagKode: 'hvaler_kaver_rundt_hvaler',
            DeltakerKode: $('#person').val()
        },

        success: function(data) {
            data.meldinger.forEach(function(melding) {
            $("#meldinger").prepend("<p> Deltaker: "+ melding.deltaker + ", melding: " + melding.melding + "</p>");
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

function getPosition() {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/PosisjonsService',
        contentType: 'application/json',
        method: 'GET',
        headers: createHeaders(),

        success: function(data) {
            $(document.body).replaceWith(JSON.stringify(data, null, 65));
        }
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
        }),
        success: function(data) {
            $(document.body).replaceWith(JSON.stringify(data, null, 65));
        }
    });
}

setInterval(function() {getMessages(0)}, 10000);