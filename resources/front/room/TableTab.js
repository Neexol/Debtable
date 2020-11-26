class TableTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <AddRecordForm/>
                <DebtsTable/>
            </>
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

function DebtsTableRow(props) {
    const row = props.row;
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

const DebtsTableBody = (props) => (
    <tbody>{
        props.list.map(row =>
            <DebtsTableRow key={row.id} row={row}/>
        )
    }</tbody>
)

class DebtsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            table: null
        };
    }

    componentDidMount() {
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
                        ? <tbody><tr><td colSpan={5}><Loader/></td></tr></tbody>
                        : <DebtsTableBody list={this.state.table}/>
                }
            </table>
        );
    }
}

class AddRecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            whoOwes: "Георгий",
            purchase: "Стирка",
            whoPaid: "Владимир",
            cost: 50
        };
    }

    handleChange = (e) => this.setState({
        whoOwes: e.target.value
    });

    render() {
        return (
            <table className="add-record-form"><tbody><tr>
                <td><input
                    name="whoOwes"
                    type="text"
                    value={this.state.whoOwes}
                    onChange={this.handleChange}
                    placeholder="Кто"
                /></td>
                <td><input
                    name="purchase"
                    type="text"
                    value={this.state.purchase}
                    // onChange={this.handleChange}
                    placeholder="Что"
                /></td>
                <td><input
                    name="whoPaid"
                    type="text"
                    value={this.state.whoPaid}
                    // onChange={this.handleChange}
                    placeholder="Кому"
                /></td>
                <td><input
                    name="cost"
                    type="text"
                    value={this.state.cost}
                    // onChange={this.handleChange}
                    placeholder="Сколько"
                /></td>
                <td><button>ADD</button></td>
            </tr></tbody></table>
        );
    }
}

// function AddRecordForm(props) {
//     return (
//         <table className="add-record-form"><tbody><tr>
//             <td><input type="text" placeholder="Кто нахуй"/></td>
//             <td><input type="text" placeholder="Что нахуй"/></td>
//             <td><input type="text" placeholder="Кому нахуй"/></td>
//             <td><input type="text" placeholder="Сколько блять"/></td>
//             <td><button>ADD</button></td>
//         </tr></tbody></table>
//     );
// }