class HomeRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIndex: 0,
            profile: undefined,
            rooms: undefined,
            invites: undefined
        };
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck = index => this.setState({checkedIndex: index});

    updateUser = newUser => this.setState({profile: newUser});

    updateRoomsByAdd = newRoom => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.rooms.push(newRoom);
        return {rooms: newRooms}
    });
    updateRoomsByDelete = deletedRoom => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.rooms.splice(newRooms.rooms.map(room => room.id).indexOf(deletedRoom), 1);
        return {rooms: newRooms}
    });
    updateRoomsByChange = updatedRoom => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.rooms[newRooms.rooms.map(room => room.id).indexOf(updatedRoom.id)] = updatedRoom;
        return {rooms: newRooms}
    });

    updateInvitesByAccept = acceptedInvite => this.setState(state => {
        let newRooms = state.rooms;
        newRooms.rooms.push(acceptedInvite);

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
                    console.log("error "+response.status);
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
                    console.log("error "+response.status);
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
                    console.log("error "+response.status);
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
            <>
                <HomeSideMenu checkedIndex={this.state.checkedIndex}
                              onCheck={this.handleCheck}/>
                {
                    this.state.profile === undefined || this.state.rooms === undefined
                        ? <div className="home__empty-page"><Loader/></div>
                        : <div className="home__content">{
                            NAVIGATION(this.state.checkedIndex, {
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
                }
            </>
        );
    }
}