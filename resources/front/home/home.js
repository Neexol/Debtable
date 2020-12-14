const NAV_NAMES = isInvites => [
    (<IconWithText icon={'meeting_room'} text={'Комнаты'}/>),
    (<IconWithText icon={'person'} text={'Профиль'}/>),
    (<IconWithText icon={isInvites ? 'notifications_active' : 'notifications'} text={'Приглашения'}/>)
];

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