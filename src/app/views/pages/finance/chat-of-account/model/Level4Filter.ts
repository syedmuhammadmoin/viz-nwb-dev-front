export class Level4Filter {
    code: string;
    name: string;
    level1Name: string;
    pageStart: number;
    pageEnd: number;
  
    constructor() {
      this.code = '';
      this.name = '';
      this.level1Name = '';
      this.pageStart = 0;
      this.pageEnd = 100; // Default values for pagination
    }
  }
  