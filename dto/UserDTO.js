class UserDTO {
    constructor(user) {
      this.id = user._id;
      this.username = user.username;
      this.email = user.email;
      this.role = user.role;
    }
  }
  
  export default UserDTO;
  