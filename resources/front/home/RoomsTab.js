class RoomsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addRoomDialogOpened: false,
            deleteRoomDialogOpened: false,
            changeRoomDialogOpened: false,
            newRoomName: '',
            selectedRoom: null
        };
    }

    openAddRoomDialog = () => this.setState({
        addRoomDialogOpened: true
    });
    closeAddRoomDialog = () => this.setState({
        addRoomDialogOpened: false, 
        newRoomName: ''
    });
    
    openDeleteRoomDialog = id => this.setState({
        deleteRoomDialogOpened: true,
        selectedRoom: id
    });
    closeDeleteRoomDialog = () => this.setState({
        deleteRoomDialogOpened: false,
        selectedRoom: null
    });
    
    openChangeRoomDialog = (id) => this.setState({
        changeRoomDialogOpened: true,
        selectedRoom: id
    });
    closeChangeRoomDialog = () => this.setState({
        changeRoomDialogOpened: false,
        selectedRoom: null
    });

    handleRoomNameChange = e => this.setState({newRoomName: e.target.value});

    handleAddRoom = () => {
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
        this.closeAddRoomDialog();
    }

    handleDeleteRoom = () => {this.setState({addRoomDialogOpened: false});
        sendDelete(ROUTE_ROOM(this.state.selectedRoom), null, response => {
            this.props.updateRoomsByDelete(response);
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
        this.closeDeleteRoomDialog();
    }

    render() {
        return (
            <>
                <RoomTiles rooms={this.props.rooms}
                           onDelete={this.openDeleteRoomDialog}
                           onChange={this.openChangeRoomDialog}/>
                <button className="home__add-room-btn"
                        onClick={this.openAddRoomDialog}>
                    Добавить комнату
                </button>

                <div id="addNewRoomDialog" className="modal"
                     onClick={e => {if (e.target.id === 'addNewRoomDialog') this.closeAddRoomDialog()}}
                     style={{display: this.state.addRoomDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="close" onClick={this.closeAddRoomDialog}>✕</span>

                        <label htmlFor="room_name"><b>Название новой комнаты</b></label>
                        <input type="text" placeholder="Название" name="room_name" id="room_name"
                               value={this.state.newRoomName}
                               onChange={this.handleRoomNameChange}/>

                        <button type="submit" className="apply-btn"
                                onClick={this.handleAddRoom}
                                disabled={this.state.newRoomName === ''}>
                            Создать
                        </button>
                    </div>
                </div>

                <div id="deleteRoomDialog" className="modal"
                     onClick={e => {if (e.target.id === 'deleteRoomDialog') this.closeDeleteRoomDialog()}}
                     style={{display: this.state.deleteRoomDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="close" onClick={this.closeDeleteRoomDialog}>✕</span>

                        <h1>Удалить эту комнату?</h1>

                        <div style={{display: 'flex'}}>
                            <button type="submit" className="apply-btn"
                                    onClick={this.closeDeleteRoomDialog}>
                                Отмена
                            </button>
                            <button type="submit" className="apply-btn"
                                    onClick={this.handleDeleteRoom}>
                                Да
                            </button>
                        </div>
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
                <div key={room.id}
                     className="card"
                     onClick={() => {
                         if (room.name === "1206") {
                             location.assign(`../room/room.html`)
                         }
                     }}>

                    <span className="close"
                          style={{fontSize: '10pt'}}
                          onClick={() => props.onDelete(room.id)}>
                        ⌫
                    </span>

                    <b>{room.name}</b>
                    <span className='edit'
                          onClick={() => props.onDelete(room.id)}>
                         ✎
                    </span><br/>
                    id: {room.id}
                </div>
            ))
        } </>
    );
}