class RoomsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addRoomDialogOpened: false,
            newRoomName: ''
        };
    }

    closeAddRoomDialog = e => this.setState({addRoomDialogOpened: false});
    openAddRoomDialog  = e => this.setState({addRoomDialogOpened: true});

    handleRoomNameChange = e => this.setState({newRoomName: e.target.value});
    handleAddRoom = e => {
        this.setState({addRoomDialogOpened: false});
        sendPost(ROUTE_ROOMS, JSON.stringify({
            name: this.state.newRoomName
        }), response => {
            this.props.updateRoomsByAdd(response);
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    console.log("error "+response.status);
                    break;
            }
        });
    }

    render() {
        return (
            <>
                <RoomTiles rooms={this.props.rooms}/>
                <button
                    className="home__add-room-btn"
                    onClick={this.openAddRoomDialog}
                >
                    add room
                </button>
                <div id="addNewRoomDialog" className="modal"
                     onClick={e => {if (e.target.id === 'addNewRoomDialog') this.closeAddRoomDialog()}}
                     style={{display: this.state.addRoomDialogOpened ? 'block' : 'none'}}
                >
                    <div className="modal-content">
                        <span className="close"
                              onClick={this.closeAddRoomDialog}
                        >✕</span>
                        <label htmlFor="room_name"><b>Название новой комнаты</b></label>
                        <input type="text" placeholder="Название" name="room_name" id="room_name"
                               value={this.state.newRoomName}
                               onChange={this.handleRoomNameChange}/>
                        <button type="submit" className="apply-btn"
                                onClick={this.handleAddRoom}
                                disabled={this.state.newRoomName === ''}
                        >Создать</button>
                        {/*<label htmlFor="room_name"><b>Название новой комнаты</b></label>*/}
                        {/*<div style={{display: "flex"}}>*/}
                        {/*    <input type="text" placeholder="Название" name="room_name" id="room_name"*/}
                        {/*           style={{flexGrow: "1"}}*/}
                        {/*           value={this.state.newRoomName}*/}
                        {/*           onChange={this.handleRoomNameChange}/>*/}
                        {/*    <button type="submit" className="apply-btn"*/}
                        {/*            onClick={this.handleAddRoom}*/}
                        {/*            disabled={this.state.newRoomName === ''}*/}
                        {/*    >Создать</button>*/}
                        {/*</div>*/}
                    </div>

                </div>
            </>
        );

        // return (
        //     <> {
        //         this.state.isLoading
        //             ? <Loader/>
        //             : <>
        //                 <RoomTiles rooms={this.state.rooms}/>
        //                 <button
        //                     className="home__add-room-btn"
        //                     onClick={e => {
        //                         // sendGet("api/users/me");
        //                     }}
        //                 >
        //                     add room
        //                 </button>
        //             </>
        //     }
        //         <button
        //             className="home__add-room-btn"
        //             onClick={e => {
        //                 // setJWT(undefined);
        //                 sendGet('api/users/me', response => {
        //                     console.log(`success! ${response.responseText}`);
        //                 }, response => {
        //                     console.log(`error! ${response.status}`);
        //                 });
        //                 // sendGet("api/users/me");
        //             }}
        //         >
        //             TEST BUTTON
        //         </button>
        //     </>
        // );
    }
}

function RoomTiles(props) {
    return (
        <> {
            props.rooms.rooms.map(room => (
                <div
                    key={room.id}
                    className="card"
                    onClick={() => {
                        if (room.name === "1206") {
                            location.assign(`../room/room.html`)
                        }
                        // location.assign(`room/${room.room_id}`)
                    }}
                >
                    <b>{room.name}</b><br/>
                    id: {room.id}
                </div>
            ))
        } </>
    );
}