type SvgElementPropsBase = {
  className: string;
};

type PathProps = SvgElementPropsBase & {
  d: string;
};

type CircleProps = SvgElementPropsBase & {
  cx: string;
  cy: string;
  r: string;
};

type EllipseProps = SvgElementPropsBase & {
  cx: string;
  cy: string;
  rx: string;
  ry: string;
  transform?: string;
};

type PolygonProps = SvgElementPropsBase & {
  points: string;
};

type RectProps = SvgElementPropsBase & {
  x: string;
  y: string;
  width: string;
  height: string;
  rx?: string;
  ry?: string;
};

type LineProps = SvgElementPropsBase & {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
};

export type SvgElement = {
  tag: string;
  props: PathProps | CircleProps | EllipseProps | PolygonProps | RectProps | LineProps;
};
