class TableTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            purchases: undefined,
            dialog: undefined,
            editPurchaseDialogOpened: false,
            selectedPurchase: null,
        };
    }

    openEditPurchaseDialog = purchase => this.setState({
        editPurchaseDialogOpened: true,
        selectedPurchase: purchase
    });
    closeEditPurchaseDialog = () => this.setState({
        editPurchaseDialogOpened: false,
        selectedPurchase: null
    });
    
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
                               button={{icon: 'add', text: 'добавить'}}
                               members={this.props.members}
                               room={this.props.room}
                               updateTable={this.getPurchases}/>
                {
                    this.state.purchases === undefined
                        ? <div className="room__empty-page"><Loader/></div>
                        : <DebtsTable purchases={this.state.purchases}
                                      openEditDialog={this.openEditPurchaseDialog}/>
                }

                <div id="editPurchaseDialog" className="dialog"
                     onClick={e => {if (e.target.id === 'editPurchaseDialog') this.closeEditPurchaseDialog()}}
                     style={{display: this.state.editPurchaseDialogOpened ? 'block' : 'none'}}>

                    <div className="dialog-content">
                        <span className="small-action-btn close-dialog-btn"
                              onClick={this.closeEditPurchaseDialog}>
                            <i className="material-icons">close</i>
                        </span>

                        <h2>Изменить покупку</h2>

                        {/*<AddRecordForm purchases={this.state.purchases === undefined ? [] : this.state.purchases}*/}
                        {/*               id='add'*/}
                        {/*               button={{icon: 'save', text: 'сохранить'}}*/}
                        {/*               members={this.props.members}*/}
                        {/*               room={this.props.room}*/}
                        {/*               updateTable={this.getPurchases}/>*/}
                    </div>
                </div>
            </>
        );
    }
}

function DebtsTable(props) {
    return (
        <table className={"highlight centered"}>
            <thead>{DebtsTableHeaders}</thead>
            <tbody>{
                props.purchases.map(purchase => (
                    <tr key={purchase.id}
                        style={{cursor: 'pointer'}}
                        onClick={() => props.openEditDialog(purchase)}>
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
        console.log('constructor of '+this.props.id+', purchase = '+this.props.purchase);
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
    // editPurchase = purchaseID => {
    //     sendPut(ROUTE_PURCHASE(this.props.room.id, purchaseID), JSON.stringify({
    //         name: this.state.purchaseName,
    //         debt: this.state.cost,
    //         date: getCurrentDate(),
    //         buyer_id: this.state.buyer,
    //         debtor_ids: this.state.debtors
    //     }), response => {
    //         // this.props.updateTableByAdd(response);
    //         this.props.updateTable();
    //     }, response => {
    //         switch (response.status) {
    //             case 401:
    //                 redirectToLogin();
    //                 break;
    //             default:
    //                 M.toast({
    //                     html: "error "+response.status,
    //                     classes: "error-toast"
    //                 })
    //                 console.log("error "+response.status);
    //                 break;
    //         }
    //     });
    // }

    // handleActionWithPurchase = purchase => {
    //     if (purchase) {
    //         this.editPurchase(purchase.id);
    //     } else {
    //         this.addPurchase();
    //     }
    // }

    componentDidMount() {
        // M.FormSelect.init($('#debtorsSelect'));
        // M.FormSelect.init($('#buyerSelect'));
        // M.Autocomplete.init($('#purchase-name'));

        // M.FormSelect.init($('select'));
        // M.FormSelect.init($('#buyerSelect'));
        // M.Autocomplete.init($('#purchase-name'));

        console.log('didMount of '+this.props.id+', purchase = '+this.props.purchase);
        M.AutoInit();
        // if (this.props.purchase) {
        //     this.setState({
        //         debtors: this.props.purchase.debtors.map(debtor => debtor.id),
        //         purchaseName: this.props.purchase.name,
        //         cost: this.props.purchase.debt,
        //         buyer: this.props.purchase.buyer.id,
        //     })
        // }
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
        console.log('render of '+this.props.id+', purchase = '+this.props.purchase);
        return (
            <div className="add-record-form">

                <div className='row' style={{flexGrow: '1'}}>
                    <div className="input-field col s3">
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
                                id={"debtorsSelect"}>
                            {/*<option value='-1'>Все</option>*/}
                            {
                                this.props.members.map(member => (
                                    <option value={member.id} key={member.id}>
                                        {member.display_name}
                                    </option>
                                ))
                            }
                        </select>
                        <label>Кто должен</label>
                    </div>

                    <div className="input-field col s3">
                        <input type="text"
                            // placeholder="Например, веп))0"
                               id={"purchase-name"}
                               value={this.state.purchaseName}
                               onChange={e => this.setState({purchaseName: e.target.value})}
                               className="autocomplete"/>
                        <label htmlFor="purchase-name">Покупка</label>
                    </div>

                    <div className="input-field col s3">
                        <select value={this.state.buyer}
                                onChange={e => this.setState({
                                    buyer: Number.parseInt(e.target.value)
                                })}
                                id={"buyerSelect"}>
                            {
                                this.props.members.map(member => (
                                    <option value={member.id} key={member.id}>
                                        {member.display_name}
                                    </option>
                                ))
                            }
                        </select>
                        <label>Кому должен</label>
                    </div>

                    <div className="input-field col s3">
                        <input type="number"
                            // placeholder="40 гривен"
                               value={this.state.cost}
                               onChange={e => this.setState({
                                   cost: e.target.value
                               })}
                               id={"costInput"}/>
                        <label htmlFor="costInput">Сколько</label>
                    </div>
                </div>

                <div style={{transform: "translateY(-100%)"}}>
                    <button className="waves-effect waves-light btn"
                            disabled={
                                this.state.debtors.length === 0 ||
                                this.state.purchaseName.length === 0 ||
                                this.state.cost.length === 0
                            }
                            onClick={() => this.handleAddPurchase(this.props.purchase)}>
                        <i className="material-icons left">{this.props.button.icon}</i>
                        {this.props.button.text}
                    </button>
                </div>

            </div>
        );
    }
}