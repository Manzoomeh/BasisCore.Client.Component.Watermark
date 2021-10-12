import Watermark from "../Watermark/Watermark";
import WatermarkElement from "../../models/WatermarkElement";
import Position from "../../models/Position";

export default abstract class ContainerElement<
  TSVGElement extends SVGGraphicsElement
> extends WatermarkElement {
  public Content: TSVGElement;
  private _borderElement: SVGRectElement;
  public _groupElement: SVGGElement;
  constructor(owner: Watermark) {
    super(owner);
  }

  protected abstract getContentElement(): TSVGElement;
  protected abstract updateUIEffect(): void;

  protected initElement(): void {
    this.createGroupElement();
  }

  getSVGElement(): SVGGraphicsElement {
    return this._groupElement;
  }

  private createBorder() {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    element.setAttribute("class", "wm-rect-box");
    element.setAttribute("visibility", "visible");
    element.setAttribute("draggable", "true");
    element.setAttribute("style", "fill-opacity: 0");
    this._borderElement = element;
    this._groupElement.appendChild(this._borderElement);
  }

  protected updateBorder() {
    const box: SVGRect = this.Content.getBBox();
    this._borderElement.setAttribute("height", box.height.toString());
    this._borderElement.setAttribute("width", box.width.toString());
    this._borderElement.setAttribute("x", box.x.toString());
    this._borderElement.setAttribute("y", box.y.toString());
  }

  private createGroupElement() {
    this._groupElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    this._groupElement.setAttribute(
      "style",
      "transform-origin:center;transform-box:fill-box"
    );
    this._groupElement.setAttribute("id", this.Id);
    this._groupElement.setAttribute("class", "wm-group");
    this._groupElement.setAttribute("visibility", "visible");
    this.Content = this.getContentElement();
    this._groupElement.appendChild(this.Content);
    this.Content.addEventListener("inactive", (e) => this.inActive());
    this.Content.addEventListener("click", (e) => {
      e.stopPropagation();
      this.Owner.setActiveElement(this);
    });
    this.createBorder();
    this.Content.addEventListener("move", (e) => {
      e.preventDefault();
      var d = (e as CustomEvent).detail as Position;
      this.Position.X += d.X;
      this.Position.Y += d.Y;
      this.updateUIEffect();
    });
  }

  active() {
    this.updateBorder();
    this._borderElement.setAttribute("class", "wm-rect-box wm-rect-select");
  }

  inActive() {
    this._borderElement.setAttribute("class", "wm-rect-box");
  }

  remove() {
    this._groupElement.remove();
  }
}
