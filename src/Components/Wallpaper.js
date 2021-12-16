import React, { Component } from 'react';
import '../Styles/Home.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
const API_URL = require('../constants').API_URL;
class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: '',
            suggestions: [],
            locationSelected: false

        }
    }
    
    getRestaurantsforLocation = (e) => {
        const location = e.target.value;
        localStorage.setItem('city_name', location);
        this.setState({
            locationSelected: true
        });
        axios.get(`${API_URL}/getAllRestaurantsByLocation/${location}`).
            then(
                resp => {
                    this.setState(
                        {
                            restaurants: resp.data.restaurantList
                        }
                    )
                }
            ).catch(
                err => {
                    console.log(err)
                }
            );


    }

    onSearchTextChange = (e) => {
        const searchText = e.target.value;
        const { locationSelected } = this.state;
        if (!locationSelected) {
            axios.get(`${API_URL}/getAllRestaurants`).
                then(
                    resp => {
                        this.setState(
                            {
                                restaurants: resp.data.restaurantList
                            }
                        )
                    }
                ).catch(
                    err => {
                        console.log(err)
                    }
                );
        }
        const { restaurants } = this.state;
        let suggestions = [];
        if (searchText.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({
            suggestions: suggestions || []
        });
    }

    renderSuggestions = () => {

        const { suggestions } = this.state;

        if (suggestions.length === 0) {
            return null
        }
        return (
            <ul className="suggestionBox container-fluid row" style={{zIndex:"1000"}}>
                {
                    suggestions.map(
                        (item, index) => {
                            return (
                                <li className="suggestionItem" onClick={() => this.goToRestaurant(item)} >
                                    <div className="suggestionImage col-1">
                                        <img src={item.thumb} alt="not found" />
                                    </div>
                                    <div className="suggestionText col-7 ps-2 ms-4 me-2">
                                        <div className="suggestionTextName row">
                                            {item.name}
                                        </div>
                                        <div className="suggestionTextLocality row">
                                            {item.locality}
                                        </div>
                                    </div>
                                    <div className="orderButton col-4 text-danger ">
                                        Order Now
                                    </div>
                                </li>
                            )

                        }
                    )
                }
            </ul>
        )

    }
    goToRestaurant = (item) => {
        this.props.history.push(`/details?name=${item.name}`);
    }
    startDisplaySuggestions = (e) => {
        const searchText = e.target.value;
        if (searchText.length === 0) {
            const { locationSelected } = this.state;
            if (!locationSelected) {
                axios.get(`${API_URL}/getAllRestaurants`).
                    then(
                        resp => {
                            this.setState(
                                {
                                    restaurants: resp.data.restaurantList
                                }
                            )
                        }
                    ).catch(
                        err => {
                            console.log(err)
                        }
                    );
            }
            const { restaurants } = this.state;
            this.setState({
                suggestions: restaurants || []
            });
        }

    }

    stopDisplaySuggestions=(e)=>{
        const searchText = e.target.value;
        if (searchText.length === 0){
            this.setState({
                suggestions:  []
            });
        }
        
    }


    render() {
        const { locationData } = this.props;
        return (
            <div>
                <img src={require('../Assets/homeMain.png').default} className="home-img wallpaper img-fluid" alt="No img" />
                <div className=" home-img  img-fluid gradient "></div>
                <div className="top-portion container-fluid">
                    <div className="row justify-content-center" style={{marginTop:"30px"}}>
                        <div className="mainLogo mt-lg-0 mt-5">e!</div>
                    </div>
                    <br />
                    <div className="row justify-content-center">
                        <div className="find-head col-auto">Find the best restaurants, cafés, and bars</div>
                    </div>
                    <br /><br />
                    <div className="row justify-content-center">
                        <div className="search-city col-6 mb-3 mb-sm-0" style={{ maxWidth: "205.81px" }}>
                            <select className="search-opt form-select " onChange={this.getRestaurantsforLocation} >
                                <option selected disabled>Select City</option>
                                {
                                    locationData.map(
                                        (item, index) => {
                                            return (

                                                <option key={index} value={item} >{item}</option>
                                            );
                                        }
                                    )
                                }

                            </select>
                        </div>
                        <div className="col-7  col-sm-6" style={{ maxWidth: "321.36px", minWidth: "321.36px" }}>
                            <div className="input-group">
                                <span style={{ backgroundColor: "white", height: "50px", width: "47px", borderRadius: ".25rem 0px 0px .25rem" }}>
                                    <i id="search-icon" className="bi bi-search" style={{ display: "inline-block", marginLeft: "15px", marginTop: "15px" }}></i>
                                </span>
                                <input className=" form-control search-opt" id="select-restaurant" type="text" placeholder="Search for restaurants" onChange={this.onSearchTextChange} />
                                {
                                    this.renderSuggestions()
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Wallpaper);