import React, { Component } from 'react';

class ShowList extends React.Component {
	
	  render() {
			let data;
			let user_name;
		return (
		  <div>
					{this.props.items.map(function(object, i){
						if (object.message) {
							data = <div className={"row"} key={i}> 
											<b key={i}> {object.message}</b> 
										</div>;
						}
						if (object.story) {
							data = <div className={"row"} key={i}>
											<b key={i}> {object.story}</b> 
										</div>; 
						}
						if (object.from) {
							user_name = <b key={i}> {object.from.name}</b> 
						}
						if(object.full_picture){
							data = <div className={"row"} key={i}>
											<img src={object.full_picture} id="picture_post"/>
										</div>; 
						}
						if (object.source) {
							data = <div className={"video_sec"} key={i}><video
							src={object.source}
							controls
							autplay="true"
							playsinline
							muted
							crossorigin
							width = "570"
						/></div>;
						}
				
						return <div className="coupon">
						<div className="container">
							<div className="chip">
								<img src="img_avatar.png" alt="Person" width="96" height="96"/>
								{user_name}
							</div>
						</div>
						<div className="container" >
							{data}
						<p></p>
						</div>
						<div className="container">
						</div>
					</div>;
					
					})}
				</div>
		);
	  }
	}


export default ShowList;

