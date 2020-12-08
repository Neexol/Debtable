const NAV_NAMES = [
    // "🚪 Rooms",
    // "👤 Profile",
    // "🔔 Notifications"
    <><i className="material-icons nav-icon">meeting_room</i>Комнаты</>,
    <><i className="material-icons nav-icon">person</i>Профиль</>,
    <><i className="material-icons nav-icon">notifications</i>Приглашения</>,
]

const NAVIGATION = (index, prop) => ([
    (<RoomsTab rooms={prop.rooms}
               updateRoomsByAdd={prop.updateRoomsByAdd}
               updateRoomsByDelete={prop.updateRoomsByDelete}
               updateRoomsByChange={prop.updateRoomsByChange}/>),
    (<ProfileTab profile={prop.profile}
                 updateUser={prop.updateUser}/>),
    (<InvitesTab invites={prop.invites}
                 updateInvitesByAccept={prop.updateInvitesByAccept}
                 updateInvitesByDecline={prop.updateInvitesByDecline}/>)
][index]);

ReactDOM.render(
    <HomeRoot/>,
    document.getElementById('root')
);