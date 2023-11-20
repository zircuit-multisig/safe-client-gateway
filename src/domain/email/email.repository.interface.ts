export const IEmailRepository = Symbol('IEmailRepository');

export interface IEmailRepository {
  getEmails();

  saveEmail(args: {
    chainId: string;
    safe: string;
    emailAddress: string;
    account: string;
  }): Promise<void>;
}
