export class Level4AccountModel {
    id?: string; // Optional ID (can be undefined)
    editableName: string; // Required, max length 200
    code: string; // Required, max length 10
    level3_id?: string; // Optional, required in certain cases
  }