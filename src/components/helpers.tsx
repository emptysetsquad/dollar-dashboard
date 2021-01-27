import styled from 'styled-components'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ w }) => w};
  height: ${({ h }) => h};
  padding: ${({ p }) => p};
  margin: ${({ m }) => m};
  align-items: ${({ ai }) => ai};
  justify-content: ${({ jc }) => jc};
  flex-grow: ${({ fg }) => fg};
`
export const Row = styled.div`
  width: ${({ w }) => (w ? w : '100%')};
  height: ${({ h }) => h};
  display: flex;
  flex-direction: row;
  padding: ${({ p }) => p};
  margin: ${({ m }) => m};
  justify-content: ${({ jc }) => jc};
  align-items: ${({ ai }) => ai};
  flex-grow: ${({ fg }) => fg};
`
