export interface IRegister {
  name?: string,
  surname?: string,
  email: string,
  password: string,
  confPassword: string,
  returnSecureToken: boolean
}
