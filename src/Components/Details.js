import React, { Component } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../Styles/details.css';
import queryString from 'query-string';
import Modal from 'react-modal';
import axios from 'axios';
const API_URL = require('../constants').API_URL;

const menuStyle = {
    content: {
        marginTop: '150px',
        maxWidth: '800px',
        background: 'white',
        zIndex: '10000000',
        padding: '12px',
        border: 'groove'
    }
}

Modal.setAppElement('#root')

export default class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: null,
            menu: null,
            isMenuOpen: false,
            totalPrice: 0
        }
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        const { name } = params;
        console.log(name);
        axios.get(`${API_URL}/getRestaurantByName/${name}`)
            .then(resp => {
                this.setState({
                    restaurant: resp.data.restaurant
                })
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(`${API_URL}/getMenuForRestaurant/${name}`)
            .then(resp => {
                this.setState({
                    menu: resp.data.menu
                })
            })
            .catch(err => {
                console.log(err);
            });

    }
    openMenu = () => {
        this.setState({
            isMenuOpen: true
        })
    }

    closeMenu = () => {
        this.setState({
            isMenuOpen: false
        })
    }

    addItemHandler = (item) => {
        const { totalPrice } = this.state;
        this.setState({
            totalPrice: totalPrice + item.itemPrice
        })
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    buildForm = (details) => {
        const { action, params } = details;
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        })
        return form;
    }

    postTheInformationToPaytm = (info) => {

        const form = this.buildForm(info);


        document.body.appendChild(form);


        form.submit();


        form.remove();

    }

    getChecksum = (data) => {
        return fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(resp => {
                return resp.json();
            })
            .catch(err => {
                console.log(err);
            });
    }

    paymentHandler = () => {
        const data = {
            amount: this.state.totalPrice,
            email: 'sriyazahamed29@gmail.com',
            mobileNo: '9999999999'
        }

        this.getChecksum(data)
            .then(result => {
                let information = {
                    action: 'https://securegw-stage.paytm.in/order/process',
                    params: result
                }
                this.postTheInformationToPaytm(information);
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {

        const { restaurant, menu, isMenuOpen, totalPrice } = this.state;

        return (
            <div>


                <div className=' container details mt-4 mt-md-5 mb-5'>
                    {
                        restaurant
                            ?
                            <>
                                <Carousel showThumbs={false}>
                                    <div>
                                        <img className='images' src={require('../Assets/breakfastDetails.png').default} />
                                    </div>
                                    <div>
                                        <img className='images' src={require('../Assets/lunchDetails.png').default} />
                                    </div>
                                    <div>
                                        <img className='images' src={require('../Assets/dinnerDetails.png').default} />
                                    </div>
                                </Carousel>

                                <div className='restName mb-5  mb-md-3'>
                                    <div className='restName'>{restaurant[0].name}</div>
                                    <div className='float-end mt-4 mt-md-0'><div className='orderBtn btn btn-danger ' onClick={this.openMenu}>Place Online Order</div></div>
                                </div>
                                <div className='tabs pt-5 pt-sm-0' >
                                    <Tabs>
                                        <TabList>
                                            <Tab ><div className="tabName ">Overview</div></Tab>
                                            <Tab ><div className="tabName">Contact</div></Tab>
                                        </TabList>

                                        <TabPanel>
                                            <div className='abtTitle mt-5'>About this place</div>
                                            <div className='abtSubTitle mt-3'>Cuisine</div>

                                            <div className='abtElem mt-1'>{
                                                restaurant[0].Cuisine.map((item, index) => {
                                                    return <span key={index}>{item.name},</span>
                                                })
                                            }</div>
                                            <div className='abtSubTitle mt-3'>Average Cost</div>
                                            <div className='abtElem mt-1'>₹{restaurant[0].cost} for two people (approx.)</div>
                                        </TabPanel>
                                        <TabPanel>
                                            <div className='phNoTitle mt-5'>Phone Number</div>
                                            <div className="phNo mt-1">{restaurant[0].contact_number} </div>
                                            <div className='abtSubTitle mt-5'>{restaurant[0].name}</div>
                                            <div className='address mt-1'>{restaurant[0].address}</div>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </>
                            :
                            <div>Loading..</div>

                    }

                </div>
                <Modal isOpen={isMenuOpen} style={menuStyle} className="container">
                    <h2>
                        Menu
                        <button onClick={this.closeMenu} className="btn btn-outline-danger float-end">X</button>
                    </h2>
                    {restaurant ? <h5>{restaurant[0].name}</h5> : null}
                    <ul className="menu">
                        {
                            menu
                                ?
                                menu.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <div className="row no-gutters menuItem my-3">
                                                <div className="col-10">
                                                    <div className="row no-gutters">
                                                        <div className="cuisines col-sm-10 col-8 ">{item.itemName}</div>
                                                        <div className="cuisines col-sm-2 col-4" >&#8377; {item.itemPrice}</div>
                                                    </div>
                                                    {
                                                        item.isVeg
                                                            ?
                                                            <div className="text-success fs-6">Veg</div>
                                                            :
                                                            <div className="text-danger fs-6">Non-Veg</div>
                                                    }
                                                    <div className="cuisines">{item.itemDescription}</div>
                                                </div>
                                                <div className="col-2 ">
                                                    <button className="btn btn-light addButton" onClick={() => this.addItemHandler(item)}>Add</button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                                :
                                null
                        }
                    </ul>
                    <div className="mt-3 restName fs-4">
                        Subtotal <span className="m-4">&#8377; {totalPrice}</span>
                        <button className="btn btn-danger float-end" onClick={() => this.paymentHandler()}>Pay Now</button>
                    </div>
                </Modal>

            </div>
        )
    }
}
