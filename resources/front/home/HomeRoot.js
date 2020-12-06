class HomeRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIndex: 0,
            profile: undefined,
            rooms: undefined
        };
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck = index => this.setState({checkedIndex: index});
    updateUser = newUser => this.setState({profile: newUser});

    componentDidMount() {
        sendGet('api/users/me', response => {
            this.setState({profile: response});
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    console.log("error "+response.status);
                    break;
            }
        })
        sendGet('api/rooms', response => {
            this.setState({rooms: response});
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    console.log("error "+response.status);
                    break;
            }
        })
    }

    render() {
        return (
            <>
                <HomeSideMenu
                    checkedIndex={this.state.checkedIndex}
                    onCheck={this.handleCheck}
                />{
                    this.state.profile === undefined || this.state.rooms === undefined
                        ? <div className="home__empty-page"><Loader/></div>
                        : <div className="home__content">{
                            NAVIGATION(this.state.checkedIndex, {
                                profile: this.state.profile,
                                rooms: this.state.rooms,
                                updateUser: this.updateUser
                            })
                        }</div>
                }
                {/*<div className="home__empty-page"><Loader/></div>*/}
                {/*<div className="home__content">{*/}
                {/*    this.state.profile === undefined || this.state.rooms === undefined*/}
                {/*        ? <Loader/>*/}
                {/*        : NAVIGATION(this.state.checkedIndex, {*/}
                {/*            profile: this.state.profile,*/}
                {/*            rooms: this.state.rooms*/}
                {/*        })*/}
                {/*}</div>*/}
            </>
        );
    }
}