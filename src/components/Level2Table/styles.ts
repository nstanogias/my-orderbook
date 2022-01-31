import styled, { css } from 'styled-components';
import { devices } from '../../responsive/responsive';

const sharedRowStyle = css`
  display: flex;
  color: #e6dcdc;
  padding: 0.25rem 1rem;
  justify-content: space-between;

  div {
    padding: 0 2rem;

    @media ${devices.tablet} {
      padding: 0 0.75rem;
    }

    @media ${devices.mobile} {
      justify-content: space-around;
      padding: 0 0.5rem;
    }
  }
`;

export const Table = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid wheat;

  @media ${devices.mobile} {
    flex-direction: column-reverse;
  }
`;

export const TableSide = styled.div<{ isAsk?: boolean }>`
  display: flex;
  flex-direction: column;

  @media ${devices.mobile} {
    flex-direction: ${(props) => (props.isAsk ? 'column-reverse' : 'column')};
  }
`;

export const TableHeader = styled.div<{ hideInMobile?: boolean }>`
  display: flex;
  text-transform: uppercase;
  color: #e6dcdc;
  padding: 1rem;
  justify-content: space-between;

  div {
    padding: 0 2rem;

    @media ${devices.tablet} {
      padding: 0 0.75rem;
    }

    @media ${devices.mobile} {
      justify-content: space-around;
      padding: 0 0.5rem;
    }
  }

  @media ${devices.mobile} {
    display: ${(props) => (props.hideInMobile ? 'none' : 'flex')};
  }
`;

export const BidRow = styled.div`
  ${sharedRowStyle}
  @media ${devices.mobile} {
    flex-direction: row-reverse;
  }
`;

export const AskRow = styled.div`
  ${sharedRowStyle}
`;

export const SpreadRow = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
  color: darkcyan;
`;

export const BidPrice = styled.div`
  color: green;
`;

export const AskPrice = styled.div`
  color: brown;
`;
