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
                         className="card-panel invite-card"
                         onClick={e => {
                             if (e.target.className.includes('btn')) return;
                             // console.log(`click on "${room.name}" [id: ${room.id}]`);
                         }}>

                        {/*<div style={{width: 'max-content'}}>*/}
                        <div>
                            Приглашение в комнату "<b>{room.name}</b>"<br/>
                            <span className={'neutral-text-colored'}
                                  style={{display: 'flex', alignItems: 'center'}}>
                                <i className="material-icons small-icon nav-icon">people</i>
                                {room.members_number}
                            </span><br/>
                            {/*id: {room.id}<br/>*/}
                        </div>


                        <div className={'row action-section'}>
                            {/*<button className="waves-effect waves-light btn-flat col s6"*/}
                            {/*        onClick={() => props.onDeclineInviteClick(room.id)}>*/}
                            {/*    Отклонить*/}
                            {/*</button>*/}
                            {/*<button className="waves-effect waves-light btn col s6"*/}
                            {/*        onClick={() => props.onAcceptInviteClick(room.id)}>*/}
                            {/*    Принять*/}
                            {/*</button>*/}
                            <a className="col s6"
                               onClick={() => props.onAcceptInviteClick(room.id)}>
                                Принять
                            </a>
                            <a className="col s6 neutral-text-colored"
                                    onClick={() => props.onDeclineInviteClick(room.id)}>
                                Отклонить
                            </a>
                        </div>
                    </div>
                ))
        }</div>
    );
}