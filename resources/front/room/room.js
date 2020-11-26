const NAV_NAMES = [
    "🗒 Table",
    "📊 Dynamics",
    "📅 Calendar",
    "⚙️ Management"
]

const NAVIGATION = [
    (<TableTab/>),
    (<DynamicsTab/>),
    (<CalendarTab/>),
    (<ManagementTab/>)
];

ReactDOM.render(
    <RoomRoot/>,
    document.getElementById('root')
);