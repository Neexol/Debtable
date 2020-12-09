class RoomRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomID: this.getRoomID(),
            checkedIndex: this.getCurrentTab(),
            members: undefined,
            purchases: undefined,
            // statistics: undefined
        };
    }

    getCurrentTab() {
        const tab = new URLSearchParams(window.location.search).get('tab')?.toString();
        switch (tab) {
            case 'statistics': return 1;
            case 'management': return 2;
            default: return 0;
        }
    }

    getRoomID() {
        const tab = new URLSearchParams(window.location.search).get('room');
        return Number.parseInt(tab);
    }

    handleCheck = index => {
        const tabs = ['table', 'statistics', 'management'];
        const params = new URLSearchParams(window.location.search);
        params.set('tab', tabs[index]);
        window.history.pushState(
            {tab: index},
            '',
            window.location.toString().replace(/\?.*$/, '')+`?${params}`
        );
        this.setState({checkedIndex: index})
    }

    getMembers = () => sendGet(ROUTE_MEMBERS(this.state.roomID),
        response => {
            this.setState({members: response});
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

    getPurchases = () => sendGet(ROUTE_PURCHASES(this.state.roomID),
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
        this.getMembers();
        this.getPurchases();
    }

    render() {
        return (
            <>
                <RoomTopMenu checkedIndex={this.state.checkedIndex}
                             onCheck={this.handleCheck}/>
                {
                    this.state.members    === undefined ||
                    this.state.purchases  === undefined
                    // this.state.statistics === undefined
                        ? <div className="room__empty-page"><Loader/></div>
                        : <div className="room__content">{
                            NAVIGATION(this.state.checkedIndex, {
                                members: this.state.members,
                                purchases: this.state.purchases,
                                // statistics: this.state.statistics
                            })
                        }</div>
                }
            </>
        )
    }

    // render() {
    //     if (this.state.isLoading) {
    //         return <Loader/>
    //     } else return (
    //         <>
    //             <RoomTopMenu checkedIndex={this.state.checkedIndex}
    //                          onCheck={this.handleCheck}/>
    //
    //             <div className="room__content">
    //                 {NAVIGATION(this.state.checkedIndex, this.state.members)}
    //             </div>
    //         </>
    //
    //     );
    // }
}
