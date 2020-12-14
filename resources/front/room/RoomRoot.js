class RoomRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomID: this.getRoomID(),
            checkedIndex: this.getCurrentTab(),
            room: undefined,
            members: undefined,
            // purchases: undefined,
            invitedUsers: undefined,
        };
    }

    getCurrentTab() {
        const tab = new URLSearchParams(window.location.search).get('tab')?.toString();
        switch (tab) {
            case 'management': return 0;
            case 'statistics': return 1;
            default: return 2;
        }
    }

    getRoomID() {
        const tab = new URLSearchParams(window.location.search).get('room');
        return Number.parseInt(tab);
    }

    handleCheck = index => {
        const tabs = ['management', 'statistics', 'table'];
        const params = new URLSearchParams(window.location.search);
        params.set('tab', tabs[index]);
        window.history.pushState(
            {tab: index},
            '',
            window.location.toString().replace(/\?.*$/, '')+`?${params}`
        );
        this.setState({checkedIndex: index})
    }

    updateMembersByRemove = removedMember => this.setState(state => {
        let newMembers = state.members;
        newMembers.splice(newMembers.map(member => member.id).indexOf(removedMember), 1);
        return {members: newMembers}
    });
    updateInvitedUsersByRemove = removedInvitedUser => this.setState(state => {
        let newInvitedUsers = state.invitedUsers;
        newInvitedUsers.splice(newInvitedUsers.map(user => user.id).indexOf(removedInvitedUser), 1);
        return {invitedUsers: newInvitedUsers}
    });
    updateInvitedUsersByAdd = newInvitedUser => this.setState(state => {
        let newInvitedUsers = state.invitedUsers;
        newInvitedUsers.push(newInvitedUser);
        return {invitedUsers: newInvitedUsers}
    });

    getMembers = () => sendGet(ROUTE_MEMBERS(this.state.roomID),
        response => {
            this.setState({members: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    redirectToHome();
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка загрузки участников');
                    break;
            }
        }
    );
    getInvitedUsers = () => sendGet(ROUTE_INVITES_OF_ROOM(this.state.roomID),
        response => {
            this.setState({invitedUsers: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    redirectToHome();
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка загрузки приглашений');
                    break;
            }
        }
    );
    // getPurchases = () => sendGet(ROUTE_PURCHASES(this.state.roomID),
    //     response => {
    //         this.setState({purchases: response});
    //     },
    //     response => {
    //         switch (response.status) {
    //             case 401:
    //                 redirectToLogin();
    //                 break;
    //             case 403:
    //                 showErrorToast(response.status, 'Ошибка доступа к комнате');
    //                 redirectToHome();
    //                 break;
    //             case 404:
    //                 showErrorToast(response.status, 'Комната не найдена');
    //                 break;
    //             default:
    //                 showErrorToast(response.status, 'Ошибка загрузки списка покупок');
    //                 break;
    //         }
    //     }
    // );
    getRoom = () => sendGet(ROUTE_ROOM(this.state.roomID),
        response => {
            this.setState({room: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    redirectToHome();
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка загрузки комнаты');
                    break;
            }
        }
    );

    componentDidMount() {
        this.getRoom();
        this.getMembers();
        // this.getPurchases();
        this.getInvitedUsers();
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <RoomTopMenu checkedIndex={this.state.checkedIndex}
                             onCheck={this.handleCheck}/>
                <div className={'content'}
                     style={this.state.checkedIndex === 2 ? {padding: '0'} : null}>{
                    this.state.room         === undefined ||
                    this.state.members      === undefined ||
                    this.state.invitedUsers === undefined
                        ? <Loader size={'big'} center={true}/>
                        : NAVIGATION(this.state.checkedIndex, {
                            members: this.state.members,
                            // purchases: this.state.purchases,
                            invitedUsers: this.state.invitedUsers,
                            room: this.state.room,
                            updateMembersByRemove: this.updateMembersByRemove,
                            updateInvitedUsersByRemove: this.updateInvitedUsersByRemove,
                            updateInvitedUsersByAdd: this.updateInvitedUsersByAdd,
                        })
                }</div>
            </div>
        )
    }
}
