// const BASE_URL = "https://devtable.herokuapp.com";
const BASE_URL = "http://localhost:8080";
const HOST_URL = BASE_URL + "/";

const Loader = () => <div className="loader"/>;

function getJWT() {
    let matches = document.cookie.match(new RegExp("(?:^|; )jwt_auth=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setJWT(jwt) {
    // if (jwt === undefined) {
    //     document.cookie = 'jwt_auth=;max-age=-1';
    // } else {
    //     document.cookie = 'jwt_auth='+encodeURIComponent(jwt)+';path=/';
    // }
    document.cookie = 'jwt_auth=' + (jwt === undefined
        ? ';max-age=-1'
        : encodeURIComponent(jwt)
    ) + ';path=/';
}

const redirectToLogin = () => location.replace(HOST_URL+'auth/login.html');

const sendRequest = (path, options) =>
    $.ajax(HOST_URL+path, options);

function sendPost(path, body, onSuccess, onError) {
    sendRequest(path, {
        type: "POST",
        data: body,
        contentType: "application/json",
        headers: { Authorization: `Bearer ${getJWT()}` },
        success: onSuccess,
        error: onError
    });
}

function sendGet(path, onSuccess, onError) {
    sendRequest(path, {
        type: "GET",
        headers: { Authorization: `Bearer ${getJWT()}` },
        success: onSuccess,
        error: onError
    });
}


