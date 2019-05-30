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
    console.log("test1")
    window.fbAsyncInit = () => {
      window.FB.init({
        appId      : '1747983188680794',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.3'
      });
   
      var token = "EAAY1yA0I4FoBALHIWaHZCrMatcPucaitGWBBzZAhoNxKmCAkWZBnx25Un6sOxRiiA5HtuZA47mB5MIIqbQxpaeYINLXVJeW3uEnMPbZBfZAxZCznhydLN3mQqXQFX8Ms6cfBV0lYMKoOUVQ5KXfLafWmFx6Rx1i8ZAPYqbqmZBQQ18mAmF6f3A7GJ5OMS4hWmWOx4xND2mjUURwZDZD";
      window.FB.api("/1389776634498901/feed?fields= link,name,message,story,full_picture,from,source", response  =>  {
          console.log(response)
          console.log("testss")
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
    return (
      <div>
        <div className="fb-header-base">
        </div>
        <div className="fb-header">
          <div id="img1" className="fb-header"><img src="facebook1.png" className = "logo"/></div>
        </div>
        <div className="center">
        <ShowList items={this.state.feeds}/>
      </div> 
      </div> 
    );
  }
}


export default App;
