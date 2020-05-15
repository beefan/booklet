const api = process.env.VUE_APP_API;

export async function getBooklet(id) {
  const route = `${api}/${id}`;
  console.log("contacting" + route + " for booklet id " + id);
  return fetch(route)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("incoming!!");
      console.log(data);
      return data;
    })
    .catch(err => {
      console.error(err);
    });
}
