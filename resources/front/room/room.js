const NAV_NAMES = [
    (<IconWithText icon={'settings'} text={'Управление'}/>),
    (<IconWithText icon={'insert_chart_outlined'} text={'Статистика'}/>),
    (<IconWithText icon={'table_chart'} text={'Таблица'}/>)
]

const NAV_HOME = <IconWithText icon={'home'} text={'Домой'}/>;

const NAVIGATION = (index, prop) => ([
    (<ManagementTab room={prop.room}
                    members={prop.members}
                    updateMembersByRemove={prop.updateMembersByRemove}
                    updateInvitedUsersByRemove={prop.updateInvitedUsersByRemove}
                    updateInvitedUsersByAdd={prop.updateInvitedUsersByAdd}
                    invitedUsers={prop.invitedUsers}/>),
    (<StatisticsTab room={prop.room}/>),
    (<TableTab room={prop.room}
               members={prop.members}/>)
][index]);

ReactDOM.render(
    <RoomRoot/>,
    document.getElementById('root')
);