
export const title = "";

export const loader: APIHandler = async ({ request }) => {
}

export const view: ViewHandler = ({}, next) => `
<html>
<head></head>
<body>
  ${next()}
</body>
</html>
`;