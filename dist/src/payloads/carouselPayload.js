"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carouselPayloads = void 0;
function carouselPayloads(distanceDataArray) {
    const contents = distanceDataArray.map((distance) => {
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
        altText: "Flex Message",
        contents: {
            type: "carousel",
            contents: contents,
        },
    };
    return JSON.parse(JSON.stringify(payload));
}
exports.carouselPayloads = carouselPayloads;
