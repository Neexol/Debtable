const NAV_NAMES = [
    // "🚪 Rooms",
    // "👤 Profile",
    // "🔔 Notifications"
    <><i className="material-icons">meeting_room</i>Комнаты</>,
    <><i className="material-icons">person</i>Профиль</>,
    <><i className="material-icons">notifications</i>Приглашения</>,
]

const NAVIGATION = (index, prop) => ([
    (<RoomsTab rooms={prop.rooms}
               updateRoomsByAdd={prop.updateRoomsByAdd}
               updateRoomsByDelete={prop.updateRoomsByDelete}
               updateRoomsByChange={prop.updateRoomsByChange}/>),
    (<ProfileTab profile={prop.profile}
                 updateUser={prop.updateUser}/>),
    (<NotificationsTab/>)
][index]);

ReactDOM.render(
    <HomeRoot/>,
    document.getElementById('root')
);