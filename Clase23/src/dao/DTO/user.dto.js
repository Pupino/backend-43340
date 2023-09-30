export default class UsersDTO {
  constructor(users) {
    this.id = users._id || users.id; //this is how to handle mongoose _id or memory id
    this.email = users.email;
    this.password = users.password;
    this.firstName = users.firstName;
    this.lastName = users.lastName;
    this.age = users.age;
    this.isAdmin = users.isAdmin;
    this.isPremium = users.isPremium;
  }
}
