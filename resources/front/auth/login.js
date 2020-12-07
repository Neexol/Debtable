class AuthorizationRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            pass: '',
            errorText: ''
        };
    }

    setErrorText = error => this.setState({errorText: error});

    handleLoginChange = e => this.setState({login: e.target.value});
    handlePassChange  = e => this.setState({pass:  e.target.value});

    handleSubmitClick = e => {
        sendPost(ROUTE_LOGIN, JSON.stringify({
            username: this.state.login,
            password: this.state.pass
        }), response => {
            setJWT(response);
            location.replace(HOST_URL+'home/home.html');
        }, response => {
            switch (response.status) {
                case 401:
                    this.setErrorText("Неправильный пароль!");
                    break;
                case 404:
                    this.setErrorText("Пользователь не найден!");
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
                    <h1>Авторизация</h1><hr/>

                    <label htmlFor="login"><b>Логин</b></label>
                    <input type="text" placeholder="Введите логин" name="login" id="login"
                           value={this.state.login}
                           onChange={this.handleLoginChange}/>

                    <label htmlFor="pass"><b>Пароль</b></label>
                    <input type="password" placeholder="Введите пароль" name="pass" id="pass"
                           value={this.state.pass}
                           onChange={this.handlePassChange}/>

                    <div className="validation-errors"
                         style={{display: (this.state.errorText === '' ? 'none' : 'block')}}>
                        {this.state.errorText}
                    </div>

                    <button type="submit" className="apply-btn"
                            onClick={this.handleSubmitClick}
                            disabled={
                                this.state.login === '' ||
                                this.state.pass  === ''
                            }>
                        Войти
                    </button>
                </div>

                <div className="container signin">
                    <p>Впервые на Debtable? <a href="register.html">Регистрация</a></p>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AuthorizationRoot/>,
    document.getElementById('root')
);