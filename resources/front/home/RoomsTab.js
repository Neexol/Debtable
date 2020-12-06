class RoomsTab extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     isLoading: true,
        //     rooms: null
        // };
    }

    componentDidMount() {
        // sendGet('api/rooms', response => {
        //     this.setState({
        //         isLoading: false,
        //         rooms: response
        //     });
        // })

        // $.get(`${HOST_URL}api/rooms`, (response) => {
        //     this.setState({
        //         isLoading: false,
        //         rooms: response
        //     })
        // });
    }

    render() {
        return (
            <>
                <RoomTiles rooms={this.props.rooms}/>
                <button
                    className="home__add-room-btn"
                    onClick={e => {
                        // sendGet("api/users/me");
                    }}
                >
                    add room
                </button>
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