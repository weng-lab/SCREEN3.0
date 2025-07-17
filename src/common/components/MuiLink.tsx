import { Link, LinkProps } from "@mui/material"
import NextLink from "next/link"

const MuiLink = (props: LinkProps) => {
  return (
    <Link component={NextLink} {...props} />
  )
}

export default MuiLink