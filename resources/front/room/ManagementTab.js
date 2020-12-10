class ManagementTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            removeMemberDialogOpened: false,
            leaveRoomDialogOpened: false,
            removeInvitedUserDialogOpened: false,
            inviteUsersDialogOpened: false,
            selectedUserID: null,
        };
    }

    userById = userID => {
        const users = this.props.members
            .concat(this.props.invitedUsers);
        return userID ? users[users.map(user => user.id).indexOf(userID)] : {username: null};
    };

    openRemoveMemberDialog = memberID => this.setState({
        removeMemberDialogOpened: true,
        selectedUserID: memberID
    });
    closeRemoveMemberDialog = () => this.setState({
        removeMemberDialogOpened: false,
        selectedUserID: null
    });

    openRemoveInvitedUserDialog = invitedUserID => this.setState({
        removeInvitedUserDialogOpened: true,
        selectedUserID: invitedUserID
    });
    closeRemoveInvitedUserDialog = () => this.setState({
        removeInvitedUserDialogOpened: false,
        selectedUserID: null
    });

    openLeaveRoomDialog = memberID => this.setState({
        leaveRoomDialogOpened: true,
        selectedUserID: memberID
    });
    closeLeaveRoomDialog = () => this.setState({
        leaveRoomDialogOpened: false,
        selectedUserID: null
    });

    whoIsUser = userID => {
        if (this.props.members.map(user => user.id).includes(userID)) {
            return 'member'
        } else if (this.props.invitedUsers.map(user => user.id).includes(userID)) {
            return 'invitedUser'
        } else {
            return 'user'
        }
    };

    removeMember = isAuthorizedUser => {
        sendDelete(ROUTE_REMOVE_MEMBER(this.props.roomID, this.state.selectedUserID), null,
        response => {
            this.props.updateMembersByRemove(response);
            // console.log("isAuthorizedUser = "+isAuthorizedUser);
            if (isAuthorizedUser) redirectToHome();
            // console.log("user ["+response+"] removed");
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    console.log("error "+response.status);
                    break;
            }
        });
        if (isAuthorizedUser) {
            this.closeLeaveRoomDialog();
        } else {
            this.closeRemoveMemberDialog();
        }
    };
    handleLeaveRoom = () => this.removeMember(true);
    handleRemoveMember = () => this.removeMember(false);

    handleRemoveInvitedUser = () => {
        sendDelete(ROUTE_REMOVE_INVITED_USER(this.props.roomID, this.state.selectedUserID), null,
        response => {
                this.props.updateInvitedUsersByRemove(response);
                console.log("invited user ["+response+"] removed");
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    console.log("error "+response.status);
                    break;
            }
        });
        this.closeRemoveInvitedUserDialog();
    };

    handleInviteNewUser = () => {
        sendPost(ROUTE_INVITES_OF_ROOM(this.props.roomID), JSON.stringify({
            user_id: this.state.selectedUserID
        }), response => {
            this.props.updateInvitedUsersByAdd(response);
            console.log("invite new user ["+response.id+"]");
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    console.log("error "+response.status);
                    break;
            }
        });
        this.closeRemoveInvitedUserDialog();
    };

    inviteNewUserFromDialog = userID => {
        this.state.selectedUserID = userID;
        this.handleInviteNewUser();
    };
    cancelInviteFromDialog = userID => {
        this.state.selectedUserID = userID;
        this.handleRemoveInvitedUser();
    }

    render() {
        return (
            <>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span>Комната "<strong>название</strong>"</span>
                    <button className="action-btn"
                            onClick={() => this.setState({inviteUsersDialogOpened: true})}
                            style={{display: 'flex', alignItems: 'center'}}>
                        <><i className="material-icons nav-icon">person_add</i>Пригласить участников</>
                    </button>
                </div>

                <hr/>

                <div className="members-container">
                    <span>
                        Участники<br/>
                        <MembersList members={this.props.members}
                                     onRemove={this.openRemoveMemberDialog}
                                     onLeaveRoom={this.openLeaveRoomDialog}
                                     removeIcon='person_remove'/>
                    </span>
                    {
                        this.props.invitedUsers.length ? (
                            <span>
                                Пришлашенные<br/>
                                <MembersList members={this.props.invitedUsers}
                                             onRemove={this.openRemoveInvitedUserDialog}
                                             onLeaveRoom={this.openLeaveRoomDialog}
                                             removeIcon='cancel'/>
                            </span>
                        ) : null
                    }
                </div>

                <ConfirmDialog id="removeMemberDialog"
                               display={this.state.removeMemberDialogOpened}
                               onClose={this.closeRemoveMemberDialog}
                               onConfirm={this.handleRemoveMember}
                               text={`Кикнуть участника #${this.userById(this.state.selectedUserID).username}?`}/>

                <ConfirmDialog id="removeInvitedUserDialog"
                               display={this.state.removeInvitedUserDialogOpened}
                               onClose={this.closeRemoveInvitedUserDialog}
                               onConfirm={this.handleRemoveInvitedUser}
                               text={`Отменить приглашение #${this.userById(this.state.selectedUserID).username}?`}/>

                <ConfirmDialog id="leaveRoomDialog"
                               display={this.state.leaveRoomDialogOpened}
                               onClose={this.closeLeaveRoomDialog}
                               onConfirm={this.handleLeaveRoom}
                               text='Вы действительно хотите покинуть комнату? А долги кто будет возвращать? А?'/>

                <InviteUsersDialog id="inviteUsersDialog"
                                   whoIsUser={this.whoIsUser}
                                   display={this.state.inviteUsersDialogOpened}
                                   onInviteUser={this.inviteNewUserFromDialog}
                                   onCancelInvite={this.cancelInviteFromDialog}
                                   onClose={() => this.setState({inviteUsersDialogOpened: false})}/>
            </>
        );
    }
}

