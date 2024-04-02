export class Student {
  public id?: string;

  constructor(
    public name: string,
    public surname: string,
    public address: string,
    public telephoneNumber: string,
    public schoolClass: string,
    public furtherInfo: string
  ) {}

  setId(id: string): void {
    this.id = id;
  }
}
