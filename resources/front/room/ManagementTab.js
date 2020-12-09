class ManagementTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span>Комната "<b>название</b>"</span>
                    <button className="action-btn"
                            style={{display: 'flex', alignItems: 'center'}}>
                        <><i className="material-icons nav-icon">person_add</i>Пригласить участников</>
                    </button>
                </div>


                <hr/>

                <span>Участники</span>
                <div className="members-container">
                    <MembersList members={this.props.members} removeIcon='person_remove'/>
                </div>

            </>
        );
    }
}

function MembersList(props) {
    return (
        <>{
                props.members.map(member => (
                    <div key={member.id}
                         className="member-card"
                         style={{display: 'flex', alignItems: 'center'}}>
                        <span>
                            {member.display_name}<br/>
                            @{member.username}
                        </span>

                        <span className="material-icons small-action-btn"
                              // onClick={}
                              // style={{float: 'right'}}
                        >
                            {props.removeIcon}
                        </span>
                    </div>
                ))
        }</>
    );
}