export default class userRtaDTO {
  constructor(user) {
    this.email = user.user.email;
    this.fullName =
      user.user.firstName +
      (user.user.lastName != 'nolast' ? ' ' + user.user.lastName : '');
  }
}
