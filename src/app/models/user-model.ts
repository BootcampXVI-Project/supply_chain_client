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

export class User {
  email: string = "";
  password: string = "";
  userName: string = "";
  fullName: string = "";
  avatar: string = "";
  phoneNumber: string = "";
  address: string = "";
  role: string = "";
  status: string = "";
  signature: string = "";
  userId: string = ""
}

export class UserInfo {
  address: string = '';
  avatar: string = '';
  email: string = '';
  fullName: string = '';
  phoneNumber: string = '';
  role: string = '';
  signature: string = '';
  userId: string = '';
  userName: string = '';
}
