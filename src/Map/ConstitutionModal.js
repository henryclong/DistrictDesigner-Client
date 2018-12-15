import React, { Component } from 'react';

class ConstitutionModal extends Component {

  isValid = (text) => {
    return !(text === 'NA');
  }

  processConstitutionText = () => {
    const constitution = this.props.constitution;
    return (
      <div>
        <h1>Redistricting Guidelines</h1>
        <div className="scrollable inset">
          <h2>Summary:</h2>
          <ul>
            <li><p>District populations must be within <b>{constitution.CONSTITUTION_REQUIREMENTS.equalPopulation * 100}%</b> of each other</p></li>
            <li><p>It is <b>{constitution.CONSTITUTION_REQUIREMENTS['countyLine']}</b> that districts respect county boundaries</p></li>
            <li><p>It is <b>{constitution.CONSTITUTION_REQUIREMENTS['contiguous']}</b> that districts are contiguous</p></li>
            <li><p>It is <b>{constitution.CONSTITUTION_REQUIREMENTS['preserveCommunitiesIncumbants']}</b> that districts preserve communities and incumbents</p></li>
          </ul>
          {constitution['CONSTITUTION_TEXT'].map((textEntry) => (
            <div>
              <hr/>
              <h2>{textEntry['document']+', '+textEntry['shortName']}</h2>
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
        {this.processConstitutionText()}
      </div>
    );
  }
}

export default ConstitutionModal;
