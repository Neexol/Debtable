// const BASE_URL = "https://devtable.herokuapp.com";
// const BASE_URL = "http://localhost:8080";
const BASE_URL = "";
const HOST_URL = BASE_URL + "/";

// Auth
const ROUTE_REGISTER = 'api/auth/register';
const ROUTE_LOGIN = 'api/auth/login';

// Account
const ROUTE_CHANGE_PASS = 'api/account/change/password';
const ROUTE_CHANGE_NAME = 'api/account/change/data';

// Users
const ROUTE_ME = 'api/users/me';
const ROUTE_USER = 'api/users';

// Rooms
const ROUTE_CREATE_ROOM = 'api/rooms';
const ROUTE_ROOMS = 'api/rooms';
const ROUTE_ROOM = id => 'api/rooms/' + id;
const ROUTE_DELETE_ROOM_MEMBER = (roomID, userID) => 'api/rooms/' + roomID + '/members/' + userID;

// Invites
const ROUTE_INVITES_OF_USER = 'api/rooms/invites';
const ROUTE_INVITES_OF_ROOM = id => 'api/rooms/' + id + '/invites';
const ROUTE_DECLINE_INVITE = id => 'api/rooms/invites/' + id;

const Loader = () => <div className="loader"/>;

const getJWT = () => {
    let matches = document.cookie.match(new RegExp("(?:^|; )jwt_auth=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const setJWT = jwt => document.cookie = 'jwt_auth=' + (
    jwt === undefined
        ? ';max-age=-1'
        : encodeURIComponent(jwt)
) + ';path=/';

const redirectToLogin = () => location.replace(HOST_URL+'auth/login.html');

const sendRequest = (path, method, body, onSuccess, onError) => $.ajax(HOST_URL+path, {
    type: method,
    data: body,
    contentType: "application/json",
    headers: { Authorization: `Bearer ${getJWT()}` },
    success: onSuccess,
    error: onError
});

const sendGet    = (path,       onSuccess, onError) => sendRequest(path, 'GET',    null, onSuccess, onError);
const sendPost   = (path, body, onSuccess, onError) => sendRequest(path, 'POST',   body, onSuccess, onError);
const sendPatch  = (path, body, onSuccess, onError) => sendRequest(path, 'PATCH',  body, onSuccess, onError);
const sendDelete = (path, body, onSuccess, onError) => sendRequest(path, 'DELETE', body, onSuccess, onError);
const sendPut    = (path, body, onSuccess, onError) => sendRequest(path, 'PUT',    body, onSuccess, onError);


