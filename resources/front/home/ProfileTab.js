class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.profile.display_name
        }
    };

    handleDisplayNameChange = e => this.setState({displayName: e.target.value});
    handleSaveClick = e => {
        sendPatch('api/account/change/data', JSON.stringify({
            new_display_name: this.state.displayName
        }), response => {
            this.props.updateUser(response);
            // alert(`All is good! ${response.responseText}\n${response.text}\n${response.body}\n${response}`);
        }, response => {
            switch (response.status) {
                case 404:
                    this.setState({
                        errLogin:  'block',
                        errRepeat: 'none',
                        errPass:   'none'
                    });
                    break;
                default:
                    this.setState({
                        errLogin:  'none',
                        errRepeat: 'none',
                        errPass:   'block'
                    });
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
            <div className="container">
                <h1>Профиль (<strong>{this.props.profile.username})</strong></h1>

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
        );
    }
}