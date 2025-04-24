
export const loader: APIHandler = async (ctx) => {
  ctx.lang  = "en-US";
  ctx.title = "Example Tailsip App";
}

export const view: ViewHandler = ({}, next) => `
  <div>
  ${next()}
  </div>
`;


export const style: StyleHandler = () => `

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

body {
  color: white;
  font-family: "Roboto";
}

$> {
  background-color: #111115;
  min-height: 100vh;

  padding: 1rem 0 1rem 0;
}

`