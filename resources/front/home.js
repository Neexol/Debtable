// const NAVIGATION = new Map([
//     ["ROOMS",    (<HomeRooms/>)   ],
//     ["PROFILE",  (<HomeProfile/>) ],
//     ["SETTINGS", (<HomeSettings/>)]
// ]);
// const NAVIGATION = new Map([
//     ["ROOMS",    "(HomeRooms)"   ],
//     ["PROFILE",  "(HomeProfile)" ],
//     ["SETTINGS", "(HomeSettings)"]
// ]);

// const NAV_NAMES = [
//     "Rooms",
//     "Profile",
//     "Settings"
// ]

// alert(NAVIGATION[0]);

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkedIndex: 0};
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(index) {
        this.setState({checkedIndex: index})
    }

    render() {
        // return <div>Home</div>;
        return (
            <>
                <span>
                    <HomeSideMenu
                        checkedIndex={this.state.checkedIndex}
                        onCheck={this.handleCheck}
                    />
                </span>
                <span>
                    {NAVIGATION[this.state.checkedIndex]}
                </span>
            </>
        );
    }
}

class HomeSideMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    // {
    //     NAV_NAMES.map(name => {
    //     const i = NAV_NAMES.indexOf(name);
    //     return (
    // <a onClick={this.props.onCheck(i)}>
    // {name}
    // </a>
    // )
    // })
    // }

    render() {
        const checkedIndex = this.props.checkedIndex;
        // return <div>HomeSideMenu</div>;
        return (

                <nav>
                    <div onClick={() => this.props.onCheck(0)} className={"checked_" + (checkedIndex === 0)}>
                        ROOMS
                    </div>
                    <div onClick={() => this.props.onCheck(1)} className={"checked_" + (checkedIndex === 1)}>
                        PROFILE
                    </div>
                    <div onClick={() => this.props.onCheck(2)} className={"checked_" + (checkedIndex === 2)}>
                        SETTINGS
                    </div>
                </nav>

        );
    }
}

class HomeRooms extends React.Component {
    render() {
        return (
            <div>
                there are rooms
            </div>
        );
    }
}

class HomeProfile extends React.Component {
    render() {
        return (
            <div>
                there is profile
            </div>
        );
    }
}

class HomeSettings extends React.Component {
    render() {
        return (
            <div>
                there is settings
            </div>
        );
    }
}

const NAVIGATION = [
    (<HomeRooms/>),
    (<HomeProfile/>),
    (<HomeSettings/>)
];

ReactDOM.render(
    <Home/>,
    document.getElementById('root')
);