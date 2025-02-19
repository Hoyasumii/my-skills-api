export interface Service<Repository, Args, ReturnType> {
  repository: Repository;
  run(data: Args): Promise<ReturnType>;
}
