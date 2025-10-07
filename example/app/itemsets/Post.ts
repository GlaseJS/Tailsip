

export const Posts = $itemset("Post", ({ prop, ref }) => ({
  author:  ref<User>("User"),
  content: prop("string")
}));

declare global { type Post = $ItemFromSet<typeof Posts> }

export const create = $endpoint(async (item: $ItemCreate<typeof Posts>) => {
  if ($db.find("Post", $db.Or(item)))
    throw new Error("Already Exists");
  
  return $db.save("Post", {});
});

export const read = $endpoint(async (query: $Query<typeof Posts>) => $db.find("Posts", query));