export type SvgElementPropsBase = {
  className: string;
};

export type PathProps = SvgElementPropsBase & {
  d: string;
};

export type CircleProps = SvgElementPropsBase & {
  cx: string;
  cy: string;
  r: string;
};

export type EllipseProps = SvgElementPropsBase & {
  cx: string;
  cy: string;
  rx: string;
  ry: string;
  transform?: string;
};

export type PolygonProps = SvgElementPropsBase & {
  points: string;
};

export type SvgElement = { tag: string; props: PathProps | CircleProps | EllipseProps | PolygonProps };
