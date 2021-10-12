import { MergeType } from "../../basiscore/enum";
import IComponentManager from "../../basiscore/IComponentManager";
import ISource from "../../basiscore/ISource";
import IUserDefineComponent from "../../basiscore/IUserDefineComponent";
import { SourceId } from "../../basiscore/type-alias";
import Util from "../../Util";
import IOption from "../Watermark/IOptions";
import Watermark from "../Watermark/Watermark";

export default class BcComponent implements IComponentManager {
  readonly owner: IUserDefineComponent;
  private watermark: Watermark;
  private svgBgImageSourceId: SourceId;
  private watermarkItemsSourceId: SourceId;

  constructor(owner: IUserDefineComponent) {
    this.owner = owner;
  }

  public async initializeAsync(): Promise<void> {
    this.svgBgImageSourceId = await this.owner.getAttributeValueAsync(
      "wm-background"
    );

    this.watermarkItemsSourceId = await this.owner.getAttributeValueAsync(
      "wm-items"
    );
    const resultSourceId = await this.owner.getAttributeValueAsync(
      "wm-resultId"
    );
    const btnId = await this.owner.getAttributeValueAsync("wm-btn");
    document.querySelector(btnId)?.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.watermark) {
        const img = this.watermark.getResult();
        this.owner.setSource(resultSourceId, img);
      }
    });
    this.owner.addTrigger([
      this.svgBgImageSourceId,
      this.watermarkItemsSourceId,
    ]);
  }

  public async runAsync(source?: ISource): Promise<boolean> {
    console.log(source);
    if (source?.id === this.svgBgImageSourceId) {
      const svg = await this.owner.getAttributeValueAsync("wm-element");
      const svgElement = document.querySelector<SVGElement>(svg);
      const ImageInfo = await Util.GetBase64Image(source.rows[0].value[0]);
      const option: IOption = {
        SvgElement: svgElement,
        ImageInfo: ImageInfo,
      };
      this.watermark = new Watermark(option);
    } else {
      if (this.watermark) {
        if (source?.id === this.watermarkItemsSourceId) {
          const elements = await this.extractElementSourcesAsync(source);
          if (elements.length !== this.watermark.Elements.length) {
            const keys = elements.map((x) => x.Key);
            const removedElements = this.watermark.Elements.filter((x) => {
              const info = x.getElementInfo();
              return info.Key && keys.indexOf(info.Key) == -1;
            });
            removedElements.forEach((x) => x.remove());
          }
          for (const row of elements) {
            const element = this.watermark.Elements.find(
              (x) => x.getElementInfo().Key === row.Key
            );
            if (element) {
              element.setElementInfo(row);
            } else {
              row.Type === "TEXT"
                ? this.watermark.addTextElement(row)
                : this.watermark.addImageElement(row);
            }
          }
        }
      }
    }
    return true;
  }

  async extractElementSourcesAsync(source: ISource) {
    const elements = [];
    const rows = source.rows[0]?._root?.elements;
    if (rows) {
      for (const element of rows) {
        if (element.Type === "LOGO") {
          const imageOption = await Util.GetBase64Image(element.File);
          const p = { ...imageOption, ...element };
          elements.push(p);
        } else {
          elements.push(element);
        }
      }
    }
    return elements;
  }
}
