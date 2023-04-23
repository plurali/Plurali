export enum Background {
    Color = "Color",
    Image = "Image",
}

export interface BackgroundData  {
    backgroundType: Background,
    backgroundImage: string | null,
    backgroundColor: string | null,
    lastTimeAssetChanged: Date
}

// The priority is the following:
// Checks whether data is available for the current background type
// If not and the type is color, try to fall back to SP color.
// If SP color is not present, try to fall back to the other type.
// If the other type is not present, falls back to default Plurali color.
export interface WithBackground {
    color: string | null;
    data: BackgroundData
}