function MembersList(props) {
    return (
        <>{
            props.members.map(member => (
                <div key={member.id}
                     className={"member-card" + (member.id === getAuthorizedUserID() ? " self" : "")}
                     style={{display: 'flex', alignItems: 'center'}}>
                    <span>
                        <strong>{member.display_name}</strong><br/>
                        {LOGIN_SYMBOL}{member.username}
                    </span>

                    <span className="material-icons small-action-btn"
                          onClick={() => {
                              if (member.id === getAuthorizedUserID()) {
                                  props.onLeaveRoom(member.id);
                              } else {
                                  props.onRemove(member.id);
                              }
                          }}>
                        {props.removeIcon}
                    </span>
                </div>
            ))
        }</>
    );
}

function ConfirmDialog(props) {
    return (
        <div id={props.id} className="modal"
             onClick={e => {if (e.target.id === props.id) props.onClose()}}
             style={{display: props.display ? 'block' : 'none'}}>

            <div className="modal-content">
                <span className="small-action-btn close-dialog-btn"
                      onClick={props.onClose}>
                    <i className="material-icons">close</i>
                </span>

                <h2>{props.text}</h2>

                <div style={{display: 'flex'}}>
                    <button type="submit" className="apply-btn"
                            onClick={props.onClose}>
                        Отмена
                    </button>
                    <button type="submit" className="apply-btn"
                            onClick={props.onConfirm}>
                        Да
                    </button>
                </div>
            </div>
        </div>
    );
}

class InviteUsersDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchResults: undefined,
        };
    }

    handleSearchTextChange = e => this.setState({searchText: e.target.value});

    handleSearch = () => {
        sendGet(ROUTE_USERS(this.state.searchText),
            response => {
                this.setState({searchResults: response});
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
    }

    render() {
        return (
            <div id={this.props.id} className="modal"
                 onClick={e => {if (e.target.id === this.props.id) this.props.onClose()}}
                 style={{display: this.props.display ? 'block' : 'none'}}>

                <div className="modal-content">

                    <span className="small-action-btn close-dialog-btn"
                          onClick={this.props.onClose}>
                        <i className="material-icons">close</i>
                    </span>

                    <div style={{display: "flex"}}>
                        <input type="text" placeholder="Введите имя" name="search"
                               style={{flexGrow: "1"}}
                               value={this.state.searchText}
                               onChange={this.handleSearchTextChange}/>
                        <button className="action-btn"
                                onClick={this.handleSearch}
                                disabled={this.state.searchText === ''}
                                style={{display: 'flex', alignItems: 'center'}}>
                            <><i className="material-icons nav-icon">search</i>Поиск</>
                        </button>
                    </div>

                    <div className="search-results-container">
                        {
                            this.state.searchResults === undefined ? '' : (
                                !this.state.searchResults.length ? 'Пользователей не найдено :(' : (
                                    this.state.searchResults.map(user => (
                                        <SearchResult key={user.id}
                                                      user={user}
                                                      whoIsUser={this.props.whoIsUser(user.id)}
                                                      onInviteUser={this.props.onInviteUser}
                                                      onCancelInvite={this.props.onCancelInvite}/>
                                    ))
                                )
                            )
                        }
                    </div>

                </div>
            </div>
        );
    }
}

function SearchResult(props) {
    return (
        <div className="search-result">
            <span>
                <strong>{props.user.display_name}</strong><br/>
                {LOGIN_SYMBOL}{props.user.username}
            </span>

            <button className={"invite-text-btn"+(props.whoIsUser === 'invitedUser' ? ' negative' : '')}
                    onClick={() => {
                        switch (props.whoIsUser) {
                            case 'invitedUser': props.onCancelInvite(props.user.id); return;
                            case 'user': props.onInviteUser(props.user.id); return;
                        }
                    }}
                    disabled={props.whoIsUser === 'member'}>
                {
                    props.whoIsUser === 'member' ? 'Уже в комнате' : (
                        props.whoIsUser === 'invitedUser' ? 'Отменить приглашение' :
                            'Пригласить'
                    )
                }
            </button>
        </div>
    );
}