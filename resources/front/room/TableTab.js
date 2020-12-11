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
                               purchase={this.state.selectedPurchase}
                               members={this.props.members}
                               room={this.props.room}
                               updateTable={this.getPurchases}/>
                {
                    this.state.purchases === undefined
                        ? <div className="room__empty-page"><Loader/></div>
                        : <DebtsTable purchases={this.state.purchases}
                                      members={this.props.members}
                                      room={this.props.room}
                                      openEditDialog={this.openEditPurchaseDialog}
                                      updateTable={this.getPurchases}/>
                }
            </>
        );
    }
}

class DebtsTable extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'edit';
        this.state = {
            editPurchaseDialogOpened: false,
            selectedPurchase: null,
            debtors: [],
            purchaseName: '',
            cost: '',
            buyer: getAuthorizedUserID(),
        };
    }

    openEditPurchaseDialog = purchase => this.setState({
        selectedPurchase: purchase,
        editPurchaseDialogOpened: true,
        debtors: purchase.debtors.map(debtor => debtor.id),
        purchaseName: purchase.name,
        cost: purchase.debt,
        buyer: purchase.buyer,
    });
    closeEditPurchaseDialog = () => this.setState({
        editPurchaseDialogOpened: false,
        selectedPurchase: null,
    });

    handleEditPurchase = purchaseID => {
        sendPut(ROUTE_PURCHASE(this.props.room.id, purchaseID), JSON.stringify({
            name: this.state.purchaseName,
            debt: this.state.cost,
            date: getCurrentDate(),
            buyer_id: this.state.buyer.id,
            debtor_ids: this.state.debtors
        }), response => {
            // this.props.updateTableByAdd(response);
            this.props.updateTable();
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    M.toast({
                        html: "error "+response.status,
                        classes: "error-toast"
                    })
                    console.log("error "+response.status);
                    break;
            }
        });
        this.closeEditPurchaseDialog();
    }

    componentDidMount() {
        M.AutoInit();
    }

    componentDidUpdate() {
        M.Autocomplete.getInstance($('#purchaseName'+this.id)).updateData(
            JSON.parse(`{${
                this.props.purchases
                    .map(purchase => `"${purchase.name}": null`)
                    .join(',')
            }}`)
        );
    }

    render() {
        return (
            <>
                <table className={"highlight centered"}>
                    <thead>{DebtsTableHeaders}</thead>
                    <tbody>{
                        this.props.purchases.map(purchase => (
                            <tr key={purchase.id}
                                style={{cursor: 'pointer'}}
                                onClick={() => this.openEditPurchaseDialog(purchase)}>
                                <td className='valign-wrapper'>{
                                    purchase.debtors.map(debtor => (
                                        <div key={debtor.id}
                                             className='chip'
                                             title={LOGIN_SYMBOL+debtor.username}>
                                            {debtor.display_name}
                                        </div>
                                    ))
                                }</td>
                                <td>{purchase.name}</td>
                                <td>
                                    <div className='chip'
                                         title={LOGIN_SYMBOL+purchase.buyer.username}>
                                        {purchase.buyer.display_name}
                                    </div>
                                </td>
                                <td>{purchase.debt}</td>
                                <td>{purchase.date}</td>
                            </tr>
                        ))
                    }</tbody>
                </table>

                <div id="editPurchaseDialog" className="dialog"
                     onClick={e => {if (e.target.id === 'editPurchaseDialog') this.closeEditPurchaseDialog()}}
                     style={{display: this.state.editPurchaseDialogOpened ? 'block' : 'none'}}>

                    <div className="dialog-content">
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeEditPurchaseDialog}>
                            <i className="material-icons">close</i>
                        </span>

                        <h2>Изменить покупку</h2>

                        <PurchaseForm id={this.id}
                                      members={this.props.members}
                                      debtors={this.state.debtors}
                                      onDebtorsChange={() => this.setState({
                                          debtors: $('#debtorsSelect'+this.id).val().map(value => Number.parseInt(value))
                                      })}
                                      purchaseName={this.state.purchaseName}
                                      onPurchaseNameChange={e => this.setState({purchaseName: e.target.value})}
                                      buyer={this.state.buyer}
                                      onBuyerChange={e => this.setState({
                                          buyer: Number.parseInt(e.target.value)
                                      })}
                                      cost={this.state.cost}
                                      onCostChange={e => this.setState({cost: e.target.value})}
                                      // button={{icon: 'save', text: 'Сохранить'}}
                                      buttonIcon={'save'}
                                      onSubmit={() => this.handleEditPurchase(this.state.selectedPurchase?.id)}/>

                    </div>
                </div>
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

class AddRecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'add';
        this.state = {
            debtors: [],
            purchaseName: '',
            cost: '',
            buyer: getAuthorizedUserID(),
        };
    }

    handleAddPurchase = () => {
        sendPost(ROUTE_PURCHASES(this.props.room.id), JSON.stringify({
            name: this.state.purchaseName,
            debt: this.state.cost,
            date: getCurrentDate(),
            buyer_id: this.state.buyer,
            debtor_ids: this.state.debtors
        }), response => {
            // this.props.updateTableByAdd(response);
            this.props.updateTable();
        }, response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    M.toast({
                        html: "error "+response.status,
                        classes: "error-toast"
                    })
                    console.log("error "+response.status);
                    break;
            }
        });
    }

    componentDidMount() {
        M.AutoInit();
    }

    componentDidUpdate() {
        M.Autocomplete.getInstance($('#purchaseName'+this.id)).updateData(
            JSON.parse(`{${
                this.props.purchases
                    .map(purchase => `"${purchase.name}": null`)
                    .join(',')
            }}`)
        );
    }

    render() {
        return (
            <PurchaseForm id={this.id}
                          members={this.props.members}
                          debtors={this.state.debtors}
                          onDebtorsChange={() => this.setState({
                              debtors: $('#debtorsSelect'+this.id).val().map(value => Number.parseInt(value))
                          })}
                          purchaseName={this.state.purchaseName}
                          onPurchaseNameChange={e => this.setState({purchaseName: e.target.value})}
                          buyer={this.state.buyer}
                          onBuyerChange={e => this.setState({
                              buyer: Number.parseInt(e.target.value)
                          })}
                          cost={this.state.cost}
                          onCostChange={e => this.setState({cost: e.target.value})}
                          // button={{icon: 'add', text: ''}}
                          buttonIcon={'add'}
                          onSubmit={() => this.handleAddPurchase(this.props.purchase)}/>

        );
    }
}

