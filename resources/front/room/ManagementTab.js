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
        sendDelete(ROUTE_REMOVE_MEMBER(this.props.room.id, this.state.selectedUserID), null,
        response => {
            if (isAuthorizedUser) redirectToHome();
            else this.props.updateMembersByRemove(response);
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
                    showErrorToast(response.status, 'Участник или комната не найдены');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка удаления участника');
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
        sendDelete(ROUTE_REMOVE_INVITED_USER(this.props.room.id, this.state.selectedUserID), null,
        response => {
                this.props.updateInvitedUsersByRemove(response);
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
                    showErrorToast(response.status, 'Участник или комната не найдены');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка удаления приглашения');
                    break;
            }
        });
        this.closeRemoveInvitedUserDialog();
    };

    handleInviteNewUser = () => {
        sendPost(ROUTE_INVITES_OF_ROOM(this.props.room.id), JSON.stringify({
            user_id: this.state.selectedUserID
        }), response => {
            this.props.updateInvitedUsersByAdd(response);
            console.log("invite new user ["+response.id+"]");
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    redirectToHome();
                    break;
                case 404:
                    showErrorToast(response.status, 'Участник или комната не найдены');
                    break;
                case 409:
                    showErrorToast(response.status,
                        'Пользователь уже является участником<br>или уже приглашен'
                    );
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка приглашения');
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
                <div className={'top-content-container'}
                     style={{padding: '1.5rem'}}>
                    <div className={'align-center-horizontal'}
                         style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{fontSize: '24pt'}}>
                        Комната <b>{this.props.room.name}</b>
                    </span>
                        <button className="waves-effect waves-light btn"
                                style={{margin: '0 0 0 1rem'}}
                                onClick={() => this.setState({inviteUsersDialogOpened: true})}>
                            <i className={'material-icons'}>person_add</i>
                        </button>
                    </div>
                </div>

                <div className={'members-container align-center-horizontal'}>
                    <span className={'users-col'}>
                        <div className={'center-align title'}>Участники</div>
                        <MembersList members={this.props.members}
                                     onRemove={this.openRemoveMemberDialog}
                                     onLeaveRoom={this.openLeaveRoomDialog}
                                     isOnlyOneMember={this.props.members.length === 1}
                                     removeIcon='person_remove'/>
                    </span>
                    {
                        this.props.invitedUsers.length ? (
                            <span className={'users-col'}>
                                <div className={'center-align title'}>Приглашенные</div>
                                <MembersList members={this.props.invitedUsers}
                                             onRemove={this.openRemoveInvitedUserDialog}
                                             onLeaveRoom={this.openLeaveRoomDialog}
                                             isOnlyOneMember={false}
                                             removeIcon='cancel'/>
                            </span>
                        ) : null
                    }
                </div>

                <Dialog id={'removeMemberDialog'}
                        width={'40%'}
                        onClose={this.closeRemoveMemberDialog}
                        isOpen={this.state.removeMemberDialogOpened}
                        title={
                            'Исключить участника ' +
                            LOGIN_SYMBOL +
                            this.userById(this.state.selectedUserID).username +
                            '?'
                        }>
                    <YesCancelButtons onYesClick={this.handleRemoveMember}
                                      onCancelClick={this.closeRemoveMemberDialog}/>
                </Dialog>

                <Dialog id={'removeInvitedUserDialog'}
                        width={'40%'}
                        onClose={this.closeRemoveInvitedUserDialog}
                        isOpen={this.state.removeInvitedUserDialogOpened}
                        title={
                            'Удалить приглашение для ' +
                            LOGIN_SYMBOL +
                            this.userById(this.state.selectedUserID).username +
                            '?'
                        }>
                    <YesCancelButtons onYesClick={this.handleRemoveInvitedUser}
                                      onCancelClick={this.closeRemoveInvitedUserDialog}/>
                </Dialog>

                <Dialog id={'leaveRoomDialog'}
                        width={'40%'}
                        onClose={this.closeLeaveRoomDialog}
                        isOpen={this.state.leaveRoomDialogOpened}
                        title={'Вы действительно хотите покинуть комнату?'}>
                    <YesCancelButtons onYesClick={this.handleLeaveRoom}
                                      onCancelClick={this.closeLeaveRoomDialog}/>
                </Dialog>

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
                     className={
                         'card-panel user-card ' +
                         (getAuthorizedUserID() === member.id ? 'self' : '')
                     }>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>
                            <b>{member.display_name}</b><br/>
                            <div className={'neutral-text-colored'}>{LOGIN_SYMBOL}{member.username}</div>
                        </span>

                        <span className="material-icons small-action-btn negative-text-colored"
                              style={{display: (props.isOnlyOneMember ? 'none' : 'block')}}
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

                </div>
            ))
        }</>
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
                        showErrorToast(response.status, 'Ошибка поиска');
                        break;
                }
            }
        );
    }

    render() {
        return (
            <Dialog id={this.props.id}
                    onClose={this.props.onClose}
                    isOpen={this.props.display}
                    title={'Пригласить участников'}>

                <EditButton id={'searchUsersInput'}
                            label={'Имя пользователя'}
                            editValue={this.state.searchText}
                            onEditChange={this.handleSearchTextChange}
                            onButtonClick={this.handleSearch}
                            buttonDisabled={this.state.searchText === ''}
                            buttonIcon={'search'}
                            margin={'0 0 1rem 0'}/>

                <div className="search-results-container">
                    <table>
                        <tbody>{
                            this.state.searchResults === undefined
                                ? <SearchResult text={' '}/>
                                : (
                                    !this.state.searchResults.length
                                    ? <SearchResult text={'Пользователей не найдено :('}/>
                                    : (
                                        this.state.searchResults.map(user => (
                                        <SearchResult key={user.id}
                                                      user={user}
                                                      whoIsUser={this.props.whoIsUser(user.id)}
                                                      onInviteUser={this.props.onInviteUser}
                                                      onCancelInvite={this.props.onCancelInvite}/>
                                    ))
                                )
                            )
                        }</tbody>
                    </table>
                </div>
            </Dialog>
        );
    }
}

function SearchResult(props) {
    if (props.text) return <tr><td>{props.text}</td></tr>;
    return (
        <tr><td><div className="search-result">
            <span>
                <b>{props.user.display_name}</b><br/>
                <div className={'neutral-text-colored'}>{LOGIN_SYMBOL}{props.user.username}</div>
            </span>
            {
                props.whoIsUser === 'member'
                    ? <div className={'neutral-text-colored'}>Уже в комнате</div>
                    : <a className={props.whoIsUser === 'invitedUser' ? 'negative-text-colored' : ''}
                         onClick={() => {
                             switch (props.whoIsUser) {
                                 case 'invitedUser': props.onCancelInvite(props.user.id); return;
                                 case 'user': props.onInviteUser(props.user.id); return;
                             }
                         }}>
                        {
                            props.whoIsUser === 'member' ? 'Уже в комнате' : (
                                props.whoIsUser === 'invitedUser' ? 'Отменить приглашение' :
                                    'Пригласить'
                            )
                        }
                    </a>
            }
        </div></td></tr>
    );
}