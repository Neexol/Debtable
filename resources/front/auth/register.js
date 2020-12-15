class AuthorizationRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            displayName: '',
            pass: '',
            passRepeat: '',
            errorText: ''
        };
    }

    setErrorText = error => this.setState({errorText: error});

    handleLoginChange       = e => this.setState({login:       e.target.value});
    handleDisplayNameChange = e => this.setState({displayName: e.target.value});
    handlePassChange        = e => this.setState({pass:        e.target.value});
    handlePassRepeatChange  = e => this.setState({passRepeat:  e.target.value});

    handleSubmitClick = e => {
        if (this.state.pass !== this.state.passRepeat) {
            this.setErrorText("Пароли не совпадают!");
            return;
        }
        sendPost(ROUTE_REGISTER, JSON.stringify({
            username: this.state.login,
            display_name: this.state.displayName,
            password: this.state.pass
        }), response => {
            setJWT(response);
            redirectToHome();
        }, response => {
            switch (response.status) {
                case 409:
                    this.setErrorText("Пользователь с таким логином уже существует!");
                    break;
                case 415:
                    this.setErrorText("Ошибка в теле запроса!");
                    break;
                case 422:
                    this.setErrorText("Проверьте правильность данных!");
                    break;
                default:
                    this.setErrorText("Неизвестная ошибка!");
                    break;
            }
        });
    }

    render() {
        return (
            <div className="card-panel auth-card">
                <h4>Регистрация</h4><hr/>

                <Edit id={'displayNameInput'} type={'text'}
                      margin={'0 0 1rem 0'}
                      value={this.state.displayName}
                      onChange={this.handleDisplayNameChange}
                      label={'Имя пользователя'}/>
                <Edit id={'loginInput'} type={'text'}
                      margin={'0 0 1rem 0'}
                      value={this.state.login}
                      onChange={this.handleLoginChange}
                      label={'Логин'}/>
                <Edit id={'passInput'} type={'password'}
                      margin={'0 0 1rem 0'}
                      value={this.state.pass}
                      onChange={this.handlePassChange}
                      label={'Пароль'}/>
                <Edit id={'PassRepeatInput'} type={'password'}
                      margin={'0 0 1rem 0'}
                      value={this.state.passRepeat}
                      onChange={this.handlePassRepeatChange}
                      label={'Пароль еще раз'}/>

                <div className="validation-errors"
                     style={{display: (this.state.errorText === '' ? 'none' : 'block')}}>
                    {this.state.errorText}
                </div>

                <button className="waves-effect waves-light btn"
                        style={{width: '100%', margin: '1rem 0'}}
                        onClick={this.handleSubmitClick}
                        disabled={
                            this.state.login       === '' ||
                            this.state.displayName === '' ||
                            this.state.pass        === '' ||
                            this.state.passRepeat  === ''
                        }>
                    Зарегистрироваться
                </button>

                <p style={{textAlign: 'center'}}>
                    Уже есть аккаунт? <a href={'login'}>Войти</a>
                </p>
            </div>
        );
    }
}

ReactDOM.render(
    <AuthorizationRoot/>,
    document.getElementById('root')
);