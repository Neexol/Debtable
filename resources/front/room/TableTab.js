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
                <AddRecordForm purchases={this.state.purchases === undefined ? [] : this.state.purchases}
                               members={this.props.members}/>
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

class AddRecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            debtors: [],
            purchaseName: '',
            cost: 0,
            buyer: getAuthorizedUserID(),
        };
    }

    componentDidMount() {
        M.FormSelect.init($('#debtorsSelect'));
        M.FormSelect.init($('#buyerSelect'));
        M.Autocomplete.init($('#purchase-name'));
    }

    componentDidUpdate() {
        M.Autocomplete.getInstance($('#purchase-name')).updateData(
            JSON.parse(`{${
                this.props.purchases
                    .map(purchase => `"${purchase.name}": null`)
                    .join(',')
            }}`)
        );
    }

    render() {
        console.log('da (yes)');
        return (
            <div className="add-record-form">

                <div className="input-field col s12">
                    <select multiple={true}
                            value={this.state.debtors}
                            onChange={() => {
                                // let selection = $('#debtorsSelect').val();
                                // if (selection.includes('all')) {
                                //     selection = this.props.members.map(member => member.id);
                                // }
                                let selection = $('#debtorsSelect').val().map(value => Number.parseInt(value));
                                // if (selection.includes(-1)) selection = [-1];
                                this.setState({debtors: selection})
                            }}
                            id="debtorsSelect">
                        {/*<option value='-1'>Все</option>*/}
                        {
                            this.props.members.map(member => (
                                <option value={member.id}>{member.display_name}</option>
                            ))
                        }
                    </select>
                    <label>Кто должен</label>
                </div>

                <div className="input-field col s12">
                    <input type="text" id="purchase-name" className="autocomplete"/>
                    <label htmlFor="purchase-name">Покупка</label>
                </div>

                <div className="input-field col s12">
                    <select value={this.state.buyer}
                            onChange={e => this.setState({
                                debtors: e.target.value
                            })}
                            id="buyerSelect">
                        {
                            this.props.members.map(member => (
                                <option value={member.id}>{member.display_name}</option>
                            ))
                        }
                    </select>
                    <label>Кому должен</label>
                </div>

            </div>
        );
    }
}