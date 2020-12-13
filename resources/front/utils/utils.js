// const BASE_URL = "https://devtable.herokuapp.com";
// const BASE_URL = "http://localhost:8080";
const BASE_URL = location.origin;
const HOST_URL = BASE_URL + "/";
const LOGIN_SYMBOL = '@';

// Auth
const ROUTE_REGISTER = 'api/auth/register';
const ROUTE_LOGIN = 'api/auth/login';

// Account
const ROUTE_CHANGE_PASS = 'api/account/change/password';
const ROUTE_CHANGE_NAME = 'api/account/change/data';

// Users
const ROUTE_ME = 'api/users/me';
const ROUTE_USERS = query => 'api/users?username=' + query;

// Rooms
const ROUTE_CREATE_ROOM = 'api/rooms';
const ROUTE_ROOMS = 'api/rooms';
const ROUTE_ROOM = roomID => 'api/rooms/' + roomID;

// Invites
const ROUTE_INVITES_OF_USER = 'api/rooms/invites';
const ROUTE_INVITES_OF_ROOM = roomID => 'api/rooms/' + roomID + '/invites';
const ROUTE_DECLINE_INVITE = inviteID => 'api/rooms/invites/' + inviteID;
const ROUTE_REMOVE_INVITED_USER = (roomID, userID) => 'api/rooms/' + roomID + '/invites?user_id=' + userID;

// Members
const ROUTE_MEMBERS = roomID => 'api/rooms/' + roomID + '/members';
const ROUTE_REMOVE_MEMBER = (roomID, userID) => 'api/rooms/' + roomID + '/members/' + userID;

// Purchases
const ROUTE_PURCHASES = roomID => 'api/rooms/' + roomID + '/purchases';
const ROUTE_PURCHASE = (roomID, purchaseID) => 'api/rooms/' + roomID + '/purchases/' + purchaseID;

// Statistics
const ROUTE_STATISTICS = roomID => 'api/rooms/' + roomID + '/stats';

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
const redirectToHome  = () => location.replace(HOST_URL+'home/home.html');
const redirectToRoom  = id => location.replace(HOST_URL+'room/room.html?room='+id);

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

const parseJWT = () => {
    const jwt = getJWT();
    if (jwt === undefined) return undefined;
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
};
const getAuthorizedUserID = () => parseJWT()?.id;

const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return dd + '.' + mm + '.' + yyyy;
}

const showErrorToast = (code, message) => M.toast({
    html: code + ': ' + message,
    classes: "error-toast"
})

const Dialog = props => (
    <div id={props.id} className="dialog"
         onClick={e => {if (e.target.id === props.id) props.onClose()}}
         style={{display: props.isOpen ? 'block' : 'none'}}>
        <div className="dialog-content">
            <span className="small-action-btn close-dialog-btn"
                  onClick={props.onClose}>
                <i className="material-icons">close</i>
            </span>
            <h4>{props.title}</h4>
            {props.children}
        </div>
    </div>
);

const YesCancel = props => (
    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
        <button className="waves-effect waves-light btn-flat"
                onClick={props.onYesClick}>
            да
        </button>
        <button className="waves-effect waves-red btn-flat"
                onClick={props.onCancelClick}>
            отмена
        </button>
    </div>
);