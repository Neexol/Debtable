const NAV_NAMES = [
    "🚪 Rooms",
    "👤 Profile",
    "🔔 Notifications"
]

const NAVIGATION = (index, prop) => ([
    (<RoomsTab rooms={prop.rooms}/>),
    (<ProfileTab profile={prop.profile} updateUser={prop.updateUser}/>),
    (<NotificationsTab/>)
][index]);

ReactDOM.render(
    <HomeRoot/>,
    document.getElementById('root')
);