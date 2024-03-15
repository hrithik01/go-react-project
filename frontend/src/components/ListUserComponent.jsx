import React, { Component } from "react";
import UserService from "../services/UserService";

class ListUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
        this.addUser = this.addUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.viewUser = this.viewUser.bind(this);
    }

    deleteUser(id) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            UserService.deleteUser(id).then((res) => {
                this.setState({ users: this.state.users.filter(user => user.id !== id) });
            }).catch((error) => { console.log("Error in ListUserComponent", error) });
        }
    }
    viewUser(id) {
        this.props.history.push(`/view-user/${id}`);
    }
    updateUser(id) {
        this.props.history.push(`/update-user/${id}`);
    }
    addUser() {
        this.props.history.push('/add-user');
    }
    componentDidMount() {
        UserService.getUsers().then((res) => {
            this.setState({ users: res });
        }).catch((error) => { console.log("Error in ListUserComponent", error) });
    }
    render() {
        return (
            <div style={{marginLeft: '20px'}}>
                <h2 className="text-center">Users List</h2>
                <div className="row">
                    <button className="btn btn-primary" onClick={this.addUser}> Add User</button>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th> User First Name</th>
                                <th> User Last Name</th>
                                <th> User Email Id</th>
                                <th> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map(
                                    user =>
                                        <tr key={user.id}>
                                            <td> {user.first_name} </td>
                                            <td> {user.gender} </td>
                                            <td> {user.email} </td>
                                            <td>
                                                <button onClick={() => this.updateUser(user.id)} className="btn btn-info">Update</button>
                                                <button style={{ marginLeft: "10px" }} onClick={() => this.deleteUser(user.id)} className="btn btn-danger">Delete</button>
                                                <button style={{ marginLeft: "10px" }} onClick={() => this.viewUser(user.id)} className="btn btn-info">View</button>
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ListUserComponent;