class HomeRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIndex: this.getCurrentTab(),
            profile: undefined,
            rooms: undefined,
            invites: undefined
        };
        this.handleCheck = this.handleCheck.bind(this);
    }

    getCurrentTab() {
        const tab = new URLSearchParams(window.location.search).get('tab')?.toString();
        switch (tab) {
            case 'profile': return 1;
            case 'invites': return 2;
            default: return 0;
        }
    }

    handleCheck = index => {
        const tabs = ['rooms', 'profile', 'invites'];
        const params = new URLSearchParams(window.location.search);
        params.set('tab', tabs[index]);
        window.history.pushState(
            {tab: index},
            '',
            window.location.toString().replace(/\?.*$/, '')+`?${params}`
        );
        this.setState({checkedIndex: index});
    }

    updateUser = newUser => this.setState({profile: newUser});

    updateRoomsByAdd = newRoom => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.push(newRoom);
        return {rooms: newRooms}
    });
    updateRoomsByDelete = deletedRoom => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.splice(newRooms.map(room => room.id).indexOf(deletedRoom), 1);
        return {rooms: newRooms}
    });
    updateRoomsByChange = updatedRoom => this.setState(state => {
        let newRooms = state.rooms;
        newRooms[newRooms.map(room => room.id).indexOf(updatedRoom.id)] = updatedRoom;
        return {rooms: newRooms}
    });

    updateInvitesByAccept = acceptedInvite => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.push(acceptedInvite);
        let newInvites = state.invites;
        newInvites.splice(newInvites.map(room => room.id).indexOf(acceptedInvite.id), 1);
        return {
            invites: newInvites,
            rooms: newRooms
        }
    });
    updateInvitesByDecline = declinedInvite => this.setState(state => {
        let newInvites = state.invites;
        newInvites.splice(newInvites.map(room => room.id).indexOf(declinedInvite), 1);
        return {invites: newInvites}
    });

    getProfile = () => sendGet(ROUTE_ME,
        response => {
            this.setState({profile: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    // console.log("error "+response.status);
                    showErrorToast(response.status, 'Ошибка загрузки профиля');
                    break;
            }
        }
    );
    getRooms = () => sendGet(ROUTE_ROOMS,
        response => {
            this.setState({rooms: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    // console.log("error "+response.status);
                    showErrorToast(response.status, 'Ошибка загрузки комнат');
                    break;
            }
        }
    );
    getInvites = () => sendGet(ROUTE_INVITES_OF_USER,
        response => {
            this.setState({invites: response});
            // response.rooms.forEach(room => console.log('\ninvite to '+room.name+` [${room.id}]`));
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    // console.log("error "+response.status);
                    showErrorToast(response.status, 'Ошибка загрузки приглашений');
                    break;
            }
        }
    );

    componentDidMount() {
        this.getProfile();
        this.getRooms();
        this.getInvites();
    }

    render() {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'flex-start'}}>
                <HomeSideMenu checkedIndex={this.state.checkedIndex}
                              isInvites={this.state.invites?.length > 0}
                              onCheck={this.handleCheck}/>
                <div className={'content'}>{
                    this.state.profile === undefined ||
                    this.state.rooms   === undefined ||
                    this.state.invites === undefined
                        ? <Loader size={'big'} center={true}/>
                        : NAVIGATION(this.state.checkedIndex, {
                            profile: this.state.profile,
                            rooms: this.state.rooms,
                            invites: this.state.invites,
                            updateUser: this.updateUser,
                            updateRoomsByAdd: this.updateRoomsByAdd,
                            updateRoomsByDelete: this.updateRoomsByDelete,
                            updateRoomsByChange: this.updateRoomsByChange,
                            updateInvitesByAccept: this.updateInvitesByAccept,
                            updateInvitesByDecline: this.updateInvitesByDecline
                        })
                }</div>
            </div>
        );
    }
}