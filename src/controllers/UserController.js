let users = require('../mocks/users.js')

module.exports = {

  listUsers(request, response) {

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

  getUserById(request, response) {

    const { id } = request.params;

    let user = users.find((user) => user.id === Number(id)); // converting the number of the request.params.id (string) to a number

    if (!user) { return response.send(400, {error: 'user not found'}); }
  
    response.send(200, user);

    },

  createUser(request, response) { 

    const { body } = request;
    
    const lastUserId = users[users.length - 1].id;

    const newUser = {
      id: lastUserId + 1,
      name: body.name,
    }

    users.push(newUser);

    response.send(200, newUser);
      
    },

  updateUser(request, response) {

    let { id } = request.params;
    id = Number(id);

    const { name } = request.body;

    if (users.find((user) => user.id === id)) {
      users = users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            name,
          };
        } else {
          return user
        };
      });
    } else {
      return response.send(400, { error: 'user not found' });
    };

    response.send(200, { id, name });
  },

  deleteUser(request, response) {
    
    let { id } = request.params;
    id = Number(id);

    if (users.find((user) => user.id === id)) {
      users = users.filter((user) => user.id !== id)
      response.send(200, { status: 'user deleted successfully' })
    } else {
    response.send(400, {error: 'user not found'});
    };
  }
  };