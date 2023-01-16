interface Line {
  line: {
    type: string;
    altText: string;
    template: {
      imageSize: string;
      columns: object[];
      imageAspectRatio: string;
      type: string;
    };
  };
}

interface LineColumns {
  text: string;
  title: string;
  imageBackgroundColor: string;
  thumbnailImageUrl: string;
  actions: Object[];
}

interface PointOfInterest {
  community_id: string;
  poiid: String | Number;
  name: String;
  detail: String;
  tel: String;
  website: String;
  image: String | null;
  latitude: any;
  longitude: any;
}

export { Line, LineColumns, PointOfInterest };
