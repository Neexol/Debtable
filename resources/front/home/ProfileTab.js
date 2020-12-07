class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.profile.display_name
        }
    };

    handleDisplayNameChange = e => this.setState({displayName: e.target.value});

    handleSaveClick = e => {
        sendPatch(ROUTE_CHANGE_NAME, JSON.stringify({
            new_display_name: this.state.displayName
        }), response => {
            this.props.updateUser(response);
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    console.log("error "+response.status);
                    break;
            }
        });
    }

    handleChangePassClick = e => {}

    handleLogOut = e => {
        setJWT(undefined);
        redirectToLogin();
    }

    render() {
        return (
            <>
                <div className="container">
                    <h1>{this.props.profile.username}</h1>

                    <label htmlFor="display_name"><b>Имя пользователя</b></label>
                    <div style={{display: "flex"}}>
                        <input type="text" placeholder="Введите имя" name="display_name" id="display_name"
                               style={{flexGrow: "1"}}
                               value={this.state.displayName}
                               onChange={this.handleDisplayNameChange}/>
                        <button type="submit" className="apply-btn"
                                onClick={this.handleSaveClick}
                                disabled={this.state.displayName === this.props.profile.display_name}
                        >Сохранить</button>
                    </div>

                    <button className="apply-btn" onClick={this.handleChangePassClick}>
                        Сменить пароль
                    </button>

                    <button className="apply-btn" onClick={this.handleLogOut}>
                        Выйти из этой параши
                    </button>
                </div>


            </>
        );
    }
}