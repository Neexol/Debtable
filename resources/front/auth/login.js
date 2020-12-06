class AuthorizationRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            pass: '',
            errLogin: 'none',
            errPass: 'none'
        };
    }

    handleLoginChange = e => this.setState({login: e.target.value});
    handlePassChange  = e => this.setState({pass:  e.target.value});
    handleSubmitClick = e => {
        sendPost(ROUTE_LOGIN, JSON.stringify({
            username: this.state.login,
            password: this.state.pass
        }), response => {
            setJWT(response);
            location.replace(HOST_URL+'home/home.html');
            // alert(`All is good! ${response.responseText}\n${response.text}\n${response.body}\n${response}`);
        }, response => {
            switch (response.status) {
                case 404:
                    this.setState({errLogin: 'block', errPass: 'none'});
                    break;
                default:
                    this.setState({errLogin: 'none', errPass: 'block'});
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
                    <div className="error-tooltip" style={{display: this.state.errLogin}}>
                        *Пользователь с таким логином не найден
                    </div>

                    <label htmlFor="pass"><b>Пароль</b></label>
                    <input type="password" placeholder="Введите пароль" name="pass" id="pass"
                           value={this.state.pass}
                           onChange={this.handlePassChange}/>
                    <div className="error-tooltip" style={{display: this.state.errPass}}>
                        *Ошибка в логине или пароле
                    </div>

                    <button type="submit" className="apply-btn"
                            onClick={this.handleSubmitClick}
                            disabled={
                                this.state.login === '' ||
                                this.state.pass  === ''
                            }
                    >Войти</button>
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