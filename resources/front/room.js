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
            <DebtsTable/>
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

const DebtsTableHeaders = (
    <tr>
        <th>Кто должен</th>
        <th>Покупка</th>
        <th>Кому должен</th>
        <th>Сколько</th>
        <th>Дата</th>
    </tr>
)

class DebtsTableRow extends React.Component {
    render() {
        const row = this.props.row;
        return (
            <tr>
                <td>{row.who_owes}</td>
                <td>{row.purchase}</td>
                <td>{row.who_paid}</td>
                <td>{row.cost}</td>
                <td>{row.date}</td>
            </tr>
        );
    }
}

class DebtsTableBody extends React.Component {
    render() {
        return (
            <tbody> {
                this.props.list.map((row) =>
                    <DebtsTableRow key={row.id} row={row}/>
                )
            } </tbody>
        )
    }
}

class DebtsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            table: null
        };
    }

    componentDidMount() {
        // console.log("Table attached");
        $.get(`${HOST_URL}table.json`, (response) => {
            this.setState({
                isLoading: false,
                table: response
            })
        });
    }

    render() {
        return (
            <table className={"redTable"}>
                <thead>{DebtsTableHeaders}</thead>
                {
                    this.state.isLoading
                        ? <div className="loader"/>
                        : <DebtsTableBody list={this.state.table}/>
                }
            </table>
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