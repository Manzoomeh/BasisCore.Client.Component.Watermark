import ElementInfo from "../../ElementInfo";
import ImageElementInfo from "../../ImageElementInfo";
import WatermarkElement from "../../models/WatermarkElement";
import Watermark from "../Watermark/Watermark";
export default class MainImageElement extends WatermarkElement {
  setElementInfo(info: ElementInfo) {
    throw new Error("Method not Supported.");
  }
  remove() {
    throw new Error("Method not Supported.");
  }
  private _imageElement: SVGImageElement;
  getSVGElement(): SVGGraphicsElement {
    return this._imageElement;
  }
  getElementInfo() {
    return this.ImageInfo;
  }
  constructor(owner: Watermark, readonly ImageInfo: ImageElementInfo) {
    super(owner);
    this._imageElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    this._imageElement.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      this.ImageInfo.Data as any as string
    );
    this._imageElement.setAttribute("x", this.Position.X.toString());
    this._imageElement.setAttribute("y", this.Position.Y.toString());
    this._imageElement.setAttribute("visibility", "visible");
    this.Owner.addElement(this);
    this.Owner.Element.setAttribute("height", this.ImageInfo.Height.toString());
    this.Owner.Element.setAttribute("width", this.ImageInfo.Width.toString());
  }
}
