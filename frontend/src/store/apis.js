const api = process.env.VUE_APP_API;

/**
 * Save a booklet to user profile
 *
 * @param {*} booklet
 */
export function saveBooklet(booklet) {
  const route = `${api}/save`;
  console.log("saving booklet");
  console.log(booklet);
  fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(booklet)
  })
    .then(response => {
      if (response.ok) {
        console.log("successfully uploaded booklet");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * Handle user Pdf upload to be saved
 * to profile as booklet
 *
 * @param {*} pdfFile
 * @param {*} userId
 */
export async function savePdfAsBooklet(pdfFile, userId) {
  const route = `${api}/pdf`;
  console.log("contacting " + route);
  const formData = new FormData();
  formData.append("pdf", pdfFile);
  formData.append("userId", userId);

  fetch(route, {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (response.ok) {
        console.log("successfully uploaded pdf");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * Register New User
 *
 * @param {*} user
 */
export async function registerUser(user) {
  const route = `${api}/register`;
  return fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * User Login
 *
 * @param {*} user
 */
export async function login(user) {
  const route = `${api}/login`;
  return fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * Logout
 */
export function logout() {
  const route = `${api}/logout`;
  fetch(route)
    .then(response => {
      if (response.ok) {
        console.log("logged out");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * Get a single booklet by its ID
 *( deprecated? )
 * @param {*} id
 */
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

/**
 * Get Booklets Liked By User
 *
 * @param {*} userId
 */
export async function getUserLikes(userId) {
  const route = `${api}/likes/${userId}`;
  console.log("contacting" + route + " for booklet id " + userId);
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

/**
 * Get Booklets saved To User Profile
 *
 * @param {*} userId
 */
export async function getUserBooklets(userId) {
  console.log(userId);
  const route = `${api}/all/${userId}`;
  console.log("contacting " + route + " for booklet id " + userId);
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

/**
 * Update User Profile
 *
 * @param {*} user
 */
export async function updateUserInfo(user) {
  const route = `${api}/user`;
  fetch(route, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      if (response.ok) {
        console.log("successfully updated user info");
      }
    })
    .catch(err => {
      console.error(err);
    });
}
