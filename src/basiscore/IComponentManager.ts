import ISource from "./ISourceOptions";

export default interface IComponentManager {
  initializeAsync(): Promise<void>;
  runAsync(source?: ISource): Promise<any>;
}
