import TextElementInfo from "../../TextElementInfo";
import InteractiveElement from "../Interactive/InterActiveElement";
import Watermark from "../Watermark/Watermark";

export default class TextElement extends InteractiveElement<
  SVGTextElement,
  TextElementInfo
> {
  constructor(owner: Watermark, textInfo: TextElementInfo) {
    super(owner, textInfo);
  }
  protected updateElementInfo(info: TextElementInfo) {
    super.updateElementInfo(info);
    this.ElementInfo.Color = info.Color || "Black";
    this.ElementInfo.FontFamily = info.FontFamily;
    this.ElementInfo.FontSize = +info.FontSize;
    this.ElementInfo.Text = info.Text;
  }
  protected applyElementInfoToUI() {
    this.Content.setAttribute("font-family", this.ElementInfo.FontFamily);
    this.Content.setAttribute(
      "font-size",
      this.ElementInfo.FontSize.toString()
    );
    this.Content.setAttribute("fill", this.ElementInfo.Color);
    this.Content.textContent = this.ElementInfo.Text;
    super.applyElementInfoToUI();
  }
  protected getContentElement(): SVGTextElement {
    const textElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textElement.setAttribute("fill", this.ElementInfo.Color);
    textElement.setAttribute("dominant-baseline", "text-before-edge");
    textElement.setAttribute("x", this.Position.X.toString());
    textElement.setAttribute("y", this.Position.Y.toString());
    textElement.setAttribute("visibility", "visible");
    return textElement;
  }
}
