class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.profile.display_name,
            changePassDialogOpened: false,
            changePass: {
                oldPass: '',
                newPass: '',
                newPassRepeat: ''
            }
        }
    };

    openChangePassDialog = () => this.setState({
        changePassDialogOpened: true
    });
    closeChangePassDialog = () => this.setState({
        changePassDialogOpened: false,
        changePass: {
            oldPass: '',
            newPass: '',
            newPassRepeat: ''
        }
    });

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

    handleOldPassChange = e => this.setState({changePass: {oldPass: e.target.value}});
    handleNewPassChange = e => this.setState({changePass: {newPass: e.target.value}});
    handleNewPassRepeatChange = e => this.setState({changePass: {newPassRepeat: e.target.value}});

    handleChangePass = e => {}

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

                    <button className="apply-btn" onClick={this.openChangePassDialog}>
                        Сменить пароль
                    </button>

                    <button className="apply-btn" onClick={this.handleLogOut}>
                        Выйти из этой параши
                    </button>
                </div>

                <div id="changePassDialog" className="modal"
                     onClick={e => {if (e.target.id === 'changePassDialog') this.closeChangePassDialog()}}
                     style={{display: this.state.changePassDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeChangePassDialog}>
                            ✕
                        </span>

                        <label htmlFor="old_pass"><b>Текущий пароль</b></label>
                        <input type="password" placeholder="текущий пароль" name="old_pass" id="old_pass"
                               value={this.state.changePass.oldPass}
                               onChange={this.handleOldPassChange}/>

                        <label htmlFor="new_pass"><b>Новый пароль</b></label>
                        <input type="password" placeholder="новый пароль" name="new_pass" id="new_pass"
                               value={this.state.changePass.newPass}
                               onChange={this.handleNewPassChange}/>

                        <label htmlFor="new_pass_repeat"><b>Новый пароль еще раз</b></label>
                        <input type="password" placeholder="новый пароль еще раз" name="new_pass_repeat" id="new_pass_repeat"
                               value={this.state.changePass.newPassRepeat}
                               onChange={this.handleNewPassRepeatChange}/>

                        <button type="submit" className="apply-btn"
                                onClick={this.handleChangePass}
                                disabled={
                                    this.state.changePass.oldPass === '' ||
                                    this.state.changePass.newPass === '' ||
                                    this.state.changePass.newPassRepeat === ''
                                }>
                            Подтвердить
                        </button>
                    </div>
                </div>
            </>
        );
    }
}