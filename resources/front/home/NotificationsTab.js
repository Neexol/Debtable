class NotificationsTab extends React.Component {
    handleAcceptInvite = id => {
        sendPost(ROUTE_INVITES_OF_USER, JSON.stringify({
            invite_id: id
        }), response => {
            this.props.updateInvitesByAccept(response);
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
    }

    handleDeclineInvite = id => {
        sendDelete(ROUTE_DECLINE_INVITE(id), null,
        response => {
            this.props.updateInvitesByDecline(response);
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
    }

    render() {
        return (
            <>
                <InviteTiles invites={this.props.invites}
                             onAcceptInviteClick={this.handleAcceptInvite}
                             onDeclineInviteClick={this.handleDeclineInvite()}/>
            </>
        );
    }
}

function InviteTiles(props) {
    return (
        <> {
            props.invites.rooms.length === 0 ? (<strong>Нет приглашений</strong>) :
                props.invites.rooms.map(room => (
                    <div key={room.id}
                         className="card invite-card"
                         onClick={e => {
                             if (e.target.className === 'accept-invite' ||
                                 e.target.className === 'decline-invite') return;
                             console.log(`click on "${room.name}" [id: ${room.id}]`);
                         }}>

                        <div style={{width: 'max-content'}}>
                            Приглашение в комнату "<b>{room.name}</b>"<br/>
                            <span style={{display: 'flex', alignItems: 'center'}}>
                                <i className="material-icons nav-icon">people</i>
                                {room.members_number}
                            </span><br/>
                            id: {room.id}<br/>
                        </div>


                        <div style={{display: "flex", float: "bottom"}}>
                            <button className="action-btn"
                                    onClick={() => props.onAcceptInviteClick(room.id)}
                                    style={{display: 'flex', alignItems: 'center', marginRight: "0.3rem"}}>
                                <><i className="material-icons nav-icon">check_circle</i>Принять</>
                            </button>
                            <button className="action-btn"
                                    onClick={() => props.onDeclineInviteClick(room.id)}
                                    style={{display: 'flex', alignItems: 'center'}}>
                                <><i className="material-icons nav-icon">cancel</i>Отклонить</>
                            </button>
                        </div>
                    </div>
                ))
        } </>
    );
}