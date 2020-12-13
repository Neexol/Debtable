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
            redirectToHome();
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
            <div className="card-panel auth-card">
                <h4>Авторизация</h4><hr/>

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

                <div className="validation-errors"
                     style={{display: (this.state.errorText === '' ? 'none' : 'block')}}>
                    {this.state.errorText}
                </div>

                <button className="waves-effect waves-light btn"
                        style={{width: '100%', margin: '1rem 0'}}
                        onClick={this.handleSubmitClick}
                        disabled={
                            this.state.login       === '' ||
                            this.state.pass        === ''
                        }>
                    Войти
                </button>

                <p style={{textAlign: 'center'}}>
                    Впервые на Debtable? <a href="register.html">Регистрация</a>
                </p>
            </div>
        );
    }
}

ReactDOM.render(
    <AuthorizationRoot/>,
    document.getElementById('root')
);