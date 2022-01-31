# Crypto orderbook

## Description

Display a realtime [level 2 table](https://tradingsim.com/blog/level-ii/) (orderbook) to the user.

User is able to switch between bitcoin/usd and eth/usd market data by clicking on a button.

## Implementation

The implementation is done with CRA project using typescript template.

A worker thread is used to perform the heavy job of fetching the data. In that way, the UI stays responsive and the main thread is not throttled.

## Stack

- React / Typescript
- Styled components
- Websocket API
- Webworker

## Public url

[https://my-orderbook-nstanogias.vercel.app/](https://my-orderbook-nstanogias.vercel.app/)
