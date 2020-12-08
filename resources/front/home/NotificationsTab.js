class NotificationsTab extends React.Component {
    render() {
        return (
            <>
                <InviteTiles invites={this.props.invites}/>
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

                        <div style={{width: 'min-content'}}>
                            Приглашение в комнату "<b>{room.name}</b>"<br/>
                            <span style={{display: 'flex', alignItems: 'center'}}>
                                <i className="material-icons nav-icon">people</i>
                                {room.members_number}
                            </span><br/>
                            id: {room.id}<br/>
                        </div>


                        <div style={{display: "flex", float: "bottom"}}>
                            <button className="action-btn"
                                    // onClick={this.openAddRoomDialog}
                                    style={{display: 'flex', alignItems: 'center'}}>
                                <><i className="material-icons nav-icon">check_circle</i>Принять</>
                            </button>
                            <button className="action-btn"
                                    // onClick={this.openAddRoomDialog}
                                    style={{display: 'flex', alignItems: 'center'}}>
                                <><i className="material-icons nav-icon">cancel</i>Отклонить</>
                            </button>
                        </div>
                    </div>
                ))
        } </>
    );
}