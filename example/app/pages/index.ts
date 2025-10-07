
export const loader = async () => ({

});

export const skeleton = $view((username = "loading") => `
<div>
{{ user.name }}
</div>
`);

export const view = { ...skeleton }