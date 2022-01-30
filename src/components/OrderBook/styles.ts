import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  color: wheat;
`;
export const Button = styled.button`
  padding: 0.3rem 0.8rem;
  margin-top: 1rem;
  border-radius: 4px;
  border: none;
  color: white;
  background: cadetblue;
  font-size: 1.2rem;
  text-align: center;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const ReconnectMessage = styled.p`
  color: wheat;
`;

export const Footer = styled.div`
  text-align: center;
`;
