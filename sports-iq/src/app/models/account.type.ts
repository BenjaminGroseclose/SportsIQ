export interface IAccount {
  accountID: number;
  username: string;
  displayName: string;
  email: string;
  profilePictureUrl: string;
  lastLogin: Date;
  isActive: boolean;
  userID: string; // AuthO user ID
  createDate: Date;
  lastModified: Date | null;
}
