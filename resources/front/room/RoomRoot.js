class RoomRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIndex: 0,
            isLoading: true,
            members: null
        };
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount() {
        alert(document.cookie);
        $.get(`${HOST_URL}members.json`, (response) => {
            this.setState({
                isLoading: false,
                members: response
            })
        });
    }

    handleCheck(index) {
        this.setState({checkedIndex: index})
    }

    render() {
        if (this.state.isLoading) {
            return <Loader/>
        } else return (
            <>
                <RoomTopMenu
                    checkedIndex={this.state.checkedIndex}
                    onCheck={this.handleCheck}
                />
                <div className="room__content">
                    {NAVIGATION(this.state.checkedIndex, this.state.members)}
                </div>
            </>
        );
    }
}
