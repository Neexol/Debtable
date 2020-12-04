const NAV_NAMES = [
    "🗒 Table",
    "📊 Dynamics",
    "📅 Calendar",
    "⚙️ Management"
]

const NAVIGATION = (index, prop) => ([
    (<TableTab members={prop}/>),
    (<DynamicsTab/>),
    (<CalendarTab/>),
    (<ManagementTab/>)
][index]);

ReactDOM.render(
    <RoomRoot/>,
    document.getElementById('root')
);