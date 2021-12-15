import React, { Component } from 'react';
import Wallpaper from './Wallpaper';
import QuickSearches from './QuickSearches';


import axios from 'axios';

const API_URL=require('../constants').API_URL;

export default class Home extends Component {
    constructor(){
        super();
        this.state={
            location:[],
            mealTypes:[]
        }
    }

    componentDidMount(){
        axios.get(`${API_URL}/getAllLocations`)
        .then(resp=>{
            this.setState({
                location:resp.data.restaurantList
            })
        }).catch(err=>{
            console.log(err);
        }
        );


        axios.get(`${API_URL}/widget`)
        .then(resp=>{
            this.setState({
                mealTypes:resp.data.mealtypes
            })
        }).catch(err=>{
            console.log(err);
        }
        );
    }
    
    render() {
        const {location,mealTypes}=this.state;
        return (
            <div >
                <Wallpaper locationData={location} />
                <QuickSearches qsData={mealTypes}/>
            </div>
        )
    }
}
