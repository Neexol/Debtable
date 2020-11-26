const NAV_NAMES = [
    "🚪 Rooms",
    "👤 Profile",
    "🔔 Notifications"
]

const NAVIGATION = [
    (<RoomsTab/>),
    (<ProfileTab/>),
    (<NotificationsTab/>)
];

ReactDOM.render(
    <HomeRoot/>,
    document.getElementById('root')
);