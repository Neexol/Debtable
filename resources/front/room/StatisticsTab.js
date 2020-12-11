class StatisticsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statistics: undefined
        };
    }

    getStatistics = () => sendGet(ROUTE_STATISTICS(this.props.room.id),
        response => {
            this.setState({statistics: response});
        },
        response => {
            switch (response.status) {
                case 401:
                    redirectToLogin();
                    break;
                default:
                    // alert("error "+response.status);
                    console.log("error "+response.status);
                    break;
            }
        }
    );

    componentDidMount() {
        this.getStatistics();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    getBackgroundColor = value => (value > 0
        ? 'rgba(75, 192, 192, 0.3)'
        : 'rgba(255, 99, 132, 0.3)'
    );
    getBorderColor = value => (value > 0
        ? 'rgba(75, 192, 192, 1)'
        : 'rgba(255, 99, 132, 1)'
    );

    updateChart = () => {
        const stats = this.state.statistics;
        if (!stats) return;
        const ctx = document.getElementById('statsCanvas');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stats.map(col => col.user.display_name),
                datasets: [{
                    data: stats.map(col => col.balance),
                    backgroundColor: stats.map(col => this.getBackgroundColor(col.balance)),
                    borderColor: stats.map(col => this.getBackgroundColor(col.balance)),
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    render() {
        return (
            <canvas className={'diagram'} id={'statsCanvas'}/>
        );
    }
}