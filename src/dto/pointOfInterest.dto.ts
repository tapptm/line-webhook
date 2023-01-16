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
  text: String;
  title: String;
  imageBackgroundColor: String;
  thumbnailImageUrl: String;
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
