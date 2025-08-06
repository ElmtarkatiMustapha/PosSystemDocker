export function searchFunction(searchText, state, dispatch, attribute) {
  if (searchText.trim().length < 1) {
    dispatch({
      type: "SET_ALL_ITEMS",
      payload: state.storedItems,
    });
  } else {
    dispatch({
      type: "SET_ALL_ITEMS",
      payload: state.storedItems.filter((item) => {
        return item[attribute]
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());
      }),
    });
  }
}
