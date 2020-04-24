const api = process.env.VUE_APP_API

export function getBooklet(id) {
    console.log(api);
  fetch(api)
    .then(response => {
      return response.json();
    })
    .then(data => {
        console.log(data);
      return data;
    })
    .catch(err => {
      console.error(err);
    });

  console.log(id);
}
