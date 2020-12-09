function RoomTopMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav className="room__top-menu">
            <div style={{float:'left', display: 'flex', alignItems: 'center'}}
                 onClick={redirectToHome}>
                {NAV_HOME}
            </div>
            {
                NAV_NAMES.map(name => {
                    const i = NAV_NAMES.indexOf(name);
                    return (
                        <div key={i}
                             onClick={() => props.onCheck(i)}
                             className={(index === i) ? "active" : null}
                             style={{display: 'flex', alignItems: 'center'}}>
                            {name}
                        </div>
                    )
                })
            }
        </nav>
    );
}
