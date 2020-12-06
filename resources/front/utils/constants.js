// const BASE_URL = "https://devtable.herokuapp.com";
const BASE_URL = "http://localhost:8080";
const HOST_URL = BASE_URL + "/";

const Loader = () => <div className="loader"/>;

// function getCookie(name) {
//     let matches = document.cookie.match(new RegExp(
//         "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//     ));
//     return matches ? decodeURIComponent(matches[1]) : undefined;
// }

function getJWT() {
    let matches = document.cookie.match(new RegExp("(?:^|; )jwt_auth=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setJWT(jwt) {
    if (jwt === undefined) {
        document.cookie = 'jwt_auth=;max-age=-1';
    } else {
        document.cookie = 'jwt_auth='+encodeURIComponent(jwt)+';path=/';
    }
}

const sendRequest = (path, options) =>
    $.ajax(HOST_URL+path, options);

function sendPost(path, body, onSuccess, onError) {
    sendRequest(path, {
        type: "POST",
        data: body,
        contentType: "application/json",
        headers: {
            Authorization: "kek"
        },
        success: onSuccess,
        error: onError
    });
}

function sendGet(path, onSuccess) {
    sendRequest(path, {
        type: "GET",
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6ImRlYnRhYmxlU2VydmVyIiwiaWQiOjMsImV4cCI6MTYwNzE5MTg0Nn0.qJgbkH1MRxLkck5-mSOSe7MufO8PWJWUy5Ru5JArPqoVpdEwttoq2jrq3ROfDmQhEbSPxVtwQMvIPG-4LZAksQ"
        },
        success: onSuccess,
        error: (response) => {
            switch (response.status) {
                case 401: location.replace(HOST_URL+'auth/authorization.html');
            }
            // console.log("response yeeehi ["+response.status+"] : "+response.respo);
        },
    });
}


