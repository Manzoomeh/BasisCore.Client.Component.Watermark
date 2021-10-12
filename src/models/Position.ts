export default class Position {
  constructor(public X: number, public Y: number) {}

  GetDistance(from: Position): Position {
    return new Position(from.X - this.X, from.Y - this.Y);
  }
  static CreateFromEvent(event: MouseEvent): Position {
    return new Position(event.clientX, event.clientY);
  }
}
