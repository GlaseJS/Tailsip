
export const loader: APIHandler = async (ctx) => {
  ctx.lang  = "en-US";
  ctx.title = "Example Tailsip App";
}

export const view: ViewHandler = ({}, next) => `
  <div>
  ${next()}
  </div>
`;