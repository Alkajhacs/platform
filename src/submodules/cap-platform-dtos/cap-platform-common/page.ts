

export class Page{
  public PageSize:number;
  public PageNumber:number;
  public TotalRecords:number;
  public CurrentPage:number;

  constructor(){
      this.PageSize = 0;
      this.PageNumber = 0;
      this.TotalRecords = 0;
      this.CurrentPage = 0;
  }
}