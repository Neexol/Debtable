const NAV_NAMES = [
    (<IconWithText icon={'settings'} text={'Управление'}/>),
    (<IconWithText icon={'insert_chart_outlined'} text={'Статистика'}/>),
    (<IconWithText icon={'table_chart'} text={'Таблица'}/>)

    // (<div className={'icon-with-text'}>
    //     <i className="material-icons nav-icon">table_chart</i>Таблица
    // </div>),
    // (<div className={'icon-with-text'}>
    //     <i className="material-icons nav-icon">insert_chart_outlined</i>Статистика
    // </div>),
    // (<div className={'icon-with-text'}>
    //     <i className="material-icons nav-icon">settings</i>Управление
    // </div>),
]

// const NAV_HOME = <><i className="material-icons nav-icon">home</i>Домой</>;
const NAV_HOME = <IconWithText icon={'home'} text={'Домой'}/>;

const NAVIGATION = (index, prop) => ([
    (<TableTab room={prop.room}
               members={prop.members}/>),
    (<StatisticsTab room={prop.room}/>),
    (<ManagementTab room={prop.room}
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