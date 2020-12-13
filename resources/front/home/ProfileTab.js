class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.profile.display_name,
            changePassDialogOpened: false,
            oldPass: '',
            newPass: '',
            newPassRepeat: '',
            errorText: ''
        }
    };

    openChangePassDialog = () => this.setState({
        changePassDialogOpened: true
    });
    closeChangePassDialog = () => this.setState({
        changePassDialogOpened: false,
        oldPass: '',
        newPass: '',
        newPassRepeat: '',
        errorText: ''
    });

    handleDisplayNameChange = e => this.setState({displayName: e.target.value});

    handleSaveClick = () => {
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
                    showErrorToast(response.status, 'Ошибка сохранения');
                    break;
            }
        });
    }

    handleOldPassChange = e => this.setState({oldPass: e.target.value});
    handleNewPassChange = e => this.setState({newPass: e.target.value});
    handleNewPassRepeatChange = e => this.setState({newPassRepeat: e.target.value});

    setErrorText = error => this.setState({errorText: error});

    handleChangePass = () => {
        if (this.state.newPass !== this.state.newPassRepeat) {
            this.setErrorText("Пароли не совпадают!");
            return;
        }
        sendPatch(ROUTE_CHANGE_PASS, JSON.stringify({
            old_password: this.state.oldPass,
            new_password: this.state.newPass
        }), response => {
            this.closeChangePassDialog();
        }, response => {
            switch (response.status) {
                case 400:
                    this.setErrorText("Неизвестная ошибка!");
                    break;
                case 401:
                    redirectToLogin();
                    break;
                case 403:
                    this.setErrorText("Текущий пароль неправильный!");
                    break;
                case 415:
                    this.setErrorText("Ошибка в теле запроса!");
                    break;
                case 422:
                    this.setErrorText("Проверьте правильность данных!");
                    break;
            }
        });
    }

    handleLogOut = e => {
        setJWT(undefined);
        redirectToLogin();
    }

    componentDidMount() {
        M.updateTextFields();
    }

    render() {
        return (
            <>
                <div className="card-panel profile-card">

                    <div style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        padding: '2rem 2rem 2rem 0',
                        wordWrap: 'anywhere'
                    }}>
                        <div className={'profile-decorator-line'}/>
                        <div style={{flexGrow: '1'}}>
                            <h3>
                                {this.props.profile.display_name}
                            </h3>
                            <h5 className={'neutral-text-colored'}>
                                {LOGIN_SYMBOL}{this.props.profile.username}
                            </h5>
                        </div>
                    </div>

                    <div style={{padding: '2rem'}}>
                        <div style={{marginTop: '0rem'}}>
                            <EditButton id={'displayNameInput'}
                                        label={'Имя пользователя'}
                                        editValue={this.state.displayName}
                                        onEditChange={this.handleDisplayNameChange}
                                        onButtonClick={this.handleSaveClick}
                                        buttonDisabled={this.state.displayName === this.props.profile.display_name}
                                        buttonIcon={'save'}/>
                        </div>

                        {/*<label htmlFor="display_name"><b>Имя пользователя</b></label>*/}
                        {/*<div style={{display: "flex"}}>*/}
                        {/*    <input type="text" placeholder="Введите имя" name="display_name" id="display_name"*/}
                        {/*           style={{flexGrow: "1"}}*/}
                        {/*           value={this.state.displayName}*/}
                        {/*           onChange={this.handleDisplayNameChange}/>*/}
                        {/*    <button type="submit" className="apply-btn"*/}
                        {/*            onClick={this.handleSaveClick}*/}
                        {/*            disabled={this.state.displayName === this.props.profile.display_name}>*/}
                        {/*        Сохранить*/}
                        {/*    </button>*/}
                        {/*</div>*/}





                        {/*<button className="apply-btn" onClick={this.openChangePassDialog}>*/}
                        {/*    Сменить пароль*/}
                        {/*</button>*/}

                        {/*<button className="apply-btn" onClick={this.handleLogOut}>*/}
                        {/*    Выйти из этой параши*/}
                        {/*</button>*/}
                    </div>

                    <div className={'card-bottom'}
                         style={{margin: '0', padding: '2rem'}}>
                        <a className="negative-text-colored"
                           style={{marginLeft: '1rem'}}
                           onClick={this.handleLogOut}>
                            Выйти
                        </a>
                        <a className="text-colored"
                           onClick={this.openChangePassDialog}>
                            Сменить пароль
                        </a>
                    </div>

                </div>

                <div id="changePassDialog" className="modal"
                     onClick={e => {if (e.target.id === 'changePassDialog') this.closeChangePassDialog()}}
                     style={{display: this.state.changePassDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeChangePassDialog}>
                            <i className="material-icons">close</i>
                        </span>

                        <h2>Сменить пароль</h2>

                        <label htmlFor="old_pass"><b>Текущий пароль</b></label>
                        <input type="password" placeholder="текущий пароль" name="old_pass" id="old_pass"
                               value={this.state.oldPass}
                               onChange={this.handleOldPassChange}/>

                        <label htmlFor="new_pass"><b>Новый пароль</b></label>
                        <input type="password" placeholder="новый пароль" name="new_pass" id="new_pass"
                               value={this.state.newPass}
                               onChange={this.handleNewPassChange}/>

                        <label htmlFor="new_pass_repeat"><b>Новый пароль еще раз</b></label>
                        <input type="password" placeholder="новый пароль еще раз" name="new_pass_repeat" id="new_pass_repeat"
                               value={this.state.newPassRepeat}
                               onChange={this.handleNewPassRepeatChange}/>

                        <div className="validation-errors"
                             style={{display: (this.state.errorText === '' ? 'none' : 'block')}}>
                            {this.state.errorText}
                        </div>

                        <button type="submit" className="apply-btn"
                                onClick={this.handleChangePass}
                                disabled={
                                    this.state.oldPass === '' ||
                                    this.state.newPass === '' ||
                                    this.state.newPassRepeat === ''
                                }>
                            Подтвердить
                        </button>
                    </div>
                </div>
            </>
        );
    }
}