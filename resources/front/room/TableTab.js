class TableTab extends React.Component {
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
