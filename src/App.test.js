import { act, render, screen } from '@testing-library/react';
import App from './App';
import fetchMock from 'jest-fetch-mock'
import CSVController from './Components/CSVController'
import { unmountComponentAtNode } from "react-dom";


// const mockResponse = { type: "basic", url: "http://localhost:3000/example.csv/upload/", redirected: false, status: 201, ok: true, statusText: "CREATED", headers: Headers, body: ReadableStream, bodyUsed: false }

fetchMock.enableMocks()

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('CSVcontroller renders', async () => {
  act(()=> {
    render(<CSVController />, container);
  });
  
  expect(container.textContent).toBe("Hello")
});
