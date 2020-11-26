function RoomTopMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav className="room__top-menu">
            <div
                onClick={() => {
                    location.assign(`../home/home.html`)
                    // location.assign(`home`)
                }}
                style={{float:'left'}}
            >🏠 Home</div>
            {
                NAV_NAMES.map(name => {
                    const i = NAV_NAMES.indexOf(name);
                    return (
                        <div
                            key={i}
                            onClick={() => props.onCheck(i)}
                            className={(index === i) ? "active" : null}
                        >{name}</div>
                    )
                })
            } </nav>
    );
}
