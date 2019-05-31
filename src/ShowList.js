import React, { Component } from 'react';
import Story from './Story';
import Links from './Links'
import VideoTag from './VideoTag'

class ShowList extends React.Component {
  showItems(items){
    if (items) {
     return items.map((item, key) => {
        return(
          <div>
          {item.story && <Story story={item}/>}
          {item.link && !item.source && <Links link={item}/>}
          {item.source && <VideoTag video={item}/>}
          </div>
        )
      })
    }
  }

	  render() {
      const { items } = this.props
		return (
		  <div>
					{items && this.showItems(items)}
			</div>
		);
	  }
	}


export default ShowList;

