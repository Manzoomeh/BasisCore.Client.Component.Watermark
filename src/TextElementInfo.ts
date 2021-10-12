import ElementInfo, { TileMode } from "./ElementInfo";

export default class TextElementInfo extends ElementInfo {
  constructor(
    public Text: string,
    public FontFamily: string,
    public FontSize: number,
    public Color: string,
    rotate: number,
    opacity: number,
    tileMode: TileMode,
    span: number,
    key?: string
  ) {
    super("TEXT", rotate, opacity, tileMode, span, key);
  }

  static fromDummyObject(obj: any | TextElementInfo): TextElementInfo {
    return new TextElementInfo(
      obj.Text,
      obj.FontFamily,
      obj.FontSize,
      obj.Color,
      obj.Rotate,
      obj.Opacity,
      obj.TileMode,
      obj.Span,
      obj.Key
    );
  }
}
