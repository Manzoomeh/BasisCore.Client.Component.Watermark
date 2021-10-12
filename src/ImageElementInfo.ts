import ElementInfo, { TileMode } from "./ElementInfo";

export default class ImageElementInfo extends ElementInfo {
  constructor(
    readonly Data: string | ArrayBuffer,
    rotate: number,
    public Scale: number,
    public Width: number,
    public Height: number,
    opacity: number,
    tileMode: TileMode,
    span: number,
    key?: string
  ) {
    super("LOGO", rotate, opacity, tileMode, span, key);
  }

  static fromDummyObject(obj: any | ImageElementInfo): ImageElementInfo {
    return new ImageElementInfo(
      obj.Data,
      obj.Rotate,
      obj.Scale,
      obj.Width,
      obj.Height,
      obj.Opacity,
      obj.TileMode,
      obj.Span,
      obj.Key
    );
  }
}
