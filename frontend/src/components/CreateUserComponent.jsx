import React, { Component } from "react";
import UserService from "../services/UserService";
import { Link } from "react-router-dom";

class CreateUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            gender: '',
            civil_status: '',
            birthday: '',
            contact: '',
            address: ''
        }
        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeMiddleNameHandler = this.changeMiddleNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.changeGenderHandler = this.changeGenderHandler.bind(this);
        this.changeCivilStatusHandler = this.changeCivilStatusHandler.bind(this);
        this.changeBirthdayHandler = this.changeBirthdayHandler.bind(this);
        this.changeContactHandler = this.changeContactHandler.bind(this);
        this.changeAddressHandler = this.changeAddressHandler.bind(this);
        this.saveOrUpdateUser = this.saveOrUpdateUser.bind(this);
    }

    componentDidMount() {
        if(this.state.id === '_add') {
            return;
        } else {
            UserService.getUserById(this.state.id).then(res => {
                let user = res;
                this.setState({
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
                    email: user.email,
                    gender: user.gender,
                    civil_status: user.civil_status,
                    birthday: user.birthday,
                    contact: user.contact,
                    address: user.address
                })
            }).catch(
                error => { console.log("Error in CreateUserComponent Component mounting", error) }
            );
        }
    }
    saveOrUpdateUser = (e) => {
        e.preventDefault();
        let user = {
            first_name: this.state.first_name,
            middle_name: this.state.middle_name,
            last_name: this.state.last_name,
            email: this.state.email,
            gender: this.state.gender,
            civil_status: this.state.civil_status,
            birthday: this.state.birthday,
            contact: this.state.contact,
            address: this.state.address
        }
        console.log('user => ' + JSON.stringify(user));
        if(this.state.id === '_add') {
            if(!this.state.email.includes('@') || !this.state.email.includes('.com')) {
                alert("Invalid email address!");
            }
            else if(this.state.contact.length !== 10) {
                alert("Invalid contact number!");
            }
            else if(!this.state.first_name || !this.state.last_name || !this.state.email || !this.state.gender || !this.state.civil_status || !this.state.birthday || !this.state.contact || !this.state.address) {
                alert("All fields are required!");
            }
            else{
                UserService.createUser(user).then(res => {
                    this.props.history.push('/users');
                }).catch(error => { console.log("Error in CreateUserComponent saveOrUpdateUser", error) });
           }
        }
        else {
            user.id = this.state.id;
            if(!this.state.first_name || !this.state.last_name || !this.state.email || !this.state.gender || !this.state.civil_status || !this.state.birthday || !this.state.contact || !this.state.address) {
                alert("All fields are required!");
            }
            else if(!this.state.email.includes('@') || !this.state.email.includes('.com')) {
                alert("Invalid email address!");
            }
            else if(this.state.contact.length !== 10) {
                alert("Invalid contact number!");
            }
            else {
                if(window.confirm("Are you sure you want to update this user?")) {
                    UserService.updateUser(user).then(res => {
                        this.props.history.push('/users');
                    }).catch(error => { console.log("Error in CreateUserComponent saveOrUpdateUser", error) });
            }}
        }
    }
    changeFirstNameHandler = (event) => {
        this.setState({first_name: event.target.value});
    }
    changeMiddleNameHandler = (event) => {
        this.setState({middle_name: event.target.value});
    }
    changeLastNameHandler = (event) => {
        this.setState({last_name: event.target.value});
    }
    changeEmailHandler = (event) => {
        this.setState({email: event.target.value});
    }
    changeGenderHandler = (event) => {
        this.setState({gender: event.target.value});
    }
    changeCivilStatusHandler = (event) => {
        this.setState({civil_status: event.target.value});
    }
    changeBirthdayHandler = (event) => {
        this.setState({birthday: event.target.value});
    }
    changeContactHandler = (event) => {
        this.setState({contact: event.target.value});
    }
    changeAddressHandler = (event) => {
        this.setState({address: event.target.value});
    }
    cancel() {
        this.props.history.push('/users');
    }
    getTitle() {
        if(this.state.id === '_add') {
            return <h3 className="text-center"> Add User </h3>
        } else {
            return <h3 className="text-center"> Update User </h3>
        }
    }
    render() {
        return (
            <div>
                <br />
                <div className="container" style={{backgroundColor: "lightgrey", padding: "8px"}}>
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            { this.getTitle() }
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> First Name: </label>
                                        <input placeholder="First Name" name="first_name" className="form-control" value={this.state.first_name} onChange={this.changeFirstNameHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Middle Name: </label>
                                        <input placeholder="Middle Name" name="middle_name" className="form-control" value={this.state.middle_name} onChange={this.changeMiddleNameHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Last Name: </label>
                                        <input placeholder="Last Name" name="last_name" className="form-control" value={this.state.last_name} onChange={this.changeLastNameHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Email: </label>
                                        <input placeholder="Email" name="email" className="form-control" value={this.state.email} onChange={this.changeEmailHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Civil Status: </label>
                                        <select name="civil_status" className="form-control" value={this.state.civil_status} onChange={this.changeCivilStatusHandler}>
                                            <option defaultValue={""} hidden={true} >Please select civil status...</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Gender: </label>
                                        <select name="gender" className="form-control" value={this.state.gender} onChange={this.changeGenderHandler}>
                                            <option defaultValue={""} hidden={true} >Please select gender...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Birthday: </label>
                                        <input type="date" placeholder="Birthday" name="birthday" className="form-control" value={this.state.birthday} onChange={this.changeBirthdayHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Contact: </label>
                                        <input placeholder="Contact" name="contact" className="form-control" value={this.state.contact} onChange={this.changeContactHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{fontWeight: 'bold'}}> Address: </label>
                                        <input placeholder="Address" name="address" className="form-control" value={this.state.address} onChange={this.changeAddressHandler} />
                                    </div>
                                    <button className="btn btn-success" onClick={this.saveOrUpdateUser}> Save </button>
                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}> Cancel </button>
                                    <Link to="/users" className="btn btn-primary" style={{marginLeft: "10px"}}> Home </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default CreateUserComponent;