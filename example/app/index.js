// For people who don't care about typings, they could now do in a single file
const Users = $itemset("User", ({ prop, t }) => ({ 
  username: prop( "string", t("index"),  t("login") ),
  password: prop( "string", t("secret"), t("login") ) 
}));

$endpoint("login", {
  expects: Users.tagged("login"),
  returns: Users.notTagged("secret"),
  handler: async ({ username, password }) => {
    const exists = $db.find("User", { username });
    if (exists && bcrypt.compare(exists.password, password)) return exists;
    throw new Error("wrong credentials");
  }
});