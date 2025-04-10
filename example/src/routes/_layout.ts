
export const lang = () => "en-US";
export const title = "Example Tailsip App";

export const loader: APIHandler = async ({ request }) => {
}

export const view: ViewHandler = ({}, next) => `
  ${next()}
`;