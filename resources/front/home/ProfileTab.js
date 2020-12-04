class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log(JSON.stringify({
        //     username: "quill",
        //     display_name: "Владимир",
        //     password: "UltraPass123"
        // }));

        // $.post(`${HOST_URL}table.json`,


        // $.ajax({
        //     method: "post",
        //     url: `${HOST_URL}api/auth/register`,
        //     contentType: "application/json",
        //     data: JSON.stringify({
        //         username: "quill",
        //         display_name: "Владимир",
        //         password: "UltraPass123"
        //     }),
        //     success: response => {
        //         console.log("ajax " + response.responseText);
        //     }
        // });
        

        // let response = await fetch(`${HOST_URL}table.json`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         username: "quill",
        //         display_name: "Владимир",
        //         password: "UltraPass123"
        //     }),
        // });
        //
        // let result = await response.json();
        // alert(result.message);

        /// YES //////////////////////////////////
        // $.post(`${HOST_URL}api/auth/register`,
        //     JSON.stringify({
        //         username: "quill",
        //         display_name: "Владимир",
        //         password: "UltraPass123"
        //     }),
        //     (response) => {
        //     console.log("post " + response.responseText);
        // });

        // $.get(`${HOST_URL}table.json`, (response) => {
        // $.get(`https://devtable.herokuapp.com/api/users/me`, (response) => {
        //     console.log(response.responseText);
        //     console.log(response.code)
        // });
    }

    render() {
        return (
            <div>
                there is profile
            </div>
        );
    }
}