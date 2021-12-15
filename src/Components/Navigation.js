import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import '../Styles/navigation.css';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import { FacebookProvider, LoginButton } from 'react-facebook';
import axios from 'axios';
const API_URL = require('../constants').API_URL;
const customStyle = {
    content: {
        marginTop: '150px',
        maxWidth: '532px',
        background: 'white',
        zIndex: '10000000',
        padding: '28px',
        border: 'groove'
    }
}

Modal.setAppElement('#root')

class Navigation extends Component {
    goHome = (path) => {
        this.props.history.push(path);
    }

    constructor() {
        super();
        this.state = {
            backgroundStyle: ' ',
            isLoginModalOpen: false,
            isSignupModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined
        }
    }
    componentDidMount() {
        let initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);
        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname);
        });
    }

    setHeaderStyle = (path) => {
        let bg = '';
        if (path === "/" || path === '/home') {
            bg = 'transparent';
        } else {
            bg = 'colored';
        }
        this.setState({
            backgroundStyle: bg
        });
    }
    openLoginModal = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }

    closeLoginModal = () => {
        this.setState({
            isLoginModalOpen: false,
            username: "",
            password: "",
            loginError:undefined
        });
    }

    openSignUpModal = () => {
        this.setState({
            isSignupModalOpen: true
        });
    }

    closeSignUpModal = () => {
        this.setState({
            isSignupModalOpen: false,
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            signUpError:undefined
        });
    }

    loginHandler = () => {
        const { username, password } = this.state;
        const req = {
            username,
            password
        }
        axios({
            method: 'POST',
            url: `${API_URL}/login`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { user } = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
            this.setState({
                user: user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            })
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong",
                username: "",
                password: ""
            })
        });
    }

    cancelLoginHandler = () => {
        this.closeLoginModal();
    }

    signUpHandler = () => {
        const { username, password, firstName, lastName } = this.state;
        const req = {
            username,
            password,
            firstName,
            lastName
        }

        axios({
            method: 'POST',
            url: `${API_URL}/signup`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { user } = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
            this.setState({
                user: user,
                isLoggedIn: true,
                signUpError: undefined,
                isSignupModalOpen: false
            })
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoggedIn: false,
                signUpError: "Error Signing Up",
                username: "",
                password: "",
                firstName: "",
                lastName: ""
            })
        });
    }

    cancelSignUpHandler = () => {
        this.closeSignUpModal();
    }

    logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        this.setState({
            user: undefined,
            isLoggedIn: false,
            username: "",
            password: ""
        });
    }


    handleChange = (e, field) => {
        const val = e.target.value;
        this.setState({
            [field]: val,
            loginError: undefined,
            signUpError: undefined
        })
    }

    handleError = () => {
        this.setState({
            user: undefined,
            isLoggedIn: false,
            username: "",
            password: ""
        });
    }
    googleLoginHandler = (e) => {
        const names = e.profileObj.name.split(" ");
        const user = { firstName: names[0], lastName: names[1], username: e.profileObj.email, password: "SignedInViaGoogle" }
        this.setState({
            user: user,
            isLoggedIn: true,
            loginError: undefined,
            isLoginModalOpen: false
        })

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', true);
    }

    googleSignUpHandler = (e) => {
        const names = e.profileObj.name.split(" ");
        const req = { username: e.profileObj.email, password: "SignedInViaGoogle", firstName: names[0], lastName: names[1] }
        axios({
            method: 'POST',
            url: `${API_URL}/signup`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { user } = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
            this.setState({
                user,
                isLoggedIn: true,
                signUpError: undefined,
                isSignupModalOpen: false
            });
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoggedIn: false,
                signUpError: "Error Signing Up",
                username: "",
                password: "",
                firstName: "",
                lastName: ""
            })
        });

    }

    handleFacebookSignIn = (e) => {
        const user = { firstName: e.profile.first_name, lastName: e.profile.last_name, username: e.profile.id, password: "SignedInViaFB" }
        this.setState({
            user: user,
            isLoggedIn: true,
            loginError: undefined,
            isLoginModalOpen: false
        })

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', true);
    }

    handleFacebookSignUp=(e)=>{
        const req ={ firstName: e.profile.first_name, lastName: e.profile.last_name, username: e.profile.id, password: "SignedUpViaFB" }
        axios({
            method: 'POST',
            url: `${API_URL}/signup`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { user } = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
            this.setState({
                user,
                isLoggedIn: true,
                signUpError: undefined,
                isSignupModalOpen: false
            });
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoggedIn: false,
                signUpError: "Error Signing Up",
                username: "",
                password: "",
                firstName: "",
                lastName: ""
            })
        });

    }

    

    render() {
        const { backgroundStyle,
            isHome,
            isLoginModalOpen,
            isSignupModalOpen,
            isLoggedIn,
            user,
            username,
            password,
            firstName,
            lastName,
            loginError,
            signUpError } = this.state;
        return (
            <div>
                <div className="heading" style={{ "visibility": backgroundStyle === 'transparent' ? 'hidden' : 'visible' }}>
                    <div className="container ">
                        <div className="row">
                            <div className="col-2">
                                <div className="logoNavigation" onClick={() => { this.goHome("/home") }}>e!</div>
                            </div>
                            <div className="col-10 text-end align-self-center" style={{ visibility: 'visible', zIndex: "10" }} >
                                {
                                    isLoggedIn
                                        ?
                                        <>
                                            <span className="text-white m-4" style={{ padding: "6px 12px 6px 12px", border: "1px", fontSize: "17px" }}>{user.firstName}</span>
                                            <button className="btn btn-close-white" onClick={this.logout}>Logout</button>
                                        </>
                                        :
                                        <>
                                            <button className="login btn " onClick={this.openLoginModal}>Login</button>
                                            <button className="login create-acnt btn btn-outline-light" onClick={this.openSignUpModal}>Create an account</button>
                                        </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isLoginModalOpen} style={customStyle} className="container">
                    <div className='row'>
                        <div className='col-9'><h2 className='justify-content-center'>Login</h2></div>
                        <div onClick={this.closeLoginModal} className="col-3 btn btn-outline-danger float-end">X</div>
                    </div>
                    <form className="mt-4">
                        {
                            loginError
                                ?
                                <div className="alert alert-danger text-center my-3 fs-6" >{loginError}</div>

                                :
                                null
                        }
                        <div className='container'>
                            <div className='row'>
                                <div className='col-3'>Email</div>
                                <div className='col-6'>
                                    <input className="form-control mod-inp" type="text" placeholder="" required value={username} onChange={(e) => this.handleChange(e, 'username')} />
                                </div>
                            </div>
                            <div className='row mt-4'>
                                <div className='col-3'>Password</div>
                                <div className='col-6'>
                                    <input className="form-control mod-inp" type="password" placeholder="password" required value={password} onChange={(e) => this.handleChange(e, 'password')} />
                                </div>
                            </div>
                        </div>


                        <div className=" row mt-5">
                            <div type="button" className="mx-5 btn btn-primary col-3 " onClick={this.loginHandler} value="Login">Login</div>
                            <button className="btn btn-danger col-3 float-end " onClick={this.cancelLoginHandler}>Cancel</button>
                        </div>

                        <div className="mt-4 row justify-content-center">
                           <GoogleLogin
                                className='col-8 col-sm-5  me-sm-5 me-0'
                                clientId="117684904255-reu9nleepqmqpgp4b9jb2n3ug3bej164.apps.googleusercontent.com"
                                buttonText="Continue with google"
                                onSuccess={this.googleLoginHandler}
                                onFailure={this.googleLoginHandler}
                                cookiePolicy={'single_host_origin'}
                            />
                            <FacebookProvider appId="954141548521431">
                                <LoginButton
                                    scope="email"
                                    onCompleted={this.handleFacebookSignIn}
                                    onFailure={this.handleFacebookSignIn}
                                    className="col-8 col-sm-5 mt-4 mt-sm-0"
                                >
                                    Login via Facebook
                                </LoginButton>
                            </FacebookProvider>
                        </div>

                    </form>
                </Modal>
                <Modal isOpen={isSignupModalOpen} style={customStyle} className="container">
                    <div className='row'>
                        <div className='col-9'><h2 className='justify-content-center'>Sign Up</h2></div>
                        <div onClick={this.closeSignUpModal} className="col-3 btn btn-outline-danger float-end">X</div>
                    </div>
                    <form className="mt-4">
                        {
                            signUpError
                                ?
                                <div className="alert alert-danger text-center my-3 fs-6">{signUpError}</div>
                                :
                                null
                        }
                        <div className='container'>
                            <div className='row mt-2'>
                                <div className='col-5 col-sm-3'>First Name</div>
                                <div className='col-6'>
                                    <input className="mod-inp form-control" type="text" placeholder="First Name" required value={firstName} onChange={(e) => this.handleChange(e, 'firstName')} />
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-5 col-sm-3 pt-3'>Last Name</div>
                                <div className='col-6'>
                                    <input className="mod-inp form-control my-3" type="text" placeholder="Last Name" required value={lastName} onChange={(e) => this.handleChange(e, 'lastName')} />
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-5 col-sm-3'>Email</div>
                                <div className='col-6'>
                                    <input className="form-control mod-inp" type="text" placeholder="" required value={username} onChange={(e) => this.handleChange(e, 'username')} />
                                </div>
                            </div>
                            <div className='row mt-4'>
                                <div className='col-5 col-sm-3'>Password</div>
                                <div className='col-6'>
                                    <input className="form-control mod-inp" type="password" placeholder="password" required value={password} onChange={(e) => this.handleChange(e, 'password')} />
                                </div>
                            </div>

                        </div>


                        <div className=" row mt-4">
                            <div type="button" className="mx-5 btn btn-primary col-3 " onClick={this.signUpHandler} value="SignUp">SignUp</div>
                            <button className="btn btn-danger col-3 float-end " onClick={this.cancelSignUpHandler}>Cancel</button>
                        </div>
                        <div className="mt-4 row justify-content-center ">
                            
        
                            <GoogleLogin
                                className='col-8 col-sm-5  me-sm-5 me-0'
                                clientId="117684904255-reu9nleepqmqpgp4b9jb2n3ug3bej164.apps.googleusercontent.com"
                                buttonText="Continue with google"
                                onSuccess={this.googleSignUpHandler}
                                onFailure={this.googleSignUpHandler}
                                cookiePolicy={'single_host_origin'}
                            />
                            <FacebookProvider appId="954141548521431" >
                                <LoginButton
                                    scope="email"
                                    onCompleted={this.handleFacebookSignUp}
                                    onFailure={this.handleFacebookSignUp}
                                    className="col-8 col-sm-5 mt-4 mt-sm-0"
                                >
                                    Login via Facebook
                                </LoginButton>
                            </FacebookProvider>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Navigation);