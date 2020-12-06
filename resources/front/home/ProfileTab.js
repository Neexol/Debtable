class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.profile.display_name
        }
    };

    handleDisplayNameChange = e => this.setState({displayName: e.target.value});
    handleSaveClick = e => {}
    handleChangePassClick = e => {}
    handleLogOut = e => {
        setJWT(undefined);
        redirectToLogin();
    }

    render() {
        return (
            <div className="container">
                <h1>Профиль <strong>{this.props.profile.username}</strong></h1><hr/>

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