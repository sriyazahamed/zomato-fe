import React, { Component } from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
const API_URL = require('../constants').API_URL;

class Filter extends Component {
    constructor() {
        super();
        this.state = {
            mealName: '',
            mealType: 0,
            locations: [],
            selectedLocation: '',
            pageNo: 1,
            restaurantList: [],
            totalResults: 0,
            noOfPages: 0,
            cuisines: [],
            lCost: undefined,
            hCost: undefined,
            sortOrder: 1
        }
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        const { mealName, mealType } = params;
        this.setState({
            mealName,
            mealType
        })
        const cityName = localStorage.getItem('city_name');

        axios.get(`${API_URL}/getAllLocations`)
            .then(resp => {
                const locations = resp.data.restaurantList;
                const selectedCity = cityName;
                this.setState({
                    locations: locations,
                    selectedLocation: cityName,
                });
                setTimeout(() => {
                    this.filterRestaurants();
                }, 0);
            })
            .catch(err => {
                console.log(err);
            });
    }

    filterRestaurants = () => {
        const {
            mealType,
            selectedLocation,
            cuisines,
            hCost,
            lCost,
            sortOrder,
            pageNo
        } = this.state;

        const req = {
            mealtype: mealType,
            location: selectedLocation,
            page: pageNo
        }

        if (cuisines.length > 0) {
            req.cuisine = cuisines;
        }

        if (hCost !== undefined && lCost !== undefined) {
            req.hcost = hCost;
            req.lcost = lCost;
        }

        if (sortOrder !== undefined) {
            req.sort = sortOrder;
        }

        axios({
            method: 'POST',
            url: `${API_URL}/filterRestaurants`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }

        ).then(result => {
            const { pageSize, page, totalResultCount, filteredRestaurantList } = result.data;

            this.setState({
                pageNo: page,
                restaurantList: filteredRestaurantList,
                totalResults: totalResultCount,
                noOfPages: pageSize,
            })
        }).catch(err => {
            console.log(err);
        });
    }

    getPages = () => {
        const { noOfPages, totalResults, restaurantList } = this.state;
        let pages = [];
        for (let i = 0; i < noOfPages; i++) {
            pages.push(
                <span key={i} className="pages btn btn-outline-dark mx-1" onClick={() => this.handlePageChange(i + 1)}>{i + 1}</span>
            )
        }
        return pages;
    }

