class InvitesTab extends React.Component {
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
                case 404:
                    showErrorToast(response.status, 'Приглашение не найдено');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка принятия приглашения');
                    break;
            }
        });
    };

    handleDeclineInvite = id => {
        sendDelete(ROUTE_DECLINE_INVITE(id), null,
        response => {
            this.props.updateInvitesByDecline(response);
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                case 404:
                    showErrorToast(response.status, 'Приглашение не найдено');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка отказа от приглашения');
                    break;
            }
        });
    };

    render() {
        return (
            <>
                <InviteTiles invites={this.props.invites}
                             onAcceptInviteClick={this.handleAcceptInvite}
                             onDeclineInviteClick={this.handleDeclineInvite}/>
            </>
        );
    }
}

function InviteTiles(props) {
    return (
        <div className={'cards-container'}>{
            props.invites.length === 0 ? (<strong>Нет приглашений</strong>) :
                props.invites.map(room => (
                    <div key={room.id}
                         className="card-panel invite-card">

                        <div>
                            Приглашение в комнату "<b>{room.name}</b>"<br/>
                            <span className={'neutral-text-colored'}
                                  style={{display: 'flex', alignItems: 'center', marginTop: '0.2rem'}}>
                                <i className="material-icons small-icon nav-icon">people</i>
                                {room.members_number}
                            </span><br/>
                        </div>


                        <div className={'row action-section'}>
                            <a className="col s6"
                               onClick={() => props.onAcceptInviteClick(room.id)}>
                                Принять
                            </a>
                            <a className="col s6 text-colored"
                                    onClick={() => props.onDeclineInviteClick(room.id)}>
                                Отклонить
                            </a>
                        </div>
                    </div>
                ))
        }</div>
    );
}