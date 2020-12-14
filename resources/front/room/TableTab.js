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
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    redirectToHome();
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка загрузки списка покупок');
                    break;
            }
        }
    );

    componentDidMount() {
        this.getPurchases();
    }

    render() {
        return (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <div className={'top-content-container'}>
                    <AddRecordForm purchases={this.state.purchases === undefined ? [] : this.state.purchases}
                                   purchase={this.state.selectedPurchase}
                                   members={this.props.members}
                                   room={this.props.room}
                                   updateTable={this.getPurchases}/>
                </div>

                <div className={'table-container'}>{
                    this.state.purchases === undefined
                        ? <Loader size={'big'} center={true}/>
                        : <DebtsTable purchases={this.state.purchases}
                                      members={this.props.members}
                                      room={this.props.room}
                                      openEditDialog={this.openEditPurchaseDialog}
                                      updateTable={this.getPurchases}/>
                }</div>
            </div>
        );
    }
}

class DebtsTable extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'edit';
        this.state = {
            editPurchaseDialogOpened: false,
            deletePurchaseDialogOpened: false,
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
        buyer: purchase.buyer.id,
    });
    closeEditPurchaseDialog = () => this.setState({
        editPurchaseDialogOpened: false,
        selectedPurchase: null,
    });

    openDeletePurchaseDialog = purchase => this.setState({
        selectedPurchase: purchase,
        deletePurchaseDialogOpened: true,
    });
    closeDeletePurchaseDialog = () => this.setState({
        deletePurchaseDialogOpened: false,
        selectedPurchase: null,
    });

    handleEditPurchase = () => {
        sendPut(ROUTE_PURCHASE(this.props.room.id, this.state.selectedPurchase.id), JSON.stringify({
            name: this.state.purchaseName,
            debt: this.state.cost,
            date: this.state.selectedPurchase.date,
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
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате или пользователю');
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната, покупка или пользователи не найдены');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка редактирования покупки');
                    break;
            }
        });
        this.closeEditPurchaseDialog();
    };
    handleDeletePurchase = () => {
        sendDelete(ROUTE_PURCHASE(this.props.room.id, this.state.selectedPurchase.id), null, 
        response => {
            // this.props.updateTableByRemove(response);
            this.props.updateTable();
        }, 
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате');
                    redirectToHome();
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната или покупка не найдены');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка удаления покупки');
                    break;
            }
        });
        this.closeDeletePurchaseDialog();
    };

    componentDidUpdate() {
        M.AutoInit();
        M.updateTextFields();
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
                    <tbody className={'scrollable'}>{
                        this.props.purchases.map(purchase => (
                            <tr key={purchase.id}
                                style={{cursor: 'pointer'}}
                                onClick={e => {
                                    if (e.target.className.includes('btn')) return;
                                    this.openEditPurchaseDialog(purchase)
                                }}>
                                <td className='valign-wrapper'
                                    style={{flexWrap: 'wrap'}}>{
                                    purchase.debtors.map(debtor => (
                                        <div key={debtor.id}
                                             className='chip'
                                             title={LOGIN_SYMBOL+debtor.username}>
                                            {debtor.display_name}
                                        </div>
                                    ))
                                }</td>
                                <td style={{width: '25%', wordWrap: 'anywhere'}}>
                                    {purchase.name}
                                </td>
                                <td style={{width: '15%'}}>
                                    <div className='chip'
                                         title={LOGIN_SYMBOL+purchase.buyer.username}>
                                        {purchase.buyer.display_name}
                                    </div>
                                </td>
                                <td style={{width: '15%'}}>{purchase.debt}</td>
                                <td style={{width: '15%'}}>{purchase.date}</td>
                                <td style={{width: '5%'}}>
                                    <button className="waves-effect waves-red material-icons btn-flat delete"
                                            onClick={() => this.openDeletePurchaseDialog(purchase)}>
                                        delete_outline
                                    </button>
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </table>

                <Dialog id={'editPurchaseDialog'}
                        width={'70%'}
                        onClose={this.closeEditPurchaseDialog}
                        isOpen={this.state.editPurchaseDialogOpened}
                        title={'Изменить покупку'}>
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
                                  buttonIcon={'save'}
                                  onSubmit={this.handleEditPurchase}/>
                </Dialog>

                <Dialog id={'deletePurchaseDialog'}
                        width={'40%'}
                        onClose={this.closeDeletePurchaseDialog}
                        isOpen={this.state.deletePurchaseDialogOpened}
                        title={`Удалить покупку "${this.state.selectedPurchase?.name}"?`}>
                    <YesCancelButtons onYesClick={this.handleDeletePurchase}
                                      onCancelClick={this.closeDeletePurchaseDialog}/>
                </Dialog>

                {/*<div id="deletePurchaseDialog" className="dialog"*/}
                {/*     onClick={e => {if (e.target.id === 'deletePurchaseDialog') this.closeDeletePurchaseDialog()}}*/}
                {/*     style={{display: this.state.deletePurchaseDialogOpened ? 'block' : 'none'}}>*/}

                {/*    <div className="dialog-content">*/}
                {/*        <span className="small-action-btn close-dialog-btn"*/}
                {/*              onClick={this.closeDeletePurchaseDialog}>*/}
                {/*            <i className="material-icons">close</i>*/}
                {/*        </span>*/}

                {/*        <h4>Удалить покупку "{this.state.selectedPurchase?.name}"?</h4>*/}

                {/*        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>*/}
                {/*            <button className="waves-effect waves-light btn-flat"*/}
                {/*                    onClick={this.handleDeletePurchase}>*/}
                {/*                да блять*/}
                {/*            </button>*/}
                {/*            <button className="waves-effect waves-light btn-flat"*/}
                {/*                    onClick={this.closeDeletePurchaseDialog}>*/}
                {/*                отмена*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}
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
                case 403:
                    showErrorToast(response.status, 'Ошибка доступа к комнате или пользователю');
                    break;
                case 404:
                    showErrorToast(response.status, 'Комната не найдена');
                    break;
                default:
                    showErrorToast(response.status, 'Ошибка добавления покупки');
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

            <div className='row' style={{flexGrow: '1', margin: '0'}}>
                <div className="input-field col s3" style={{margin: '0'}}>
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

                <div className="input-field col s3" style={{margin: '0'}}>
                    <input type="text"
                        // placeholder="Например, веп))0"
                           id={"purchaseName"+props.id}
                           value={props.purchaseName}
                           onChange={props.onPurchaseNameChange}
                           className="autocomplete"/>
                    <label htmlFor={"purchaseName"+props.id}>Покупка</label>
                </div>

                <div className="input-field col s3" style={{margin: '0'}}>
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

                <div className="input-field col s3" style={{margin: '0'}}>
                    <input type="number"
                        // placeholder="40 гривен"
                           value={props.cost}
                           onChange={props.onCostChange}
                           id={"costInput"+props.id}/>
                    <label htmlFor={"costInput"+props.id}>Сколько</label>
                </div>
            </div>

            <div >
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