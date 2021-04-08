import './home.scss';

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { getLoginUrl, REDIRECT_URL } from 'app/shared/util/url-utils';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  useEffect(() => {
    const redirectURL = localStorage.getItem(REDIRECT_URL);
    if (redirectURL) {
      localStorage.removeItem(REDIRECT_URL);
      location.href = `${location.origin}${redirectURL}`;
    }
  });

  const { account } = props;

  return (
    <Row>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
      <Col md="9">
        <h2>Welcome, Java Hipster!</h2>
        <p className="lead">This is your homepage</p>
        {account && account.login ? (
          <div>
            <Alert color="success">You are logged in as user {account.login}.</Alert>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              If you want to
              <span>&nbsp;</span>
              <a href={getLoginUrl()} className="alert-link">
                sign in
              </a>
              , you can try the default accounts:
              <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
              <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
            </Alert>
          </div>
        )}
        <p>If you have any question on JHipster or NHipster:</p>

        <ul>
          <li>
            <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">
              JHipster homepage
            </a>
          </li>
          <li>
            <a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
              JHipster on Stack Overflow
            </a>
          </li>
          <li>
            <a href="https://github.com/jhipster/generator-jhipster-nodejs/issues?state=open" target="_blank" rel="noopener noreferrer">
              NHipster bug tracker
            </a>
          </li>
          <li>
            <a href="https://gitter.im/jhipster/generator-jhipster-nodejs" target="_blank" rel="noopener noreferrer">
              NHipster public chat room
            </a>
          </li>
          <li>
            <a href="https://twitter.com/java_hipster" target="_blank" rel="noopener noreferrer">
              follow @java_hipster on Twitter
            </a>
          </li>
        </ul>

        <p>
          If you like NHipster, do not forget to give us a star on{' '}
          <a href="https://github.com/jhipster/generator-jhipster-nodejs" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          !
        </p>
      </Col>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
