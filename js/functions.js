deltagerKode = ''
lagKode  = ''


function getState() {

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

}

function sendMessage(msg) {

}

function getPosition() {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/PosisjonsService',
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

function sendPosition(latitude, longitude) {
    $.ajax({
        url: 'https://bbr2015.azurewebsites.net/api/PosisjonsService',
        contentType: 'application/json',
        method: 'POST',
        headers: {
            LagKode: '',
            DeltakerKode: ''
        },
        data: JSON.stringify({
            "latitude": latitude,
            "longitude": longitude
        }),
        success: function(data) {
            $(document.body).replaceWith(JSON.stringify(data, null, 65));
        }
    });
}