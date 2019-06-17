export class ResultGetPaged<T> {
  public totalItens: number;
  public pagina: number;
  public totalPaginas: number;
  public resultado: T[];
}
