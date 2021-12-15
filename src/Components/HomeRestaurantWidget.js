import React, { Component } from 'react'
import '../Styles/Home.css';

export default class HomeRestaurantWidget extends Component {
    
    render() {
        const {imgPath,meal}=this.props;
        return (
            <React.Fragment>
                <div className="row" >
                    {console.log(imgPath)}   
                   <div className="col-5 me-3"><img src={imgPath} className="category-image"  alt="No image"/></div>
                    <div className="col-4">
                        <h4 className="category-name">{meal}</h4>
                        <p className="category-description">Start your day with 
                         exclusive {meal} options</p>
                    </div>
                </div>
             </React.Fragment>
        )
    }
}
