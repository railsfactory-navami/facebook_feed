import React, { Component } from 'react';

class Story extends React.Component {
	
	  render() {
		return (
		  <div>
        <div className="fb-header">
				<div className="coupon"></div>
				  <div className="container">
				    <div className="chip">
						{this.props.items.map(function(object, i){
               return <div className={"row"} key={i}> 
                          {[ 
                             <b className="fosfo" key={i}> {object.story}</b> 
                          ]}
                      </div>; 
             })}
			</div></div></div></div>
		);
	  }
	}


export default ShowList;