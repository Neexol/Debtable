class Room extends React.Component {
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
                <RoomTopMenu
                    checkedIndex={this.state.checkedIndex}
                    onCheck={this.handleCheck}
                />
                <div className="room__content">
                    {NAVIGATION[this.state.checkedIndex]}
                </div>
            </>
        );
    }
}

function RoomTopMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav className="room__top-menu">
            <div
                onClick={() => {
                    location.assign(`home.html`)
                    // location.assign(`home`)
                }}
                style={{float:'left'}}
            >🏠 Home</div>
            {
            NAV_NAMES.map(name => {
                const i = NAV_NAMES.indexOf(name);
                return (
                    <div
                        key={i}
                        onClick={() => props.onCheck(i)}
                        className={(index === i) ? "active" : null}
                    >{name}</div>
                )
            })
        } </nav>
    );
}

class RoomManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1>There will be management</h1>
        );
    }
}

class RoomTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1>There will be table</h1>
        );
    }
}

class RoomDynamics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1>There will be dynamic table</h1>
        );
    }
}

class RoomCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1>There will be calendar of purchases</h1>
        );
    }
}

const NAV_NAMES = [
    "🗒 Table",
    "📊 Dynamics",
    "📅 Calendar",
    "⚙️ Management"
]
const NAVIGATION = [
    (<RoomTable/>),
    (<RoomDynamics/>),
    (<RoomCalendar/>),
    (<RoomManagement/>)
];

ReactDOM.render(
    <Room/>,
    document.getElementById('root')
);