class HomeRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkedIndex: 0};
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(index) {
        this.setState({checkedIndex: index})
    }

    render() {
        return (
            <>
                <HomeSideMenu
                    checkedIndex={this.state.checkedIndex}
                    onCheck={this.handleCheck}
                />
                <div className="home__content">
                    {NAVIGATION[this.state.checkedIndex]}
                </div>
            </>
        );
    }
}