export interface CatalogBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
}

export interface CatalogResponse {
  books: CatalogBook[];
}

export interface AddBooksRequest {
  userId: string;
  collectionOfIsbns: Array<{ isbn: string }>;
}

export interface DeleteBookRequest {
  userId: string;
  isbn: string;
}

export interface DeleteCollectionResponse {
  userId: string;
  message: string;
}
