import React, { Component } from 'react';
import '../Styles/Home.css';
import HomeRestaurantWidget from './HomeRestaurantWidget';
import { withRouter } from 'react-router-dom';

class QuickSearches extends Component {
    goToFilterPage=(index)=>{
        this.props.history.push(`\Filter?mealName=${this.props.qsData[index].name}&mealType=${this.props.qsData[index].meal_type}`);
    }

    render() {
        const {qsData}=this.props;
        return (
            <React.Fragment>
                <div className="bottom container mt-5 ">
                    <div className="row ">
                        <div className="quick">Quick Searches</div>
                    </div>

                    <div className="row my-4">
                        <div className="discov">Discover restaurants by type of meal</div>
                    </div>

                    <div className="row ms-1" >
                        {
                            qsData.map(
                                (item,index)=>{
                                    return(
                                        <div className="box col-12 col-xl-3 me-4 mb-5 category" style={{cursor:"pointer"}} onClick={()=>{this.goToFilterPage(index)}}><HomeRestaurantWidget key={item} imgPath={item.image} meal={item.name} /></div>
                                    );  
                                }
                            )
                        }
                    </div>

                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(QuickSearches);
