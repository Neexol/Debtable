class RoomsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            rooms: null
        };
    }

    componentDidMount() {
        $.get(`${HOST_URL}rooms.json`, (response) => {
            this.setState({
                isLoading: false,
                rooms: response
            })
        });
    }

    render() {
        return (
            <> {
                this.state.isLoading
                    ? <Loader/>
                    : <>
                        <RoomTiles rooms={this.state.rooms}/>
                        <button
                            className="home__add-room-btn"
                            onClick={e => {
                                sendGet("api/users/me");
                                alert(document.cookie);
                            }}
                        >
                            add room
                        </button>
                    </>
            }
                <button
                    className="home__add-room-btn"
                    onClick={e => {
                        sendGet("api/users/me");
                        alert(document.cookie);
                    }}
                >
                    TEST BUTTON
                </button></>
        );
    }
}

function RoomTiles(props) {
    return (
        <> {
            props.rooms.map(room => (
                <div
                    key={room.room_id}
                    className="card"
                    onClick={() => {
                        if (room.label === "1206") {
                            location.assign(`../room/room.html`)
                        }
                        // location.assign(`room/${room.room_id}`)
                    }}
                >
                    <b>{room.label}</b><br/>
                    {room.members_quantity} members
                </div>
            ))
        } </>
    );
}