export const LINE_GRADIENT_BACKGROUND = `
 background: linear-gradient(
  to bottom,
  transparent calc(50% - 2px),
  white calc(50% - 2px),
  white calc(50% + 1px),
  transparent calc(50% + 1px)
 ) !important;
`;

export const PREDEFINED_MIXINS: { [key: string]: string } = {
  TRANSPARENT_BACKGROUND: LINE_GRADIENT_BACKGROUND,
};
