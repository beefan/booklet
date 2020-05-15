const api = process.env.VUE_APP_API;

export async function getBooklet(id) {
  console.log("calling fetch for booklet id " + id);
  return fetch(api)
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
