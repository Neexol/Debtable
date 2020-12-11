function RoomTopMenu(props) {
    const index = props.checkedIndex;
    return (
        <nav>
            <div className="nav-wrapper">
                <ul className="hide-on-med-and-down" style={{width: '100%'}}>
                    <li className={'left'}>
                        <a onClick={redirectToHome}
                           style={{display: 'flex', alignItems: 'center'}}>
                            {NAV_HOME}
                        </a>
                    </li>
                    {
                        NAV_NAMES.map((name, i) => {
                            return (
                                <li key={i} className={'right'}>
                                    <a onClick={() => props.onCheck(i)}
                                       className={(index === i) ? "active" : null}
                                       style={{display: 'flex', alignItems: 'center'}}>
                                        {name}
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </nav>
        // <nav className="room__top-menu">
        //     <div style={{float:'left', display: 'flex', alignItems: 'center'}}
        //          onClick={redirectToHome}>
        //         {NAV_HOME}
        //     </div>
        //     {
        //         NAV_NAMES.map(name => {
        //             const i = NAV_NAMES.indexOf(name);
        //             return (
        //                 <div key={i}
        //                      onClick={() => props.onCheck(i)}
        //                      className={(index === i) ? "active" : null}
        //                      style={{display: 'flex', alignItems: 'center'}}>
        //                     {name}
        //                 </div>
        //             )
        //         })
        //     }
        // </nav>
    );
}
