class TableTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <DebtsTable members={this.props.members}/>;
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

    // render() {
    //     return (
    //         <div>
    //             <AddRecordForm
    //                 table={this.state.table}/>
    //             <table className={"redTable"}>
    //                 <thead>{DebtsTableHeaders}</thead>
    //                 {
    //                     this.state.isLoading
    //                         ? <tbody><tr><td colSpan={5}><Loader/></td></tr></tbody>
    //                         : <DebtsTableBody list={this.state.table}/>
    //                 }
    //             </table>
    //         </div>
    //     );
    // }
    render() {
        return (
            <div>{
                this.state.isLoading
                    ? <Loader/>
                    : <div>
                        <AddRecordForm
                            table={this.state.table}
                            members={this.props.members}
                        />
                        <table className={"redTable"}>
                            <thead>{DebtsTableHeaders}</thead>
                            <DebtsTableBody list={this.state.table}/>
                        </table>
                    </div>
            }</div>
        );
    }
}

class Multiselect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {expanded: false};
    }

    toggleExpanded = () => this.setState(
        state => ({expanded: !state.expanded})
    )

    hardFocus = e => {
        $('#multiselect-focus-field').focus();
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        return (
            <div className="multiselect">
                <div className="selectBox" onClick={this.toggleExpanded}>
                    <input
                        onBlur={() => this.setState({expanded: false})}
                        readOnly={true}
                        id="multiselect-focus-field"
                        placeholder={this.props.placeholder}
                        value={
                            this.props.checkedList.length > 0
                                ? this.props.checkedList.join(", ")
                                : ""
                        }
                    />
                </div>
                <div
                    id="checkboxes"
                    className="no-select"
                    onMouseUp={this.hardFocus}
                    onMouseDown={this.hardFocus}
                    style={{display: (this.state.expanded ? "block" : "none")}}>
                    {
                        this.props.list.map(element => (
                            <label
                                htmlFor={element}
                                key={element}>
                                <input
                                    type="checkbox"
                                    id={element}
                                    onClick={this.props.onListClick}
                                />
                                {element}
                            </label>
                        ))
                    }</div>
            </div>
        );
    }
}

class AddRecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            whoOwes: [],
            purchase: "",
            whoPaid: "",
            cost: null,
            distribution: false
        };
    }

    handlePurchaseChange = e => this.setState({
        purchase: e.target.value
    });

    handleCostChange = e => this.setState({
        cost: e.target.value
    })

    toggleDistribution = () => this.setState(
        state => ({distribution: !state.distribution})
    );

    onListClick = e => {
        let newList = this.state.whoOwes;
        if (e.target.checked) {
            newList.push(e.target.id)
        } else {
            newList.splice(newList.indexOf(e.target.id), 1);
        }
        this.setState({whoOwes: newList})
    }

    render() {
        return (
            <table className="add-record-form"><tbody><tr>
                <td><Multiselect
                    list={this.props.members.map(member => member.name)}
                    checkedList={this.state.whoOwes}
                    onListClick={this.onListClick}
                    placeholder="Кто (who?)"
                /></td>

                <td><div>
                    <input
                        list="suggestions"
                        placeholder="покупка"
                        value={this.state.purchase}
                        onChange={this.handlePurchaseChange}/>
                    <datalist id="suggestions">{
                        [...new Set(
                            this.props.table.map(record => record.purchase)
                        )].map(purchase => (<option>{purchase}</option>))
                    }</datalist>
                </div></td>

                <td><select>{
                    this.props.members.map(member => (
                        <option>{member.name}</option>
                    ))}
                }</select></td>

                <td><input
                    name="cost"
                    type="number"
                    value={this.state.cost}
                    onChange={this.handleCostChange}
                    placeholder="Сколько"
                /></td>

                <td
                    className="no-select"
                    style={{
                        width: "1pt",
                        height: "25pt",
                        // background: "red",
                        // textAlign: "center",
                        fontSize: "18pt",
                        fontFamily: "Consolas, serif"
                        // lineHeight: "100%",
                        // padding: "0"
                    }}
                    onClick={this.toggleDistribution}
                >
                    {/*{this.state.distribution ? "❖" : "◆"}*/}
                    {this.state.distribution ? "●" : "∷"}
                </td>

                <td><button>ADD</button></td>
            </tr></tbody></table>
        );
    }
}