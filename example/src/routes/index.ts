export const view: ViewHandler = ({}, next) => `
<div>
  hellow world
</div>
`;

export const style: StyleHandler = (ctx) => `

html, body {
  min-height: 100vh; 
}

body {
  background-color: #FF55FF;
}

`


export const client: ClientHandler = (ctx) => ({
  "page:load": () => {
    console.log("Hello World")
  }
})