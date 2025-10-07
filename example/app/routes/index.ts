

export const uses = async () => ({
  user: await $cache.read("session").user as User,
});

export const view = ({ user }) => skeleton(user.name);
export const skeleton = (name?: string) => `
  <span>${ name || "username..." }</span>
`

export const error = () => `<user-login>`;