class RoomRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomID: this.getRoomID(),
            checkedIndex: this.getCurrentTab(),
            members: undefined,
            purchases: undefined,
            invitedUsers: undefined,
        };
    }

    getCurrentTab() {
        const tab = new URLSearchParams(window.location.search).get('tab')?.toString();
        switch (tab) {
            case 'statistics': return 1;
            case 'management': return 2;
            default: return 0;
        }
    }

    getRoomID() {
        const tab = new URLSearchParams(window.location.search).get('room');
        return Number.parseInt(tab);
    }

    handleCheck = index => {
        const tabs = ['table', 'statistics', 'management'];
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

    getMembers = () => sendGet(ROUTE_MEMBERS(this.state.roomID),
        response => {
            this.setState({members: response});
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
    getInvitedUsers = () => sendGet(ROUTE_INVITES_OF_ROOM(this.state.roomID),
        response => {
            this.setState({invitedUsers: response});
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
    getPurchases = () => sendGet(ROUTE_PURCHASES(this.state.roomID),
        response => {
            this.setState({purchases: response});
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
        this.getMembers();
        this.getPurchases();
        this.getInvitedUsers();
    }

    render() {
        return (
            <>
                <RoomTopMenu checkedIndex={this.state.checkedIndex}
                             onCheck={this.handleCheck}/>
                {
                    this.state.members      === undefined ||
                    this.state.purchases    === undefined ||
                    this.state.invitedUsers === undefined
                        ? <div className="room__empty-page"><Loader/></div>
                        : <div className="room__content">{
                            NAVIGATION(this.state.checkedIndex, {
                                members: this.state.members,
                                purchases: this.state.purchases,
                                invitedUsers: this.state.invitedUsers,
                                roomID: this.state.roomID,
                                updateMembersByRemove: this.updateMembersByRemove,
                                updateInvitedUsersByRemove: this.updateInvitedUsersByRemove,
                            })
                        }</div>
                }
            </>
        )
    }

    // render() {
    //     if (this.state.isLoading) {
    //         return <Loader/>
    //     } else return (
    //         <>
    //             <RoomTopMenu checkedIndex={this.state.checkedIndex}
    //                          onCheck={this.handleCheck}/>
    //
    //             <div className="room__content">
    //                 {NAVIGATION(this.state.checkedIndex, this.state.members)}
    //             </div>
    //         </>
    //
    //     );
    // }
}
