class AuthorizationRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            displayName: '',
            pass: '',
            passRepeat: '',
            errLogin: 'none',
            errRepeat: 'none',
            errPass: 'none'
        };
    }

    handleLoginChange       = e => this.setState({login:       e.target.value});
    handleDisplayNameChange = e => this.setState({displayName: e.target.value});
    handlePassChange        = e => this.setState({pass:        e.target.value});
    handlePassRepeatChange  = e => this.setState({passRepeat:  e.target.value});
    handleSubmitClick = e => {
        if (this.state.pass !== this.state.passRepeat) {
            this.setState({
                errLogin:  'none',
                errRepeat: 'block',
                errPass:   'none'
            })
            return;
        }
        sendPost('api/auth/register', JSON.stringify({
            username: this.state.login,
            display_name: this.state.displayName,
            password: this.state.pass
        }), response => {
            setJWT(response);
            location.replace(HOST_URL+'home/home.html');
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
                    <div className="error-tooltip" style={{display: this.state.errLogin}}>
                        *Такой пользователь уже зарегистрирован
                    </div>

                    <label htmlFor="display_name"><b>Имя пользователя</b></label>
                    <input type="text" placeholder="Введите ваше имя" name="display_name" id="display_name"
                           value={this.state.displayName}
                           onChange={this.handleDisplayNameChange}
                    />

                    <label htmlFor="pass"><b>Пароль</b></label>
                    <input type="password" placeholder="Введите пароль" name="pass" id="pass"
                           value={this.state.pass}
                           onChange={this.handlePassChange}
                    />

                    <label htmlFor="pass-repeat"><b>Пароль еще раз</b></label>
                    <input type="password" placeholder="Повторите пароль" name="pass-repeat" id="pass-repeat"
                           value={this.state.passRepeat}
                           onChange={this.handlePassRepeatChange}
                    />
                    <div className="error-tooltip" style={{display: this.state.errRepeat}}>
                        *Пароли не совпадают!
                    </div>
                    <div className="error-tooltip" style={{display: this.state.errPass}}>
                        *Ошибка в логине или пароле!
                    </div>

                    <button type="submit" className="apply-btn"
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
                    <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AuthorizationRoot/>,
    document.getElementById('root')
);