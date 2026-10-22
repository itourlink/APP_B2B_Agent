export type TourType = "fixed" | "package" | "daily";

type TourTypeData = {
  intTypeTour?: number | string | null;
  intTourTypeID?: number | string | null;
};

export const getTourType = (tour?: TourTypeData | null): TourType => {
  const isType = (type: number) =>
    Number(tour?.intTypeTour) === type ||
    Number(tour?.intTourTypeID) === type;

  if (isType(21)) return "fixed";
  if (isType(19)) return "package";

  return "daily";
};
