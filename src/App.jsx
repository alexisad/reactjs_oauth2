import logo from './logo.svg';
import React from 'react';
import './App.css';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const
  keyId = "***",
  keySecret = "***",
  apikey = "***";


/**
 * Gets an access token for a given access key and secret.
 * @param {*} access_key 
 * @param {*} access_secret 
 */
 export const getToken = (access_key, access_secret) => {
  let url = "https://account.api.here.com/oauth2/token";
  let key = encodeURI(access_key);
  let secret = encodeURI(access_secret);
  let nonce = btoa(Math.random().toString(36)).substring(2, 13);
  let timestamp = Math.floor(Date.now()/1000);
  let normalizedUrl = encodeURIComponent(url);
  let signing_method = encodeURI("HMAC-SHA256");
  let sig_string = "oauth_consumer_key="
  .concat(key)
  .concat("&oauth_nonce=")
  .concat(nonce)
  .concat("&oauth_signature_method=")
  .concat(signing_method)
  .concat("&oauth_timestamp=")
  .concat(timestamp)
  .concat("&").concat("oauth_version=1.0");

  let normalised_string = "POST&".concat(normalizedUrl).concat("&").concat(encodeURIComponent(sig_string));
  let signingKey = secret.concat("&");

  let digest = CryptoJS.HmacSHA256(normalised_string, signingKey);
  let signature = CryptoJS.enc.Base64.stringify(digest);

  let auth = 'OAuth oauth_consumer_key="'
  .concat(key)
  .concat('",oauth_signature_method="')
  .concat(signing_method)
  .concat('",oauth_signature="')
  .concat(encodeURIComponent(signature))
  .concat('",oauth_timestamp="')
  .concat(timestamp)
  .concat('",oauth_nonce="')
  .concat(nonce)
  .concat('",oauth_version="1.0"')

  return axios({
      method: 'post',
      url: url,
      data: JSON.stringify({grantType: "client_credentials"}),
      headers: {
          'Content-Type': "application/json",
          'Authorization': auth
      }
  });
}

/**
 * Send request for a given token and url.
 * @param {*} token 
 * @param {*} url
 */
export const sendReqOauth2 = (token, url) => { 
  return axios({
    method: 'get',
    url: url,
    headers: {
        'Authorization': 'Bearer ' + token
    }
  });
};


/**
 * Send request for a given apikey and url.
 * @param {*} apikey 
 * @param {*} url
 */
 export const sendReqApiKey = (apikey, url) => { 
  return axios({
    method: 'get',
    url: url + "&apikey=" + apikey
  });
};




export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      label: "sending request...",
      labelAcV7: "sending request..."
    };
  }

  componentDidMount() {
    this.requesting();
  }

  requesting = async () => {
    /* comment out if you need to use OAuth2 
    let token = await getToken(keyId, keySecret);
    console.log("token:", token.data.accessToken);
    let r = await sendReqOauth2(token.data.accessToken, "https://geocode.search.hereapi.com/v1/geocode?qq=postalCode=6728&in="+ encodeURI("countryCode:AUS"));
    */
    let r = await sendReqApiKey(apikey, "https://geocode.search.hereapi.com/v1/geocode?qq=postalCode=6728&in="+ encodeURI("countryCode:AUS"));
    console.log("r:", r);
    this.setState({
      label: r.data.items[0].address.label
    });
    /* comment out if you need to use OAuth2 
    let r2 = await sendReqOauth2(token.data.accessToken, "https://search.hereapi.com/v1/autocomplete?q=560&types=postalCode&in="+ encodeURI("countryCode:AUS"));
    */
    let r2 = await sendReqApiKey(apikey, "https://search.hereapi.com/v1/autocomplete?q=560&types=postalCode&in="+ encodeURI("countryCode:AUS"));
    this.setState({
      labelAcV7: r2.data.items[0].address.label
    });

  }
    

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>Geocode: {this.state.label}</div>
          <div>Autocomplete: {this.state.labelAcV7}</div>
        </header>
      </div>
    );
  }
}

