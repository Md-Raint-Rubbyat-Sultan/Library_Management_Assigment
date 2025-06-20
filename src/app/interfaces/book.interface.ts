interface availablity {
  availablity: (borrowedCopies: number) => void;
}

interface book extends availablity {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: number;
  description?: string;
  copies: number;
  available?: boolean;
}

export { book };
