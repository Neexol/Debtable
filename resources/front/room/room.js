const NAV_NAMES = [
    // "🗒 Table",
    // "📊 Dynamics",
    // "📅 Calendar",
    // "⚙️ Management"
    (<><i className="material-icons nav-icon">table_chart</i>Таблица</>),
    (<><i className="material-icons nav-icon">insert_chart_outlined</i>Статистика</>),
    (<><i className="material-icons nav-icon">settings</i>Управление</>),
]

const NAV_HOME = <><i className="material-icons nav-icon">home</i>Домой</>;

const NAVIGATION = (index, prop) => ([
    (<TableTab roomID={prop.roomID}
               purchases={prop.purchases}
               members={prop.members}/>),
    (<StatisticsTab/>),
    (<ManagementTab roomID={prop.roomID}
                    members={prop.members}
                    updateMembersByRemove={prop.updateMembersByRemove}
                    updateInvitedUsersByRemove={prop.updateInvitedUsersByRemove}
                    updateInvitedUsersByAdd={prop.updateInvitedUsersByAdd}
                    invitedUsers={prop.invitedUsers}/>)
][index]);

ReactDOM.render(
    <RoomRoot/>,
    document.getElementById('root')
);