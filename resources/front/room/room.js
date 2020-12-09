const NAV_NAMES = [
    // "🗒 Table",
    // "📊 Dynamics",
    // "📅 Calendar",
    // "⚙️ Management"
    <><i className="material-icons nav-icon">table_chart</i>Таблица</>,
    <><i className="material-icons nav-icon">insert_chart_outlined</i>Статистика</>,
    <><i className="material-icons nav-icon">settings</i>Управление</>
]

const NAV_HOME = <><i className="material-icons nav-icon">home</i>Домой</>;

const NAVIGATION = (index, prop) => ([
    (<TableTab members={prop}/>),
    (<StatisticsTab/>),
    (<ManagementTab/>)
][index]);

ReactDOM.render(
    <RoomRoot/>,
    document.getElementById('root')
);