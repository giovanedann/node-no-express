let users = require('../mocks/users.js')

module.exports = {

  listUsers(request, response) { // listing the users (respecting the query params asc/desc)

    const { order } = request.query;

    const sortedUsers = users.sort((a,b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      } else {
        return a.id > b.id ? 1 : -1;
      };
    });

    console.log(request.query);

    response.send(200, sortedUsers);
  },

  getUserById(request, response) { // getting user by ID 
 
    const { id } = request.params;

    let user = users.find((user) => user.id === Number(id)); // converting the number of the request.params.id (string) to a number

    if (!user) { return response.send(400, {error: 'user not found'}); }
  
    response.send(200, user);

    },

  createUser(request, response) { 

    const { body } = request; // injecting the body into the request
    
    const lastUserId = users[users.length - 1].id; // getting the last created user id

    const newUser = {
      id: lastUserId + 1,
      name: body.name,
    }

    users.push(newUser); // pushing the new user on the users array

    response.send(200, newUser);
      
    },

  updateUser(request, response) { // function to update (name) user from the array

    let { id } = request.params;
    id = Number(id); // converting the id (string) of request.params to a number

    const { name } = request.body; // getting the name from the request body sent by PUT method

    if (users.find((user) => user.id === id)) { // finding the user by the id
      users = users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            name, // overwriting the name of the object with the name of the request.body
          };
        } else {
          return user
        };
      });
    } else {
      return response.send(400, { error: 'user not found' }); // message if the id of the user doesn't exist
    };

    response.send(200, { id, name }); // sending the id and name of the user
  },

  deleteUser(request, response) {
    
    let { id } = request.params;
    id = Number(id);

    if (users.find((user) => user.id === id)) {
      // removing the item from the array by filtering and keeping only the values with different id
      users = users.filter((user) => user.id !== id)
      response.send(200, { status: 'user deleted successfully' })
    } else {
      response.send(400, {error: 'user not found'});
    };
  }
  };