function PurchaseForm(props) {
    return (
        <div className="add-record-form">

            <div className='row' style={{flexGrow: '1'}}>
                <div className="input-field col s3">
                    <select multiple={true}
                            value={props.debtors}
                            onChange={props.onDebtorsChange}
                            id={"debtorsSelect"+props.id}>
                        {
                            props.members.map(member => (
                                <option value={member.id} key={member.id}>
                                    {member.display_name}
                                </option>
                            ))
                        }
                    </select>
                    <label htmlFor={"debtorsSelect"+props.id}>Кто должен</label>
                </div>

                <div className="input-field col s3">
                    <input type="text"
                        // placeholder="Например, веп))0"
                           id={"purchaseName"+props.id}
                           value={props.purchaseName}
                           onChange={props.onPurchaseNameChange}
                           className="autocomplete"/>
                    <label htmlFor={"purchaseName"+props.id}>Покупка</label>
                </div>

                <div className="input-field col s3">
                    <select value={props.buyer}
                            onChange={props.onBuyerChange}
                            id={"buyerSelect"+props.id}
                    >
                        {
                            props.members.map(member => (
                                <option value={member.id} key={member.id}>
                                    {member.display_name}
                                </option>
                            ))
                        }
                    </select>
                    <label htmlFor={"buyerSelect"+props.id}>Кому должен</label>
                </div>

                <div className="input-field col s3">
                    <input type="number"
                        // placeholder="40 гривен"
                           value={props.cost}
                           onChange={props.onCostChange}
                           id={"costInput"+props.id}/>
                    <label htmlFor={"costInput"+props.id}>Сколько</label>
                </div>
            </div>

            <div style={{transform: "translateY(-100%)"}}>
                <button className="waves-effect waves-light btn"
                        disabled={
                            props.debtors.length === 0 ||
                            props.purchaseName.length === 0 ||
                            props.cost.length === 0
                        }
                        onClick={props.onSubmit}>
                    {/*<i className="material-icons left">{props.button.icon}</i>*/}
                    {/*{props.button.text}*/}
                    <i className="material-icons">{props.buttonIcon}</i>
                </button>
            </div>

        </div>
    );
}