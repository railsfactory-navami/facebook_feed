import React from 'react';
import './app.css';
import ShowList from './ShowList';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      feeds: []
    };
  }


  componentDidMount() {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId      : '1747983188680794',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.3'
      });
   
      var token = "EAAY1yA0I4FoBAMx7wUiqxKUd8ZBZAnQ0slrJlqVnYZAaZAj9UuJPLEnIWpJpoyJs23eT84P1qzempDrrpmHY12t341DwJV5wC0UsAAL0fok5x4FIHqXyjHduHpi8mmvSX6nnHlq6UDZAA0fl7uaMVrGTAcbZCnZCd5pa0Crg8eOZAcWnXQzcCCPeupKVXhNFNoBPAsS92ilPeQZDZD";
      window.FB.api("/1389776634498901/feed?fields= link,name,message,story,full_picture,from,source", response  =>  {
          if (response && !response.error) {
            this.setState({
              feeds: response["data"]
            });
          }
        }, {access_token: token}
      );
    };
  }

  render(){
    const {feeds} = this.state
    return (
      <div>
        <div className="fb-header-base">
        </div>
        <div className="fb-header">
          <div id="img1" className="fb-header"><img src="facebook1.png" className = "logo"/></div>
        </div>
        <div className="center">
        <ShowList items={feeds}/>
      </div> 
      </div> 
    );
  }
}


export default App;
