import { audiosUrl } from "../configs/urlpath";
import { getAudioDurationInSeconds } from "get-audio-duration";

async function carouselPayload(distanceDataArray: any) {
  const contents = distanceDataArray.map((distance: any) => {
    return {
      type: "bubble",
      size: "micro",
      hero: {
        type: "image",
        url: distance.image,
        size: "full",
        aspectMode: "cover",
        aspectRatio: "320:213",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: distance.name.replace(/(.{40})..+/, "$1…"),
            weight: "bold",
            size: "sm",
            wrap: true,
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: distance.distance,
                    wrap: true,
                    color: "#8c8c8c",
                    size: "xs",
                  },
                ],
              },
            ],
          },
        ],
        spacing: "sm",
        paddingAll: "13px",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "separator",
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "เปิดแผนที่",
              uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude}+${distance.longitude}`,
            },
          },
        ],
      },
    };
  });

  const payload = {
    type: "flex",
    altText: "แนะนำที่นี่เลยจ้า",
    contents: {
      type: "carousel",
      contents: contents,
    },
  };

  return JSON.parse(JSON.stringify(payload));
}

async function audioPayload(distanceDataArray: any, language: string) {
  const duration = await getAudioDurationInSeconds(
    `${process.cwd()}/src/assets/audios/${distanceDataArray[0].soundname}`
  );
  const payload = {
    ...(language === "language_english" && {
      sender: {
        iconUrl: "https://kims-rmuti.com/linebot/files/images/Alex.gif",
        name: "Alex",
      },
    }),
    type: "audio",
    originalContentUrl: `${audiosUrl}/${distanceDataArray[0].soundname}`,
    duration: duration * 1000,
  };

  return JSON.parse(JSON.stringify(payload));
}

async function contentPayload(distanceDataArray: any, language: string) {
  const payload = {
    ...(language === "language_english" && {
      sender: {
        iconUrl: "https://kims-rmuti.com/linebot/files/images/Alex.gif",
        name: "Alex",
      },
    }),
    altText: "Flex Message",
    type: "flex",
    contents: {
      type: "bubble",
      hero: {
        url: distanceDataArray[0].image,
        aspectMode: "cover",
        aspectRatio: "20:13",
        size: "full",
        type: "image",
      },
      body: {
        type: "box",
        contents: [
          {
            size: "lg",
            wrap: true,
            type: "text",
            text: distanceDataArray[0].name,
            weight: "bold",
            contents: [],
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                text: distanceDataArray[0].detail,
                contents: [],
                weight: "regular",
                type: "text",
                wrap: true,
                size: "sm",
              },
            ],
          },
          {
            type: "text",
            text: distanceDataArray[0].distance,
            wrap: true,
            color: "#aaaaaa",
            size: "sm",
          },
        ],
        spacing: "sm",
        layout: "vertical",
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#905c44",
            margin: "xxl",
            action: {
              type: "uri",
              label: language === "language_english" ? "navigate" : "เปิดแผนที่",
              uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distanceDataArray[0].latitude}+${distanceDataArray[0].longitude}`,
            },
          },
        ],
      },
    },
  };

  return JSON.parse(JSON.stringify(payload));
}

function messagePayload(distanceDataArray: any, language: string) {
  const payload = {
    ...(language === "language_english" && {
      sender: {
        iconUrl: "https://kims-rmuti.com/linebot/files/images/Alex.gif",
        name: "Alex",
      },
    }),
    type: "text",
    text:
      language === "language_english"
        ? `You can listen to audio about "${distanceDataArray[0].name}". by clicking on the audio message.`
        : `พี่ๆ สามารถฟังเสียงบรรยายเกี่ยวกับ "${distanceDataArray[0].name}" โดยพี่ๆ สามารถคลิกที่ข้อความเสียงได้เลยค่ะ`,
  };

  return JSON.parse(JSON.stringify(payload));
}

export { carouselPayload, audioPayload, contentPayload, messagePayload };
