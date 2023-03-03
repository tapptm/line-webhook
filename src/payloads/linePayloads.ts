function carouselPayload(distanceDataArray: any) {
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

function audioPayload(imageUrl: string, duration: number) {
  const payload = {
    type: "audio",
    originalContentUrl: imageUrl,
    duration: duration,
  };

  return JSON.parse(JSON.stringify(payload));
}

function contentPayload(distanceDataArray: any) {
  const payload = {
    altText: "Flex Message",
    type: "flex",
    contents: {
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
            layout: "baseline",
            contents: [
              {
                text: distanceDataArray[0].detail.replace(/(.{40})..+/, "$1…"),
                contents: [],
                weight: "regular",
                type: "text",
                wrap: true,
                size: "sm",
              },
            ],
            type: "box",
          },
        ],
        spacing: "sm",
        layout: "vertical",
      },
      type: "bubble",
      hero: {
        url: distanceDataArray[0].image,
        aspectMode: "cover",
        aspectRatio: "20:13",
        size: "full",
        type: "image",
      },
    },
  };

  return JSON.parse(JSON.stringify(payload));
}

export { carouselPayload, audioPayload, contentPayload };
