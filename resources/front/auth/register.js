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
            location.replace(HOST_URL+'home/home.html');
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
            <div className="registration-form">
                <div className="container">
                    <h1>Регистрация</h1><hr/>

                    <label htmlFor="login"><b>Логин</b></label>
                    <input type="text" placeholder="Введите логин" name="login" id="login"
                           value={this.state.login}
                           onChange={this.handleLoginChange}
                    />

                    <label htmlFor="display_name"><b>Имя пользователя</b></label>
                    <input type="text" placeholder="Введите ваше имя" name="display_name" id="display_name"
                           value={this.state.displayName}
                           onChange={this.handleDisplayNameChange}
                    />

                    <label htmlFor="pass"><b>Пароль</b></label>
                    <input type="password" placeholder="Введите пароль" name="pass" id="pass"
                           autoComplete="new-password"
                           value={this.state.pass}
                           onChange={this.handlePassChange}
                    />

                    <label htmlFor="pass-repeat"><b>Пароль еще раз</b></label>
                    <input type="password" placeholder="Повторите пароль" name="pass-repeat" id="pass-repeat"
                           value={this.state.passRepeat}
                           onChange={this.handlePassRepeatChange}
                    />

                    <div className="validation-errors"
                         style={{display: (this.state.errorText === '' ? 'none' : 'block')}}>
                        {this.state.errorText}
                    </div>

                    <button className="apply-btn"
                            onClick={this.handleSubmitClick}
                            disabled={
                                this.state.login       === '' ||
                                this.state.displayName === '' ||
                                this.state.pass        === '' ||
                                this.state.passRepeat  === ''
                            }
                    >Зарегистрироваться</button>
                </div>

                <div className="container signin">
                    <p>Уже есть аккаунт? <a href="login.html">Войти</a></p>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AuthorizationRoot/>,
    document.getElementById('root')
);