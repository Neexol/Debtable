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
                    showErrorToast(response.status, 'Ошибка создания комнаты');
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
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка удаления комнаты');
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
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка изменения комнаты');
                    break;
            }
        });
        this.closeChangeRoomDialog();
    }

    componentDidUpdate() {
        M.updateTextFields();
    }

    render() {
        return (
            <>
                <RoomTiles rooms={this.props.rooms}
                           onDelete={this.openDeleteRoomDialog}
                           onChange={this.openChangeRoomDialog}/>

                <button className="btn-floating btn-large"
                        onClick={this.openAddRoomDialog}>
                    <i className="material-icons nav-icon">add</i>
                </button>

                <Dialog id={'addNewRoomDialog'}
                        onClose={this.closeAddRoomDialog}
                        isOpen={this.state.addRoomDialogOpened}
                        title={'Создать комнату'}>
                    <EditButton id={'newRoomNameInput'}
                                label={'Название комнаты'}
                                editValue={this.state.newRoomName}
                                onEditChange={this.handleRoomNameChange}
                                onButtonClick={this.handleAddRoom}
                                buttonDisabled={this.state.newRoomName === ''}
                                buttonIcon={'add'}/>
                </Dialog>

                <Dialog id={'changeRoomDialog'}
                        onClose={this.closeChangeRoomDialog}
                        isOpen={this.state.changeRoomDialogOpened}
                        title={'Изменить название комнаты'}>
                    <EditButton id={'changeRoomNameInput'}
                                label={'Новое название'}
                                editValue={this.state.updatedRoomName}
                                onEditChange={this.handleUpdatedRoomNameChange}
                                onButtonClick={this.handleChangeRoom}
                                buttonDisabled={
                                    this.state.updatedRoomName === this.roomById(this.state.selectedRoomId).name ||
                                    this.state.updatedRoomName === ''
                                }
                                buttonIcon={'save'}/>
                </Dialog>

                <Dialog id={'deleteRoomDialog'}
                        onClose={this.closeDeleteRoomDialog}
                        isOpen={this.state.deleteRoomDialogOpened}
                        title={`Удалить комнату "${this.roomById(this.state.selectedRoomId).name}"?`}>
                    <YesCancel onYesClick={this.handleDeleteRoom}
                               onCancelClick={this.closeDeleteRoomDialog}/>
                </Dialog>

            </>
        );
    }
}

function RoomTiles(props) {
    return (
        <div className={'cards-container'}>{
            props.rooms.length === 0 ? (<strong>Нет комнат</strong>) :
            props.rooms.map(room => (
                <div key={room.id}
                     className="card-panel room-card hoverable"
                     onClick={e => {
                         // console.log(e.target.className.includes('edit-room-btn'));
                         // if (e.target.className === 'edit-room-btn' ||
                         //     e.target.className === 'delete-room-btn') return;
                         if (e.target.className.includes('small-action-btn')) return;
                         redirectToRoom(room.id);
                         // console.log(`click on "${room.name}" [id: ${room.id}]`);
                     }}>

                    <span className="room-tile-icons-container">
                        <span className='material-icons small-action-btn small-icon positive'
                              style={{marginBottom: '0.5rem'}}
                              onClick={() => props.onChange(room.id)}>
                            edit
                        </span>
                        <span className="material-icons small-action-btn small-icon negative"
                              onClick={() => props.onDelete(room.id)}>
                            delete
                        </span>
                    </span>
                    
                    <b>{room.name}</b><br/>
                    <span className={'neutral-text-colored'}
                          style={{display: 'flex', alignItems: 'center', marginTop: '0.2rem'}}>
                        <i className="material-icons nav-icon small-icon">people</i>
                        {room.members_number}
                    </span>
                </div>
            ))
        }</div>
    );
}