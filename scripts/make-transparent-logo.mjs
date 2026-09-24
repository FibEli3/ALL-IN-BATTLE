import sharp from "sharp";

const source = "public/event/logo.png";
const target = "public/event/logo-transparent.png";
const background = [25, 14, 1];

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < data.length; index += 4) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const distance = Math.hypot(
    red - background[0],
    green - background[1],
    blue - background[2],
  );

  data[index + 3] = Math.round(Math.max(0, Math.min(255, ((distance - 18) / 34) * 255)));
}

const transparent = await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 256,
    height: 256,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{
    input: await sharp(transparent)
      .resize(232, 232, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer(),
    gravity: "center",
  }])
  .png({ compressionLevel: 9 })
  .toFile(target);

console.log(`Created ${target}`);
