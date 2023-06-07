export class UserToken {
  userId?: string;
  phoneNumber?: string;
  username?: string;
  role?: string;
  token?: string;
}

export class LoginUser {
  phoneNumber: string = "";
  password: string = "";
}

