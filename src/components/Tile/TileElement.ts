import { TileMode } from "../../ElementInfo";
import ContainerElement from "../Interactive/ContainerElement";
import Watermark from "../Watermark/Watermark";

export default class Tile<TSVGElement extends SVGGraphicsElement> {
  private _list: Array<SVGUseElement>;
  private _tileWidthSize: number = 0;
  private _tileHeightSize: number = 0;
  private _tileMode: TileMode = "NONE";
  private _timeoutHandler: any = null;
  constructor(
    readonly Owner: Watermark,
    private readonly Tile: ContainerElement<TSVGElement>
  ) {
    this._list = new Array<SVGUseElement>();
  }

  private clear() {
    this._list.forEach((e) => e.remove());
    this._list.splice(0, this._list.length);
    this._tileWidthSize = 0;
    this._tileHeightSize = 0;
    this._tileMode = "NONE";
  }
  public updateTiles(tileMode: TileMode, span: number) {
    if (tileMode == "NONE") {
      this.clear();
    } else {
      const tileRect = this.Tile._groupElement.getBoundingClientRect();
      const ownerRect = this.Owner.Element.getBoundingClientRect();
      if (tileRect.height == 0 || tileRect.width == 0) {
        if (!this._timeoutHandler) {
          //wait for load element in ui.but only one time
          this._timeoutHandler = setTimeout(
            () => this.updateTiles(tileMode, span),
            1
          );
        }
      } else {
        const tileWidth = tileRect.width + span;
        const tileHeight = tileRect.height + span;
        if (
          this._tileWidthSize != tileWidth ||
          this._tileHeightSize != tileHeight ||
          this._tileMode != tileMode
        ) {
          this.clear();
          const xCount = Math.floor(ownerRect.width / tileWidth) + 1;
          const yCount = Math.floor(ownerRect.height / tileHeight) + 1;
          let gap = 0;
          for (var iy = -yCount; iy < yCount; iy++) {
            if (tileMode === "FLOWER" && iy % 2 != 0) {
              gap = (tileRect.width + span) / 2;
            } else {
              gap = 0;
            }
            for (var ix = -xCount; ix < xCount; ix++) {
              if (ix == 0 && iy == 0) {
                continue;
              }
              let newX = tileWidth * ix + gap;
              let newY = tileHeight * iy;
              const element = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "use"
              );
              element.setAttribute("href", `#${this.Tile.Id}`);
              element.setAttribute("transform", `translate(${newX} ${newY})`);
              element.setAttribute("visibility", "visible");
              this._list.push(element);
              this.Owner.Element.appendChild(element);
            }
          }
          this._tileWidthSize = tileWidth;
          this._tileHeightSize = tileHeight;
          this._tileMode = tileMode;
        }
      }
    }
  }
}
