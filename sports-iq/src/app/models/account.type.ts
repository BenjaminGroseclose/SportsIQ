export interface IAccount {
  accountID: number;
  username: string;
  displayName: string;
  email: string;
  profilePictureUrl: string;
  lastLogin: Date;
  isActive: boolean;
  createDate: Date;
  lastModified: Date | null;
}
