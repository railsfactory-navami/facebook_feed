import React, { Component } from 'react';

class VideoTag extends React.Component {
	
	  render() {
      const {video} = this.props
		return (
		  <div>
				<div className="coupon">
						<div className="container">
							<div className="chip">
								<img src="img_avatar.png" alt="Person" width="96" height="96"/>
								{video.from && video.from.name}
							</div>
						</div>
						<div className="container" >
            <video
							src={video.source}
							controls
							autplay="true"
							playsinline
							muted
							crossorigin
							width = "570"
						/>
						<p></p>
						</div>
						<div className="container">
						</div>
					</div>
      </div>
		);
	  }
	}


export default VideoTag;