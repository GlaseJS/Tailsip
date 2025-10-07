export const session = true;

export const Users = $itemset("User", ({ prop, t }) => ({
  username: prop( "string", t.index  ),
  password: prop( "string", t.secret ) // auto stripped when detected on payload transmissions
}));

declare global { type Users = typeof Users; type User = $ItemFromSet<Users> }

Users.getHash = (item) => item.id;
Users.equals  = (a, b) => a.getHash() == b.getHash();

export const login = $form<{ username: string, password: string }>({
  view: () => `
    <input name="username" type="text"/>
    <input name="password" type="password"/>
  `,
  validate: ({ username, password }) => username && password,
  endpoint: async ({ session, username, password }) => {
    const user = await $db.find("User", { username });
    if (!compare(password, user.password)) throw new Error("wrong credentials");

    return {
      session: await session.update("user", user.id)
    }
  }
});