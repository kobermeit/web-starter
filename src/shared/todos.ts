export interface Todo {
  id: string;
  title: string;
  done: boolean;
  updatedAt: string;
}

/** A todo's full state plus when the user made the change, in epoch milliseconds. Every todo write sends this. */
export interface TodoWrite {
  id: string;
  title: string;
  done: boolean;
  deleted: boolean;
  changedAt: number;
}
