function HomeSideMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav className="home__side-menu"> {
            NAV_NAMES(props.isInvites).map((name, i) => (
                <div key={i}
                     onClick={() => props.onCheck(i)}
                     className={(index === i) ? "active" : null}
                     style={{display: 'flex', alignItems: 'center'}}>
                    {name}
                </div>
            ))
        } </nav>
    );
}