import styled from 'styled-components';

export const Table = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid wheat;
`;

export const TableSide = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  display: flex;
  text-transform: uppercase;
  color: #e6dcdc;
  padding: 1rem;
  justify-content: space-between;

  div {
    padding: 0 2rem;
  }
`;

export const TableRow = styled.div`
  display: flex;
  color: #e6dcdc;
  padding: 0.25rem 1rem;
  justify-content: space-between;

  div {
    padding: 0 2rem;
  }
`;

export const Columns = styled.section`
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 8px;
  grid-column-gap: 40px;
  padding: 1rem;
  color: #e6dcdc;
`;

export const BidPrice = styled.div`
  color: green;
`;

export const AskPrice = styled.div`
  color: brown;
`;
