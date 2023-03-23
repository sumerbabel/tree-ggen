type Unsuscribe = () => void;
type Observer<T> = (value: T) => void;
export interface ISubject<T> {
  subscribe(observer: Observer<T>): Unsuscribe;
}

export class TreeSubject<T> implements ISubject<T> {
  private observers: Observer<T>[] = [];

  public subscribe(observer: Observer<T>): Unsuscribe {
    this.observers.push(observer);
    return  () => this.unsubscribe(observer);
  }

  public unsubscribe(observer: Observer<T>) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public next(value: T) {
    this.observers.forEach((observer) => observer(value));
  }
}