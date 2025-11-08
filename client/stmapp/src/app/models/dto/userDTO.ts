export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserRegistrationDTO {
  username: string;
  email: string;
  role: string;
  password: string;
}


export interface UserUpdateDTO {
  id: number;
  username?: string;
  email?: string;
  role?: string;
}

export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface UserChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UserResetPasswordDTO {
  email: string;
}

export interface UserSetNewPasswordDTO {
  resetToken: string;
  newPassword: string;
}