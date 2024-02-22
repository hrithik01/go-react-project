import React, { Component } from "react";

class FooterComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
    }

    render() {
        return (
            <div>
                <footer className="footer">
                    <span className="text-muted">GoLang React SQL Project &copy; Hrithik Joshi</span>
                </footer>
            </div>
        )
    }
}

export default FooterComponent;