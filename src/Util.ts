import ImageElementInfo from "./ImageElementInfo";

export default class Util {
  static GetBase64Image(image: Blob): Promise<ImageElementInfo> {
    return new Promise<ImageElementInfo>((resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          () => {
            var imageElement = new Image();
            imageElement.onload = () => {
              resolve(
                new ImageElementInfo(
                  reader.result,
                  0,
                  1,
                  imageElement.width,
                  imageElement.height,
                  1,
                  "NONE",
                  0
                )
              );
            };
            imageElement.src = reader.result as string;
          },

          false
        );
        reader.readAsDataURL(image);
      } catch (err) {
        reject(err);
      }
    });
  }
}
