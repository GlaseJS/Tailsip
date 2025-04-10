export const view: ViewHandler = ({}, next) => `
hellow world
`;

export const style: StyleHandler = (ctx) => `

html, body {
  min-height: 100vh; 
}

body {
  background-color: #FF55FF;
}

`