    handlePageChange = (page) => {
        const { noOfPages } = this.state;
        if (page < 1) return;
        if (page > noOfPages) return;
        this.setState({
            pageNo: page
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleLocationChange = (e) => {
        const location = e.target.value;
        debugger;
        this.setState({
            selectedLocation: location
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCuisineChange = (e, cuisine) => {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cuisine);
        if (index < 0 && e.target.checked) {
            cuisines.push(cuisine);
        } else {
            cuisines.splice(index, 1);
        }
        this.setState({
            cuisines
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCostChange = (e, lCost, hCost) => {
        this.setState({
            lCost: lCost,
            hCost: hCost
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleSortChange = (e, sortOrder) => {
        this.setState({
            sortOrder: sortOrder
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    goToRestaurant = (rest) => {
        const url = `/details?name=${rest.name}`;
        this.props.history.push(url);
    }

    render() {
        const { mealName, selectedLocation, locations, pageNo, restaurantList } = this.state;
        let currentPage = pageNo;
        return (
            <div>
                <div className="container topic my-4">
                    <div className="row">
                        <div className="col">{mealName} Places in {selectedLocation}</div>
                    </div>
                </div>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-5 ms-4 ms-sm-0 filter-section justify-content-center">
                            <div className="filter-cont filter-sort-head my-3 mt-1">Filters</div>
                            <div className="filter-cont filter-subhead my-3">Select Location</div>
                            <div className="my-3">
                                <select className="filter-cont" name="" id="select-location-options" onChange={(e) => this.handleLocationChange(e)}>
                                    <option selected disabled>Select Location</option>
                                    {
                                        locations.map(
                                            (result) => {
                                                return (
                                                    <option value={result} >{result}</option>
                                                )
                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="filter-cont filter-subhead my-3 mt-4">Cuisine</div>
                            <div className="filter-cont Cuisine-contents">
                                <div className="filter-cont my-3">
                                    <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'North Indian')} />
                                    <label className="ms-1">
                                        North Indian
                                    </label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'South Indian')} />
                                    <label className="ms-1">
                                        South Indian
                                    </label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Chinese')} />
                                    <label className="ms-1">
                                        Chinese
                                    </label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Fast Food')} />
                                    <label className="ms-1">
                                        Fast Food
                                    </label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Street Food')} />
                                    <label className="ms-1">
                                        Street Food
                                    </label>
                                </div>
                            </div>

                            <div className="filter-cont filter-subhead my-3 mt-4">Cost For Two</div>
                            <div className="filter-cont cost-for-two-option ">
                                <div className="filter-cont my-3">
                                    <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 0, 500)} />
                                    <label className="ms-1">Less than &#8377; 500</label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 500, 1000)} />
                                    <label className="ms-1">&#8377; 500 to &#8377; 1000</label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 1000, 1500)} />
                                    <label className="ms-1">&#8377; 1000 to &#8377; 1500</label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 1500, 2000)} />
                                    <label className="ms-1">&#8377; 1500 to &#8377; 2000</label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 2000, 1000000)} />
                                    <label className="ms-1">&#8377; 2000+</label>
                                </div>
                            </div>

                            <div className="filter-cont filter-sort-head my-3 mt-4">Sort</div>
                            <div className="filter-cont sort-option mb-1">
                                <div className="filter-cont my-3">
                                    <input type="radio" name="sort" onChange={(e) => this.handleSortChange(e, 1)} />
                                    <label className="ms-1">Price low to high</label>
                                </div>
                                <div className="filter-cont my-3">
                                    <input type="radio" name="sort" onChange={(e) => this.handleSortChange(e, -1)} />
                                    <label className="ms-1">Price high to low</label>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-7  mx-lg-5 my-lg-0 my-5 result-section ">
                            {
                                restaurantList.length > 0
                                    ?
                                    restaurantList.map((item) => {
                                        return (
                                            <div className="container result mb-4" style={{ cursor: "pointer" }} onClick={() => this.goToRestaurant(item)}>
                                                <div className="specific-result row mt-1 ms-md-0 ms-3 ms-sm-2">
                                                    <div className="col-md-3 col-12">
                                                        <img className='filterImg' src={item.thumb} alt="" />
                                                    </div>
                                                    <div className="res-right col-12 col-md-9">
                                                        <div className=" row restaurant-name mt-2 mt-lg-0">
                                                            {item.name}
                                                        </div>
                                                        <div className="place row  my-2">
                                                            {item.locality}
                                                        </div>
                                                        <div className=" adrs row  ">
                                                            {item.address}
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr style={{ border: "solid 2px #dedfe5" }} />
                                                <div className='container'>
                                                    <div className='row'>
                                                        <div className="cuisine-cost col-5">CUISINE</div>
                                                        <div className="cuisine-cost col-1">:</div>
                                                        <div className="cuisine-cost-result col-1">
                                                            {
                                                                item.Cuisine.map((cuisineType) => {
                                                                    return (
                                                                        <span>{cuisineType.name},</span>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="cuisine-cost col-5">COST FOR TWO</div>
                                                        <div className="cuisine-cost col-1">:</div>
                                                        <div className="cuisine-cost-result col-1">{item.cost}</div>
                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    })
                                    :
                                    <div className="text-danger text-center my-5">No Results Found</div>
                            }






                            <div className="row justify-content-center my-5">
                                {
                                    restaurantList.length > 0
                                        ?
                                        <div style={{ width: "fit-content;" }}>
                                            <span className="pages btn btn-outline-dark mx-1" onClick={() => this.handlePageChange(--currentPage)}>&#60;</span>
                                            {
                                                this.getPages()
                                            }
                                            <span className="pages btn btn-outline-dark mx-1" onClick={() => this.handlePageChange(++currentPage)}>&#62;</span>
                                        </div>
                                        :
                                        null
                                }


                            </div>


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Filter);