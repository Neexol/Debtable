// const NAVIGATION = new Map([
//     ["ROOMS",    (<HomeRooms/>)   ],
//     ["PROFILE",  (<HomeProfile/>) ],
//     ["SETTINGS", (<HomeSettings/>)]
// ]);
// const NAVIGATION = new Map([
//     ["ROOMS",    "(HomeRooms)"   ],
//     ["PROFILE",  "(HomeProfile)" ],
//     ["SETTINGS", "(HomeSettings)"]
// ]);

const NAV_NAMES = [
    "Rooms",
    "Profile",
    "Settings"
]

// alert(NAVIGATION[0]);

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkedIndex: 0};
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(index) {
        this.setState({checkedIndex: index})
    }

    render() {
        return (
            <>
                <span>
                    <HomeSideMenu
                        checkedIndex={this.state.checkedIndex}
                        onCheck={this.handleCheck}
                    />
                </span>
                <span>
                    {NAVIGATION[this.state.checkedIndex]}
                </span>
            </>
        );
    }
}

function HomeSideMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav> {
            NAV_NAMES.map(name => {
                const i = NAV_NAMES.indexOf(name);
                return (
                    <div
                        key={i}
                        onClick={() => props.onCheck(i)}
                        className={(index === i) ? "active" : null}
                    >
                        {name}
                    </div>
                )
            })
        } </nav>
    );
}

class HomeRooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            rooms: null
        };
    }

    componentDidMount() {
        console.log("Rooms attached")
        $.get(`${HOST_URL}rooms.json`, (response) => {
            this.setState({
                isLoading: false,
                rooms: response
            })
        });
    }

    render() {
        return (
            <div> {
                this.state.isLoading
                    ? <div className="loader"/>
                    : this.state.rooms.map(room => (
                        <div key={room.room_id}>
                            <b>{room.label}</b><br/>
                            {room.members_quantity} members
                        </div>
                    ))
            } </div>
        );
    }
}

class HomeProfile extends React.Component {
    render() {
        return (
            <div>
                there is profile
            </div>
        );
    }
}

class HomeSettings extends React.Component {
    render() {
        return (
            <div>
                there is settings
            </div>
        );
    }
}

const NAVIGATION = [
    (<HomeRooms/>),
    (<HomeProfile/>),
    (<HomeSettings/>)
];

ReactDOM.render(
    <Home/>,
    document.getElementById('root')
);