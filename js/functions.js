function getDeltakerkode() {
	return $('#person').val();
}

function createHeaders() {
    return {
        LagKode: lagKode,
        DeltakerKode: getDeltakerkode()
    }
}

function getState(callback) {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/PosisjonsService',
        contentType: 'application/json',
        method: 'GET',
        headers: createHeaders(),
        success: callback
    });
}

function registerPost(registerNyPost) {

    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/GameService',
        contentType: 'application/json',
        method: 'POST',
        headers: {
            LagKode: lagKode,
            DeltakerKode: deltagerKode
        },
        data: JSON.stringify({
            registrerNyPost: registerNyPost
        })
    });


}

function getMessages(seqNo) {
    meldingUrl = 'https://bbr2015.azurewebsites.net/api/Meldinger'
    if (seqNo) {
        meldingUrl += '/' + seqNo
    }
    $.ajax({
        url: meldingUrl,
        contentType: 'application/json',
        method: 'GET',
        headers: {
            LagKode: '',
            DeltakerKode: ''
        },

        success: function(data) {
            $(document.body).replaceWith(JSON.stringify(data, null, 65));
        }
    });
}

function sendMessage(msg) {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/Meldinger',
        contentType: 'application/json',
        method: 'POST',
        headers: {
            LagKode: '',
            DeltakerKode: ''
        },
        data: JSON.stringify({
            "tekst": msg
        }),
        success: function(data) {
            $(document.body).replaceWith(JSON.stringify(data, null, 65));
        }
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