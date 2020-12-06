class RoomsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addRoomDialogOpened: false,
            deleteRoomDialogOpened: false,
            changeRoomDialogOpened: false,
            newRoomName: '',
            updatedRoomName: '',
            selectedRoomId: null
        };
    }

    roomById = id => {
        const rooms = this.props.rooms.rooms;
        return id ? rooms[rooms.map(room => room.id).indexOf(id)] : {name: null};
    };

    openAddRoomDialog = () => this.setState({
        addRoomDialogOpened: true
    });
    closeAddRoomDialog = () => this.setState({
        addRoomDialogOpened: false, 
        newRoomName: ''
    });
    
    openDeleteRoomDialog = id => this.setState({
        deleteRoomDialogOpened: true,
        selectedRoomId: id
    });
    closeDeleteRoomDialog = () => this.setState({
        deleteRoomDialogOpened: false,
        selectedRoomId: null
    });
    
    openChangeRoomDialog = (id) => this.setState({
        updatedRoomName: this.roomById(id).name,
        changeRoomDialogOpened: true,
        selectedRoomId: id
    });
    closeChangeRoomDialog = () => this.setState({
        changeRoomDialogOpened: false,
        selectedRoomId: null,
        updatedRoomName: ''
    });

    handleRoomNameChange = e => this.setState({newRoomName: e.target.value});
    handleUpdatedRoomNameChange = e => this.setState({updatedRoomName: e.target.value});

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

    handleDeleteRoom = () => {
        sendDelete(ROUTE_ROOM(this.state.selectedRoomId), null, response => {
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

    handleChangeRoom = () => {
        sendPatch(ROUTE_ROOM(this.state.selectedRoomId), JSON.stringify({
            new_name: this.state.updatedRoomName
        }), response => {
            this.props.updateRoomsByChange(response);
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
        this.closeChangeRoomDialog();
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

                <div id="changeRoomDialog" className="modal"
                     onClick={e => {if (e.target.id === 'changeRoomDialog') this.closeChangeRoomDialog()}}
                     style={{display: this.state.changeRoomDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="close" onClick={this.closeChangeRoomDialog}>✕</span>

                        <label htmlFor="room_name"><b>Новое название для комнаты</b></label>
                        <input type="text" placeholder="Название" name="room_name" id="room_name"
                               value={this.state.updatedRoomName}
                               onChange={this.handleUpdatedRoomNameChange}/>

                        <button type="submit" className="apply-btn"
                                onClick={this.handleChangeRoom}
                                disabled={
                                    this.state.updatedRoomName === this.roomById(this.state.selectedRoomId).name
                                }>
                            Сохранить
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
    }
}

function RoomTiles(props) {
    return (
        <> {
            props.rooms.rooms.map(room => (
                <div key={room.id}
                     className="card"
                     onClick={e => {
                         if (e.target.className === 'edit' ||
                             e.target.className === 'close') return;
                         console.log(`click on "${room.name}" [id: ${room.id}]`);
                     }}>

                    <span className="close"
                          style={{fontSize: '10pt'}}
                          onClick={() => props.onDelete(room.id)}>
                        ⌫
                    </span>

                    <b>{room.name}</b>
                    <span className='edit'
                          onClick={() => props.onChange(room.id)}>
                        {' ✎'}
                    </span><br/>
                    id: {room.id}
                </div>
            ))
        } </>
    );
}