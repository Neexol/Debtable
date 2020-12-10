class TableTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            purchases: undefined,
        };
    }

    getPurchases = () => sendGet(ROUTE_PURCHASES(this.props.room.id),
        response => {
            this.setState({purchases: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    console.log("error "+response.status);
                    break;
            }
        }
    );

    componentDidMount() {
        this.getPurchases();
    }

    render() {
        return (
            <>
                <h2>*тут форма для добавления</h2>
                <AddRecordForm/>
                {
                    this.state.purchases === undefined
                        ? <div className="room__empty-page"><Loader/></div>
                        : <DebtsTable purchases={this.state.purchases}/>
                }

            </>
        );
    }
}

function DebtsTable(props) {
    return (
        <table className={"redTable"}>
            <thead>{DebtsTableHeaders}</thead>
            <tbody>{
                props.purchases.map(purchase => (
                    <tr key={purchase.id}>
                        <td style={{display: 'flex', flexWrap: 'wrap', padding: '0.3rem'}}>{
                            purchase.debtors.map(debtor => (
                                <span key={debtor.id}
                                      className='user-chip'
                                      title={LOGIN_SYMBOL+debtor.username}>
                                    {debtor.display_name}
                                </span>
                            ))
                        }</td>
                        <td>{purchase.name}</td>
                        <td>
                            <span className='user-chip'
                                  title={LOGIN_SYMBOL+purchase.buyer.username}>
                                {purchase.buyer.display_name}
                            </span>
                        </td>
                        <td>{purchase.debt}</td>
                        <td>{purchase.date}</td>
                    </tr>
                ))
            }</tbody>
        </table>
    );
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
                    <input onBlur={() => this.setState({expanded: false})}
                           readOnly={true}
                           id="multiselect-focus-field"
                           placeholder={this.props.placeholder}
                           value={
                               this.props.checkedList.length > 0
                                   ? this.props.checkedList.join(", ")
                                   : ""
                           }/>
                </div>
                <div id="checkboxes"
                     className="no-select"
                     onMouseUp={this.hardFocus}
                     onMouseDown={this.hardFocus}
                     style={{display: (this.state.expanded ? "block" : "none")}}>
                    {
                        this.props.list.map(element => (
                            <label htmlFor={element}
                                   key={element}>
                                {element}
                                <input type="checkbox"
                                       id={element}
                                       onClick={this.props.onListClick}/>
                                {element}
                            </label>
                        ))
                    }
                </div>
            </div>
        );
    }
}

class AddRecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            debtors: [],
            purchase: "",
            buyer: null,
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
                <td><Multiselect list={this.props.members.map(member => member.name)}
                                 checkedList={this.state.whoOwes}
                                 onListClick={this.onListClick}
                                 placeholder="Кто (who?)"/></td>

                <td><div>
                    <input list="suggestions"
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

                <td><input name="cost"
                           type="number"
                           value={this.state.cost}
                           onChange={this.handleCostChange}
                           placeholder="Сколько"/></td>

                <td className="no-select"
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
                    onClick={this.toggleDistribution}>
                    {/*{this.state.distribution ? "❖" : "◆"}*/}
                    {this.state.distribution ? "●" : "∷"}
                    {/*{this.state.distribution ? "⁕" : "⁂"}*/}
                </td>

                <td><button>ADD</button></td>
            </tr></tbody></table>
        );
    }
}