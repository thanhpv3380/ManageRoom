import React, { Component } from 'react';
import './BetGame.css';
import bet from './../../../constants/Image';
import io from 'socket.io-client';
import jwt_decode from 'jwt-decode';

let socket = '';

class BetGame extends Component {
    constructor() {
        super();
        socket = io('http://localhost:9000');
        const decoded = localStorage.getItem('user') ? jwt_decode(localStorage.getItem('user')) : '';
        socket.emit('client-send-info', { userId: decoded._id });
        this.state = {
            bets: [],
            rolls: {
                one: bet.chicken,
                two: bet.crab,
                three: bet.fish
            },
            players: [],
            status: true
        }

    }
    componentDidMount() {
        socket.on('client-send-allbets', (data) => {
            this.setState({ bets: [...data.bets] });
            this.setState({ players: [...data.players] })
        });
        socket.on('server-send-bet', (data) => {
            let list = [...this.state.bets];
            list.push(data);
            this.setState({ bets: [...list] });
            console.log(list);
        });
        socket.on('server-send-roll', (data) => {
            
            //console.log(data);
            const dice = [bet.tiger, bet.zucchini, bet.chicken, bet.shrimp, bet.fish, bet.crab];
            this.setState({ rolls: { one: dice[data.one], two: dice[data.two], three: dice[data.three] }, players: [...data.players] });
            //this.setState({bets: []});
        });
        socket.on('server-send-open', () =>{
            this.setState({bets: [], status: true});
        });
        socket.on('server-send-close', () =>{
            this.setState({status: false});
        })
        socket.on('server-send-disconnect', (data) =>{
            this.setState({players: [...data.players]});
        });
    }
    handleBet = (id) => {
        if (this.state.status){
            const decoded = localStorage.getItem('user') ? jwt_decode(localStorage.getItem('user')) : '';
            socket.emit('client-send-bet', { userId: decoded._id, choice: id });
        } else {
            alert('Room close');
        }
    }
    handleRoll = (e) => {
        e.preventDefault();
        //console.log('fs1');
        let interval = setInterval(() => {
            //console.log('fs');
            const dice = [bet.tiger, bet.zucchini, bet.chicken, bet.shrimp, bet.fish, bet.crab];
            let roll1 = Math.floor(Math.random() * 6);
            let roll2 = Math.floor(Math.random() * 6);
            let roll3 = Math.floor(Math.random() * 6);
            console.log(roll1, roll2, roll3);
            this.setState({
                rolls: {
                    one: dice[roll1],
                    two: dice[roll2],
                    three: dice[roll3]
                }
            })
        }, 200);
        setTimeout(() => { 
            clearInterval(interval);
            socket.emit('client-send-roll'); 
        }, 5000);

    }
    handleOpen = (e) => {
        e.preventDefault();
        socket.emit('client-send-open');
       
    }
    handleClose = (e) =>{
        e.preventDefault();
        socket.emit('client-send-close');
    }
    render() {
        const { bets, rolls, players, status } = this.state;
        let one = rolls.one;
        let two = rolls.two;
        let three = rolls.three;
        return (
            <div className="container bg-white betgame mt-5 mb-5">
                <div className="row">
                    <div className="col-sm-8 p-3">
                        <div className="header">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-5">
                                        <img src={one} width="80px" />
                                        <img src={two} width="80px" />
                                        <img src={three} width="80px" />
                                    </div>
                                    <div className="col-sm-7 p-0">
                                        <div className="title">
                                            {   status ? 
                                                    <h4><strong>Sòng bạc đang mở.</strong> Đặt cược đi bà con</h4> 
                                                : 
                                                    <h4><strong>Sòng bạc đã đóng.</strong> Chờ kết quả xóc</h4> 
                                            }
                                        </div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-sm-4 p-0">
                                                    <button className="btn btn-danger text-uppercase w-100" onClick={this.handleClose}>Đóng sòng</button>
                                                </div>
                                                <div className="col-sm-4 p-0">
                                                    <button className="btn btn-success text-uppercase w-100" onClick={this.handleRoll}>Lắc bầu cua</button>
                                                </div>
                                                <div className="col-sm-4 p-0">
                                                    <button className="btn btn-warning text-uppercase w-100" onClick={this.handleOpen}>Mở sòng</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="content mt-3">
                            {/* <img src={bet.table} width="100%" /> */}
                            <div className="row">
                                <div className="col-sm-4" onClick={() => this.handleBet(1)}>
                                    <img src={bet.tiger} width="100%" />
                                </div>
                                <div className="col-sm-4" onClick={() => this.handleBet(2)}>
                                    <img src={bet.zucchini} width="100%" />
                                </div>
                                <div className="col-sm-4" onClick={() => this.handleBet(3)}>
                                    <img src={bet.chicken} width="100%" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4" onClick={() => this.handleBet(4)}>
                                    <img src={bet.shrimp} width="100%" />
                                </div>
                                <div className="col-sm-4" onClick={() => this.handleBet(5)}>
                                    <img src={bet.fish} width="100%" />
                                </div>
                                <div className="col-sm-4" onClick={() => this.handleBet(6)}>
                                    <img src={bet.crab} width="100%" />
                                </div>
                            </div>
                            {
                                bets.map((bet, index) => {
                                    let style = {
                                        top: `${bet.posBet.y}px`,
                                        left: `${bet.posBet.x}px`,
                                        backgroundImage: `url(${bet.user.image})`,
                                        transform: `${bet.posBet.rad}`
                                    }
                                    return (
                                        <div className="bet-choice" style={style} key={index}>
                                            <div className="bet-choice-coin">{5}</div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                    <div className="col-sm-4 p-3 content-right">
                        <div className="rule">
                            <h4 className="font-weight-bold">Luật chơi(Vui là chính)</h4>
                            <ul className="p-3">
                                <li>
                                    Mới chơi được tặng <strong>100 đồng</strong>
                                </li>
                                <li>
                                    Mỗi lần cháy túi sẽ được tặng <strong>20 đồng</strong> đồng để gỡ gạc
                            </li>
                                <li>
                                    Mỗi lần click là đặt cược <strong>5 đồng</strong>
                                </li>
                                <li>
                                    Tra số tiền tại <strong>henry.com</strong>
                                </li>
                            </ul>
                        </div>
                        <div className="rank mt-3">
                            <h4 className="font-weight-bold">Bảng xếp hạng</h4>
                            <table className="table">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Hạng</th>
                                        <th scope="col">Avatar</th>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Điểm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        players.map((player, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{index+1}</th>
                                                    <td><img src={player.user.image} width="40px" /></td>
                                                    <td>{player.user.name}</td>
                                                    <td>{player.coin}</td>
                                                </tr>
                                            )
                                        })
                                    }


                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        )
    };
};

export default BetGame;