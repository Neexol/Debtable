// const BASE_URL = "https://devtable.herokuapp.com";
const BASE_URL = "http://localhost:8080";
const HOST_URL = BASE_URL + "/";

function sendRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        HOST_URL + "members.json",
        true
    );
    xhr.onload = () => {
        $(`#response`).html(
            `<b>${xhr.status}<b><br>` +
            xhr.responseText
        );
        ReactDOM.render(
            <DebtsTable list={JSON.parse(xhr.responseText)}/>,
            document.getElementById('root')
        );
    }
    xhr.onerror = () => alert( "Ошибка " + xhr.status );
    xhr.send("hello");
}

// function BoilingVerdict(props) {
//     if (props.celsius >= 100) {
//         return <p>Вода закипит.</p>;
//     }
//     return <p>Вода не закипит.</p>;
// }

// class TemperatureInput extends React.Component {
//     constructor(props) {
//         super(props);
//         this.handleChange = this.handleChange.bind(this);
//         this.state = {temperature: ''};
//     }
//
//     handleChange(e) {
//         this.setState({temperature: e.target.value});
//     }
//
//     render() {
//         const temperature = this.state.temperature;
//         const scale = this.props.scale;
//         return (
//             <fieldset>
//                 <legend>Введите температуру в градусах {scaleNames[scale]}:</legend>
//                 <input value={temperature}
//                        onChange={this.handleChange} />
//             </fieldset>
//         );
//     }
// }

// ReactDOM.render(
//     <Calculator />,
//     document.getElementById('root')
// );

const DebtsTableHeaders = (
    <tr>
        <th>Кто должен</th>
        <th>Покупка</th>
        <th>Кому должен</th>
        <th>Сколько</th>
        <th>Дата</th>
    </tr>
)
// function DebtsTableHeaders(props) {
//     return (
//         <tr>
//             <th>Кто должен</th>
//             <th>Покупка</th>
//             <th>Кому должен</th>
//             <th>Сколько</th>
//             <th>Дата</th>
//         </tr>
//     )
// }

class DebtsTableRow extends React.Component {
    render() {
        const row = this.props.row;
        return (
            <tr>
                <td>{row.who_owes}</td>
                <td>{row.purchase}</td>
                <td>{row.who_paid}</td>
                <td>{row.cost}</td>
                <td>{row.date}</td>
            </tr>
        );
    }
}

class DebtsTableBody extends React.Component {
    render() {
        return (
            <tbody>
            {
                this.props.list.map((row) =>
                    <DebtsTableRow key={row.id} row={row}/>
                )
            }
            </tbody>
        )
    }
}

class DebtsTable extends React.Component {
    render() {
        return (
            <table className={"redTable"}>
                <thead>{DebtsTableHeaders}</thead>
                <DebtsTableBody list={this.props.list}/>
            </table>
        );
    }
}