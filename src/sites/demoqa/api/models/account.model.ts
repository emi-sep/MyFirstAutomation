export interface TestUserCredentials {
  username: string;
  password: string;
}

export interface TestUser {
  id: string;
  username: string;
  password: string;
}

export interface UserBook {
  isbn: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  books: UserBook[];
}
