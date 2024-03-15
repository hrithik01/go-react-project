import React, { Component } from "react";
import UserService from "../services/UserService";
import { Link } from "react-router-dom";

class ViewUserComponent extends Component {
    constructor (props) {
        super (props);
        this.state = {
            id: this.props.match.params.id,
            user: {}
        }
    }
    componentDidMount() {
        UserService.getUserById(this.state.id).then( res => {
            console.log("res", res);
            this.setState({ user: res });
        }).catch(error => { console.log("Error in ViewUserComponent", error) });
    }
    render() {
        return (
            <div>
                <br />
                <div className="card col-md-4 offset-md-3" style={{backgroundColor: "lightgrey", border: '2px solid navy'}}>
                    <h3 className="text-center" style={{textDecoration: 'underline'}}>
                        View User Details </h3>
                        <div className="card-body">
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>First Name:&nbsp; </label>
                                <div> {this.state.user.first_name} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Middle Name:&nbsp; </label>
                                <div> {this.state.user.middle_name} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Last Name:&nbsp; </label>
                                <div> {this.state.user.last_name} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Email:&nbsp; </label>
                                <div> {this.state.user.email} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Gender:&nbsp; </label>
                                <div> {this.state.user.gender} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Civil Status:&nbsp; </label>
                                <div> {this.state.user.civil_status} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Birthday:&nbsp; </label>
                                <div> {this.state.user.birthday} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Contact:&nbsp; </label>
                                <div> {this.state.user.contact} </div>
                            </div>
                            <div className="row">
                                <label style={{fontWeight: 'bold'}}>Address:&nbsp; </label>
                                <div> {this.state.user.address} </div>
                            </div>
                            <Link to="/users" className="btn btn-primary"> Home </Link>
                        </div>
                </div>
            </div>
        )
    }
}

export default ViewUserComponent;