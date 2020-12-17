function RoomTopMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav className="top-menu">
            <div style={{display: 'flex', flexDirection: 'column'}}
                 onClick={redirectToHome}>
                <span className={'selection'}/>
                {NAV_HOME}
            </div>
            <div className={'nav-group'} style={{display: 'flex'}}>{
                NAV_NAMES.map((name, i) => (
                    <div key={i}
                         onClick={() => props.onCheck(i)}
                         className={(index === i) ? "active" : null}
                         style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
                        <span className={'selection ' + ((index === i) ? "accent-colored" : null)}/>
                        {name}
                    </div>
                ))
            }</div>
        </nav>
    );
}
