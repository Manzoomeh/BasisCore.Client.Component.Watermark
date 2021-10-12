export type ElementType = "TEXT" | "LOGO" | "IMAGE";
export type TileMode = "NONE" | "BOX" | "FLOWER";

export default class ElementInfo {
  constructor(
    readonly Type: ElementType,
    public Rotate: number,
    public Opacity: number,
    public TileMode: TileMode,
    public Span?: number,
    readonly Key?: string
  ) {}
}
