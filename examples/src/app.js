require('./app.less');

import React, { Component } from 'react';
import { render } from 'react-dom';
import Badges from './Badges/Badges';
import Examples from './Examples';
import Footer from './Footer/Footer';
import ForkMeOnGitHub from './ForkMeOnGitHub/ForkMeOnGitHub';
import TrackLinks from './TrackLinks/TrackLinks';

class App extends Component {
  render() {
    return (
      <TrackLinks>
        <h1>react-autosuggest</h1>
        <Badges />
        <Examples />
        <Footer />
        <ForkMeOnGitHub user="moroshko" repo="react-autosuggest" />
      </TrackLinks>
    );
  }
}

render(<App />, document.getElementById('app'));
