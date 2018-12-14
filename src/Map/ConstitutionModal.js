import React, { Component } from 'react';
import constitutionObject from './constitutionObject.js';

class ConstitutionModal extends Component {

  isValid = (text) => {
    return !(text === 'NA');
  }

  processConstitutionText = (constitution) => {

    return (
      <div>
        <h1>Redistricting Guidelines</h1>
        <div className="scrollable inset">
          {constitution['text'].map((textEntry) => (
            <div>
              <hr/>
              <h2>{textEntry['document']+', '+textEntry['state_postal']}</h2>
              <h3>
                {(this.isValid(textEntry['article']))?(' Article ' + textEntry['article']):''}
                {(this.isValid(textEntry['section']))?(' Section ' + textEntry['section']):''}
              </h3>
              <p>
                {(this.isValid(textEntry['body']))?(textEntry['body']):''}
              </p>
              <p>
                {(this.isValid(textEntry['notes']))?(textEntry['notes']):''}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.processConstitutionText(constitutionObject)}
      </div>
    );
  }
}

export default ConstitutionModal;
