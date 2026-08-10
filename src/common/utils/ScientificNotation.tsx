import { Typography, TypographyOwnProps } from "@mui/material";

/**
 * @param num Number to convert to Sci Notation
 * @param sigFigs Number of desired significant figures
 * @param typographyProps Props spread onto Typography element
 * @returns
 */
export function ScientificNotation(num: number, sigFigs: number, typographyProps?: TypographyOwnProps) {
  if (num > 0.01) {
    return <Typography {...typographyProps}>{num.toFixed(2)}</Typography>;
  }

  // Convert the number to scientific notation using toExponential
  const scientific = num.toExponential(sigFigs);
  const [coefficient, exponent] = scientific.split("e");

  return (
    <Typography {...typographyProps}>
      {coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup>
    </Typography>
  );
}
