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
        const rooms = this.props.rooms;
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
        sendPut(ROUTE_ROOM(this.state.selectedRoomId), JSON.stringify({
            name: this.state.updatedRoomName
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
                        style={{display: 'flex', alignItems: 'center'}}
                        onClick={this.openAddRoomDialog}>
                    <><i className="material-icons nav-icon">add_circle</i>Добавить комнату</>
                </button>

                <div id="addNewRoomDialog" className="modal"
                     onClick={e => {if (e.target.id === 'addNewRoomDialog') this.closeAddRoomDialog()}}
                     style={{display: this.state.addRoomDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeAddRoomDialog}>
                            <i className="material-icons">close</i>
                        </span>

                        <h2>Создать комнату</h2>

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
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeChangeRoomDialog}>
                            <i className="material-icons">close</i>
                        </span>

                        <h2>Изменить название комнаты</h2>

                        <label htmlFor="new_room_name"><b>Новое название для комнаты</b></label>
                        <input type="text" placeholder="Название" name="new_room_name" id="new_room_name"
                               value={this.state.updatedRoomName}
                               onChange={this.handleUpdatedRoomNameChange}/>

                        <button type="submit" className="apply-btn"
                                onClick={this.handleChangeRoom}
                                disabled={
                                    this.state.updatedRoomName === this.roomById(this.state.selectedRoomId).name ||
                                    this.state.updatedRoomName === ''
                                }>
                            Сохранить
                        </button>
                    </div>
                </div>

                <div id="deleteRoomDialog" className="modal"
                     onClick={e => {if (e.target.id === 'deleteRoomDialog') this.closeDeleteRoomDialog()}}
                     style={{display: this.state.deleteRoomDialogOpened ? 'block' : 'none'}}>

                    <div className="modal-content">
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeDeleteRoomDialog}>
                            <i className="material-icons">close</i>
                        </span>

                        <h2>Удалить комнату "{this.roomById(this.state.selectedRoomId).name}"?</h2>

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
            props.rooms.length === 0 ? (<strong>Нет комнат</strong>) :
            props.rooms.map(room => (
                <div key={room.id}
                     className="card room-card"
                     onClick={e => {
                         // console.log(e.target.className.includes('edit-room-btn'));
                         // if (e.target.className === 'edit-room-btn' ||
                         //     e.target.className === 'delete-room-btn') return;
                         if (e.target.className.includes('edit-room-btn') ||
                             e.target.className.includes('delete-room-btn')) return;
                         redirectToRoom(room.id);
                         // console.log(`click on "${room.name}" [id: ${room.id}]`);
                     }}>

                    <span className="room-tile-icons-container">
                        <span className='material-icons small-action-btn edit-room-btn'
                              style={{marginBottom: '0.3rem'}}
                              onClick={() => props.onChange(room.id)}>
                            edit
                        </span>
                        <span className="material-icons small-action-btn delete-room-btn"
                              onClick={() => props.onDelete(room.id)}>
                            delete
                        </span>
                    </span>
                    
                    <b>{room.name}</b><br/>
                    <span style={{display: 'flex', alignItems: 'center'}}>
                        <i className="material-icons nav-icon">people</i>
                        {room.members_number}
                    </span><br/>
                    id: {room.id}
                </div>
            ))
        } </>
    );
}