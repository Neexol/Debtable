// const BASE_URL = "https://devtable.herokuapp.com";
const BASE_URL = "http://localhost:8080";
const HOST_URL = BASE_URL + "/";

const Loader = () => <div className="loader"/>;

function sendRequest(path, options) {
    return $.ajax(HOST_URL+path, options);
}

function sendPost(path, body) {
    sendRequest(path, {
            type: "POST",
            data: body,
            contentType: "application/json",
            headers: {
                Authorization: "kek"
            }
    }).success(response => {
        console.log(response.responseText);
    });
}

function sendGet(path) {
    sendRequest(path, {
        type: "GET",
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6ImRlYnRhYmxlU2VydmVyIiwiaWQiOjMsImV4cCI6MTYwNzE5MTg0Nn0.qJgbkH1MRxLkck5-mSOSe7MufO8PWJWUy5Ru5JArPqoVpdEwttoq2jrq3ROfDmQhEbSPxVtwQMvIPG-4LZAksQ"
        }
    }).success(response => {
        console.log(response.responseText);
    });
}


