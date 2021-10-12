import Position from "./models/Position";

export default class DragDropHandler {
  ActiveElement: SVGElement = null;
  PreviousLocation: Position;
  constructor(readonly Element: SVGElement) {
    this.Element.addEventListener("mousedown", startDrag);
    this.Element.addEventListener("mousemove", drag);
    this.Element.addEventListener("mouseup", endDrag);
    this.Element.addEventListener("mouseleave", endDrag);

    function startDrag(event) {
      this.ActiveElement = event.target;
      this.PreviousLocation = Position.CreateFromEvent(event);
    }

    function drag(event) {
      if (this.ActiveElement) {
        event.preventDefault();
        const now = Position.CreateFromEvent(event);
        const change = this.PreviousLocation.GetDistance(now);
        this.PreviousLocation = now;
        const moveEvent = new CustomEvent("move", { detail: change });
        this.ActiveElement.dispatchEvent(moveEvent);
      }
    }
    function endDrag(evt) {
      this.ActiveElement = null;
    }
  }
}
