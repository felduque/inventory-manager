export const FetchInventory = (value) => {
  if (value.length > 0) {
    window.api.send("search-product", { replyName: "inventory" ,data: value });
  } else {
    window.api.send("get-all-products");
  }
};
