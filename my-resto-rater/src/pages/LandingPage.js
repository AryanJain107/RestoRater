import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
`;

const OptionsContainer = styled.div`
  margin-top: 20px;
`;

const OptionLink = styled(Link)`
  background-color: #007BFF;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

function LandingPage() {
  return (
    <LandingPageContainer>
      <Title>RestoRater</Title>
      <OptionsContainer>
        <OptionLink to="/login">Login</OptionLink>
        <OptionLink to="/signup">Sign Up</OptionLink>
      </OptionsContainer>
    </LandingPageContainer>
  );
}

export default LandingPage;
