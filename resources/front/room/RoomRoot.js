class RoomRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIndex: this.getCurrentTab(),
            isLoading: true,
            members: null
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

    componentDidMount() {
        $.get(`${HOST_URL}test/members.json`, (response) => {
            this.setState({
                isLoading: false,
                members: response
            })
        });
    }

    render() {
        if (this.state.isLoading) {
            return <Loader/>
        } else return (
            <>
                <RoomTopMenu checkedIndex={this.state.checkedIndex}
                             onCheck={this.handleCheck}/>

                <div className="room__content">
                    {NAVIGATION(this.state.checkedIndex, this.state.members)}
                </div>
            </>
        );
    }
}
