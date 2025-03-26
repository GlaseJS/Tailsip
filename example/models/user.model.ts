
export const Users = Model({
  username: { type: "string!" },
  password: { type: "string!", secret: true },
  email:    { type: "string",  validate: val => val.includes("@") },
  
  isAdmin:  { type: "boolean?" },
  isUser:   { type: "boolean", default: ()=>true },
  
  posts: Ref("Posts"),

  createdAt, updatedAt
});