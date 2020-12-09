class ManagementTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            removeMemberDialogOpened: false,
            removeInvitedUserDialogOpened: false,
            selectedUserID: null
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

    handleRemoveMember = () => {
        sendDelete(ROUTE_REMOVE_MEMBER(this.props.roomID, this.state.selectedUserID), null,
        response => {
            this.props.updateMembersByRemove(response);
            console.log("user ["+response+"] removed");
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
        this.closeRemoveMemberDialog();
    }

    handleRemoveInvitedUser = () => {
        sendDelete(ROUTE_REMOVE_INVITED_USER(this.props.roomID, this.state.selectedUserID), null,
            response => {
                this.props.updateInvitedUsersByRemove(response);
                console.log("invited user ["+response+"] removed");
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
    }

    render() {
        return (
            <>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span>Комната "<strong>название</strong>"</span>
                    <button className="action-btn"
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
                                     removeIcon='person_remove'/>
                    </span>
                    {
                        this.props.invitedUsers.length ? (
                            <span>
                                Пришлашенные<br/>
                                <MembersList members={this.props.invitedUsers}
                                             onRemove={this.openRemoveInvitedUserDialog}
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
            </>
        );
    }
}

function MembersList(props) {
    return (
        <>{
                props.members.map(member => (
                    <div key={member.id}
                         className="member-card"
                         style={{display: 'flex', alignItems: 'center'}}>
                        <span>
                            <strong>{member.display_name}</strong><br/>
                            #{member.username}
                        </span>

                        <span className="material-icons small-action-btn"
                              onClick={() => props.onRemove(member.id)}
                              // style={{float: 'right'}}
                        >
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
                        Да, пошел он нахуй
                    </button>
                </div>
            </div>
        </div>
    );
}